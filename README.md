# Move Rentals

Marketing site and booking-inquiry front end for Move Rentals (scooter, motorcycle, and
selected vehicle rentals in Lisbon), plus a protected admin workspace for editing fleet
metadata.

## Stack

- **Frontend:** React 19 + Vite, React Router v7, TanStack Query, Tailwind CSS
- **Backend:** Netlify Functions (serverless)
- **Data:** [Twice Commerce](https://www.twicecommerce.com/) API for live product/pricing
  data, merged with a custom fleet metadata document stored in Netlify Blobs (site copy,
  badges, specs, rental rules)
- **Auth:** Netlify Identity (via `@netlify/identity`) for the `/admin` workspace
- **Monitoring:** Sentry (errors + session replay), Google Analytics 4 / GTM

## Getting started

```bash
npm install
npm run dev        # Vite dev server only (frontend, no functions)
netlify dev         # frontend + Netlify Functions together (needs Netlify CLI + site link)
```

The frontend proxies `/.netlify/functions/*` to `http://localhost:8888` in dev (see
[vite.config.js](vite.config.js)), so `netlify dev` is required to exercise anything that
calls a function (products, admin login, saving fleet metadata).

If no fleet metadata has been saved to Netlify Blobs yet (e.g. first local run), the app
falls back to the sample data in [public/db.json](public/db.json).

## Quality checks

```bash
npx playwright install chromium # first run only
npm run test:e2e                # desktop/mobile smoke tests with mocked services
npm run test:lighthouse         # performance thresholds against the production build
npm run test:lighthouse:live    # home, vehicle, and admin checks on move-rentals.com
npm run check:live-content      # duplicate slugs and broken live image URLs
npm run qa                      # lint, build, and Playwright suite
```

The GitHub Actions quality workflow runs these checks on pushes and pull requests. Browser
tests do not require Twice or Netlify credentials because service responses are mocked.
The weekly live monitoring workflow checks the deployed pages and current catalog.

## Fleet administration

Fleet saves are immediate and use optimistic revision checks. If another administrator saves
first, the stale save is rejected and the editor must be refreshed before retrying. The admin
also shows the latest 20 revision summaries.

Vehicle images can be overridden with ordered HTTPS URLs in the fleet editor. Leave that list
empty to continue using the images supplied by Twice. This intentionally avoids an upload
pipeline that would require additional storage quotas, moderation, and cleanup.

## Monitoring

Sentry is lazy-loaded only when the app catches an error. Netlify supplies `COMMIT_REF` during
production builds and Vite attaches it as the Sentry release; a local `VITE_SENTRY_RELEASE`
value can override it. Recommended Sentry alerts:

- trigger a notification for a newly seen production issue;
- alert when the production issue count rises above 5 events in 15 minutes;
- review the Netlify Function logs for `Twice fleet fetch failed` and `Sentry rejected an
  envelope` if client reports stop arriving.

## Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the project        |
| `npm start`       | Alias for `netlify dev`              |

## Environment variables

Set these in the Netlify site's environment variables (and in a local `.env` for
`netlify dev`):

| Variable               | Used by                   | Purpose                                                                               |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `TWICE_API_ID`         | `fetch-products` function | Twice Commerce API basic-auth ID                                                      |
| `TWICE_API_SECRET`     | `fetch-products` function | Twice Commerce API basic-auth secret                                                  |
| `ADMIN_ALLOWED_EMAILS` | `admin-access` util       | Comma-separated emails allowed into `/admin` in addition to the `admin` Identity role |
| `VITE_SHOW_MILEAGE_COUNTER` | Homepage build | Set to `true` when the live kilometre counter is ready to publish. It is shown automatically in local development. |

Netlify Identity itself doesn't need an env var — it's enabled per-site in the Netlify
dashboard (Project configuration > Identity).

## Project structure

```
netlify/functions/       Serverless functions (products, admin session, fleet metadata)
src/components/          Shared, reusable UI components
src/hooks/                Shared React hooks
src/pages/                Route-level pages
src/pages/admin/          Fleet metadata editor (container + hook + components + sections)
src/services/              API/service clients (Twice, fleet metadata, auth, analytics)
src/utils/                 Small stateless helpers (icon map, WhatsApp link builder)
public/db.json             Local fallback fleet metadata for offline/first-run dev
```

## Deployment

Deployed on Netlify. `netlify.toml` configures the build (`npm run build`, publish
`dist/`), SPA redirect, and security headers (CSP, etc.). Pushing to the connected branch
triggers a deploy; pull requests get deploy previews.

## Sitemap

`/sitemap.xml` is generated by a Netlify Function. It lists the public static pages and the
currently visible fleet listings, using the same Twice and fleet-metadata sources as the app.
It is advertised in `public/robots.txt` and cached at Netlify's edge for one hour. Submit the
production URL in Google Search Console after deploying.
