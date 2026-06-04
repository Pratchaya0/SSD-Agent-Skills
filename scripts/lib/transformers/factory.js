import path from 'path';
import {
  cleanDir,
  ensureDir,
  writeFile,
  generateYamlFrontmatter,
  replacePlaceholders,
  compileProviderBlocks,
  stripRuleMarkers,
} from '../utils.js';

const FIELD_SPECS = {
  'user-invocable': {
    sourceKey: 'userInvocable',
    yamlKey: 'user-invocable',
    condition: (skill) => skill.userInvocable,
    value: () => true,
  },
  'argument-hint': {
    sourceKey: 'argumentHint',
    yamlKey: 'argument-hint',
    condition: (skill) => skill.userInvocable && skill.argumentHint,
  },
};

/**
 * Create a transformer function for a given provider config.
 *
 * @param {Object} config - Provider configuration from providers.js
 * @returns {Function} transform(skills, distDir)
 */
export function createTransformer(config) {
  const {
    provider,
    configDir,
    displayName,
    frontmatterFields = [],
    bodyTransform,
    placeholderProvider,
    providerTags = [provider],
  } = config;
  const placeholderKey = placeholderProvider || provider;

  const activeFields = frontmatterFields
    .map((name) => FIELD_SPECS[name])
    .filter(Boolean);

  return function transform(skills, distDir) {
    const providerDir = path.join(distDir, provider);
    const skillsDir = path.join(providerDir, `${configDir}/skills`);

    cleanDir(providerDir);
    ensureDir(skillsDir);

    const allSkillNames = skills.map((s) => s.name);
    const commandNames = skills.filter((s) => s.userInvocable).map((s) => s.name);

    let refCount = 0;
    let scriptCount = 0;

    for (const skill of skills) {
      const skillName = skill.name;
      const skillDir = path.join(skillsDir, skillName);

      const frontmatterObj = {
        name: skillName,
        description: skill.description,
      };

      for (const spec of activeFields) {
        if (spec.condition && !spec.condition(skill)) continue;
        const val = spec.value ? spec.value(skill) : skill[spec.sourceKey];
        if (val) frontmatterObj[spec.yamlKey] = val;
      }

      const frontmatter = generateYamlFrontmatter(frontmatterObj);

      let skillBody = compileProviderBlocks(skill.body, providerTags);
      skillBody = replacePlaceholders(skillBody, placeholderKey, commandNames, allSkillNames);
      skillBody = stripRuleMarkers(skillBody);

      const scriptsPath = `${configDir}/skills/${skillName}/scripts`;
      skillBody = skillBody.replace(/\{\{scripts_path\}\}/g, scriptsPath);
      if (bodyTransform) skillBody = bodyTransform(skillBody, skill);

      writeFile(path.join(skillDir, 'SKILL.md'), `${frontmatter}\n\n${skillBody}`);

      if (skill.references && skill.references.length > 0) {
        const refDir = path.join(skillDir, 'reference');
        ensureDir(refDir);
        for (const ref of skill.references) {
          let refContent = compileProviderBlocks(ref.content, providerTags);
          refContent = replacePlaceholders(refContent, placeholderKey, [], allSkillNames);
          refContent = stripRuleMarkers(refContent);
          writeFile(path.join(refDir, `${ref.name}.md`), refContent);
          refCount++;
        }
      }

      if (skill.scripts && skill.scripts.length > 0) {
        const scriptsOutDir = path.join(skillDir, 'scripts');
        ensureDir(scriptsOutDir);
        for (const script of skill.scripts) {
          writeFile(path.join(scriptsOutDir, script.name), script.content);
          scriptCount++;
        }
      }
    }

    const skillWord = skills.length === 1 ? 'skill' : 'skills';
    const refInfo = refCount > 0 ? ` (${refCount} reference files)` : '';
    const scriptInfo = scriptCount > 0 ? ` (${scriptCount} script files)` : '';
    console.log(`  ✓ ${displayName}: ${skills.length} ${skillWord}${refInfo}${scriptInfo}`);
  };
}
