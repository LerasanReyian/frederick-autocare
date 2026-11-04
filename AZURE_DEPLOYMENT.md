# Azure deployment: current setup and remaining activation

Updated November 4, 2026. Target: **Azure App Service on Linux for the website and API together**, plus **Azure Database for MySQL Flexible Server**. GitHub repository: https://github.com/LerasanReyian/frederick-autocare.

## Current status

The Azure student subscription is **not activated**, as confirmed by the user. No Azure resources were created or charged during this preparation. The site has **not been published to Azure**. The computer-control helper failed to initialize, and no Azure CLI/account session was available in the local checks.

The Vercel URL is historical: https://frederick-autocare-gurx-m6wp5zbmb-reyian-tukwa.vercel.app. The user changed the target to Azure. Do not troubleshoot or publish further Vercel deployments as the primary task.

## Activate first

1. Open [Azure for Students](https://azure.microsoft.com/en-us/free/students/) and complete the Microsoft/student verification personally.
2. In [Azure Portal](https://portal.azure.com/), open **Subscriptions** and confirm that **Azure for Students** shows **Active**.
3. Share the subscription's display name and whether any resources already exist; do not put passwords, access tokens or publish profiles into chat or source control.

Student benefits have eligibility, quota and duration limits. Check the portal's actual included offers and price estimate before resource creation; do not switch to pay-as-you-go to work around a verification or quota problem without a separate user decision.

## Architecture and code prepared

- One Linux App Service runs `npm start`, serving `dist` and `/api` from the existing Express server. `/inventory` keeps its SPA entry route. Frontend requests and session cookies share an origin.
- Do not use `npm run preview` as the production startup: it would serve frontend assets without the booking/staff API.
- `.github/workflows/deploy-frontend.yml` now builds/tests/lints, prepares a runtime-only package, installs Linux production dependencies and deploys the package. It verifies `/`, `/inventory` and connected `/api/health` after deployment.
- The old separate Container Apps workflow is manual and gated by `AZURE_LEGACY_SPLIT_DEPLOYMENT=true`. Leave this unset for the unified deployment. No Container Registry or Container App is required for the current approach.
- `npm run package:azure` stages only `dist`, `server`, `shared`, `database/schema.sql`, package.json and the lockfile. It excludes local `.env`, XAMPP/recovery files, `.qa` and Git metadata. The workflow installs runtime dependencies in that package before archiving it.
- The server honors Azure's HTTPS reverse proxy for secure cookies and rejects creation of new production bootstrap accounts using missing/short passwords. This guard does not rotate passwords of accounts already imported.
- The older `.github/modernize/azure-rewrite/plan.md` describes a split architecture/full NestJS rewrite. It is historical planning content, not the current deployment instructions. No backend rewrite is required just to publish the working system.

## After activation: provision and configure

First inspect existing resources and subscription quota so nothing is duplicated. Choose a permitted region near the users; resource names and availability must be checked, not assumed.

1. Create/reuse a resource group.
2. Create/reuse a **Linux App Service** with **Node.js 22 LTS**. Start with an eligible Free plan if available for the chosen subscription/region; review any proposed paid tier before provisioning.
3. Create/reuse **Azure Database for MySQL Flexible Server**. This application uses MySQL/MariaDB SQL and mysql2; Azure SQL Database is a different engine and is not a drop-in replacement. Verify any student/free MySQL allowance and chosen SKU/storage in the portal.
4. Allow the App Service's required outbound connections in the database network configuration, or use correctly configured private networking. Do not publish the local XAMPP port or expose the database to every internet IP as a shortcut.
5. Configure the App Service environment variables below and require HTTPS.

| Setting | Production value |
| --- | --- |
| NODE_ENV | production |
| API_HOST | 0.0.0.0 |
| DB_HOST | Actual hosted MySQL hostname, never localhost/127.0.0.1 |
| DB_PORT | Provider's port, normally 3306; local 3307 remains local only |
| DB_USER / DB_PASSWORD | Dedicated database account and secret |
| DB_NAME | frederick_autocare |
| DB_CONNECTION_LIMIT | Begin conservatively, e.g. 5; match server limits |
| DB_SSL | true |
| DB_SSL_CA_BASE64 | Base64 of the provider's current trusted CA chain, or use DB_SSL_CA |
| DB_SSL_REJECT_UNAUTHORIZED | true |
| ADMIN_EMAIL / ADMIN_PASSWORD | Intended bootstrap admin and unique password of at least 12 characters |
| EMPLOYEE_EMAIL / EMPLOYEE_PASSWORD | Intended bootstrap employee and a separate strong password |
| SESSION_HOURS | e.g. 8 |
| CORS_ORIGIN | Empty for this same-origin deployment |
| SCM_DO_BUILD_DURING_DEPLOYMENT | false; the workflow uploads a built package with runtime dependencies |

Do not hardcode PORT: the server already respects Azure's runtime PORT. Do not set VITE_API_BASE_URL to a local/Vercel endpoint; the workflow builds it empty for same-origin `/api` calls. Database secrets must never use a VITE_ prefix.

## Move data without damaging local recovery

The local recovered XAMPP database remains at 127.0.0.1:3307. Preserve it and its backups.

- Use a logical export/import to the new empty hosted database; never copy `.ibd` files to a different database server.
- Review MySQL compatibility and import into a separate target first. Preserve users/staff IDs, products, account requests and bookings. Do not claim migration complete from table creation alone.
- Do not transfer live session or staff-entry proof tokens; require fresh sign-in after migration.
- Keep exports outside the repository/deployment package. Confirm row counts, roles, staff IDs and CHECK TABLE/health after import. An empty schema with generated accounts is not equivalent to migrating the existing data.
- Imported passwords remain unchanged by bootstrap configuration; replace any known demonstration credentials before exposing staff access publicly.

## Connect GitHub Actions

Use Azure/GitHub **OpenID Connect** and a deployment identity scoped to the intended App Service/resources. For a job using the `production` GitHub environment, its federated subject must match:

`repo:LerasanReyian/frederick-autocare:environment:production`

Create the GitHub environment `production`. Configure these secrets in that environment (or as repository secrets if appropriate):

- AZURE_CLIENT_ID
- AZURE_TENANT_ID
- AZURE_SUBSCRIPTION_ID

Set these **repository Actions variables** (not only environment variables; the job gate is evaluated before the environment is available):

- AZURE_WEBAPP_NAME = actual App Service name
- AZURE_RESOURCE_GROUP = actual resource group
- AZURE_DEPLOY_ENABLED = true **only after** resources, database, application settings and OIDC are ready

With deployment disabled/unset, the workflow still builds/tests/packages and deliberately skips publishing. A green build with a skipped deploy is not a published site.

Push the tested deployment changes or run the workflow manually. Avoid creating an additional auto-generated workflow in Deployment Center that races this one. Check Actions for the final HTTPS hostname, then verify booking and staff-role flows with isolated test data.

## Verification and handoff

Preparation checks completed locally on November 4:

- All 3 appointment tests passed; source lint passed; production frontend/PWA build passed.
- Both deployment workflow YAML files parsed successfully.
- Runtime package input allowlist/start command/schema/PWA artifacts were checked.
- Production dependencies installed successfully in the staging package (210 packages).
- The packaged server was started temporarily on local port 3017 with production mode and the existing private local database configuration. `/api/health` connected, `/` and `/inventory` returned HTML, manifest/worker returned 200 and password login without staff entry proof returned 403.
- This check exposed an absolute-file-path problem for `/inventory` when running from the hidden staging directory; the route now serves `index.html` relative to its explicit `dist` root. The packaged check passed after that fix.
- Smoke script: ignored `.qa/azure-runtime-smoke.mjs`. The temporary process was stopped afterward. These are Windows/local checks, not a Linux GitHub Actions run or a live Azure test.
- Changes remain local; they have not been committed/pushed or published during this preparation. The existing Vercel integration may still react to future GitHub pushes; review/disconnect that integration when switching hosting.

Local commands:

```powershell
npm test
npm run lint
npm run build
npm run package:azure
```

The `.azure-package` folder alone does not contain installed production dependencies until the workflow's install step runs. Do not upload it manually as a complete runtime without installing compatible Linux dependencies or arranging a documented server build.

Before declaring publication complete, verify the actual Azure HTTPS URL, API/database health, persisted bookings, staff ID + password login, roles, secure cookies, correct public video/media, PWA behavior and absence of secrets in the uploaded package. Record the URL and observed results in QA_CHECKPOINT.md. Currently blocked on **student subscription activation and Azure account/resource access**.

Official references:

- [Azure student activation and benefits](https://azure.microsoft.com/en-us/free/students/)
- [Node.js on App Service](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
- [GitHub Actions deployment and OIDC](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions)
