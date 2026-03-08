---
name: rs-full-stack-escaneando-o-projeto-1
description: "Enforces dependency scanning workflow when auditing Node.js project dependencies with npm outdated. Use when user asks to 'check outdated packages', 'scan dependencies', 'update dependencies', 'audit npm packages', or 'plan dependency updates'. Guides analysis of current vs wanted vs latest versions, identifies breaking changes via semver major bumps, and structures an update plan. Make sure to use this skill whenever managing Node.js dependency updates. Not for yarn/pnpm-specific workflows, security vulnerability audits with npm audit, or lock file conflicts."
---

# Escaneando Dependências do Projeto

> Antes de atualizar qualquer dependência, escaneie o projeto com `npm outdated` e monte um plano que prioriza atualizações sem breaking changes.

## Prerequisites

- Projeto Node.js com `package.json` e `node_modules` instalados
- Se `node_modules` ausente: executar `npm install` primeiro

## Steps

### Step 1: Executar o scanner

```bash
npm outdated
```

Resultado esperado — tabela com 4 colunas:

| Package | Current | Wanted | Latest |
|---------|---------|--------|--------|
| prisma  | 5.19.1  | 5.22.0 | 5.22.0 |
| express | 4.21.0  | 4.21.0 | 5.0.1  |
| @types/node | 20.14.12 | 20.17.6 | 22.9.0 |

- **Current** — versão instalada no projeto (confere com `package.json`)
- **Wanted** — versão mais recente compatível com o range do `package.json` (respeita semver)
- **Latest** — última versão publicada com a tag `latest`

### Step 2: Classificar cada dependência

Para cada linha, comparar Wanted vs Latest:

| Situação | Classificação | Ação |
|----------|--------------|------|
| Wanted == Latest | Atualização segura | Atualizar primeiro |
| Wanted < Latest, mesma major | Atualização segura | Atualizar primeiro |
| Wanted < Latest, major diferente | Possível breaking change | Atualizar depois, com análise |
| Current == Wanted, Latest tem major diferente | Só breaking change disponível | Planejar migração separada |

### Step 3: Montar plano de atualização

Dividir em duas fases:

**Fase 1 — Atualizações sem breaking changes:**
```bash
# Atualizar todas as dependências dentro do range compatível
npm update
```

**Fase 2 — Atualizações com breaking changes (uma por vez):**
```bash
# Analisar changelog/migration guide antes
npm install package@latest
# Testar aplicação
# Refatorar o que quebrou
```

### Step 4: Verificar resultado

```bash
npm outdated
# Deve retornar apenas dependências com breaking changes pendentes (ou vazio)
```

## Output format

Ao reportar o scan para o usuário, usar esta estrutura:

```markdown
## Dependency Scan Results

### Atualizações seguras (sem breaking changes)
| Package | Current → Wanted |
|---------|-----------------|
| prisma  | 5.19.1 → 5.22.0 |

### Requerem análise (possível breaking change)
| Package | Current | Wanted | Latest | Motivo |
|---------|---------|--------|--------|--------|
| express | 4.21.0  | 4.21.0 | 5.0.1  | Major 4→5 |
| @types/node | 20.14.12 | 20.17.6 | 22.9.0 | Major 20→22 |

### Plano recomendado
1. Executar `npm update` para atualizações seguras
2. Migrar `express` para v5 (verificar migration guide)
3. Migrar `@types/node` para v22 (verificar compatibilidade)
```

## Error handling

- Se `npm outdated` retorna vazio: todas as dependências estão atualizadas dentro do range
- Se `npm outdated` falha com ERESOLVE: há conflitos de peer dependencies — resolver antes de atualizar

## Verification

- Após `npm update`, rodar `npm outdated` novamente — dependências seguras devem sumir da lista
- Rodar testes do projeto após cada atualização para garantir que nada quebrou

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto com muitas dependências desatualizadas | Começar pelas seguras, resolver o grosso primeiro |
| Major version bump disponível | Nunca pular direto — ler changelog e migration guide |
| Wanted == Current mas Latest é maior | O `package.json` trava a major — atualização manual necessária |
| Dependência de dev (@types, jest, tsx) | Geralmente seguro atualizar mesmo com major bump |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `npm install package@latest` em todas de uma vez | Atualizar uma breaking change por vez |
| Ignorar a coluna Wanted e ir direto para Latest | Usar Wanted como referência segura |
| Atualizar sem rodar testes depois | Testar após cada batch de atualizações |
| Assumir que Latest é sempre melhor | Analisar se a major mudou antes de decidir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre versionamento semântico e estratégia de atualização
- [code-examples.md](references/code-examples.md) — Exemplos completos de output do npm outdated e fluxos de atualização