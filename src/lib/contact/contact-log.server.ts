type LogMeta = Record<string, unknown>;

export function formatError(error: unknown) {
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

export function createContactDebugId() {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function writeLog(level: "INFO" | "ERROR", message: string, meta?: LogMeta) {
  const debugId = typeof meta?.debugId === "string" ? meta.debugId : createContactDebugId();
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    debugId,
    pid: process.pid,
    cwd: process.cwd(),
    source: "contact-form",
    ...meta,
  };

  const line = JSON.stringify(entry);

  if (level === "ERROR") {
    console.error("[contact-form]", line);
  } else {
    console.info("[contact-form]", line);
  }

  return { ok: true, target: "console" };
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
    cwd: process.cwd(),
    home: process.env.HOME ?? null,
    nodeVersion: process.version,
  };
}

export function logContactInfo(message: string, meta?: LogMeta) {
  return writeLog("INFO", message, meta);
}

export function logContactError(message: string, error: unknown, meta?: LogMeta) {
  return writeLog("ERROR", message, {
    ...meta,
    error: formatError(error),
    emailConfig: getEmailConfigDiagnostics(),
  });
}
