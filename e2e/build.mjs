/**
 * Production build for the end-to-end tests: the same as npm run build, but the
 * episode pages come from the fixed feed in e2e/fixtures/feed.xml instead of
 * the live podcast feed, so the tests know which pages exist.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { status } = spawnSync('npm', ['run', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, FEED_FILE: path.join(root, 'e2e/fixtures/feed.xml') }
});
process.exit(status ?? 1);
