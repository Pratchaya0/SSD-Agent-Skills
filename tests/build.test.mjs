import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PROVIDERS = {
  'claude-code': '.claude',
  cursor: '.cursor',
  gemini: '.gemini',
  codex: '.codex',
};

const EXPECTED_REFERENCES = [
  'backend-refactor', 'backend-review', 'backend-setup',
  'bug-auth-redirect', 'bug-version-checker', 'contact-skill-gen',
  'database', 'dotnet-controller', 'dotnet-infra', 'dotnet-service',
  'frontend-init', 'backend-init', 'ts-fix-unused',
  'frontend-refactor', 'frontend-review', 'frontend-setup',
  'git-commit', 'git-flow',
  'python-refactor', 'python-review', 'python-starter', 'python-database',
  'react-api', 'react-component', 'react-form', 'react-state',
  'release-it-setup',
];

describe('Build output — harness directories', () => {
  for (const [provider, configDir] of Object.entries(PROVIDERS)) {
    const skillDir = path.join(ROOT, configDir, 'skills', 'ssd');

    test(`${provider}: SKILL.md exists`, () => {
      assert.ok(
        fs.existsSync(path.join(skillDir, 'SKILL.md')),
        `${configDir}/skills/ssd/SKILL.md not found — run: node scripts/build.js`
      );
    });

    test(`${provider}: SKILL.md has valid frontmatter`, () => {
      const content = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf-8');
      assert.ok(content.startsWith('---\n'), 'Missing opening frontmatter delimiter');
      assert.ok(content.includes('\nname: ssd\n'), 'Missing name: ssd in frontmatter');
      assert.ok(content.includes('\ndescription:'), 'Missing description in frontmatter');
    });

    test(`${provider}: all 23 reference files exist`, () => {
      const refDir = path.join(skillDir, 'reference');
      for (const name of EXPECTED_REFERENCES) {
        const refPath = path.join(refDir, `${name}.md`);
        assert.ok(
          fs.existsSync(refPath),
          `Missing reference/${name}.md in ${provider} output`
        );
      }
    });

    test(`${provider}: placeholders resolved`, () => {
      const content = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf-8');
      assert.ok(!content.includes('{{model}}'), 'Unresolved {{model}} placeholder');
      assert.ok(!content.includes('{{config_file}}'), 'Unresolved {{config_file}} placeholder');
      assert.ok(!content.includes('{{command_prefix}}'), 'Unresolved {{command_prefix}} placeholder');
    });
  }

  test('claude-code: user-invocable: true present', () => {
    const content = fs.readFileSync(
      path.join(ROOT, '.claude/skills/ssd/SKILL.md'), 'utf-8'
    );
    assert.ok(content.includes('user-invocable: true'), 'Claude Code SKILL.md missing user-invocable');
  });

  test('cursor: no user-invocable field', () => {
    const content = fs.readFileSync(
      path.join(ROOT, '.cursor/skills/ssd/SKILL.md'), 'utf-8'
    );
    assert.ok(!content.includes('user-invocable'), 'Cursor SKILL.md should not have user-invocable');
  });

  test('codex: command prefix is $ not /', () => {
    const content = fs.readFileSync(
      path.join(ROOT, '.codex/skills/ssd/SKILL.md'), 'utf-8'
    );
    assert.ok(content.includes('$ssd'), 'Codex SKILL.md should use $ prefix');
  });
});
