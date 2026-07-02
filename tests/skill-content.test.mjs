import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REF_DIR = path.join(ROOT, 'skill', 'reference');

// Required section headings for standard skill files
const REQUIRED_SECTIONS = ['## บริบท', '## กฎหลัก'];

// Files with different structural conventions (bug fixes, git workflow, python-starter)
// — these are exempt from the standard section requirement but must not be empty.
const EXEMPT_FROM_REQUIRED_SECTIONS = new Set([
  'bug-auth-redirect',
  'bug-version-checker',
  'git-commit',
  'git-flow',
  'dotnet-infra',
  'python-starter',
]);

// Commands that document specific tech and must contain their key term
const TECH_KEYWORDS = {
  'frontend-init':     'web.config',
  'ts-fix-unused':     'TS6133',
  'backend-init':      'Jenkins',
  'frontend-setup':    'TypeScript',
  'frontend-feature':  'Redux',
  'react-component':   'React',
  'react-form':        'Formik',
  'react-state':       'Redux',
  'react-api':         'React Query',
  'backend-setup':     'ASP.NET',
  'backend-feature':   'Reverse Engineer',
  'dotnet-controller': 'Controller',
  'dotnet-service':    'Service',
  'dotnet-infra':      'Serilog',
  'dotnet-scaffold':   'dbcontext scaffold',
  'dotnet-ef-query':   'AsNoTracking',
  'database':          'EF Core',
  'python-starter':    'FastAPI',
  'python-feature':    'StreamingResponse',
  'python-review':     'SQLAlchemy',
  'python-database':   'SQLAlchemy',
  'git-commit':        'Conventional Commits',
  'git-flow':          'Git Flow',
  'release-it-setup':  'release-it',
  'frontend-doctor':   'package.json',
  'backend-doctor':    'Program.cs',
  'python-doctor':     'lifespan',
  'python-streaming-doctor': 'X-Accel-Buffering',
  'db-doctor':         'datetime2',
};

describe('Reference file content', () => {
  const refFiles = fs.readdirSync(REF_DIR).filter(f => f.endsWith('.md'));

  for (const file of refFiles) {
    const name = file.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(REF_DIR, file), 'utf-8');

    test(`${name}: has required sections`, () => {
      if (EXEMPT_FROM_REQUIRED_SECTIONS.has(name)) return;
      for (const section of REQUIRED_SECTIONS) {
        assert.ok(
          content.includes(section),
          `skill/reference/${file} missing section: "${section}"`
        );
      }
    });

    test(`${name}: not empty (>100 chars)`, () => {
      assert.ok(
        content.length > 100,
        `skill/reference/${file} appears empty or too short`
      );
    });

    if (TECH_KEYWORDS[name]) {
      test(`${name}: mentions "${TECH_KEYWORDS[name]}"`, () => {
        assert.ok(
          content.includes(TECH_KEYWORDS[name]),
          `skill/reference/${file} does not mention key technology: "${TECH_KEYWORDS[name]}"`
        );
      });
    }
  }
});
