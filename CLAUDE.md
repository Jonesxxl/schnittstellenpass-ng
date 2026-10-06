# Schnittstellenpass

Website of the football podcast: Angular SPA (versions in `package.json`) on Netlify, texts editable through Decap CMS. Setup of Spotify, Instagram and the CMS login: `README.md`.

## Toolchain

- Use the Node version from `.nvmrc`; the Angular CLI refuses older ones. Shell state does not carry over between commands, so put that Node's `bin` directory on `PATH` in every command.
- After a pull or branch switch that changed `package-lock.json`, run `npm ci` first. Stale `node_modules` show up as TypeScript errors about `@angular/core` exports.
- Checks, as in CI (`.github/workflows/ci.yml`): `npx ng test --watch=false --browsers=ChromeHeadless`, then `npm run build`.
- `ng serve` has no Netlify functions: Spotify and Instagram requests fail locally with JSON parse errors.

## Deploy

Commit freely; push only when the user says so. Every push builds on Netlify (a deploy preview for a PR, production for `main`), and builds cost credits.

## Secrets

Everything under `src/` ships to the browser. Secrets live only in Netlify environment variables, read by the proxies in `netlify/functions/`.

## CMS-editable content

A CMS-editable text lives in five files; change them together:

1. `public/content/<file>.json`: the content
2. `src/app/services/content.service.ts`: types, validation, defaults
3. `public/admin/config.yml`: CMS fields, hints, length limits
4. `public/admin/preview.js`: CMS live preview, rebuilds the site's markup
5. `public/admin/preview.css`: styles of that preview

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues on Jonesxxl/schnittstellenpass-ng (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one root `GLOSSARY.md` plus `docs/adr/`. See `docs/agents/domain.md`.
