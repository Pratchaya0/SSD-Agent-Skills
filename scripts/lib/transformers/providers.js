/**
 * Provider configurations for the SSD transformer factory.
 */
export const PROVIDERS = {
  'claude-code': {
    provider: 'claude-code',
    providerTags: ['claude-code', 'claude'],
    configDir: '.claude',
    displayName: 'Claude Code',
    frontmatterFields: ['user-invocable', 'argument-hint', 'allowed-tools'],
  },
  cursor: {
    provider: 'cursor',
    providerTags: ['cursor'],
    configDir: '.cursor',
    displayName: 'Cursor',
    frontmatterFields: [],
  },
  gemini: {
    provider: 'gemini',
    providerTags: ['gemini'],
    configDir: '.gemini',
    displayName: 'Gemini CLI',
    frontmatterFields: [],
  },
  codex: {
    provider: 'codex',
    providerTags: ['codex'],
    configDir: '.codex',
    displayName: 'Codex CLI',
    frontmatterFields: [],
  },
};
