---
name: rs-full-stack-atualizando-express-1
description: "Enforces safe major dependency update workflow when upgrading npm packages with breaking changes. Use when user asks to 'update express', 'upgrade dependencies', 'bump major version', 'fix breaking changes after update', or 'run npm-check-updates'. Applies rules: update one major dependency at a time, verify app behavior before next update, inspect all files for type errors after upgrade. Make sure to use this skill whenever performing major version bumps or resolving post-upgrade breakage. Not for minor/patch updates, greenfield project setup, or choosing between packages."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: dependencias
  tags: [npm, express, breaking-changes, typescript, migration]
---

# Atualizando Dependências Major com Segurança

> Atualize dependências com breaking changes uma por vez, verificando comportamento e tipagem antes de prosseguir para a próxima.

## Prerequisites

- `npm-check-updates` disponível via npx
- Projeto funcional com testes ou endpoints verificáveis
- Cliente HTTP (Insomnia, curl) para testar rotas

## Steps

### Step 1: Listar atualizações disponíveis agrupadas

```bash
npx npm-check-updates --format group
```

Identifique quais são **major** (breaking changes potenciais) vs minor/patch.

### Step 2: Atualizar UMA dependência major por vez (modo interativo)

```bash
npx npm-check-updates --interactive --format group
```

Selecione apenas UMA dependência major (barra de espaço para marcar), confirme com Enter e Y.

### Step 3: Verificar comportamento funcional

```bash
npm run dev
```

Teste manualmente as rotas/funcionalidades principais:
- Criar recurso (POST)
- Listar recursos (GET)
- Autenticação (login)
- Fluxos dependentes (entregas, relações entre entidades)

### Step 4: Inspecionar arquivos para erros de tipagem

Abra cada arquivo do projeto e verifique a aba de Problems do editor. Erros podem aparecer apenas quando o arquivo é aberto — porque o TypeScript faz lazy loading de diagnósticos.

Ordem de inspeção recomendada:
1. `server.ts` / ponto de entrada
2. `app.ts` / configuração
3. `routes/` — cada arquivo de rota
4. `controllers/` — cada controller
5. `middlewares/` — cada middleware
6. Configurações (`.env`, prisma, etc.)

### Step 5: Catalogar os problemas encontrados

Agrupe erros por categoria (tipagem, API removida, comportamento alterado). No caso do Express 4→5, problemas comuns são todos relacionados a tipagem dos métodos de rota.

### Step 6: Resolver todos os problemas ANTES de atualizar a próxima dependência

Refatore o código para atender a nova versão. Só depois de zero erros, parta para a próxima dependência major.

## Output format

Após cada atualização major:
- Dependência atualizada e versão (ex: `express 4.17.21 → 5.0.0`)
- Lista de problemas encontrados com localização
- Status: resolvido ou pendente

## Error handling

- Se a aplicação não inicia após update: reverta com `git checkout package.json package-lock.json && npm install`
- Se erros de tipagem surgem: catalogue todos antes de corrigir — muitos compartilham a mesma causa raiz
- Se múltiplos erros em routes/ mas nenhum em controllers/: o problema é na tipagem de métodos HTTP, não na lógica

## Heuristics

| Situação | Ação |
|----------|------|
| Várias dependências com major update | Atualize uma por vez, nunca em lote |
| Erros aparecem só ao abrir arquivo | TypeScript faz lazy check — abra todos os arquivos manualmente |
| Todos os erros têm mesmo padrão | Resolva a causa raiz uma vez, aplique em todos os arquivos |
| App funciona mas tipagem quebrou | Mudança na API de tipos da lib, não no runtime |
| Update causou muitos alertas | Não entre em pânico — agrupe por categoria, resolva por grupo |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Atualizar 3-4 majors de uma vez | Uma major por vez, resolver, depois a próxima |
| Confiar que "funciona no runtime" é suficiente | Verificar tipagem E comportamento |
| Resolver erros de tipagem sem abrir todos os arquivos | Percorrer todo o projeto arquivo por arquivo |
| Atualizar próxima dependência com erros pendentes | Zero erros antes de prosseguir |
| Usar `--force` para ignorar erros de tipo | Refatorar o código para atender a nova API |

## Verification

- Aplicação inicia sem erros no console
- Todas as rotas respondem corretamente (testar via Insomnia/curl)
- Zero problemas na aba Problems do editor
- `npx tsc --noEmit` passa sem erros

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| App nao inicia apos update | Breaking change no runtime | Reverta com `git checkout package.json package-lock.json && npm install` |
| Erros de tipagem em routes/ | API de tipos mudou entre majors | Catalogue todos os erros, resolva pela causa raiz comum |
| `npx tsc --noEmit` falha | Tipagens desatualizadas | Atualize `@types/` para a mesma major da dependencia |
| Erros aparecem so ao abrir arquivo | TypeScript faz lazy check | Abra todos os arquivos do projeto manualmente para forcar diagnostico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que atualizar uma dependência por vez e armadilhas do Express 4→5
- [code-examples.md](references/code-examples.md) — Comandos npm-check-updates, fluxo completo de verificação e exemplos de erros de tipagem