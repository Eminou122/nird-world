# NIRD WORLD — Security audit and public-release readiness

| | |
| --- | --- |
| Repository | `Eminou122/nird-world` (private at the time of the audit) |
| Production | https://nird-world.vercel.app |
| Audited commit | `8f65c2b` (`main`, identical to `origin/main`) |
| Audit date | 27 November 2026 |
| Final status | **PASS WITH WARNINGS** |

## 1. Executive summary

No credential, private key, token or connection string was found anywhere in the Git history, in local-only unreachable objects, in the GitHub repository settings or in the Vercel project. The application is a static single-page app with no backend, no authentication and no Firebase: there is no server-side data to protect, and the only user data (diagnostics) stays in the visitor's own browser.

One medium finding was fixed in this audit: the site sent no browser security headers (Content-Security-Policy, clickjacking protection, `nosniff`…). They are now set in `vercel.json`, tested locally, and **take effect only after the next deployment**. The remaining warnings are low-severity privacy and hardening items. Nothing blocks making the repository public.

## 2. Repository inspection

| Check | Result |
| --- | --- |
| Branches | `main` only, local and remote (`git ls-remote` matches local refs) |
| Tags, stashes, releases | None |
| Submodules, Git LFS, `.gitattributes` | None |
| Commits reachable from all refs | 8 |
| Files that ever existed in history | 140 paths, 250 blobs |
| GitHub Actions workflows, Actions secrets | None |
| Deploy keys, webhooks | None |
| Collaborators | Owner only |
| Pull requests, issues | None |
| Branch protection | Not available on a free private repository (GitHub returns 403); available once public |

## 3. Git history scan

**Method.** Gitleaks and TruffleHog are not installed on this machine, and downloading a scanner was not authorised, so a local scanner was written for this audit. No repository content was sent to an external service. It reads every blob reachable from every ref (`git rev-list --all --objects`), every unreachable blob (`git fsck --unreachable --no-reflogs`) and every commit message, and applies these rules:

private keys (`BEGIN … PRIVATE KEY`), AWS keys, GitHub and GitLab tokens, Google API keys, Slack, Stripe, OpenAI/Anthropic and npm tokens, JWTs, Vercel token variables, database connection strings, Firebase configuration and service accounts, Supabase URLs, generic `password/secret/api_key/token = "…"` assignments, local machine paths, e-mail addresses and private-network URLs. It also flags sensitive file names in history (`.env*`, `.npmrc`, `*.pem`, `*.key`, SSH keys, `credentials*.json`, `.vercel/`, Firebase rules).

**Scanner self-test.** A throw-away repository containing a fake AWS key, a fake GitHub token, a private-key header and a hard-coded API key in a `.env` file that was then deleted: all four were detected, and `.env` was reported as a file present in history.

**Results.**

| Scope | Findings |
| --- | --- |
| Sensitive file names in history | None (no `.env`, key, certificate or `.vercel` file was ever committed) |
| Secrets in reachable blobs | None |
| Secrets in commit messages | None |
| Unreachable local objects (31 blobs, 11 trees, 1 commit) | None. They come from the PIXEL RESISTANCE integration that was removed from this repository before it was ever pushed; they exist only on this machine |
| Local paths, e-mail addresses in files | None |
| `localhost` URLs | `README.md` (development instructions, intended) |

**Limits.** The scanner is pattern-based, with no entropy analysis: an unusual secret format with no recognisable prefix could escape it. Given the project's nature (no backend, no environment variable used by the code) this risk is low; running Gitleaks once before publication would remove it (see section 12).

## 4. Credential exposure

No credential is exposed. Nothing requires revocation, rotation or history rewriting.

## 5. Environment and configuration

| Check | Result |
| --- | --- |
| `.env.local` | Exists locally and contains one variable, `VERCEL_OIDC_TOKEN` (created by `vercel link`; short-lived OIDC token). Ignored by `.gitignore` (`*.local`) and never committed. Value not read |
| `.gitignore` | Covers `.env`, `.env.*`, `*.local`, `*.pem`, `*.key`, `.vercel`, `dist`, `node_modules` |
| `.vercel/project.json` | Local only, ignored, never committed |
| `.vercelignore` | Not present; not needed (Vercel builds from Git) |
| Vercel environment variables | None defined (`vercel env ls`) |
| Environment variables in code | None (`import.meta.env` / `process.env` unused) |
| Firebase, Firestore, Storage rules | Not used by this project |
| Source maps | Not generated (Vite default); no `.map` file in `dist` or in production |
| GitHub Actions / deployment scripts | None; Vercel's Git integration builds `npm run build` |
| Files reachable on production | `/.env`, `/.git/config`, `/.vercel/project.json`, `/package.json` all return the app's `index.html` (SPA rewrite): nothing leaks |
| HTTPS | HTTP redirects to HTTPS (308); HSTS sent by Vercel (`max-age=63072000; includeSubDomains; preload`) |

## 6. Application security

| Area | Result |
| --- | --- |
| XSS / unsafe HTML | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write` or `iframe`. All text goes through React's escaping |
| Stored data | Diagnostics in `localStorage` go through `parseStore` / `sanitizeAssessment`: wrong version, bad JSON or unknown fields are rejected, names are truncated, unreadable data is set aside in a backup key and the user is told. **Tested:** injecting `<script>` and `<img onerror>` payloads into the saved data rendered nothing executable and showed the "could not be read" notice |
| URL parameters | `?q=` is displayed as text only; `?besoin=`, `?sur=`, `?lieu=`, `?outils=` and route ids are looked up in the static catalogue, unknown values are ignored |
| External links | 97 catalogue URLs, all `https://`, all opened with `rel="noopener noreferrer"` and announced as opening a new tab |
| Redirects | No redirect built from user input |
| Network calls | None from the app (no `fetch`, no API). Only Google Fonts stylesheets and fonts are loaded |
| Authentication, admin features, CORS | None exist. `Access-Control-Allow-Origin: *` is Vercel's default for static files and exposes nothing that is not already public |
| Mixed content | No `http://` resource |

## 7. Dependencies

| Check | Result |
| --- | --- |
| Package manager | npm 11.6.2 (Node 24.11.1), `package-lock.json` v3 |
| Direct dependencies | 5 runtime (`react`, `react-dom`, `react-router`, `motion`, `lucide-react`), 7 build-time |
| `npm audit` (all) | **0 vulnerabilities** |
| `npm audit --omit=dev` | **0 vulnerabilities** |
| `npm audit signatures` | 98 packages with verified registry signatures, 58 with verified attestations, none invalid |
| Install scripts | `esbuild`, `fsevents` (expected, build tools only) |
| Licences of the runtime tree | MIT (12), ISC (1), 0BSD (1): all compatible with MIT |
| Outdated, same major (safe) | `@types/react` 19.3.0 → 19.3.3, `lucide-react` 1.78.0 → 1.82.0, `react-router` 7.18.6 → 7.18.7 |
| Outdated, new major (not recommended now) | `vite` 8, `@vitejs/plugin-react` 6, `motion` 14, `react-router` 8, `typescript` 7 |
| Abandoned packages | None: all dependencies are actively maintained |

No dependency was changed in this audit.

## 8. Licence and documentation

| Check | Result |
| --- | --- |
| `LICENSE` | MIT, "Copyright (c) 2025 NIRD WORLD contributors" |
| `README.md` | Present: features, routes, code layout, `npm install`, `npm run dev`, `typecheck`, `test`, `build`, `preview`, Node ≥ 22, Vercel output; commands verified in this audit |
| Third-party attribution | Fraunces and Instrument Sans (SIL OFL 1.1), Lucide (ISC); illustrations are original SVG in the code |
| `docs/` | Accessibility audit and user-testing templates: no participant data, names, e-mails or screenshots |
| Personal information in files | None (no e-mail, phone number or local path in any tracked file, current or past) |
| Tracked machine-specific file | `.claude/launch.json` (dev-server command and port only; harmless) |

## 9. Remediation performed (not committed, not deployed)

| Finding | Change |
| --- | --- |
| M-1 Missing security headers | `vercel.json` now sends, on every route: `Content-Security-Policy` (`default-src 'self'`, scripts from the site only, styles and fonts from the site and Google Fonts only, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation, payment, USB off), `Cross-Origin-Opener-Policy: same-origin` |

**How the CSP was tested.** The production build was served locally with exactly these headers and the SPA rewrite. Home, village, school, a started diagnostic, history, library, a tool page, the comparison page, a building and the 404 page were visited: no CSP violation, no console error, Fraunces and Instrument Sans loaded.

## 10. Tests and build

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm test` (includes the static accessibility checks in `src/app/tests/quality.test.ts`) | 64 / 64 pass |
| `npm run build` | Pass |
| axe-core (WCAG 2.2 AA) on 13 production routes | 0 violations (run earlier the same day) |

## 11. Findings and remaining risks

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| M-1 | Medium | No CSP, clickjacking or MIME-sniffing protection headers | Fixed in `vercel.json`; **needs a deployment** |
| L-1 | Low | Commit metadata contains two author e-mail addresses (a personal and an institutional one). They become visible to anyone once the repository is public | Accepted. Rewriting history to hide them is not recommended (it would require a force-push). For future commits, the GitHub "noreply" address can be used |
| L-2 | Low | Google Fonts is loaded from Google's servers, which receive each visitor's IP address (a known GDPR concern in the EU) | Open. Self-hosting the two fonts would remove it |
| L-3 | Low | No secret scanning, push protection, Dependabot alerts or rule on `main` (not available for free private repositories) | To enable after publication (section 12) |
| I-1 | Info | Secret scan is pattern-based, not Gitleaks | Optional Gitleaks run before publication |
| I-2 | Info | React Router logs a "No HydrateFallback element" warning on the first load of lazy routes | Harmless; not a security issue |

## 12. Public-release readiness

**Status: PASS WITH WARNINGS.** No secret has ever been committed and there is no critical or high finding. Before or right after making the repository public:

1. Commit and push the `vercel.json` change, then check the headers at https://nird-world.vercel.app (`curl -I`).
2. Optional: run Gitleaks once on the full history (`gitleaks git .`, or `gitleaks detect` on versions before 8.19) as a second opinion.
3. Change the visibility (repository owner only).
4. Then enable, under *Settings → Code security*: secret scanning, push protection and Dependabot alerts; and add a ruleset on `main` that blocks force-pushes and deletion.
