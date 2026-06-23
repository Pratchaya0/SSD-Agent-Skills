import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SKILL_SRC = path.join(ROOT, 'skill', 'SKILL.src.md');
const REF_DIR = path.join(ROOT, 'skill', 'reference');
const METADATA = path.join(ROOT, 'skill', 'scripts', 'command-metadata.json');

const EXPECTED_COMMANDS = [
  'frontend-init', 'backend-init', 'ts-fix-unused',
  'frontend-setup', 'react-component', 'react-form', 'react-state', 'react-api',
  'backend-setup', 'dotnet-controller', 'dotnet-service', 'dotnet-infra', 'database',
  'frontend-review', 'backend-review', 'frontend-refactor', 'backend-refactor',
  'python-review', 'python-refactor', 'python-starter', 'python-feature',
  'git-commit', 'git-flow',
  'contact-skill-gen', 'bug-auth-redirect', 'bug-version-checker', 'release-it-setup',
  'python-database',
  'frontend-doctor', 'backend-doctor', 'python-doctor', 'db-doctor',
];

describe('Skill router — SKILL.src.md', () => {
  test('SKILL.src.md exists', () => {
    assert.ok(fs.existsSync(SKILL_SRC), 'skill/SKILL.src.md not found');
  });

  test('SKILL.src.md has user-invocable: true in frontmatter', () => {
    const content = fs.readFileSync(SKILL_SRC, 'utf-8');
    assert.ok(content.includes('user-invocable: true'), 'Missing user-invocable: true');
  });

  test('SKILL.src.md mentions all 32 commands', () => {
    const content = fs.readFileSync(SKILL_SRC, 'utf-8');
    for (const cmd of EXPECTED_COMMANDS) {
      assert.ok(
        content.includes(`\`${cmd}\``),
        `Command '${cmd}' not mentioned in SKILL.src.md`
      );
    }
  });

  test('all 32 reference files exist in skill/reference/', () => {
    for (const cmd of EXPECTED_COMMANDS) {
      const refPath = path.join(REF_DIR, `${cmd}.md`);
      assert.ok(
        fs.existsSync(refPath),
        `skill/reference/${cmd}.md not found`
      );
    }
  });

  test('no extra reference files (no orphans)', () => {
    const existingFiles = fs.readdirSync(REF_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''));
    const expected = new Set(EXPECTED_COMMANDS);
    for (const file of existingFiles) {
      assert.ok(
        expected.has(file),
        `Orphan reference file: skill/reference/${file}.md — add to EXPECTED_COMMANDS or remove`
      );
    }
  });

  test('command-metadata.json has all 32 entries', () => {
    assert.ok(fs.existsSync(METADATA), 'skill/scripts/command-metadata.json not found');
    const meta = JSON.parse(fs.readFileSync(METADATA, 'utf-8'));
    for (const cmd of EXPECTED_COMMANDS) {
      assert.ok(meta[cmd], `Missing metadata entry for command: ${cmd}`);
      assert.ok(meta[cmd].description, `Missing description for command: ${cmd}`);
    }
  });
});
