---
name: rs-full-stack-finalizando-atualizacao-1
description: "Enforces selective dependency update workflow when finalizing Node.js package upgrades with npm-check-updates. Use when user asks to 'update dependencies', 'upgrade packages', 'finalize updates', 'check outdated packages', or 'update types'. Applies incremental update strategy: update one package at a time, verify all files compile, test endpoints manually, then commit. Make sure to use this skill whenever updating Node.js project dependencies or running ncu. Not for initial project setup, adding new dependencies, or frontend bundle optimization."
---

# Finalizando Atualização de Dependências

> Atualize dependências uma por vez, verifique compilação e teste endpoints antes de commitar.

## Prerequisites

- `npm-check-updates` disponível via npx
- Aplicação funcional antes de iniciar atualizações
- Ferramenta de teste HTTP (Insomnia, curl, etc.)

## Steps

### Step 1: Atualizar pacote específico com ncu interativo

```bash
npx npm-check-updates --interactive --group
```

- Desmarcar tudo com barra de espaço
- Selecionar apenas o pacote alvo (ex: `@types/node`)
- Confirmar com `y`

### Step 2: Verificar compilação arquivo por arquivo

Abrir cada arquivo do projeto para garantir que não há erros de tipagem:

```
controllers/ → cada controller
middlewares/ → cada middleware
routes/ → cada arquivo de rota
prisma/ → schema e client
tests/ → arquivos de teste
utils/ → utilitários
```

### Step 3: Executar a aplicação

```bash
npm run dev
```

### Step 4: Testar endpoints críticos

Testar manualmente os fluxos principais:

| Fluxo | Endpoint | Verificação |
|-------|----------|-------------|
| Criar usuário | POST /users | Status 201 |
| Login | POST /sessions | Token retornado |
| Listar recursos | GET /deliveries | Dados corretos |

### Step 5: Verificar dependências restantes

```bash
npm outdated
```

Avaliar se dependências restantes devem ser atualizadas ou mantidas na versão atual.

### Step 6: Commitar a atualização

```bash
git commit -m "updated @types/node"
```

Um commit por pacote atualizado — rastreabilidade clara.

## Heuristics

| Situação | Ação |
|----------|------|
| Pacote de tipagem (@types/*) | Atualizar e verificar compilação |
| Última versão introduz bug | Manter versão atual, acompanhar releases |
| Múltiplos pacotes desatualizados | Atualizar um por vez, nunca todos juntos |
| Dependência crítica (express, prisma) | Testar todos os endpoints após atualização |
| `npm outdated` mostra apenas @types/express | Avaliar se a versão atual funciona — não forçar atualização |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `ncu -u` (atualizar tudo de uma vez) | `npx ncu --interactive --group` (selecionar um por vez) |
| Atualizar sem testar endpoints | Testar fluxos críticos após cada atualização |
| Commitar múltiplas atualizações juntas | Um commit por pacote: `updated @types/node` |
| Forçar última versão quando há bug conhecido | Manter versão estável e acompanhar releases |
| Atualizar apenas pelo número da versão | Verificar arquivos, compilação e testes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre atualização seletiva e estratégia incremental
- [code-examples.md](references/code-examples.md) — Comandos e fluxos de verificação expandidos