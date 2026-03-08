---
name: rs-full-stack-patch-update-1
description: "Enforces gradual patch update workflow when managing Node.js dependencies. Use when user asks to 'update packages', 'fix dependency bugs', 'run npm check updates', 'update patch versions', or 'manage node dependencies'. Applies progressive update strategy: patch first, then minor, then major, with testing between each group. Make sure to use this skill whenever updating project dependencies or resolving outdated packages. Not for adding new dependencies, removing packages, or configuring package.json scripts."
---

# Patch Update — Atualização Gradual de Dependências

> Atualize dependências em grupos progressivos (patch → minor → major), testando a aplicação entre cada grupo para identificar quebras pontualmente.

## Prerequisites

- Node.js instalado
- Projeto com `package.json` existente
- `npx` disponível (vem com npm)
- Se usar Prisma: `npx prisma studio` para verificar dados

## Steps

### Step 1: Listar dependências desatualizadas agrupadas

```bash
npx npm-check-updates --interactive --format group
```

O modo interativo agrupa atualizações por tipo: patch (bug fixes), minor, major. Major já vem desabilitada por padrão como proteção.

### Step 2: Selecionar apenas atualizações patch

Navegue com seta cima/baixo entre pacotes. Use barra de espaço para marcar/desmarcar. Mantenha selecionados apenas os pacotes do grupo patch (correção de bugs). Desmarque todos os minor e major.

Pressione Enter para confirmar. Quando perguntar se quer instalar, responda `Y`.

### Step 3: Verificar o que mudou

Observe a saída do terminal — ele mostra versão anterior e nova para cada pacote. Confirme que apenas o terceiro número (patch) mudou:

```
# Exemplo de saída esperada:
@types/jest      5.0.13  →  5.0.14
@types/jsonwebtoken  0.6.0   →  0.6.7
ts-node          0.0.0   →  0.0.5
```

A major e minor se mantêm iguais. Apenas o patch incrementou.

### Step 4: Testar a aplicação

```bash
npm run dev
```

Verificações obrigatórias:
1. Aplicação inicia sem erros
2. Aba "Problems" do VS Code limpa (sem arquivos em vermelho)
3. Teste funcional: crie um registro, faça login, execute operações CRUD
4. Se usa Prisma: `npx prisma studio` para verificar dados no banco

### Step 5: Confirmar que patches foram eliminados

```bash
npx npm-check-updates --format group
```

O grupo patch deve estar vazio. Restam apenas minor e major para próximas atualizações.

## Output format

Após completar o ciclo de patch:
- Todas as correções de bug instaladas
- Aplicação testada e funcionando
- Lista restante contém apenas minor e major

## Error handling

- Se aplicação quebrar após patch update: identifique qual pacote causou o problema revertendo com `npm install package@versao-anterior`
- Se VS Code mostrar arquivos em vermelho: abra os arquivos indicados e verifique os erros de tipo
- Se testes falharem: rode os testes isoladamente para identificar qual dependência causou a falha

## Verification

1. `npx npm-check-updates --format group` não lista mais patches
2. `npm run dev` executa sem erros
3. Operações CRUD funcionam normalmente
4. Aba Problems do VS Code está limpa

## Heuristics

| Situação | Ação |
|----------|------|
| Muitos patches disponíveis | Atualize todos de uma vez — patches são correções de bug, risco baixo |
| Aplicação quebrou após patch | Reverta o último grupo e atualize um pacote por vez |
| Major aparece desabilitada | Correto — o ncu protege contra breaking changes por padrão |
| Quer atualizar tudo de uma vez | Não faça. Progressivo (patch → minor → major) permite identificar problemas pontualmente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Atualizar patch + minor + major juntos | Atualizar em grupos separados, testando entre cada |
| Pular testes após atualização | Sempre rodar a aplicação e testar CRUD |
| Ignorar arquivos vermelhos no VS Code | Abrir e investigar cada erro indicado |
| Atualizar e fazer deploy direto | Testar localmente primeiro, depois deploy |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre atualização progressiva e semver
- [code-examples.md](references/code-examples.md) — Todos os comandos e fluxos expandidos com variações