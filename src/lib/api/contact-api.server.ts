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

function createContactDebugId() {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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

function getEmailConfigDiagnostics() {
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
    home: process.env.HOME ?? null,
  };
}

export async function handleContactApi(request: Request) {
  const debugId = createContactDebugId();
  const emailConfig = getEmailConfigDiagnostics();

  if (request.method !== "POST") {
    return json(
      {
        success: false,
        message: "Method not allowed.",
        debug: { debugId, stage: "api-method", method: request.method },
      },
      { status: 405 },
    );
  }

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

    const { sendContactEnquiryEmail } = await import("../contact/contact-email.server");

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

    return json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
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
