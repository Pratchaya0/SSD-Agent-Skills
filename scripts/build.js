#!/usr/bin/env node

/**
 * Build System for SSD Agent Skills
 *
 * Transforms source skill (skill/SKILL.src.md + skill/reference/*.md)
 * into provider-specific formats:
 *   - Claude Code:  .claude/skills/ssd/
 *   - Cursor:       .cursor/skills/ssd/
 *   - Gemini CLI:   .gemini/skills/ssd/
 *   - Codex CLI:    .codex/skills/ssd/
 *
 * Harness directories are committed to the repo so they are installed
 * directly when a team member clones and sets up the skills.
 *
 * Run: node scripts/build.js
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readSourceFiles, ensureDir, cleanDir, writeFile } from './lib/utils.js';
import { createTransformer, PROVIDERS } from './lib/transformers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Harness output directories committed to repo (read by npx skills and used for direct install)
const HARNESS_DIRS = {
  'claude-code': '.claude',
  cursor: '.cursor',
  gemini: '.gemini',
  codex: '.codex',
};

async function main() {
  console.log('Building SSD Agent Skills...\n');

  const { skills } = readSourceFiles(ROOT_DIR);

  if (skills.length === 0) {
    console.error('Error: skill/SKILL.src.md not found');
    process.exit(1);
  }

  const skill = skills[0];
  console.log(`Source: ${skill.name} — ${skill.references.length} reference files\n`);

  // Build to dist/ for each provider
  ensureDir(DIST_DIR);

  for (const [providerKey, config] of Object.entries(PROVIDERS)) {
    const transform = createTransformer(config);
    transform(skills, DIST_DIR);
  }

  // Sync each provider's output to the committed harness directory at repo root
  console.log('\nSyncing to harness directories...');
  for (const [providerKey, harnessDir] of Object.entries(HARNESS_DIRS)) {
    const srcSkillsDir = path.join(DIST_DIR, providerKey, harnessDir, 'skills');
    const dstSkillsDir = path.join(ROOT_DIR, harnessDir, 'skills');

    if (!fs.existsSync(srcSkillsDir)) continue;

    // Clean and recopy
    const dstSkillDir = path.join(dstSkillsDir, skill.name);
    cleanDir(dstSkillDir);
    ensureDir(dstSkillDir);
    copyDir(srcSkillsDir, dstSkillsDir);
    console.log(`  ✓ ${harnessDir}/skills/${skill.name}/`);
  }

  console.log('\nDone.');
}

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  ensureDir(dst);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
