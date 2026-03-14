# Automated Cloud Deployment — Cuentopia Live Agent

## What is automated

Every `push` to `main` triggers a full, zero-touch deployment via GitHub Actions.
No manual `firebase deploy` commands. No local secrets required after initial setup.

---

## Infrastructure as Code artifacts

| File | What it declares |
|---|---|
| [`firebase.json`](../firebase.json) | Hosting public dir, SPA rewrite, Functions source & predeploy hooks, Firestore location, Emulator ports |
| [`firestore.rules`](../firestore.rules) | Security rules — agents/themes public read, sessions owner-only |
| [`firestore.indexes.json`](../firestore.indexes.json) | Composite indexes deployed alongside rules |
| [`scripts/set-env.js`](../scripts/set-env.js) | Generates `src/environments/environment*.ts` from env vars — no secrets ever committed |
| [`scripts/seed-firestore.js`](../scripts/seed-firestore.js) | Idempotent upsert of all agent configs and story themes — Firestore state as code |

---

## CI/CD Pipeline

**File:** [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

```
push to main
    │
    ├─ 1. npm ci                          (root deps)
    ├─ 2. node scripts/set-env.js         (generate environment files from Secrets)
    ├─ 3. npm run build --configuration production
    ├─ 4. npm ci --prefix functions       (Functions deps)
    ├─ 5. write functions/.env            (inject GOOGLE_GENAI_API_KEY)
    ├─ 6. firebase deploy --only firestore  (rules + indexes)
    ├─ 7. firebase deploy --only functions
    ├─ 8. firebase deploy --only hosting
    └─ 9. node scripts/seed-firestore.js  (idempotent agent config sync)
```

Each step is isolated so a Functions build failure never overwrites a working Hosting deploy.

---

## GitHub Secrets required

Set these once in **Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
|---|---|
| `FIREBASE_TOKEN` | `npx firebase-tools login:ci` in your local terminal |
| `FIREBASE_PROJECT_ID` | Firebase console → Project settings |
| `FIREBASE_APP_ID` | Firebase console → Project settings → Your apps |
| `FIREBASE_API_KEY` | Firebase console → Project settings → Your apps |
| `FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `FIREBASE_STORAGE_BUCKET` | `<project-id>.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase console → Project settings → Your apps |
| `GOOGLE_GENAI_API_KEY` | Google AI Studio → API keys |

---

## How to trigger manually

Go to **Actions → Deploy to Firebase → Run workflow** and click the button.
Useful for re-seeding agent configs after a Firestore wipe.

---

## Link for submission

The deployment automation lives entirely in two places:

- **Pipeline:** [`/.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- **IaC scripts:** [`/scripts/`](../scripts/)

> Paste either of these paths as the GitHub permalink when submitting the bonus section.
