---
name: rs-node-js-2023-criando-primeiro-teste
description: "Enforces Vitest setup and first test structure when writing automated tests for Node.js/TypeScript applications. Use when user asks to 'create a test', 'setup testing', 'add vitest', 'write my first test', or 'configure test runner'. Applies rules: use Vitest over Jest for TypeScript projects, structure tests with enunciado-operacao-validacao pattern, use .spec.ts convention, add test script to package.json. Make sure to use this skill whenever setting up a test environment or writing initial tests in a Node.js TypeScript project. Not for React component testing, E2E testing with Playwright/Cypress, or test architecture decisions on large projects."
---

# Criando Primeiro Teste com Vitest

> Todo teste segue tres etapas: enunciado (o que testa), operacao (a acao), e validacao (o expect que confirma o resultado).

## Rules

1. **Use Vitest em vez de Jest para projetos TypeScript** — porque Vitest usa ESBuild por baixo dos panos, suporta TypeScript automaticamente sem configuracao extra (Jest exige Babel/ts-jest, que sao lentos)
2. **Estruture cada teste em 3 partes: enunciado, operacao, validacao** — porque testes sem validacao (expect) passam silenciosamente sem testar nada
3. **Use extensao `.spec.ts` ou `.test.ts` consistentemente** — `.spec.ts` e a preferencia do instrutor, mas o importante e manter um padrao no projeto
4. **Crie pasta `test/` na raiz para testes** — porque organiza testes separados do codigo de producao
5. **Adicione script `test` no package.json** — `"test": "vitest"` para evitar digitar `npx vitest` toda vez
6. **Sempre tenha pelo menos um `expect` por teste** — porque um teste sem expect sempre passa, dando falsa seguranca

## How to write

### Setup inicial

```bash
# Instalar Vitest como dependencia de desenvolvimento
npm install vitest -D
```

```json
// package.json — adicionar script de test
{
  "scripts": {
    "test": "vitest"
  }
}
```

### Estrutura do primeiro teste

```typescript
// test/example.spec.ts
import { test, expect } from 'vitest'

test('usuario consegue criar uma nova transacao', async () => {
  // Operacao — a acao que esta sendo testada
  const responseStatusCode = 201

  // Validacao — o que esperamos que aconteca
  expect(responseStatusCode).toEqual(201)
})
```

## Example

**Before (teste sem estrutura clara):**
```typescript
import { test } from 'vitest'

test('transacao', () => {
  // nada aqui — teste passa sem validar nada
})
```

**After (com as 3 etapas):**
```typescript
import { test, expect } from 'vitest'

test('usuario consegue criar uma nova transacao', async () => {
  // 1. Enunciado: descrito no nome do test acima
  // 2. Operacao: chamada HTTP (sera implementada na proxima etapa)
  const response = await createTransaction({ title: 'Salario', amount: 5000 })

  // 3. Validacao: verificar o resultado
  expect(response.statusCode).toEqual(201)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Node.js com TypeScript | Use Vitest (suporte nativo a TS) |
| Projeto ja usa Jest e funciona | Nao migre sem razao — sintaxe e identica |
| Precisa rodar testes em watch mode | `npx vitest` ja roda em watch por padrao |
| Quer rodar todos os testes uma vez | `npx vitest run` ou pressione `a` no modo watch |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Teste sem nenhum `expect` | Sempre inclua pelo menos um `expect` |
| `npx vitest` direto no terminal toda vez | Adicione `"test": "vitest"` no package.json |
| Instalar Babel/ts-jest para TypeScript | Use Vitest que suporta TS nativamente |
| Misturar `.spec.ts` e `.test.ts` no mesmo projeto | Escolha um padrao e mantenha |
| Teste com nome generico como `'test 1'` | Descreva o comportamento: `'usuario consegue criar transacao'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
