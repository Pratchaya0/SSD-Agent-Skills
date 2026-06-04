# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
node scripts/build.js        # Build all providers (Claude Code, Cursor, Gemini, Codex)
node --test tests/build.test.mjs tests/skill-router.test.mjs tests/skill-content.test.mjs  # Run all tests
node --test tests/build.test.mjs          # Single test file
node --test tests/skill-router.test.mjs  # Single test file
node --test tests/skill-content.test.mjs # Single test file
```

No `bun install` needed — no external dependencies.

## Architecture

This repo ships **one user-invocable skill** (`/ssd`) with **23 sub-commands**, compiled to 4 provider formats from a single source. The consolidation is intentional: one skill in the AI menu beats 23 separate entries.

### Source (edit these)

```
skill/
  SKILL.src.md              ← Main skill: frontmatter + command router table + shared standards
  reference/
    frontend-setup.md       ← Loaded when /ssd frontend-setup is invoked
    react-component.md
    ... (23 files total)
  scripts/
    command-metadata.json   ← description + argumentHint per command (used by build)
```

### Build output (auto-generated — do not edit directly)

```
.claude/skills/ssd/   ← Claude Code (user-invocable: true, argument-hint)
.cursor/skills/ssd/   ← Cursor (no user-invocable)
.gemini/skills/ssd/   ← Gemini CLI
.codex/skills/ssd/    ← Codex CLI ($ prefix instead of /)
dist/                 ← per-provider archives
```

Run `node scripts/build.js` after every edit to `skill/` to refresh all 4 harness directories.

### Build system

```
scripts/
  build.js                         ← Orchestrator: reads skill/, writes dist/ + harness dirs
  lib/
    utils.js                       ← parseFrontmatter, replacePlaceholders, generateYamlFrontmatter, etc.
    transformers/
      factory.js                   ← createTransformer(config) — provider-agnostic
      providers.js                 ← 4 provider config objects (claude-code, cursor, gemini, codex)
      index.js                     ← re-exports
```

**Placeholders** (resolved per-provider in `scripts/lib/utils.js`):
- `{{model}}` — Claude / Gemini / GPT / the model
- `{{config_file}}` — CLAUDE.md / .cursorrules / GEMINI.md / AGENTS.md
- `{{command_prefix}}` — `/` or `$` (Codex)
- `{{available_commands}}` — full list of `/ssd <cmd>` commands

**Provider-conditional blocks** — wrap content for one provider only:
```markdown
<claude-code>
Claude-specific instruction here
</claude-code>
```

## Adding a new sub-command

1. Create `skill/reference/<command>.md` — the content loaded when the command is invoked
2. Add a row to the command table in `skill/SKILL.src.md`
3. Add an entry to `skill/scripts/command-metadata.json` (description + argumentHint)
4. Add the command to `EXPECTED_COMMANDS` and `SSD_SUB_COMMANDS` in:
   - `tests/skill-router.test.mjs`
   - `tests/skill-content.test.mjs`
   - `scripts/lib/utils.js` (`SSD_SUB_COMMANDS` array)
5. Run `node scripts/build.js` and `node --test tests/*.test.mjs`

## Reference file conventions

Standard skills must have:
- `## บริบท` — why this skill exists and what problem it solves
- `## กฎหลัก` — 5–7 non-negotiable rules

Exempt from this (use their own structure): `bug-auth-redirect`, `bug-version-checker`, `git-commit`, `git-flow`, `dotnet-infra`, `python-starter`.

## Legacy skills/ directory

The original standalone skills at `skills/ssd-*/SKILL.md` are kept for reference. The build system reads from `skill/` only. Do not edit files in `skills/` — they are the migration source, not the live content.
