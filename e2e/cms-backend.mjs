/**
 * Local Decap backend for the CMS editor tests (npm run e2e:cms). decap-server
 * works on a throwaway clone of this repository in the temp folder, so drafts
 * saved during a test never touch the working copy or GitHub. Started and
 * stopped by Playwright (playwright.config.ts).
 */
import { spawn, spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
// A fixed folder, emptied on every start: Playwright may stop this script before it can clean up
const clone = path.join(os.tmpdir(), 'schnittstellenpass-cms');
rmSync(clone, { recursive: true, force: true });

const cloned = spawnSync('git', ['clone', '--quiet', '--no-hardlinks', root, clone], { stdio: 'inherit' });
if (cloned.status !== 0) {
  process.exit(cloned.status ?? 1);
}
// The CMS works on the branch named in public/admin/config.yml
spawnSync('git', ['-C', clone, 'checkout', '--quiet', '-B', 'main'], { stdio: 'inherit' });

const server = spawn('npx', ['--yes', 'decap-server@3.11.3'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, MODE: 'git', GIT_REPO_DIRECTORY: clone, PORT: '8081' }
});

function stop() {
  server.kill();
  rmSync(clone, { recursive: true, force: true });
  process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
server.on('exit', code => {
  rmSync(clone, { recursive: true, force: true });
  process.exit(code ?? 0);
});
