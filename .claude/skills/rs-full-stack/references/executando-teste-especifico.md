---
name: rs-full-stack-executando-teste-especifico
description: "Guides execution of specific Jest test files in TypeScript projects. Use when user asks to 'run a test', 'execute specific test', 'create test file', 'setup Jest with TypeScript', or 'run jest on a file'. Covers test file naming conventions (.test/.spec), ts-node dependency, and npx jest execution. Make sure to use this skill whenever setting up or running individual Jest tests in TypeScript. Not for test assertion logic, mocking, or CI/CD pipeline configuration."
---

# Executando Teste Específico com Jest

> Para executar testes Jest em TypeScript, nomeie arquivos com `.test.ts` ou `.spec.ts`, instale `ts-node`, e execute com `npx jest <caminho>`.

## Rules

1. **Nomeie arquivos de teste com `.test.ts` ou `.spec.ts`** — `sum.test.ts` nao `sum-test.ts`, porque o Jest usa esse padrao para identificar automaticamente arquivos de teste
2. **Instale `ts-node` como dependencia de desenvolvimento** — sem ele, Jest nao consegue executar arquivos TypeScript no ambiente Node
3. **Execute testes especificos passando o caminho do arquivo** — `npx jest src/sum.test.ts`, porque evita rodar toda a suite quando voce quer testar apenas um arquivo
4. **Testes rodam sem a aplicacao em execucao** — nao precisa ter o servidor rodando para executar testes automatizados, porque testes sao independentes do runtime da aplicacao
5. **Um teste sem criterio de falha passa por padrao** — Jest considera teste como PASS quando nenhuma assertion falha, entao sempre adicione assertions reais

## How to write

### Estrutura basica de um arquivo de teste

```typescript
// sum.test.ts
test('example', () => {
  console.log('teste ok!')
})
```

### Convencao de nomenclatura

```
{nome-do-modulo}.test.ts   // Padrao test
{nome-do-modulo}.spec.ts   // Padrao spec — escolha um e mantenha consistencia
```

### Instalacao do ts-node

```bash
npm i ts-node@10.9.2 -D
```

### Execucao de teste especifico

```bash
npx jest src/sum.test.ts
```

## Example

**Before (erro comum — ts-node nao instalado):**

```bash
npx jest src/sum.test.ts
# Error: ts-node is required for TypeScript configuration
```

**After (com ts-node instalado):**

```bash
npm i ts-node -D
npx jest src/sum.test.ts
# PASS  src/sum.test.ts
#   ✓ example (1ms)
# Tests: 1 passed, 1 total
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer testar um unico arquivo | `npx jest src/arquivo.test.ts` |
| Jest nao reconhece TypeScript | Instale `ts-node` como devDependency |
| Teste passa mas nao deveria | Adicione assertions — teste vazio sempre passa |
| Quer padronizar execucao | Adicione script no `package.json` (proxima etapa) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `sum-test.ts` (sem convencao Jest) | `sum.test.ts` ou `sum.spec.ts` |
| Rodar `npx jest` sem caminho quando quer testar um arquivo | `npx jest src/sum.test.ts` |
| Subir a aplicacao para rodar testes | Execute testes diretamente — sao independentes |
| Instalar `ts-node` como dependencia de producao | `npm i ts-node -D` (devDependency) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre convencoes de teste e ts-node
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-executando-teste-especifico/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-executando-teste-especifico/references/code-examples.md)
