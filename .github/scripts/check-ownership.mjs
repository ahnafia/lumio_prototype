// Enforces the A/B folder split on every PR. Runs from main's copy of this file
// (the workflow checks out the base commit), so a PR can't weaken its own check.
//
//   1. The author must be one of the two cofounders, on a branch with their prefix.
//   2. A PR may not touch the other cofounder's folders.
//   3. Shared files (contract/, root config, .github/, ...) need the other cofounder's approval.
//   4. contract/ changes also need the `contract` label.
import { readFileSync } from 'node:fs';

const { GITHUB_TOKEN, REPO, PR_NUMBER } = process.env;
if (!GITHUB_TOKEN || !REPO || !PR_NUMBER) {
  console.error('Missing GITHUB_TOKEN, REPO or PR_NUMBER');
  process.exit(2);
}

const config = JSON.parse(readFileSync(new URL('../owners.json', import.meta.url), 'utf8'));
const api = async (path) => {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${path}: ${res.status} ${await res.text()}`);
  return res.json();
};
const paginate = async (path) => {
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await api(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) return all;
  }
};
const matches = (file, path) => (path.endsWith('/') ? file.startsWith(path) : file === path);

const pr = await api(`/pulls/${PR_NUMBER}`);
const files = (await paginate(`/pulls/${PR_NUMBER}/files`)).flatMap((f) => [f.filename, f.previous_filename].filter(Boolean));
const reviews = await paginate(`/pulls/${PR_NUMBER}/reviews`);
const labels = pr.labels.map((l) => l.name);

const author = config.people.find((p) => p.login.toLowerCase() === pr.user.login.toLowerCase());
const errors = [];
const notes = [];

if (!author) {
  errors.push(`@${pr.user.login} is not one of the cofounders in .github/owners.json.`);
} else {
  const other = config.people.find((p) => p !== author);
  if (!pr.head.ref.startsWith(author.branchPrefix)) {
    errors.push(`Branch "${pr.head.ref}" should start with "${author.branchPrefix}" (Cofounder ${author.role}).`);
  }

  // Latest review state per reviewer.
  const latest = new Map();
  for (const r of reviews) if (r.state !== 'COMMENTED') latest.set(r.user.login.toLowerCase(), r.state);
  const otherApproved = latest.get(other.login.toLowerCase()) === 'APPROVED';

  const crossed = [];
  const shared = [];
  for (const file of new Set(files)) {
    if (author.paths.some((p) => matches(file, p)) || config.free.some((p) => matches(file, p))) continue;
    if (other.paths.some((p) => matches(file, p))) crossed.push(file);
    else shared.push(file);
  }

  if (crossed.length) {
    errors.push(
      `This PR edits Cofounder ${other.role}'s (@${other.login}) files. Never edit the other person's folders; file a bug issue instead:\n` +
        crossed.map((f) => `    - ${f}`).join('\n'),
    );
  }
  if (shared.length) {
    const touchesContract = shared.some((f) => f.startsWith(config.contract));
    if (touchesContract && !labels.includes('contract')) errors.push('This PR changes contract/: add the `contract` label.');
    if (otherApproved) notes.push(`Shared files approved by @${other.login}.`);
    else
      errors.push(
        `Shared files need an approving review from @${other.login} (the contract is frozen; both must agree):\n` +
          shared.map((f) => `    - ${f}`).join('\n'),
      );
  }
  if (!crossed.length && !shared.length) notes.push(`Only Cofounder ${author.role}'s own folders are touched.`);
}

for (const n of notes) console.log(`✓ ${n}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log('Ownership check passed.');
