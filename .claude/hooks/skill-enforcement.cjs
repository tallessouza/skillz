#!/usr/bin/env node
'use strict';

/**
 * Skill Enforcement Hook — PreToolUse (Write/Edit)
 *
 * Injects a skill consultation reminder whenever the agent writes or edits code.
 * Lightweight nudge — never blocks, just reminds.
 *
 * Exit 0 = allow (always), output = injected context.
 */

const SKILL_ROUTERS = [
  'rs-implementation-workflow',
  'rs-full-stack',
  'rs-clean-code',
  'rs-node-js',
  'rs-next-js',
  'rs-devops',
  'rs-saa-s',
  'rs-testes-e',
  'rs-seguranca-para',
  'rs-ia-node',
  'rs-masterizando',
  'rs-api-com',
  'rs-redux-zustand',
];

const MICRO_ACTION_MAP = {
  variable: 'rs-clean-code/references/nomenclatura-de-variaveis-download-exercicio.md',
  boolean: 'rs-clean-code/references/causa-vs-efeito.md',
  conditional: 'rs-clean-code/references/regras-em-condicionais.md',
  'magic number': 'rs-clean-code/references/numeros-magicos.md',
  'type conversion': 'rs-clean-code/references/evite-syntatic-sugars.md',
  parameter: 'rs-clean-code/references/parametros-e-desestruturacao.md',
  component: 'rs-clean-code/references/componentes-puros.md',
  entity: 'rs-node-js/references/2023-entidades-e-casos-de-uso.md',
  'use case': 'rs-node-js/references/2023-caso-de-uso-criar-pergunta.md',
  repository: 'rs-node-js/references/2023-repository-pattern.md',
  fastify: 'rs-node-js/references/2023-conhecendo-o-fastify.md',
  route: 'rs-node-js/references/2023-separando-rotas-da-aplicacao.md',
  'error handler': 'rs-node-js/references/2023-handler-de-erros-global.md',
  env: 'rs-node-js/references/2023-tratando-env-com-zod.md',
  test: 'rs-node-js/references/2023-primeiro-teste-unitario.md',
  mapper: 'rs-node-js/references/2023-conversa-entre-camadas-mappers.md',
  prisma: 'rs-node-js/references/2023-setup-do-prisma.md',
  jwt: 'rs-node-js/references/2023-implementando-jwt-no-fastify.md',
  docker: 'rs-full-stack/references/',
  html: 'rs-full-stack/references/',
  css: 'rs-full-stack/references/',
  express: 'rs-full-stack/references/',
};

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('error', reject);
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(e); }
    });
  });
}

async function main() {
  try {
    const input = await readStdin();
    const toolName = input.tool_name || '';

    // Only trigger on Write and Edit tools
    if (toolName !== 'Write' && toolName !== 'Edit') {
      process.exit(0);
      return;
    }

    const filePath = (input.tool_input && (input.tool_input.file_path || '')) || '';

    // Skip non-source files
    if (!filePath.match(/\.(ts|tsx|js|jsx|mjs|cjs|css|html|json|yaml|yml)$/)) {
      process.exit(0);
      return;
    }

    // Skip skill files themselves, hooks, configs
    if (filePath.includes('.claude/') || filePath.includes('node_modules/') || filePath.includes('.aios-core/')) {
      process.exit(0);
      return;
    }

    // Detect relevant micro-actions from file content being written
    const content = (input.tool_input && (input.tool_input.content || input.tool_input.new_string || '')) || '';
    const detectedSkills = [];

    for (const [keyword, skillRef] of Object.entries(MICRO_ACTION_MAP)) {
      if (content.toLowerCase().includes(keyword) || filePath.toLowerCase().includes(keyword)) {
        detectedSkills.push(`  - ${keyword} → .claude/skills/${skillRef}`);
      }
    }

    const skillHint = detectedSkills.length > 0
      ? `Detected patterns — verify against these skill references:\n${detectedSkills.join('\n')}`
      : 'Identify the relevant skill router and load the specific reference before writing.';

    const message = `<skill-enforcement>
REMINDER: Verifique se consultou a skill reference ANTES de escrever este código.
File: ${filePath}
${skillHint}

Skill routers disponíveis: ${SKILL_ROUTERS.join(', ')}
A skill reference é o MANUAL. O código é o OUTPUT.

Se o contexto estiver ambíguo ou desatualizado, use web search (EXA/Context7) para validar antes de implementar.
</skill-enforcement>`;

    process.stdout.write(message);
  } catch (e) {
    // Silent fail — never block
    process.stderr.write(`[skill-enforcement] ${e.message}\n`);
  }

  process.exit(0);
}

main();
