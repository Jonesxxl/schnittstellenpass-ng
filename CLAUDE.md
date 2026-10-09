# Schnittstellenpass

Website of the football podcast: Angular SPA (versions in `package.json`) on Netlify, texts editable through Decap CMS. Setup of Spotify, Instagram and the CMS login: `README.md`.

## Workflow rules (read first)

Commit freely; push only when the user says so.

**Goal: one merge to `main` per batch of work.** Every merge or push to `main` triggers a Netlify production deploy, and each one costs Netlify credits. Deploy previews of pull requests and branch deploys are free. So changes are collected in one pull request and merged once, by the owner.

1. **Stack your changes.** Before you start, run `git fetch origin` and list the open pull requests to `main`. If a Claude pull request (head branch `claude/*`) is open, build on top of it instead of on `main`:
   - If it is your own branch, add your commits to it and update the pull request description.
   - Otherwise start your branch from that pull request's head (`git checkout -B <your-branch> origin/<its-branch>`). When your work is ready, open one pull request to `main` that contains everything, and close the older pull request with the comment "Ersetzt durch #<new number>, enthält alle Änderungen".
   - If several Claude pull requests are open, stack on the newest and fold the others in the same way.
   - Branches without an open pull request (for example `claude/hero-animation`) are parked on purpose: do not stack on them.
   - CMS drafts (head branch `cms/*`) belong to Decap CMS and are published from the CMS; do not stack on them or merge them.
2. **The newer change wins conflicts.** When combining branches or bringing in `main`, resolve each conflicting hunk in favour of the newer change; your current task is the newest. Keep every non-conflicting change from both sides; never resolve a whole file blindly with "ours" or "theirs". Then build, run the tests, and name in the pull request description what was overridden.
3. **Keep one Claude pull request open to `main`** and never merge it or push to `main` yourself. If the pull request has been merged, start the next batch from the new `main`.

## Toolchain

- Use the Node version from `.nvmrc`; the Angular CLI refuses older ones. Shell state does not carry over between commands, so put that Node's `bin` directory on `PATH` in every command.
- After a pull or branch switch that changed `package-lock.json`, run `npm ci` first. Stale `node_modules` show up as TypeScript errors about `@angular/core` exports.
- Checks, as in CI (`.github/workflows/ci.yml`): `npx ng test --watch=false --browsers=ChromeHeadless`, then `npm run build`.
- `ng serve` has no Netlify functions: Spotify and Instagram requests fail locally with JSON parse errors.
- Pages are prerendered at build time (`src/app/app.routes.server.ts`), so components also run in Node: browser APIs (`window`, `matchMedia`, observers, timers) belong in `afterNextRender` or behind `isPlatformBrowser`. Data from the Netlify functions loads in the browser only; the prerendered HTML shows its loading state, except for the episodes written at build time by `scripts/fetch-episodes.mjs`.


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
