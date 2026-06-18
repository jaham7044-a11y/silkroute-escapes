# Firebase Security Rules — Silk Route Escapes (Step 2)

These are the recommended starter rules for the admin panel. Paste them in
the Firebase Console → Firestore → Rules. Tighten them before production
(e.g. restrict writes to a list of approved admin emails).

## Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public website (step 3) will read routes — open read.
    match /routes/{routeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Default: deny everything else.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Production hardening (later)

Replace `request.auth != null` with an explicit admin check, e.g.:

```
allow write: if request.auth != null &&
  request.auth.token.email in ["admin@yourdomain.com"];
```

## Firebase Storage

Not used in Step 2 — images are stored as plain URLs in Firestore.