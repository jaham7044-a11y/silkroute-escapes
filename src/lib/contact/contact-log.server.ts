import { appendFile } from "node:fs/promises";
import { join } from "node:path";

type LogMeta = Record<string, unknown>;

const LOG_FILE = join(process.cwd(), "contact-form-debug.log");

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

async function writeLog(level: "INFO" | "ERROR", message: string, meta?: LogMeta) {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const line = `${JSON.stringify(entry)}\n`;

  try {
    await appendFile(LOG_FILE, line, "utf8");
  } catch (writeError) {
    console.error("[contact-form] Failed to write log file:", writeError);
    console.error("[contact-form]", line.trim());
  }
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
    logFile: LOG_FILE,
    cwd: process.cwd(),
  };
}

export function logContactInfo(message: string, meta?: LogMeta) {
  void writeLog("INFO", message, meta);
}

export function logContactError(message: string, error: unknown, meta?: LogMeta) {
  void writeLog("ERROR", message, {
    ...meta,
    error: formatError(error),
    emailConfig: getEmailConfigDiagnostics(),
  });
}
