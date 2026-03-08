---
name: rs-full-stack-atualizando-o-projeto-para-react-19
description: "Manages React version upgrades when migrating projects between major versions (e.g., React 18 to 19). Use when user asks to 'upgrade React', 'update React version', 'migrate to React 19', 'update dependencies', or 'bump major version'. Covers semver analysis, dependency + typings update, and post-upgrade verification. Make sure to use this skill whenever performing major React version bumps or reviewing upgrade procedures. Not for minor/patch updates, new project creation, or non-React framework migrations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: dependencias
  tags: [react, upgrade, semver, typescript, migration]
---

# Atualizando Versão do React (Major Upgrade)

> Ao atualizar o React entre versões major, atualize runtime, tipagens e verifique a aplicação — sempre consultando a documentação oficial primeiro.

## Prerequisites

- Projeto React existente com versão anterior (ex: React 18)
- Gerenciador de pacotes configurado (npm, yarn ou pnpm)
- Documentação oficial do React consultada para guia de upgrade da versão alvo

## Steps

### Step 1: Verificar versão atual

Abra `package.json` e identifique a versão major atual do `react` e `react-dom` nas dependências.

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

Lembre do versionamento semântico: **Major.Minor.Patch** — Major traz breaking changes.

### Step 2: Consultar documentação oficial

Acesse a documentação do React para o guia de upgrade da versão alvo. O guia lista etapas específicas, breaking changes e codemods disponíveis.

### Step 3: Atualizar React e React DOM

```bash
npm install react@19 react-dom@19
```

Instale a versão exata do major desejado. Ambos devem estar na mesma versão major.

### Step 4: Atualizar tipagens (TypeScript)

```bash
npm install -D @types/react@19 @types/node@19
```

As tipagens devem acompanhar a versão major do runtime, porque a API de tipos muda entre majors.

### Step 5: Sincronizar dependências

```bash
npm install
```

Garante que o `node_modules` e o lockfile estão consistentes após as atualizações.

### Step 6: Executar a aplicação

```bash
npm run dev
```

Verifique que a aplicação inicia sem erros.

## Verification

1. Abra a aplicação no navegador
2. Abra o DevTools → Console
3. Confirme que não há warnings ou erros relacionados à versão
4. Verifique `package.json` — `react`, `react-dom` e suas tipagens devem estar na versão alvo

## Error handling

- Se `npm install` falha com conflitos de peer dependencies → verifique se outras bibliotecas (ex: react-router, styled-components) suportam a nova versão major
- Se a aplicação quebra após upgrade → consulte o guia de breaking changes na documentação oficial e aplique os codemods recomendados
- Se tipagens apresentam erros → confirme que `@types/react` está na mesma versão major que `react`

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto já está na versão alvo | Nenhuma ação necessária |
| Bibliotecas de terceiros incompatíveis | Verifique issues/releases da lib antes de atualizar React |
| Projeto usa yarn ou pnpm | Substitua `npm install` pelo comando equivalente do gerenciador |
| Múltiplos projetos no monorepo | Atualize todos os pacotes que dependem de React simultaneamente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Atualizar só `react` sem `react-dom` | Atualize ambos juntos na mesma versão major |
| Ignorar atualização das tipagens | Atualize `@types/react` e `@types/node` junto |
| Atualizar sem consultar documentação | Leia o guia de upgrade oficial antes de qualquer alteração |
| Pular verificação pós-upgrade | Rode a aplicação e verifique o console do navegador |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm install` falha com peer dependency conflict | Lib de terceiros nao suporta React 19 ainda | Verifique issues/releases da lib, use `--legacy-peer-deps` temporariamente |
| Erros de tipagem apos upgrade | `@types/react` nao foi atualizado junto | Instale `@types/react@19` e `@types/node@19` |
| App quebra no runtime | Breaking change na API do React | Consulte o guia oficial de upgrade e aplique codemods recomendados |
| Warnings no console do browser | APIs depreciadas removidas na nova versao | Substitua APIs depreciadas pelas recomendadas na documentacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre versionamento semântico e estratégia de upgrade
- [code-examples.md](references/code-examples.md) — Comandos completos e variações para diferentes gerenciadores