---
name: rs-full-stack-grupos-de-atualizacoes
description: "Enforces grouped dependency update workflow using npm-check-updates interactive mode with semver grouping. Use when user asks to 'update dependencies', 'check outdated packages', 'upgrade npm packages', 'manage project dependencies', or 'run ncu'. Applies --format group flag to separate patches, minor, and major updates for informed decision-making. Make sure to use this skill whenever updating Node.js project dependencies or auditing package versions. Not for individual package installation, lock file conflicts, or monorepo dependency hoisting."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tooling
  tags: [npm, dependencies, ncu, semver, updates]
---

# Grupos de Atualizações com npm-check-updates

> Agrupe atualizações de dependências por tipo semântico (patch, minor, major) antes de decidir o que atualizar, porque cada grupo tem um nível de risco diferente.

## Prerequisites

- Node.js instalado com npx disponível
- Projeto com `package.json` contendo dependências

## Steps

### Step 1: Listar atualizações disponíveis

```bash
npx npm-check-updates
```

Mostra todas as dependências com versões atuais e recomendadas. Diferente do `npm outdated`, pula direto para a versão mais recente sem mostrar intermediárias.

### Step 2: Usar modo interativo com agrupamento

```bash
npx npm-check-updates --interactive --format group
```

Agrupa as atualizações em três categorias baseadas no versionamento semântico:

| Grupo | Significado | Risco |
|-------|-------------|-------|
| **Patch** (x.x.MUDOU) | Correções de bugs, compatível | Baixo |
| **Minor** (x.MUDOU.x) | Novas funcionalidades, compatível | Médio |
| **Major** (MUDOU.x.x) | Potencial breaking change | Alto |

### Step 3: Selecionar pacotes para atualizar

No modo interativo, navegue entre os grupos e selecione quais pacotes atualizar. Comece pelos patches (mais seguros), depois minors, e avalie majors individualmente.

## Heuristics

| Situação | Ação |
|----------|------|
| Primeira análise de dependências | Execute `npx npm-check-updates` E `npm outdated` — compare os dois resultados |
| Muitas dependências desatualizadas | Use `--interactive --format group` para decidir por grupo de risco |
| Tipagens (@types/*) com major bump | Verifique se a lib principal também mudou de major |
| Patch updates disponíveis | Geralmente seguro atualizar em lote |
| Major updates disponíveis | Avalie individualmente — podem trazer breaking changes |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `npx npm-check-updates -u` sem revisar | Use `--interactive --format group` para revisar por grupo |
| Atualizar tudo de uma vez sem agrupar | Separe por patch/minor/major e atualize em etapas |
| Confiar em apenas uma ferramenta | Compare `npm outdated` com `npx npm-check-updates` |
| Ignorar o grupo "major" | Leia changelogs de majors antes de decidir |

## Verification

- Após atualizar, execute `npm install` para aplicar as mudanças
- Rode os testes do projeto para verificar compatibilidade
- Verifique se a aplicação inicia sem erros

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `npx npm-check-updates` nao encontra atualizacoes | Todas as dependencias ja estao na ultima versao | Confirme com `npm outdated` como segunda verificacao |
| Modo interativo nao abre | Terminal nao suporta interatividade (CI/CD) | Use `npx npm-check-updates` sem `--interactive` e revise manualmente |
| Atualizacao major quebrou o projeto | Breaking change nao prevista | Reverta com `git checkout -- package.json && npm install`, leia o changelog antes de atualizar |
| `npm install` falha apos atualizar | Conflito de peer dependencies | Use `npm install --legacy-peer-deps` ou resolva os conflitos manualmente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre versionamento semântico e estratégia de atualização
- [code-examples.md](references/code-examples.md) — Todos os comandos e flags do npm-check-updates com variações