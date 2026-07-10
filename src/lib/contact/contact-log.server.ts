import { initializeApp, getApp, getApps } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

type LogMeta = Record<string, unknown>;

const CONTACT_LOG_COLLECTION = "contactFormLogs";

const firebaseConfig = {
  apiKey: "AIzaSyBh8-UbeSxbah4M8EQxb9zNaPsc8AtlSWk",
  authDomain: "silkroute-4a557.firebaseapp.com",
  projectId: "silkroute-4a557",
  storageBucket: "silkroute-4a557.firebasestorage.app",
  messagingSenderId: "1095815576775",
  appId: "1:1095815576775:web:18ddf1d79cf59cb0a712e2",
};

const firebaseApp = getApps().some((app) => app.name === "contact-form-logs")
  ? getApp("contact-form-logs")
  : initializeApp(firebaseConfig, "contact-form-logs");

const db = getFirestore(firebaseApp);

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

async function writeLog(level: "INFO" | "ERROR", message: string, meta?: LogMeta) {
  const debugId = typeof meta?.debugId === "string" ? meta.debugId : createContactDebugId();
  const entry = {
    time: new Date().toISOString(),
    createdAt: serverTimestamp(),
    level,
    message,
    debugId,
    pid: process.pid,
    cwd: process.cwd(),
    source: "contact-form",
    ...meta,
  };

  try {
    await setDoc(doc(db, CONTACT_LOG_COLLECTION, `${debugId}-${Date.now()}`), entry);
    return { ok: true };
  } catch (writeError) {
    console.error("[contact-form] Failed to write Firebase contact log:", writeError);
    console.error("[contact-form]", JSON.stringify({ ...entry, createdAt: undefined }));
    return { ok: false, error: formatError(writeError) };
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
    firebaseProjectId: firebaseConfig.projectId,
    firebaseCollection: CONTACT_LOG_COLLECTION,
    cwd: process.cwd(),
    home: process.env.HOME ?? null,
  };
}

export async function logContactInfo(message: string, meta?: LogMeta) {
  return writeLog("INFO", message, meta);
}

export async function logContactError(message: string, error: unknown, meta?: LogMeta) {
  return writeLog("ERROR", message, {
    ...meta,
    error: formatError(error),
    emailConfig: getEmailConfigDiagnostics(),
  });
}
