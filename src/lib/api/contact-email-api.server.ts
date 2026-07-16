import { sendContactEnquiryEmail, type ContactEnquiryEmailInput } from "../contact/contact-email.server";

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

function getEmailDiagnostics() {
  const user = process.env.EMAIL_USER;
  const appPassword = process.env.EMAIL_APP_PASSWORD;

  return {
    hasEmailUser: Boolean(user),
    hasAppPassword: Boolean(appPassword),
    emailUser: user ?? null,
    appPasswordLength: appPassword?.length ?? 0,
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    nodeVersion: process.version,
    cwd: process.cwd(),
  };
}

export async function handleContactEmailApi(request: Request) {
  if (request.method !== "POST") {
    return json({ success: false, message: "Method not allowed." }, { status: 405 });
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const name = asOptionalString(payload.name);
    const email = asOptionalString(payload.email);

    if (!name || !email) {
      return json({ success: false, message: "Name and email are required." }, { status: 400 });
    }

    const enquiry: ContactEnquiryEmailInput = {
      enquiryId: asOptionalString(payload.enquiryId),
      name,
      email,
      phone: asOptionalString(payload.phone),
      country: asOptionalString(payload.country),
      dates: asOptionalString(payload.dates),
      travelers: typeof payload.travelers === "number" ? payload.travelers : undefined,
      destinations: asOptionalString(payload.destinations),
      budget: asOptionalString(payload.budget),
      message: asOptionalString(payload.message),
    };

    await sendContactEnquiryEmail(enquiry);

    return json({ success: true });
  } catch (error) {
    return json(
      {
        success: false,
        message: "Unable to send contact email.",
        debug: {
          emailConfig: getEmailDiagnostics(),
          error: formatError(error),
        },
      },
      { status: 500 },
    );
  }
}
