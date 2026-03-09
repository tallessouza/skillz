# Skillz — Dev Agent + Skillz Skills Test Environment

## ⚠️ REGRA #0 — PLAN MODE OBRIGATÓRIO

**Toda tarefa de desenvolvimento DEVE começar em plan mode. Sem exceção.**

```
Recebeu tarefa de desenvolvimento (implementar, criar, build, refactor, fix)?
  │
  └─ OBRIGATÓRIO: Entre em plan mode ANTES de qualquer ação
      → Use a tool EnterPlanMode
      → O plano deve incluir: Skills Map, arquivos afetados, sequência de passos
      → Web research durante o planejamento (EXA/Context7) quando necessário
      → Só saia do plan mode (ExitPlanMode) quando o plano estiver aprovado
```

**Exceções (NÃO precisa de plan mode):**
- Perguntas simples ("o que é X?", "onde fica Y?")
- Comandos de agente (`*help`, `*status`, `*exit`)
- Leitura/exploração de código sem modificação
- Operações git simples (commit, push)

---

## ⚠️ REGRA #1 — SKILLS SÃO OBRIGATÓRIAS (LEIA ANTES DE TUDO)

**ANTES de escrever qualquer código, criar qualquer plano, ou entrar em plan mode:**

0. **ENTRE EM PLAN MODE** — todo desenvolvimento começa planejando (ver Regra #0)
1. Abra e leia `.claude/skills/rs-implementation-workflow/SKILL.md`
2. Siga a decision tree para identificar quais skill routers se aplicam
3. Navegue até os skill routers relevantes (`.claude/skills/rs-{domain}/SKILL.md`)
4. Carregue as references/ específicas que guiam cada ação
5. **O plano DEVE incluir uma seção "Skills Map"** com o mapeamento skill→arquivo
6. **Durante implementação, consulte skills PROGRESSIVAMENTE** — para CADA micro-ação:
   - Nomear variável → `rs-clean-code/references/nomenclatura-de-variaveis-*.md`
   - Escrever condicional → `rs-clean-code/references/regras-em-condicionais.md`
   - Criar entidade → `rs-node-js/references/2023-entidades-e-casos-de-uso.md`
   - Setup Fastify → `rs-node-js/references/2023-conhecendo-o-fastify.md`
   - Validar env com Zod → `rs-node-js/references/2023-tratando-env-com-zod.md`
   - Separar rotas → `rs-node-js/references/2023-separando-rotas-da-aplicacao.md`
   - Error handler → `rs-node-js/references/2023-handler-de-erros-global.md`
   - Escrever testes → `rs-node-js/references/2023-primeiro-teste-unitario.md`
   - HTML/CSS/JS fundamentos → `rs-full-stack/references/` (832 skills)
   - Express routes → `rs-full-stack/references/` (ramo server/API)
   - SQL/Knex/Prisma básico → `rs-full-stack/references/` (ramo database)
   - Docker/Webpack/Babel → `rs-full-stack/references/` (ramo tooling)

**A skill reference é o MANUAL. O código é o OUTPUT.**
**Escrever código sem consultar skills = violação de processo = equivalente a pular testes.**

---

## Objetivo

Ambiente de teste para validar a integração de ~2,087 skills extraídas de cursos Skillz com o @dev agent e CodeRabbit.

## Estrutura

```
skillz/
├── .claude/
│   ├── skills/rs-{course}/     # 12 skill routers (auto-discovered)
│   │   ├── SKILL.md            # Router: description + grouped index
│   │   └── references/         # Individual skill content (progressive disclosure)
│   └── CLAUDE.md
├── .aios-core/development/     # Dev agent + tasks + scripts
├── data/skills/{course}/       # Raw individual skills (NOT auto-discovered)
│   └── rs-{course}-{slug}/
│       ├── SKILL.md
│       └── references/
│           ├── deep-explanation.md
│           └── code-examples.md
├── scripts/                    # Build scripts
└── src/                        # Project source code
```

## Agent System

### Ativação
- `@dev` — Ativa o agente desenvolvedor (Dex)
- Comandos: `*help`, `*develop`, `*run-tests`

### Fluxo Principal

```
Escrever código
  → Skills routers ativam (auto-discovery por description matching)
  → Claude navega a decision tree do router (perguntas de decisão)
  → Carrega references/ específicas que guiam a implementação
  → CodeRabbit valida (pre-commit)
  → Auto-fix CRITICAL (max 2 iterações)
  → Commit
```

## Skills Architecture

### Progressive Disclosure (2 níveis)

1. **Router description** (~400 chars) — sempre em contexto, ativa auto-discovery
2. **Router SKILL.md** (decision tree) — árvore de decisão com links para references/
3. **references/{skill}.md** — skill individual completa (~50-150 linhas)

### Domínios (12 routers — 2,087 skills, 100% cobertura)

| Router | Skills | Domínio |
|--------|--------|---------|
| rs-full-stack | 1020 | HTML, CSS, JS, Express, SQL, Docker, Webpack, JWT |
| rs-node-js | 272 | Streams, HTTP, Fastify, NestJS, DDD |
| rs-devops | 223 | Docker, K8s, Terraform, CI/CD |
| rs-next-js | 174 | App Router, SSR, API Routes |
| rs-saa-s | 106 | Monorepo, RBAC, auth, permissions |
| rs-testes-e | 74 | Unit, E2E, Playwright, CI |
| rs-seguranca-para | 54 | Auth, XSS, CSRF, injection |
| rs-ia-node | 50 | LLM, embeddings, function calling |
| rs-masterizando | 37 | Tailwind CSS patterns |
| rs-api-com | 34 | API with Bun, Drizzle ORM |
| rs-redux-zustand | 22 | State management patterns |
| rs-clean-code | 21 | SOLID, DDD, naming, components |

## CodeRabbit Integration

- **Mode:** light (CRITICAL only)
- **Max iterations:** 2
- **Trigger:** pre-commit / story completion
- **Behavior:** auto-fix CRITICAL, document HIGH

## Regras

### NEVER
- Implementar sem consultar skills primeiro (BLOCKING — ver seção Skills Obrigatórias)
- Implementar sem ler o código existente
- Entrar em plan mode sem referenciar skills consultadas
- Pular CodeRabbit antes de commit
- Usar mock data quando real data existe
- Explicar quando receber crítica (só corrija)
- Criar código "do zero" quando existe skill com padrão documentado

### ALWAYS
- **ANTES de qualquer implementação**: abrir rs-implementation-workflow (.claude/skills/rs-implementation-workflow/SKILL.md)
- Navegar a decision tree do skill router relevante para a stack
- Carregar as references/ específicas antes de escrever código
- Verificar se skill relevante foi ativada
- Rodar CodeRabbit antes de marcar como pronto
- Conventional commits: `feat:`, `fix:`, `refactor:`
- Responder em português, código em inglês

## Skills Obrigatórias — Regra de Ouro

**TODA implementação DEVE começar consultando skills. Sem exceção.**

```
Recebeu tarefa de implementação
  │
  ├─ É nova feature/módulo/serviço?
  │   └─ OBRIGATÓRIO: Abrir rs-implementation-workflow/SKILL.md
  │       → Seguir Fases 1-4 (DDD → SOLID → Implementação → Validação)
  │       → Cada fase aponta para skills específicas com references/
  │
  ├─ É bug fix simples?
  │   └─ Consultar rs-clean-code (naming, condicionais)
  │
  ├─ É refactoring?
  │   └─ Consultar rs-clean-code (SOLID) + skill da stack
  │
  └─ Qualquer outro caso?
      └─ Identificar skill router relevante → navegar decision tree
```

**Se não consultou skill → o código está errado por definição.**

### Debugging First Principles
1. Arquivo existe onde o código espera? → `ls -la /exact/path/`
2. Servidor serve? → `curl -I http://localhost:PORT/path`
3. Testou com hard refresh? → Cmd+Shift+R

### Determinismo First
```
1. Script/código determinístico    ← SEMPRE preferir
2. Query SQL direta                ← Previsível, auditável
3. Regex/pattern matching          ← Reproduzível
4. LLM como último recurso         ← Só quando criatividade necessária
```

---
*Skillz Test Environment v1.0*

---

<!-- AIOX-MANAGED SECTIONS -->
<!-- These sections are managed by AIOX. Edit content between markers carefully. -->
<!-- Your custom content above will be preserved during updates. -->

<!-- AIOX-MANAGED-START: core-framework -->
## Core Framework Understanding

Synkra AIOX is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.
<!-- AIOX-MANAGED-END: core-framework -->

<!-- AIOX-MANAGED-START: constitution -->
## Constitution

O AIOX possui uma **Constitution formal** com princípios inegociáveis e gates automáticos.

**Documento completo:** `.aiox-core/constitution.md`

**Princípios fundamentais:**

| Artigo | Princípio | Severidade |
|--------|-----------|------------|
| I | CLI First | NON-NEGOTIABLE |
| II | Agent Authority | NON-NEGOTIABLE |
| III | Story-Driven Development | MUST |
| IV | No Invention | MUST |
| V | Quality First | MUST |
| VI | Absolute Imports | SHOULD |

**Gates automáticos bloqueiam violações.** Consulte a Constitution para detalhes completos.
<!-- AIOX-MANAGED-END: constitution -->

<!-- AIOX-MANAGED-START: sistema-de-agentes -->
## Sistema de Agentes

### Ativação de Agentes
Use `@agent-name` ou `/AIOX:agents:agent-name`:

| Agente | Persona | Escopo Principal |
|--------|---------|------------------|
| `@dev` | Dex | Implementação de código |
| `@qa` | Quinn | Testes e qualidade |
| `@architect` | Aria | Arquitetura e design técnico |
| `@pm` | Morgan | Product Management |
| `@po` | Pax | Product Owner, stories/epics |
| `@sm` | River | Scrum Master |
| `@analyst` | Alex | Pesquisa e análise |
| `@data-engineer` | Dara | Database design |
| `@ux-design-expert` | Uma | UX/UI design |
| `@devops` | Gage | CI/CD, git push (EXCLUSIVO) |

### Comandos de Agentes
Use prefixo `*` para comandos:
- `*help` - Mostrar comandos disponíveis
- `*create-story` - Criar story de desenvolvimento
- `*task {name}` - Executar task específica
- `*exit` - Sair do modo agente
<!-- AIOX-MANAGED-END: sistema-de-agentes -->

<!-- AIOX-MANAGED-START: agent-system -->
## Agent System

### Agent Activation
- Agents are activated with @agent-name syntax: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- The master agent is activated with @aiox-master
- Agent commands use the * prefix: *help, *create-story, *task, *exit

### Agent Context
When an agent is active:
- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction
<!-- AIOX-MANAGED-END: agent-system -->

<!-- AIOX-MANAGED-START: framework-structure -->
## AIOX Framework Structure

```
aiox-core/
├── agents/         # Agent persona definitions (YAML/Markdown)
├── tasks/          # Executable task workflows
├── workflows/      # Multi-step workflow definitions
├── templates/      # Document and code templates
├── checklists/     # Validation and review checklists
└── rules/          # Framework rules and patterns

docs/
├── stories/        # Development stories (numbered)
├── prd/            # Product requirement documents
├── architecture/   # System architecture documentation
└── guides/         # User and developer guides
```
<!-- AIOX-MANAGED-END: framework-structure -->

<!-- AIOX-MANAGED-START: framework-boundary -->
## Framework vs Project Boundary

O AIOX usa um modelo de 4 camadas (L1-L4) para separar artefatos do framework e do projeto. Deny rules em `.claude/settings.json` reforçam isso deterministicamente.

| Camada | Mutabilidade | Paths | Notas |
|--------|-------------|-------|-------|
| **L1** Framework Core | NEVER modify | `.aiox-core/core/`, `.aiox-core/constitution.md`, `bin/aiox.js`, `bin/aiox-init.js` | Protegido por deny rules |
| **L2** Framework Templates | NEVER modify | `.aiox-core/development/tasks/`, `.aiox-core/development/templates/`, `.aiox-core/development/checklists/`, `.aiox-core/development/workflows/`, `.aiox-core/infrastructure/` | Extend-only |
| **L3** Project Config | Mutable (exceptions) | `.aiox-core/data/`, `agents/*/MEMORY.md`, `core-config.yaml` | Allow rules permitem |
| **L4** Project Runtime | ALWAYS modify | `docs/stories/`, `packages/`, `squads/`, `tests/` | Trabalho do projeto |

**Toggle:** `core-config.yaml` → `boundary.frameworkProtection: true/false` controla se deny rules são ativas (default: true para projetos, false para contribuidores do framework).

> **Referência formal:** `.claude/settings.json` (deny/allow rules), `.claude/rules/agent-authority.md`
<!-- AIOX-MANAGED-END: framework-boundary -->

<!-- AIOX-MANAGED-START: rules-system -->
## Rules System

O AIOX carrega regras contextuais de `.claude/rules/` automaticamente. Regras com frontmatter `paths:` só carregam quando arquivos correspondentes são editados.

| Rule File | Description |
|-----------|-------------|
| `agent-authority.md` | Agent delegation matrix and exclusive operations |
| `agent-handoff.md` | Agent switch compaction protocol for context optimization |
| `agent-memory-imports.md` | Agent memory lifecycle and CLAUDE.md ownership |
| `coderabbit-integration.md` | Automated code review integration rules |
| `ids-principles.md` | Incremental Development System principles |
| `mcp-usage.md` | MCP server usage rules and tool selection priority |
| `story-lifecycle.md` | Story status transitions and quality gates |
| `workflow-execution.md` | 4 primary workflows (SDC, QA Loop, Spec Pipeline, Brownfield) |

> **Diretório:** `.claude/rules/` — rules são carregadas automaticamente pelo Claude Code quando relevantes.
<!-- AIOX-MANAGED-END: rules-system -->

<!-- AIOX-MANAGED-START: code-intelligence -->
## Code Intelligence

O AIOX possui um sistema de code intelligence opcional que enriquece operações com dados de análise de código.

| Status | Descrição | Comportamento |
|--------|-----------|---------------|
| **Configured** | Provider ativo e funcional | Enrichment completo disponível |
| **Fallback** | Provider indisponível | Sistema opera normalmente sem enrichment — graceful degradation |
| **Disabled** | Nenhum provider configurado | Funcionalidade de code-intel ignorada silenciosamente |

**Graceful Fallback:** Code intelligence é sempre opcional. `isCodeIntelAvailable()` verifica disponibilidade antes de qualquer operação. Se indisponível, o sistema retorna o resultado base sem modificação — nunca falha.

**Diagnóstico:** `aiox doctor` inclui check de code-intel provider status.

> **Referência:** `.aiox-core/core/code-intel/` — provider interface, enricher, client
<!-- AIOX-MANAGED-END: code-intelligence -->

<!-- AIOX-MANAGED-START: graph-dashboard -->
## Graph Dashboard

O CLI `aiox graph` visualiza dependências, estatísticas de entidades e status de providers.

### Comandos

```bash
aiox graph --deps                        # Dependency tree (ASCII)
aiox graph --deps --format=json          # Output como JSON
aiox graph --deps --format=html          # Interactive HTML (abre browser)
aiox graph --deps --format=mermaid       # Mermaid diagram
aiox graph --deps --format=dot           # DOT format (Graphviz)
aiox graph --deps --watch                # Live mode com auto-refresh
aiox graph --deps --watch --interval=10  # Refresh a cada 10 segundos
aiox graph --stats                       # Entity stats e cache metrics
```

**Formatos de saída:** ascii (default), json, dot, mermaid, html

> **Referência:** `.aiox-core/core/graph-dashboard/` — CLI, renderers, data sources
<!-- AIOX-MANAGED-END: graph-dashboard -->

<!-- AIOX-MANAGED-START: aiox-patterns -->
## AIOX-Specific Patterns

### Working with Templates
```javascript
const template = await loadTemplate('template-name');
const rendered = await renderTemplate(template, context);
```

### Agent Command Handling
```javascript
if (command.startsWith('*')) {
  const agentCommand = command.substring(1);
  await executeAgentCommand(agentCommand, args);
}
```

### Story Updates
```javascript
// Update story progress
const story = await loadStory(storyId);
story.updateTask(taskId, { status: 'completed' });
await story.save();
```
<!-- AIOX-MANAGED-END: aiox-patterns -->

<!-- AIOX-MANAGED-START: common-commands -->
## Common Commands

### AIOX Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow

### Development Commands
- `npm run dev` - Start development
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run build` - Build project
<!-- AIOX-MANAGED-END: common-commands -->
