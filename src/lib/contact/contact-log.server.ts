import { appendFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

type LogMeta = Record<string, unknown>;

const LOG_FILE_NAME = "contact-form-debug.log";

function uniqueLogPaths() {
  const paths = [
    process.env.CONTACT_FORM_LOG_FILE,
    join(process.cwd(), LOG_FILE_NAME),
    join(process.cwd(), "logs", LOG_FILE_NAME),
    process.env.HOME ? join(process.env.HOME, LOG_FILE_NAME) : undefined,
    process.env.HOME ? join(process.env.HOME, "logs", LOG_FILE_NAME) : undefined,
    join(tmpdir(), LOG_FILE_NAME),
  ].filter((path): path is string => Boolean(path));

  return [...new Set(paths)];
}

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

export function createContactDebugId() {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function writeLog(level: "INFO" | "ERROR", message: string, meta?: LogMeta) {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    pid: process.pid,
    cwd: process.cwd(),
    ...meta,
  };

  const line = `${JSON.stringify(entry)}\n`;
  const failures: string[] = [];

  for (const logFile of uniqueLogPaths()) {
    try {
      mkdirSync(dirname(logFile), { recursive: true });
      appendFileSync(logFile, line, "utf8");
      return logFile;
    } catch (writeError) {
      const message =
        writeError instanceof Error ? `${writeError.name}: ${writeError.message}` : String(writeError);
      failures.push(`${logFile} (${message})`);
    }
  }

  console.error("[contact-form] Failed to write contact log file:", failures.join("; "));
  console.error("[contact-form]", line.trim());
  return null;
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
    attemptedLogFiles: uniqueLogPaths(),
    cwd: process.cwd(),
    home: process.env.HOME ?? null,
  };
}

export function logContactInfo(message: string, meta?: LogMeta) {
  writeLog("INFO", message, meta);
}

export function logContactError(message: string, error: unknown, meta?: LogMeta) {
  writeLog("ERROR", message, {
    ...meta,
    error: formatError(error),
    emailConfig: getEmailConfigDiagnostics(),
  });
}
