# Vercel deployment findings

- Official Vercel GitHub integration automatically deploys pushes and pull requests from a connected repository, with the production branch (commonly `main`) controlling production deployments.
- A GitHub repository can be connected from the Vercel New Project flow or the project Settings → Git section.
- Vercel environment variables are configured per project and must be assigned to Production, Preview, and/or Development as appropriate.
- Environment-variable changes apply only to new deployments, so a redeploy is required after adding or changing them.
- Vercel supports secret/write-only environment-variable values; sensitive admin credentials should not be committed to GitHub.
- Sources: https://vercel.com/docs/git/vercel-for-github and https://vercel.com/docs/environment-variables
