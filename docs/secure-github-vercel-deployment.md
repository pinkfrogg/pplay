# Secure Deployment Guide: GitHub, Vercel, and `/admin`

## Start with the right deployment plan

Your music player is a **full-stack** application. Its public listening pages are static-looking, but the Curator’s Catalog Desk, Fetch MP3 Tags feature, catalog database, and password-protected `/admin` route all depend on server-side code. Do **not** deploy this project to GitHub Pages: GitHub Pages is static hosting and cannot run the protected API or owner session.

| Hosting route | Recommended use | Important consideration |
|---|---|---|
| **Manus built-in publishing** | The quickest path for this current project | It already provides the managed project services this build uses. You can still export a private backup to GitHub. |
| **GitHub → Vercel** | Source control and a separate hosting platform | Complete the portability checklist below before production launch. Vercel can deploy Express/Node applications, but this project must not rely on Manus-only services after export. [1] |

> **Security action before any external deployment:** replace the current admin password and session secret. Do not reuse credentials that were sent in chat, copied into notes, or used elsewhere. Generate a unique password and a separate random session secret of at least 48 characters using a password manager.

## 1. Prepare the repository safely

First, create a fresh project checkpoint in Manus. Then use the project’s **Settings → GitHub** panel to export the code to a **new private GitHub repository**. Keep the repository private because the source contains application behavior and database structure, even though the credentials themselves are not committed.

Before pushing additional changes, verify that the repository does **not** contain `.env`, `.env.local`, `.vercel`, exported credentials, database dumps, or downloaded MP3 files. The existing `.gitignore` should continue to exclude these items. Open the GitHub repository and use the code search to confirm that none of the secret values or the strings `ADMIN_EMAIL` and `ADMIN_PASSWORD` appear in documentation, sample files, workflow logs, or committed configuration.

GitHub Actions secrets are **not needed** when using Vercel’s normal GitHub integration. If you later add a GitHub Actions workflow, store workflow-only tokens as repository or environment secrets rather than in YAML or source files. GitHub documents the repository settings path as **Settings → Secrets and variables → Actions → Secrets → New repository secret**. [2]

## 2. Complete the external-hosting portability checklist

The current project receives some managed services from its original platform. A secure Vercel deployment needs independently configured replacements or an intentional removal of the dependent features.

| Current capability | What Vercel needs | What to do before production |
|---|---|---|
| Catalog, albums, and tracks | A reachable production MySQL/TiDB-compatible database | Provision an external database and set its production `DATABASE_URL`; migrate the schema and catalog data. |
| Managed `/manus-storage/` images and storage proxy | Durable public image hosting or S3-compatible storage | Copy artwork, hero images, vinyl art, and any audio you own to a storage/CDN provider. Update stored URLs so no production page relies on `/manus-storage/`. |
| Built-in platform authentication, storage, and Forge values | Either external equivalents or removed integrations | Do **not** copy internal platform API keys to Vercel. Replace or remove any dependent server modules deliberately. |
| Express/Vite runtime | A Vercel-compatible entrypoint and static-asset layout | Add and test a Vercel adapter before import. The current nested server entry and `dist/public` layout should be reviewed rather than assumed to work unchanged. |

Vercel’s current Express guidance recognizes root or `src/` server entrypoints and turns an Express app into a Vercel Function. It also notes that `express.static()` is ignored there; frontend assets must be served through Vercel’s public/static deployment mechanism. [1] Therefore, ask for a dedicated **“make the project Vercel-ready”** code pass before clicking production deploy. That pass should export or expose the Express app at a Vercel-recognized entrypoint, route `/api/trpc/*` to the server, and publish the Vite output correctly.

## 3. Configure Vercel from the private GitHub repository

After the Vercel-ready code pass is complete, sign in to [Vercel](https://vercel.com) with the same GitHub account that owns the private repository. Select **Add New → Project**, choose the repository, keep the **root directory** at the repository root, and inspect the automatically detected framework settings. Vercel installs dependencies using the detected lockfile; a `pnpm-lock.yaml` causes Vercel to use pnpm. [3]

Use a preview deployment before production. Vercel creates preview deployments for non-production branches and deploys the production branch—normally `main`—when changes are merged or pushed. [3] Keep the production branch protected and make changes through a branch and pull request whenever possible.

### Required Vercel environment variables

In **Vercel Project → Settings → Environment Variables**, add the following values. Set each one separately for **Production** and **Preview**. Use different admin passwords for Preview and Production so a preview credential never protects the live catalog. Vercel encrypts environment variables at rest, and changes apply only to new deployments. [4]

| Variable | Environment | Purpose |
|---|---|---|
| `ADMIN_EMAIL` | Production and Preview | The only email accepted on `/admin`. |
| `ADMIN_PASSWORD` | Production and Preview | A unique owner password. Use a password manager-generated value; never commit it. |
| `DATABASE_URL` | Production and Preview | Connection string for the external production or preview database. Never point Preview at your live catalog unless that is intentional. |
| `Any replacement storage variables` | As needed | Values for the external services selected in the portability checklist. |

Do **not** use the current Manus-managed variables as generic Vercel values. They are platform-specific and are not a portable production configuration. If a variable starts with `VITE_`, remember it may be included in the frontend build; never put passwords or database URLs in one.

For added protection, enable Vercel deployment protection on preview deployments or avoid sharing preview URLs broadly. Every push can create a preview deployment by default, so treat preview links as non-public review environments. [5]

## 4. Deploy and verify without exposing the catalog

After adding all required variables, deploy a preview branch. Review the Vercel build logs first; do not ignore errors involving `/api/trpc`, missing assets, database connections, or unknown environment variables. Then perform the following checks in a private/incognito window.

| Check | Expected result |
|---|---|
| Open `/` | Visitors can search, open albums, and play public audio. No curator editor or owner-access link appears. |
| Open `/admin` while signed out | Only the owner email/password form appears. The catalog desk is not displayed. |
| Enter an incorrect password | The page rejects access and does not reveal catalog controls. |
| Enter the correct new credentials | The Curator’s Catalog Desk opens. Add, edit, and Fetch MP3 Tags work against the intended environment. |
| Sign out, refresh `/admin` | The login form returns; catalog editing no longer works. |
| Open `/api/trpc/catalog.fetchMp3Metadata` without an owner session | The server rejects the request. |

Only after these checks succeed should you merge to `main` or promote the deployment to Production. Vercel documents that the production branch controls the production deployment, while other branches create previews. [3]

## 5. Connect a domain and save the admin address

In **Vercel Project → Settings → Domains**, add your custom domain and follow the DNS records Vercel provides. After the domain verifies, your admin address is always:

```text
https://your-domain.example/admin
```

Bookmark that address in your password manager. The route is deliberately absent from the public navigation, but its protection comes from the server-side owner session—not from the URL being hard to guess.

## Ongoing security routine

Use a private repository, keep Vercel project access limited to trusted collaborators, and rotate the admin password/session secret immediately if they are exposed. Re-deploy after any Vercel environment-variable change because new values do not alter already-created deployments. [4] Review Vercel build and function logs after releases, and test `/admin` in a signed-out browser at least once after each production deployment.

## References

[1] [Vercel: Express on Vercel](https://vercel.com/docs/frameworks/backend/express)

[2] [GitHub Docs: Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

[3] [Vercel: Deploying Git Repositories](https://vercel.com/docs/git)

[4] [Vercel: Environment Variables](https://vercel.com/docs/environment-variables)

[5] [Vercel: Deploying GitHub Projects with Vercel](https://vercel.com/docs/git/vercel-for-github)
