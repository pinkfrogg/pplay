# Export This Project to a New Private GitHub Repository

## Short answer

**You do not need a ZIP file for the recommended workflow.** The simplest option is to export the project directly from the website’s management panel to a new **private** GitHub repository. A ZIP is useful only as a personal backup or if you prefer manually uploading files to GitHub.

| Method | Recommendation | Why |
|---|---|---|
| **Direct GitHub export from the management panel** | **Use this** | It creates the repository and transfers the project in one flow. |
| Download ZIP, then upload to GitHub | Backup/manual alternative | It adds extra steps and makes it easier to accidentally upload secrets or omit hidden files. |

## Before you export

1. Confirm that the latest project version is saved as a checkpoint. The most recent checkpoint is already available in the version history.
2. Keep the repository **private**. The website can still be public on Vercel later; the private repository protects the source code and configuration history.
3. Do not copy, paste, or commit your admin password, session secret, database URL, or platform API keys. The project’s `.gitignore` must remain unchanged.
4. Because the current admin password and session secret have been shared in a conversation, replace them with new unique values before external deployment.

## Recommended: direct export to GitHub

1. In the website workspace, open the **Management UI** on the right.
2. Open **Settings**.
3. Select **GitHub** from the Settings side menu.
4. If prompted, sign in to GitHub and authorize the connection. Use the GitHub account that should own the repository.
5. Choose **Export code to a new repository**.
6. Select your GitHub account under **Owner**.
7. Enter a repository name, such as `melodies-in-the-dreamhouse`.
8. Choose **Private** visibility. Do not select Public.
9. Confirm the export. Wait until the Management UI confirms that the repository was created.
10. Open the repository on GitHub and confirm that you can see files such as `client/`, `server/`, `drizzle/`, `package.json`, and `.gitignore`.

> The direct export carries code into GitHub; it does **not** copy private deployment values into the repository. You will enter new production values separately in Vercel.

## Manual alternative: use a ZIP file

Use this only if you cannot or do not want to connect GitHub through the Management UI.

1. In the Management UI, open the three-dot **More** menu and choose **Download as ZIP**.
2. On GitHub, click **New repository**.
3. Give it a name, choose **Private**, and create the repository without adding a README, `.gitignore`, or license.
4. Unzip the downloaded project on your computer.
5. In the new GitHub repository, choose **Add file → Upload files** and upload the unzipped project contents. Make sure hidden files such as `.gitignore` are included; the browser upload tool may hide them.
6. Before committing, verify that no `.env`, `.env.local`, `.vercel`, audio downloads, database dumps, or secret values are present.
7. Commit the upload to the `main` branch.

For regular updates after the initial ZIP upload, use Git on your computer or reconnect the project through the management panel. Repeated ZIP uploads are not a good version-control workflow.

## Verify GitHub repository privacy and secret safety

After exporting, open the GitHub repository and go to **Settings → General**. Confirm the visibility label says **Private**. Then use the repository search box to look for the names below. They may appear as code references, but their **values** must never appear in committed files.

| Safe to see as a variable name | Must never be committed as a real value |
|---|---|
| `ADMIN_EMAIL` | Your actual admin email address, if it is private |
| `ADMIN_PASSWORD` | Any password |
| `ADMIN_SESSION_SECRET` | Any actual session secret |
| `DATABASE_URL` | The full production database connection string |

If GitHub’s secret scanning warns about a credential, stop, remove it from the commit history, rotate that credential, and only then continue.

## What happens next: Vercel

Once the repository is private and clean, connect it in Vercel using **Add New → Project → Import Git Repository**. Do **not** deploy before completing the separate Vercel-readiness pass described in `secure-github-vercel-deployment.md`. This full-stack application needs a Vercel-compatible Express/server configuration plus externally hosted database and storage services before its public site and private `/admin` route can safely run there.

After Vercel is correctly configured, your saved admin address will be:

```text
https://your-domain.example/admin
```

## Quick checklist

- [ ] Latest checkpoint exists.
- [ ] New GitHub repository is **Private**.
- [ ] No secret values, `.env` files, database dumps, or audio files were committed.
- [ ] Current admin password and session secret were replaced before production.
- [ ] Vercel-readiness code pass is complete before importing to Vercel.
- [ ] Vercel production environment variables are entered privately in Vercel, not GitHub.
