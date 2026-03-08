---
name: 2023-criando-primeiro-teste-1
description: "Creates the first unit test with Vitest following the three-part structure: description, operation, and validation (expect). Use when user asks to 'write first test', 'setup Vitest', 'create unit test', 'configure testing in TypeScript', or 'structure test files'. Enforces: Vitest over Jest for TypeScript projects, three-part test structure, at least one expect per test, consistent file extension (.spec.ts), test script in package.json. Make sure to use this skill whenever setting up testing infrastructure or writing initial tests in a Node.js TypeScript project. Not for E2E tests, integration tests with databases, or browser testing."
category: coding-lens
tags: [testing, typescript, vitest]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: testing
  tags: [vitest, testing, typescript, unit-tests, test-structure]
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

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
