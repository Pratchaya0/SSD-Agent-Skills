import fs from 'fs';
import path from 'path';

/**
 * Parse frontmatter from markdown content
 * Returns { frontmatter: object, body: string }
 */
export function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, frontmatterText, body] = match;
  const frontmatter = {};

  const lines = frontmatterText.split(/\r?\n/);
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    const leadingSpaces = line.length - line.trimStart().length;
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') && leadingSpaces >= 2) {
      if (currentArray) {
        currentArray.push(trimmed.slice(2));
      }
      continue;
    }

    if (leadingSpaces === 0) {
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();
        const isQuoted = /^(".*"|'.*')$/.test(value);
        const unquotedValue = isQuoted ? value.slice(1, -1) : value;
        const shouldCoerceBoolean =
          key === 'user-invocable' || key === 'user-invokable' || !isQuoted;

        if (value) {
          frontmatter[key] = shouldCoerceBoolean
            ? unquotedValue === 'true'
              ? true
              : unquotedValue === 'false'
                ? false
                : unquotedValue
            : unquotedValue;
          currentKey = key;
          currentArray = null;
        } else {
          currentKey = key;
          currentArray = [];
          frontmatter[key] = currentArray;
        }
      }
    }
  }

  return { frontmatter, body: body.trim() };
}

/**
 * Read and parse the SSD skill source from skill/SKILL.src.md.
 * Returns { skills: [oneEntry] }
 */
export function readSourceFiles(rootDir) {
  const skillDir = path.join(rootDir, 'skill');
  const skills = [];

  const skillMdPath = path.join(skillDir, 'SKILL.src.md');
  if (!fs.existsSync(skillMdPath)) {
    return { skills };
  }

  const content = fs.readFileSync(skillMdPath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  const references = [];
  const referenceDir = path.join(skillDir, 'reference');
  if (fs.existsSync(referenceDir)) {
    const refFiles = fs.readdirSync(referenceDir).filter(f => f.endsWith('.md'));
    for (const refFile of refFiles) {
      const refPath = path.join(referenceDir, refFile);
      references.push({
        name: path.basename(refFile, '.md'),
        content: fs.readFileSync(refPath, 'utf-8'),
        filePath: refPath,
      });
    }
  }

  const scripts = [];
  const scriptsDir = path.join(skillDir, 'scripts');
  if (fs.existsSync(scriptsDir)) {
    const scriptFiles = fs.readdirSync(scriptsDir).filter(f =>
      fs.statSync(path.join(scriptsDir, f)).isFile()
    );
    for (const scriptFile of scriptFiles) {
      const scriptPath = path.join(scriptsDir, scriptFile);
      scripts.push({
        name: scriptFile,
        content: fs.readFileSync(scriptPath, 'utf-8'),
        filePath: scriptPath,
      });
    }
  }

  skills.push({
    name: frontmatter.name || 'ssd',
    description: frontmatter.description || '',
    userInvocable: frontmatter['user-invocable'] === true || frontmatter['user-invocable'] === 'true',
    argumentHint: frontmatter['argument-hint'] || '',
    allowedTools: Array.isArray(frontmatter['allowed-tools']) ? frontmatter['allowed-tools'] : [],
    body,
    filePath: skillMdPath,
    references,
    scripts,
  });

  return { skills };
}

/**
 * Ensure directory exists, create if needed
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Clean directory (remove all contents)
 */
export function cleanDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

/**
 * Write file with automatic directory creation
 */
export function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/** Provider-specific placeholders */
export const PROVIDER_PLACEHOLDERS = {
  'claude-code': {
    model: 'Claude',
    config_file: 'CLAUDE.md',
    ask_instruction: 'STOP and call the AskUserQuestion tool to clarify.',
    command_prefix: '/',
  },
  cursor: {
    model: 'the model',
    config_file: '.cursorrules',
    ask_instruction: 'ask the user directly to clarify what you cannot infer.',
    command_prefix: '/',
  },
  gemini: {
    model: 'Gemini',
    config_file: 'GEMINI.md',
    ask_instruction: 'ask the user directly to clarify what you cannot infer.',
    command_prefix: '/',
  },
  codex: {
    model: 'GPT',
    config_file: 'AGENTS.md',
    ask_instruction: 'ask the user directly to clarify what you cannot infer.',
    command_prefix: '$',
  },
};

export const PROVIDER_BLOCK_TAGS = new Set([
  'claude-code', 'claude', 'cursor', 'gemini', 'codex',
]);

/**
 * Compile provider-conditional blocks.
 *
 * <claude-code>
 * Claude-only instructions
 * </claude-code>
 *
 * Matching blocks keep their body; non-matching blocks are removed.
 * Unknown tags are preserved so ordinary HTML/markdown is untouched.
 */
export function compileProviderBlocks(content, activeTags = []) {
  const activeTagSet = new Set(activeTags);
  const providerBlockPattern = /(^|\r?\n)[ \t]*<([a-z][a-z0-9-]*)>[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*<\/\2>[ \t]*(?=\r?\n|$)/g;
  let didCompileBlock = false;

  const compiled = content.replace(providerBlockPattern, (match, prefix, tag, body) => {
    if (!PROVIDER_BLOCK_TAGS.has(tag)) return match;
    didCompileBlock = true;
    return activeTagSet.has(tag) ? `${prefix}${body}` : prefix;
  });

  return didCompileBlock ? compiled.replace(/(?:\r?\n){3,}/g, '\n\n') : compiled;
}

/** Strip rule markers (kept for compatibility if source uses them) */
export function stripRuleMarkers(content) {
  return content.replace(/[ \t]*<!--\s*rule:[a-z0-9-]+\s*-->/g, '');
}

/** SSD sub-commands list (used in {{available_commands}}) */
const SSD_SUB_COMMANDS = [
  'frontend-init', 'backend-init',
  'frontend-setup', 'frontend-feature', 'react-component', 'react-form', 'react-state', 'react-api',
  'backend-setup', 'backend-feature', 'dotnet-controller', 'dotnet-service', 'dotnet-infra', 'dotnet-scaffold', 'dotnet-ef-query', 'database',
  'ts-fix-unused',
  'frontend-review', 'backend-review', 'frontend-refactor', 'backend-refactor',
  'python-review', 'python-refactor', 'python-starter', 'python-feature', 'python-database',
  'git-commit', 'git-flow',
  'contact-skill-gen', 'bug-auth-redirect', 'bug-version-checker', 'release-it-setup',
  'frontend-doctor', 'backend-doctor', 'python-doctor', 'python-streaming-doctor', 'db-doctor',
];

/**
 * Replace all {{placeholder}} tokens with provider-specific values
 */
export function replacePlaceholders(content, provider, _commandNames = [], _allSkillNames = []) {
  const placeholders = PROVIDER_PLACEHOLDERS[provider] || PROVIDER_PLACEHOLDERS['claude-code'];
  const cmdPrefix = placeholders.command_prefix || '/';

  const commandList = SSD_SUB_COMMANDS.map(n => `${cmdPrefix}ssd ${n}`).join(', ');

  return content
    .replace(/\{\{model\}\}/g, placeholders.model)
    .replace(/\{\{config_file\}\}/g, placeholders.config_file)
    .replace(/\{\{ask_instruction\}\}/g, placeholders.ask_instruction)
    .replace(/\{\{command_prefix\}\}/g, cmdPrefix)
    .replace(/\{\{available_commands\}\}/g, commandList);
}

function yamlNeedsQuoting(value) {
  if (typeof value !== 'string') return false;
  if (value === '') return true;
  if (/^\s|\s$/.test(value)) return true;
  if (/^[\[\]{},&*!|>'"%@`#]/.test(value)) return true;
  if (/^[?:-](\s|$)/.test(value)) return true;
  if (/: |\s#|:$/.test(value)) return true;
  if (/^(true|false|null|yes|no|on|off|~)$/i.test(value)) return true;
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value)) return true;
  return false;
}

function formatYamlScalar(value) {
  if (typeof value !== 'string') return String(value);
  if (yamlNeedsQuoting(value)) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

/**
 * Generate YAML frontmatter string
 */
export function generateYamlFrontmatter(data) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${formatYamlScalar(item)}`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${formatYamlScalar(value)}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}
