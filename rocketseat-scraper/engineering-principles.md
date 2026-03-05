# Engineering Principles — Extraídos dos Cursos Rocketseat

## Status: Mapeado (pronto para extração formal)
## Data: 2026-02-16
## Fonte: 13 cursos / 2,638 VTTs / 15.7M chars

---

## 1. Clean Code (21 aulas, 168K chars)

### Checklist Items (regras binárias)

| # | Regra | Fonte |
|---|-------|-------|
| 1 | Sem abreviações em nomes (`u` → `user`, `d` → `data`) | 003-nomenclatura-de-variaveis |
| 2 | Sem nomes genéricos (`data`, `response`, `list`, `args`) — nomear pelo conteúdo | 003-nomenclatura-de-variaveis |
| 3 | Código em inglês (misturar PT/EN prejudica legibilidade e acessibilidade) | 006-codigo-em-ingles |
| 4 | Sem negações em condicionais (`!isUserOlderThan18` → `isUserYoungerThan18`) | 007-regras-em-condicionais |
| 5 | Sem condicionais aninhadas (if dentro de if) — combinar ou early return | 007-regras-em-condicionais |
| 6 | Usar destructuring em parâmetros (`{ body, params }` > `body, params`) | 008-parametros-e-desestruturacao |
| 7 | Retornar objetos de funções (`{ user }` > `user`) para extensibilidade | 008-parametros-e-desestruturacao |
| 8 | Sem magic numbers — nomeie constantes (`THIRTY_DAYS_IN_MS`, `priceInCents`) | 009-numeros-magicos |
| 9 | Sem syntactic sugars obscuras (`!!x` → `Boolean(x)`, `+x` → `Number(x)`) | 011-evite-syntatic-sugars |
| 10 | Extrair condicionais do JSX render em variáveis nomeadas acima do return | 016-condicionais-no-render |
| 11 | PRs pequenos, revisados em 1-2 dias (10 dias aberto = não short iteration) | 002-principios-do-codigo-limpo |
| 12 | Code review obrigatório (mínimo 1, ideal 2 revisores) | 002-principios-do-codigo-limpo |
| 13 | Testes automatizados como pré-requisito de confiança | 002-principios-do-codigo-limpo |

### Heurísticas (regras contextuais)

| # | Heurística | Quando Aplicar | Fonte |
|---|-----------|----------------|-------|
| 1 | Nomear por **causa**, não efeito | Booleans: `isFormSubmitting` > `isButtonDisabled` | 005-causa-vs-efeito |
| 2 | Prefer early return > else | Sempre, exceto quando deep nesting esconde o return | 007-regras-em-condicionais |
| 3 | Comentário = WHY, documentação = WHAT | Comentário: "workaround por bug na lib X". Doc: "API reference" | 010-comentarios-vs-documentacao |
| 4 | Se não consegue testar fácil → código acoplado | Indicador: testes quebram a cada mudança pequena | 017-clean-code-no-back-end |
| 5 | Separar componente quando JS logic é isolada | NÃO quando HTML é grande; SIM quando hooks/state são locais | 012-desacoplando-componentes |
| 6 | Componente puro = recebe comportamento via props | Não importar lógica externa; funcionar em qualquer contexto | 013-componentes-puros |
| 7 | Entidade em código ≠ tabela no banco | Entidade de domínio tem regras de negócio; tabela é persistência | 020-principios-de-ddd |
| 8 | Mesmo conceito, nomes diferentes por subdomain | "user" = "customer" (compras), "recipient" (logística) | 020-principios-de-ddd |
| 9 | Código deve funcionar sem banco | Regras de negócio testáveis sem DB, framework ou dependência externa | 021-exemplo-pratico-de-ddd |
| 10 | Refatorar constantemente | 64% das features construídas nunca são usadas; patches acumulam | 002-principios-do-codigo-limpo |
| 11 | KISS — só trazer complexidade quando necessário | Não otimizar para problemas que ainda não existem | 002-principios-do-codigo-limpo |

### Frameworks / Modelos Mentais

#### 3 Pilares do Clean Code
```
1. Legibilidade    — qualquer dev entende o código rapidamente
2. Manutenibilidade — alterações não quebram coisas inesperadas
3. Previsibilidade  — confiança de que o código faz o que deveria
```

#### 5 Princípios do Código Limpo
```
1. Testes automatizados    — base de tudo
2. Code reviews            — prevenir padrões divergentes
3. Refactoring constante   — combater entropia
4. KISS                    — simplicidade primeiro
5. Short iterations        — PRs pequenos, feedback rápido
```

#### SOLID (como sistema interconectado, não regras isoladas)
```
SRP — Single Responsibility: cada classe/função tem UMA responsabilidade
OCP — Open/Closed: extensível sem modificar código existente (Strategy Pattern)
LSP — Liskov Substitution: subtipos substituíveis sem quebrar
ISP — Interface Segregation: interfaces específicas > interfaces genéricas
DIP — Dependency Inversion: depender de abstrações, não de implementações

Insight RS: a mesma mudança de código frequentemente satisfaz 3+ princípios simultaneamente.
OCP via Strategy Pattern: substituir if/else crescente por classes com interface compartilhada.
DIP via Repository Pattern: use cases recebem interfaces, implementações concretas no composition root.
```

#### DDD (introdutório)
```
1. Conversar com domain expert ANTES de codar
2. Identificar: Domain → Subdomains → Entities → Use Cases
3. Entidades em código ≠ tabelas no banco
4. Cada subdomain tem sua linguagem (Ubiquitous Language)
5. Use cases encapsulam regras de negócio
6. Repositórios abstraem persistência
```

### Patterns

| Pattern | Descrição | Fonte |
|---------|-----------|-------|
| Composition > Configuration (React) | Sub-components (`Input.Root`, `Input.Label`) > props explosion | 015-composicao-vs-customizacao |
| Handle/On Convention | `handleX` = handler interno; `onX` = callback prop | 014-funcoes-e-eventos-no-react |
| Strategy Pattern (OCP) | Substituir if/else por classes com interface compartilhada | 019-exemplo-pratico-de-solid |
| Repository Pattern (DIP) | Interface → implementação concreta injetada via constructor | 022-unindo-ddd-ao-solid |
| Object Parameters | `{ body, params }` ao invés de argumentos posicionais | 008-parametros-e-desestruturacao |

---

## 2. Testes e Arquitetura no Frontend (74 aulas, 623K chars)

### Checklist Items

| # | Regra | Fonte |
|---|-------|-------|
| 1 | Todo teste segue AAA (Arrange-Act-Assert) / Given-When-Then | 005-teste-e-qualidade |
| 2 | Coverage ≠ qualidade (linhas executadas ≠ comportamentos validados) | 005-teste-e-qualidade |
| 3 | Expected errors → HTTP status codes; Unexpected errors → 500 + observability | 018-separando-as-regras-de-negocio |

### Heurísticas

| # | Heurística | Fonte |
|---|-----------|-------|
| 1 | Um bom teste conta uma história de negócio, não detalhe de implementação | 005-teste-e-qualidade |
| 2 | Sistema legado? Começar com E2E nos critical paths antes de unit tests | 005-teste-e-qualidade |
| 3 | Architecture restricts Design restricts Code (decisões cascateiam para baixo) | 004-arquitetura-de-software |
| 4 | Everything is a trade-off (First Law of Architecture) — sem silver bullets | 004-arquitetura-de-software |
| 5 | Alta coesão, baixo acoplamento como métrica de design | 004-arquitetura-de-software |
| 6 | TDD com E2E: escrever teste Playwright antes de implementar a page | 006-tdd-com-testes-e2e |

### Frameworks

#### Test Pyramid
```
        /  E2E  \        ← lento, frágil, simula usuário real
       /Integration\     ← componente + dependências
      /    Unit      \   ← rápido, isolado, maior volume
```

#### TDD Cycle (gestão de ansiedade)
```
RED    → escrever teste que falha
GREEN  → fazer passar com mínimo de código
REFACTOR → limpar sem mudar comportamento
```

#### Repository Pattern no Frontend
```
1. Definir interface (PromptRepository)
2. Implementar (PrismaPromptRepository)
3. Injetar via constructor no use case
4. Server actions/controllers viram thin orchestrators
```

#### Black Box vs White Box Testing
```
Black Box → escrita de testes (testar comportamento, não implementação)
White Box → análise de qualidade (medir coverage, encontrar gaps)
```

---

## 3. SaaS Next.js RBAC (106 aulas, 712K chars)

### Checklist Items

| # | Regra | Fonte |
|---|-------|-------|
| 1 | Permissions em código, não no banco (90%+ dos SaaS) | 004-saas-multi-tenant-rbac |
| 2 | Error handling centralizado com typed error classes | 010-error-handling-no-fastify |
| 3 | Separar expected errors (HTTP codes) vs unexpected (500 + observability) | 010-error-handling-no-fastify |

### Heurísticas

| # | Heurística | Quando Aplicar | Fonte |
|---|-----------|----------------|-------|
| 1 | Multi-tenant ≠ multi-subdomain | Só subdomain se tenant tem página pública | 004-saas-multi-tenant-rbac |
| 2 | Multi-tenant ≠ um DB por tenant | DB separado só para governo/LGPD/self-hosted enterprise | 004-saas-multi-tenant-rbac |

### Patterns

| Pattern | Descrição | Fonte |
|---------|-----------|-------|
| RBAC + ABAC combinado | RBAC = acesso broad (roles); ABAC = granular (atributos/condições) | 004-saas-multi-tenant-rbac |
| CASL default-deny | Definir só o que CAN fazer; tudo é bloqueado por padrão | 006-introducao-ao-casl |
| Membership Table | Users → Memberships (com role) → Organizations | 004-saas-multi-tenant-rbac |
| Typed Error Classes | BadRequestError, UnauthorizedError → handler centralizado | 010-error-handling-no-fastify |

### Decision Tree: SaaS Architecture

```
Preciso de multi-tenant?
  ├── Não → Single-tenant, banco compartilhado
  └── Sim →
        ├── Tenants precisam de página pública? → Subdomínio por tenant
        └── Não → Org-switching via membership table
              ├── Contrato governo/LGPD? → DB separado por tenant
              └── Não → DB único com FK para organization
```

---

## 4. DevOps (223 aulas, 1.9M chars)

### Checklist Items

| # | Regra | Fonte |
|---|-------|-------|
| 1 | Post-mortem obrigatório após incidentes | 001-adotando-a-cultura-devops |
| 2 | Nunca criar recurso cloud via console — IaC declarativa (Terraform/Pulumi) | 001-gitops |
| 3 | Multi-stage Docker builds (separar build deps de runtime) | 017-criando-multiplos-estagios |

### Heurísticas

| # | Heurística | Fonte |
|---|-----------|-------|
| 1 | Blame the process, not the person | 001-adotando-a-cultura-devops |
| 2 | Não criar hero engineers — knowledge centralization = single point of failure | 005-conhecendo-as-tres-maneiras |
| 3 | Automatizar tarefas repetitivas antes que escalem (10 min/dia → 2h/dia) | 001-qual-e-a-ideia-do-devops |
| 4 | DevOps é cultura primeiro, ferramentas depois | 001-qual-e-a-ideia-do-devops |

### Frameworks

#### CALMS (Diagnóstico de Maturidade DevOps)
```
C — Culture:    Colaboração dev/ops, blameless post-mortems
A — Automation: CI/CD, IaC, testes automatizados
L — Lean:       Eliminar desperdício, WIP limits, flow
M — Measurement: Métricas (DORA: lead time, deploy freq, MTTR, change failure rate)
S — Sharing:    Compartilhar conhecimento, evitar silos
```

#### Three Ways of DevOps
```
1. FLOW        → Acelerar dev → ops (CI/CD, automação, small batches)
2. FEEDBACK    → Loops rápidos ops → dev (monitoring, alerting, post-mortems)
3. LEARNING    → Experimentação contínua, cultura de aprendizado
```

#### GitOps
```
Git = single source of truth da infraestrutura
- Toda mudança via PR com review
- Estado do repo = estado do cloud
- Drift detection: alertar quando realidade ≠ código
```

### Patterns

| Pattern | Descrição | Fonte |
|---------|-----------|-------|
| Multi-stage Docker builds | `FROM builder` → `COPY --from=builder` → imagem slim | 017-criando-multiplos-estagios |
| IaC Declarativa | Terraform/Pulumi > scripts imperativos > clicks no console | 001-gitops |
| Docker Optimization Ladder | Base → Slim → Alpine → Multi-stage | vários |

---

## 5. Cursos Complementares

### Go (156 aulas, 1.5M chars)
- WebSocket patterns, CSRF, autenticação por sessão
- Migrations, validators, service layer
- Channels e concorrência

### Node.js 2023 (272 aulas, 1.8M chars)
- SOLID aplicado em Node.js
- Clean Architecture
- Fastify, Prisma, Vitest
- Domain entities, use cases, repositories

### Full-Stack (1,072 aulas, 4.5M chars)
- Fundamentos web, HTML/CSS, JavaScript, React, Node.js
- IA no aprendizado (Claude, Copilot, prompting)
- APIs REST, SQL, autenticação

### Next.js (133 aulas, 1.0M chars)
- Server Components, App Router, Server Actions
- Data fetching patterns, caching strategies

### Next.js App Router + Testes (41 aulas, 330K chars)
- App Router patterns, testing Next.js apps
- Vitest + Playwright integration

---

## Mapeamento: Princípio → Artefato AIOS

### Para Self-Critique Checklist (dev phase)

```yaml
# === NAMING (Clean Code RS) ===
- Sem abreviações em variáveis
- Sem nomes genéricos (data, response, list)
- Booleans nomeados por causa, não efeito
- Código em inglês

# === STRUCTURE (Clean Code RS) ===
- Sem condicionais aninhadas
- Early return ao invés de else
- Sem magic numbers (constantes nomeadas)
- Destructuring em parâmetros
- Retornar objetos de funções

# === TESTING (Testes & Arq RS) ===
- Testes seguem AAA / Given-When-Then
- Testes expressam comportamento de negócio
- Coverage medido mas não é métrica de qualidade

# === ERROR HANDLING (SaaS RBAC RS) ===
- Typed error classes
- Expected vs unexpected errors separados
- Error handling centralizado

# === DEVOPS (DevOps RS) ===
- Multi-stage Docker builds
- IaC declarativa (nunca console)
- Post-mortem após incidentes
```

### Para Tech Presets (engineering heuristics)

```
.aios-core/data/tech-presets/
├── nextjs-react.md                ← existente (infra patterns)
├── clean-code-principles.md       ← naming, conditionals, params, KISS
├── solid-ddd-patterns.md          ← SOLID + DDD + Repository + Strategy
├── testing-strategy.md            ← pyramid, TDD, AAA, coverage ≠ quality
├── auth-rbac-patterns.md          ← RBAC+ABAC, CASL, membership, permissions
└── devops-culture.md              ← CALMS, Three Ways, GitOps, IaC
```

### Para QA Gate (qa phase)

```yaml
# === ARCHITECTURAL (Clean Code + Testes RS) ===
- Alta coesão, baixo acoplamento
- Use cases encapsulam regras de negócio
- Repository pattern para data access
- Composition over configuration (React)

# === AUTH/SECURITY (SaaS RBAC RS) ===
- Default-deny model
- Permissions em código, não no banco
- RBAC + ABAC quando granularidade necessária
```

---

## Próximos Passos

1. [ ] Rodar Framework Extractor nos cursos prioritários (clean-code, testes-arq)
2. [ ] Transformar output em tech presets
3. [ ] Adicionar checklist items ao self-critique-checklist.md
4. [ ] Testar @dev com presets ativados
5. [ ] Preparar demo para live RS
