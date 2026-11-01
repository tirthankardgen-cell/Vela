# Firebase production setup (Spark plan)

Vela uses Firebase Authentication and Cloud Firestore only. It does not initialize Firebase Storage, upload images, or require a Storage bucket. Cloud plans include rooms, walls, furniture, dimensions, colours, costs, suppliers, project details, notes and camera position. Uploaded images/PDF tracing references remain in the browser and JSON exports.

## Vercel environment variables

Paste this block into Vercel → Project → Settings → Environment Variables using **Import .env**. Select the intended environments, save, and **redeploy**. These public web-app identifiers are embedded during the Next.js build.

```dotenv
NEXT_PUBLIC_AUTH_MODE=firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCkMbNeX5iKZ_KXGygXMQyFOm-mEPb-mSA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vela-studio-1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vela-studio-1
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=798107281297
NEXT_PUBLIC_FIREBASE_APP_ID=1:798107281297:web:789532302cf2132ee29c30
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-7C6956BDYN
```

Remove any old `NEXT_PUBLIC_AUTH_MODE=demo` value. Do not set `NEXT_PUBLIC_FIREBASE_EMULATORS` on Vercel. No service-account key, Firebase Admin credential, Storage bucket variable or Firebase Analytics SDK initialization is needed. The GA measurement ID is optional configuration for the separate public-page analytics integration; it has no effect on login or plan saving. This Firebase change does not add analytics or advertising scripts.

## Firebase Console

1. Open project **vela-studio-1**. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. Select a project support email for Google.
2. In **Authentication → Settings → Authorized domains**, add `velastudio.space`, `www.velastudio.space`, and `vela-dgen.vercel.app`. Add any specific preview domain used for testing; Firebase does not accept wildcard Vercel domains. Add `localhost`/`127.0.0.1` only if testing against live Firebase locally. Keep the existing Firebase domains.
3. Review the verification/reset email templates and configure the desired password policy. Vela requires at least eight characters for new passwords. Verification emails are sent on signup and can be resent from Projects; unverified owners may save their own plans.
4. Create the **default Cloud Firestore database** in production mode and choose a suitable region. Keep the project on Spark. Do not create a Storage bucket.
5. Publish [firestore.rules](../firestore.rules) in the Firestore Rules editor, or deploy both the rules and index configuration using the CLI below. If using only the Console, add a single-field index exemption for `layoutJson` in collection group `projects` and turn off its indexes.

```sh
npm ci
npx firebase login
npx firebase deploy --only firestore:rules,firestore:indexes --project vela-studio-1
```

These steps require your Firebase project access. Adding Vercel variables or pushing Git commits does not enable Firebase providers, create the database, or publish its rules.

## Data and saving behavior

- Private documents: `users/{uid}/projects/{projectId}`. Other users and anonymous clients cannot read, list, create, update or delete them. No global project listing is allowed.
- `layoutJson` preserves nested coordinate arrays as JSON; Firestore cannot store arrays directly inside arrays. Search/display metadata stays in separate fields. The app limits JSON to 900,000 UTF-8 bytes, below Firestore's document limit. Rules validate the envelope and ownership; the studio validates the parsed layout before displaying it.
- Autosave runs after 900 ms without an edit. Edits, explicit saves and navigation share one queue. Transactions use a revision counter to reject stale writes across tabs/devices. Saves are acknowledged only after the server accepts them.
- Failed writes retain per-account, per-project browser drafts. Reconnect and use **Retry save**, or open **Projects → Unsynced browser drafts** to recover a separate copy. Closing a tab with pending writes prompts you to stay. Browser storage can fail or be cleared, so JSON exports remain useful backups.
- The dashboard loads 24 plans at a time. Deleting a project removes its Firestore document and matching recovery draft. Older browser exports/local workspace copies are not remotely erased.
- Existing guest/preview projects are not automatically attached to a real account. Export their JSON from the old workspace, sign in, create a space and use **Import**. If the imported ID already belongs to another saved version, recover the unsynced draft as a new project to avoid overwriting it.
- A tracing reference remains visible while editing but is omitted from cloud saves. Export JSON to keep the image; reopening from Firestore restores the editable plan without the image.
- Spark quotas still apply. Autosave coalesces edits, but each committed transaction reads and writes a document. Quota or connection failures appear as unsynced state; no paid service is enabled by the code.

## Verification

Use Node 24.12+ and Java 17+ for the pinned Firebase emulator CLI:

```sh
npm run test:cloud
npm run test:firebase
npm run build
```

`test:firebase` uses the isolated `demo-vela` emulator project and tests owner isolation, malformed writes, timestamps, revisions, full layout round-trip, pagination and conflicting edits. It never creates live accounts or writes to production.

For browser checks, start `npm run emulators`, then run the dev server with these variables (and no live Firebase configuration):

```dotenv
NEXT_PUBLIC_AUTH_MODE=firebase
NEXT_PUBLIC_FIREBASE_API_KEY=demo-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-vela.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-vela
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app
NEXT_PUBLIC_FIREBASE_EMULATORS=true
```

Check email signup, reload persistence, wrong-password rejection, logout, a new browser login reopening the same plan, recovery after a failed save, deletion and password reset. Google OAuth must receive a final smoke check on an authorized deployed domain with the real provider enabled; the emulator does not validate Google's live OAuth configuration.
