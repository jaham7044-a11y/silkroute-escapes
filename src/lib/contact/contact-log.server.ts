type LogMeta = Record<string, unknown>;

function formatError(error: unknown) {
  if (error instanceof Error) {
    const extra: LogMeta = {};

    for (const key of ["code", "command", "response", "responseCode", "errno", "syscall"] as const) {
      const value = (error as Error & LogMeta)[key];
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

export function getEmailConfigDiagnostics() {
  const user = process.env.EMAIL_USER;
  const appPassword = process.env.EMAIL_APP_PASSWORD;

  return {
    hasEmailUser: Boolean(user),
    hasAppPassword: Boolean(appPassword),
    emailUser: user ?? null,
    appPasswordLength: appPassword?.length ?? 0,
    nodeEnv: process.env.NODE_ENV ?? "unknown",
  };
}

export function logContactInfo(message: string, meta?: LogMeta) {
  console.error("[contact-form]", message, meta ? JSON.stringify(meta) : "");
}

export function logContactError(message: string, error: unknown, meta?: LogMeta) {
  console.error(
    "[contact-form]",
    message,
    JSON.stringify({
      ...meta,
      error: formatError(error),
      emailConfig: getEmailConfigDiagnostics(),
    }),
  );
}
