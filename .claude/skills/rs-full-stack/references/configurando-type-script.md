---
name: rs-full-stack-configurando-type-script
description: "Generates tsconfig.json configuration for Node.js TypeScript projects. Use when user asks to 'setup typescript', 'configure tsconfig', 'create tsconfig.json', 'init typescript project', or 'add typescript to node project'. Applies ES2022 target, Node16 modules, strict mode, and skipLibCheck. Make sure to use this skill whenever setting up a new TypeScript backend project. Not for frontend/React tsconfig, Deno, or Bun configurations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript-setup
  tags: [typescript, tsconfig, es2022, node16, strict-mode, skipLibCheck]
---

# Configurando TypeScript (tsconfig.json)

> Gerar um tsconfig.json otimizado para projetos Node.js com ES modules e strict mode.

## Prerequisites

- Node.js 18+ instalado
- TypeScript instalado como dependencia (`npm i -D typescript`)
- Se TypeScript nao estiver instalado: `npm install -D typescript` antes de prosseguir

## Steps

### Step 1: Criar tsconfig.json na raiz do projeto

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "module": "node16",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Step 2: Verificar que a aplicacao continua funcionando

Parar e reiniciar a aplicacao para confirmar que o tsconfig nao quebrou nada.

## Output format

Arquivo `tsconfig.json` na raiz do projeto com as compilerOptions acima.

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto Node.js backend com ES modules | Usar esta config como base |
| Precisa de paths/aliases | Adicionar `paths` e `baseUrl` ao compilerOptions |
| Projeto com testes (Vitest/Jest) | Pode precisar de tsconfig separado para testes |
| Monorepo | Usar `references` e tsconfig por package |

## Opcoes explicadas

| Opcao | Valor | Porque |
|-------|-------|--------|
| `target` | `es2022` | Suporta top-level await, private fields, e features modernas do Node 18+ |
| `lib` | `es2023` | Disponibiliza tipos de APIs JS recentes (Array.findLast, etc) |
| `module` | `node16` | Resolucao de modulos compativel com Node.js ESM e CJS |
| `moduleResolution` | `node16` | Obrigatorio quando module e node16, porque resolve .js extensions corretamente |
| `esModuleInterop` | `true` | Permite import de modulos CJS com sintaxe default import |
| `strict` | `true` | Ativa todas as verificacoes strict (strictNullChecks, noImplicitAny, etc) |
| `skipLibCheck` | `true` | Pula checagem de tipos em .d.ts de node_modules, porque acelera compilacao significativamente |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `"target": "es5"` em projeto Node moderno | `"target": "es2022"` porque Node 18+ suporta nativamente |
| `"module": "commonjs"` com ESM | `"module": "node16"` para suporte ESM correto |
| `"strict": false` | `"strict": true` porque pega bugs em tempo de compilacao |
| Omitir `skipLibCheck` | `"skipLibCheck": true` porque types de terceiros podem ter conflitos |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| TypeScript nao instalado | Dependencia ausente | `npm install -D typescript` |
| Aplicacao quebra apos adicionar tsconfig | Configuracao incompativel com codigo existente | Verificar se `target` e `module` estao alinhados com o runtime |
| Erros de tipo em bibliotecas de terceiros | `skipLibCheck` desabilitado | Adicionar `"skipLibCheck": true` |
| Import de modulos CJS falha com sintaxe default | `esModuleInterop` desabilitado | Adicionar `"esModuleInterop": true` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada opcao do tsconfig
- [code-examples.md](references/code-examples.md) — Variacoes de tsconfig para diferentes cenarios