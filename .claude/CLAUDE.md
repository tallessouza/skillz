# Skillz — Dev Agent + Skillz Skills Test Environment

## ⚠️ REGRA #1 — SKILLS SÃO OBRIGATÓRIAS (LEIA ANTES DE TUDO)

**ANTES de escrever qualquer código, criar qualquer plano, ou entrar em plan mode:**

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

Ambiente de teste para validar a integração de ~1,067 skills extraídas de cursos Rocketseat com o @dev agent e CodeRabbit.

## Estrutura

```
skillz/
├── .claude/
│   ├── skills/rs-{course}/     # 11 skill routers (auto-discovered)
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
  → Claude navega para a skill específica via references/
  → Se precisa profundidade, carrega deep-explanation.md ou code-examples.md
  → CodeRabbit valida (pre-commit)
  → Auto-fix CRITICAL (max 2 iterações)
  → Commit
```

## Skills Architecture

### Progressive Disclosure (3 níveis)

1. **Router description** (~400 chars) — sempre em contexto, ativa auto-discovery
2. **Router SKILL.md** (~200 lines) — grouped index com links para references
3. **references/{skill}.md** — skill individual completa + links para deep-explanation e code-examples

### Domínios (11 routers)

| Router | Skills | Domínio |
|--------|--------|---------|
| rs-full-stack | 832 | HTML, CSS, JS, Express, SQL, Docker, Webpack, JWT |
| rs-clean-code | 21 | SOLID, DDD, naming, components |
| rs-node-js | 272 | Streams, HTTP, Fastify, NestJS, DDD |
| rs-next-js | 174 | App Router, SSR, API Routes |
| rs-devops | 223 | Docker, K8s, Terraform, CI/CD |
| rs-saa-s | 106 | Monorepo, RBAC, auth, permissions |
| rs-testes-e | 74 | Unit, E2E, Playwright, CI |
| rs-seguranca-para | 54 | Auth, XSS, CSRF, injection |
| rs-ia-node | 50 | LLM, embeddings, function calling |
| rs-masterizando | 37 | Tailwind CSS patterns |
| rs-api-com | 34 | API with Bun, Drizzle ORM |
| rs-redux-zustand | 22 | State management patterns |

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
