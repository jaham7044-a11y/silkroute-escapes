import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

type ContactApiPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  dates?: unknown;
  travelers?: unknown;
  destinations?: unknown;
  budget?: unknown;
  message?: unknown;
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function createContactDebugId() {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    const extra: Record<string, unknown> = {};

    for (const key of ["code", "command", "response", "responseCode", "errno", "syscall"] as const) {
      const value = (error as Error & Record<string, unknown>)[key];
      if (value != null) extra[key] = value;
    }

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...extra,
    };
  }

  return { message: String(error) };
}

function getEmailConfigDiagnostics() {
  const user = process.env.EMAIL_USER;
  const appPassword = process.env.EMAIL_APP_PASSWORD;

  return {
    hasEmailUser: Boolean(user),
    hasAppPassword: Boolean(appPassword),
    emailUser: user ?? null,
    appPasswordLength: appPassword?.length ?? 0,
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    cwd: process.cwd(),
    home: process.env.HOME ?? null,
    nodeVersion: process.version,
  };
}

async function handleContactApi(request: Request): Promise<Response> {
  const debugId = createContactDebugId();
  const emailConfig = getEmailConfigDiagnostics();

  try {
    const payload = (await request.json()) as ContactApiPayload;
    const name = asOptionalString(payload.name);
    const email = asOptionalString(payload.email);

    if (!name || !email) {
      return json(
        {
          success: false,
          message: `Name and email are required. Ref: ${debugId}`,
          debug: {
            debugId,
            stage: "api-validation",
            emailConfig,
            received: {
              hasName: Boolean(name),
              hasEmail: Boolean(email),
            },
          },
        },
        { status: 400 },
      );
    }

    console.info("[contact-form]", JSON.stringify({
      debugId,
      message: "Contact API submission received",
      customerEmail: email,
      customerName: name,
      emailConfig,
    }));

    const { sendContactEnquiryEmail } = await import("./lib/contact/contact-email.server");

    await sendContactEnquiryEmail({
      debugId,
      name,
      email,
      phone: asOptionalString(payload.phone),
      country: asOptionalString(payload.country),
      dates: asOptionalString(payload.dates),
      travelers: typeof payload.travelers === "number" ? payload.travelers : undefined,
      destinations: asOptionalString(payload.destinations),
      budget: asOptionalString(payload.budget),
      message: asOptionalString(payload.message),
    });

    console.info("[contact-form]", JSON.stringify({
      debugId,
      message: "Contact API submission succeeded",
      customerEmail: email,
      customerName: name,
    }));

    return json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("[contact-form]", JSON.stringify({
      debugId,
      message: "Contact API submission failed",
      error: formatError(error),
      emailConfig,
    }));

    const isConfigError =
      error instanceof Error && error.message.includes("Email is not configured");

    return json(
      {
        success: false,
        message: isConfigError
          ? `Contact form is temporarily unavailable. Please email us directly. Ref: ${debugId}`
          : `Unable to send your message. Please try again. Ref: ${debugId}`,
        debug: {
          debugId,
          stage: "api-catch",
          emailConfig,
          error: formatError(error),
        },
      },
      { status: 500 },
    );
  }
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (request.method === "POST" && url.pathname === "/api/contact") {
        return await handleContactApi(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
