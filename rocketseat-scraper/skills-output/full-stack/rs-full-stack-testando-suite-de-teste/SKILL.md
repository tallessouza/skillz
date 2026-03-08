---
name: rs-full-stack-testando-suite-de-teste
description: "Enforces Jest test suite setup and configuration when creating test files in TypeScript Node.js projects. Use when user asks to 'configure jest', 'create test file', 'setup testing', 'run tests with watch', or 'add test script to package.json'. Applies patterns: describe blocks for grouping, ts-node for TypeScript execution, experimental VM modules, watchAll flag, runInBand for sequential execution. Make sure to use this skill whenever setting up a new test environment or creating the first test file in a project. Not for writing test assertions, mocking, or E2E testing with Playwright/Cypress."
---

# Configurando Suite de Testes com Jest e TypeScript

> Configure Jest com TypeScript usando ts-node, scripts no package.json e modo watch para execução automática.

## Prerequisites

- Jest já configurado no projeto (`jest.config.ts` existente)
- Node.js com suporte a experimental VM modules
- `ts-node` instalado como dependência de desenvolvimento

## Steps

### Step 1: Instalar ts-node

```bash
npm i ts-node@10.9.2 -D
```

Instale como dependência de desenvolvimento porque o Jest precisa do ts-node para executar arquivos `.test.ts`.

### Step 2: Criar estrutura de pastas de teste

```
src/
└── tests/
    └── users-controller.test.ts
```

Crie a pasta `tests` dentro de `src`. Nomeie os arquivos seguindo o padrão `{entidade}-controller.test.ts`.

### Step 3: Criar o primeiro arquivo de teste

```typescript
describe("Users controller", () => {
  it("teste", () => {
    console.log("passou por aqui")
  })
})
```

Use `describe` para agrupar testes em suites. Cada `describe` representa um controller ou módulo. Um `describe` sem nenhum `it` dentro causa erro — sempre inclua pelo menos um teste.

### Step 4: Adicionar script de teste no package.json

```json
{
  "scripts": {
    "test:dev": "node --experimental-vm-modules npx jest --watchAll --runInBand"
  }
}
```

| Flag | Propósito |
|------|-----------|
| `--experimental-vm-modules` | Habilita suporte a ES modules nos testes |
| `--watchAll` | Re-executa testes automaticamente ao salvar arquivos |
| `--runInBand` | Executa testes sequencialmente, um aguarda o outro terminar |

### Step 5: Executar os testes

```bash
npm run test:dev
```

O Jest entra em modo watch e re-executa ao detectar mudanças. Para interromper: `Ctrl+C`.

## Error handling

- Se erro `ts-node not found` → instale com `npm i ts-node@10.9.2 -D`
- Se erro `No tests found` → verifique que existe pelo menos um `it()` dentro do `describe`
- Se `--watch` não funciona → troque por `--watchAll` (watch observa apenas arquivos rastreados pelo git, watchAll observa todos)

## Verification

- Terminal mostra `PASS` com o nome do arquivo de teste
- Console.log dentro do teste aparece no output
- Ao salvar qualquer arquivo, os testes re-executam automaticamente

## Heuristics

| Situação | Faça |
|----------|------|
| Primeiro teste do projeto | Crie com `console.log` simples para validar que a infraestrutura funciona |
| Suite sem nenhum `it` | Sempre adicione pelo menos um teste, mesmo que placeholder |
| Flag `--watch` vs `--watchAll` | Use `--watchAll` para observar todos os arquivos, não apenas os rastreados pelo git |
| Nome do script | `test:dev` é convenção, mas pode ser customizado conforme preferência |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `--watch` sem git init | `--watchAll` para observar todos os arquivos |
| `describe` vazio sem `it` | Sempre inclua pelo menos um `it()` dentro do `describe` |
| Esquecer `--runInBand` em testes com banco | Sempre use `--runInBand` para evitar condições de corrida |
| Instalar ts-node como dependência de produção | Instalar com `-D` como dependência de desenvolvimento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada flag e decisão de configuração
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações