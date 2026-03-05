---
name: rs-node-js-2023-gerando-coverage-de-testes
description: "Applies test coverage configuration and analysis patterns when working with Vitest projects. Use when user asks to 'add test coverage', 'check coverage', 'configure vitest coverage', 'see untested code', or 'generate coverage report'. Ensures correct script setup, await on async expects, and coverage interpretation. Make sure to use this skill whenever setting up or analyzing test coverage in Vitest/Node.js projects. Not for Jest, Mocha, or non-Vitest test runners."
---

# Gerando Coverage de Testes

> Configure e interprete coverage de testes com Vitest para identificar codigo nao testado na aplicacao.

## Prerequisites

- Vitest configurado no projeto
- Testes existentes escritos e passando
- Se `@vitest/coverage-c8` nao estiver instalado, Vitest sugere instalacao automatica

## Steps

### Step 1: Criar script de coverage

Adicionar ao `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

Usar `run` para executar uma vez sem modo watch.

### Step 2: Garantir await em expects asincronos

Antes de rodar coverage, verificar que todo `expect` com promise usa `await`:

```typescript
// ERRADO — promise nao aguardada, coverage mostra falso positivo
expect(promise).rejects.toBeInstanceOf(Error)

// CORRETO — await garante que o teste realmente executa o codigo
await expect(promise).rejects.toBeInstanceOf(Error)
```

Sem `await`, Vitest pode nao aguardar a promise e o coverage fica incorreto.

### Step 3: Adicionar coverage ao .gitignore

```gitignore
coverage/
```

A pasta `coverage/` contem HTML gerado — nao deve subir ao repositorio.

### Step 4: Interpretar o relatorio

Executar `npm run test:coverage` gera `coverage/index.html`. Abrir no navegador.

O relatorio mostra:
- Percentual de cobertura por arquivo
- Numeros ao lado de cada linha indicam quantas vezes um teste passou por ela
- Linhas em vermelho = codigo nao coberto por nenhum teste

## Heuristics

| Situacao | Acao |
|----------|------|
| Coverage mostra linha vermelha em `if` de erro | Criar teste que force esse caminho de erro |
| Coverage 100% no arquivo | Bom indicador, mas nao garantia de qualidade dos testes |
| Linha mostra `4x` | 4 testes diferentes executaram essa linha |
| Quer testar apenas um teste especifico | Usar `it.only()` temporariamente |
| Quer pular um teste temporariamente | Usar `it.skip()` — coverage revelara o impacto |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Buscar 100% de coverage obsessivamente | Usar coverage para encontrar esquecimentos obvios |
| Esquecer `await` em `expect` com promises | Sempre `await expect(asyncFn())` em rejects/resolves |
| Usar `vitest --coverage` (fica em watch) | Usar `vitest run --coverage` (executa uma vez) |
| Commitar pasta `coverage/` | Adicionar `coverage/` ao `.gitignore` |
| Ignorar linhas vermelhas em use cases | Use cases sao prioridade — cobrir caminhos de erro |

## Verification

- Rodar `npm run test:coverage` sem erros
- Abrir `coverage/index.html` e verificar arquivos de use cases
- Confirmar que caminhos criticos (error handling) estao cobertos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-gerando-coverage-de-testes/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-gerando-coverage-de-testes/references/code-examples.md)
