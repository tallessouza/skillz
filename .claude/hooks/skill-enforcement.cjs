#!/usr/bin/env node
'use strict';

/**
 * Skill Enforcement Hook — PreToolUse (Write/Edit)
 *
 * Agent-aware skill consultation reminder.
 * Detects which AIOX agent is active and injects role-specific skill nudges.
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
  'rs-quality',
  'rs-backend-decisions',
  'rs-frontend-decisions',
];

// Agent → primary skill routers mapping
const AGENT_SKILL_MAP = {
  dev: {
    always: ['rs-implementation-workflow', 'rs-clean-code'],
    contextual: ['rs-node-js', 'rs-next-js', 'rs-full-stack', 'rs-devops', 'rs-testes-e', 'rs-seguranca-para', 'rs-masterizando', 'rs-api-com', 'rs-saa-s', 'rs-redux-zustand', 'rs-ia-node'],
  },
  architect: {
    always: ['rs-clean-code', 'rs-backend-decisions', 'rs-frontend-decisions'],
    contextual: ['rs-node-js', 'rs-devops', 'rs-saa-s'],
  },
  qa: {
    always: ['rs-testes-e', 'rs-quality'],
    contextual: ['rs-seguranca-para', 'rs-clean-code'],
  },
  devops: {
    always: ['rs-devops'],
    contextual: ['rs-seguranca-para'],
  },
  'data-engineer': {
    always: ['rs-node-js'],
    contextual: ['rs-saa-s', 'rs-full-stack', 'rs-api-com'],
  },
  'ux-design-expert': {
    always: ['rs-masterizando', 'rs-frontend-decisions'],
    contextual: ['rs-next-js', 'rs-full-stack'],
  },
  pm: {
    always: ['rs-implementation-workflow'],
    contextual: ['rs-backend-decisions', 'rs-frontend-decisions'],
  },
  po: {
    always: ['rs-implementation-workflow'],
    contextual: ['rs-quality'],
  },
  sm: {
    always: ['rs-implementation-workflow'],
    contextual: [],
  },
  analyst: {
    always: [],
    contextual: ['rs-implementation-workflow', 'rs-backend-decisions', 'rs-frontend-decisions'],
  },
};

// Content pattern → specific skill reference
const MICRO_ACTION_MAP = {
  // Clean code patterns
  variable: 'rs-clean-code/references/nomenclatura-de-variaveis-download-exercicio.md',
  boolean: 'rs-clean-code/references/causa-vs-efeito.md',
  conditional: 'rs-clean-code/references/regras-em-condicionais.md',
  'magic number': 'rs-clean-code/references/numeros-magicos.md',
  'type conversion': 'rs-clean-code/references/evite-syntatic-sugars.md',
  parameter: 'rs-clean-code/references/parametros-e-desestruturacao.md',
  component: 'rs-clean-code/references/componentes-puros.md',
  // Node.js patterns
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
  // Full-stack patterns
  docker: 'rs-full-stack/references/',
  html: 'rs-full-stack/references/',
  css: 'rs-full-stack/references/',
  express: 'rs-full-stack/references/',
  // DevOps patterns
  dockerfile: 'rs-devops/references/estrutura-de-um-dockerfile.md',
  kubernetes: 'rs-devops/references/o-que-e-kubernetes.md',
  'k8s': 'rs-devops/references/criando-um-deployment.md',
  terraform: 'rs-devops/references/cli-do-terraform.md',
  'github actions': 'rs-devops/references/configurando-nosso-primeiro-workflow.md',
  prometheus: 'rs-devops/references/configurando-o-prometheus.md',
  grafana: 'rs-devops/references/criando-dashboards-de-acompanhamento.md',
  istio: 'rs-devops/references/instalando-o-istio-e-primeiras-configuracoes.md',
  // Testing patterns
  playwright: 'rs-testes-e/references/',
  'testing library': 'rs-testes-e/references/',
  jest: 'rs-testes-e/references/',
  // Security patterns
  csrf: 'rs-seguranca-para/references/',
  xss: 'rs-seguranca-para/references/',
  cors: 'rs-seguranca-para/references/',
  // Tailwind patterns
  tailwind: 'rs-masterizando/references/',
  // Next.js patterns
  'server action': 'rs-next-js/references/',
  'app router': 'rs-next-js/references/',
  'server component': 'rs-next-js/references/',
};

// File extension → likely agent context
const FILE_AGENT_HINTS = {
  '.test.ts': 'qa',
  '.test.tsx': 'qa',
  '.spec.ts': 'qa',
  '.spec.tsx': 'qa',
  '.e2e.ts': 'qa',
  'Dockerfile': 'devops',
  'docker-compose': 'devops',
  '.github/workflows': 'devops',
  'terraform': 'devops',
  '.tf': 'devops',
  'migration': 'data-engineer',
  'schema.prisma': 'data-engineer',
  'seed': 'data-engineer',
};

function detectAgent(filePath) {
  for (const [pattern, agent] of Object.entries(FILE_AGENT_HINTS)) {
    if (filePath.includes(pattern)) return agent;
  }
  return 'dev'; // default
}

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
    if (!filePath.match(/\.(ts|tsx|js|jsx|mjs|cjs|css|html|json|yaml|yml|tf|hcl|prisma)$/)) {
      process.exit(0);
      return;
    }

    // Skip skill files themselves, hooks, configs
    if (filePath.includes('.claude/') || filePath.includes('node_modules/') || filePath.includes('.aiox-core/')) {
      process.exit(0);
      return;
    }

    // Detect likely agent from file context
    const detectedAgent = detectAgent(filePath);
    const agentSkills = AGENT_SKILL_MAP[detectedAgent] || AGENT_SKILL_MAP.dev;

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

    const primaryRouters = agentSkills.always.map(r => `.claude/skills/${r}/SKILL.md`).join(', ');
    const agentLabel = detectedAgent !== 'dev' ? ` (detected: @${detectedAgent})` : '';

    const message = `<skill-enforcement>
REMINDER: Verifique se consultou a skill reference ANTES de escrever este código${agentLabel}.
File: ${filePath}
${skillHint}

Primary routers for @${detectedAgent}: ${primaryRouters || 'contextual only'}
All routers: ${SKILL_ROUTERS.join(', ')}
A skill reference é o MANUAL. O código é o OUTPUT.
</skill-enforcement>`;

    process.stdout.write(message);
  } catch (e) {
    // Silent fail — never block
    process.stderr.write(`[skill-enforcement] ${e.message}\n`);
  }

  process.exit(0);
}

main();
