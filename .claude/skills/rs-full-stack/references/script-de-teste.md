---
name: rs-full-stack-script-de-teste
description: "Applies Jest test execution patterns when configuring or running tests in JavaScript/TypeScript projects. Use when user asks to 'run tests', 'configure jest', 'add test script', 'setup testing', or 'run specific test file'. Covers running specific test files, running all tests, and creating npm test scripts in package.json. Make sure to use this skill whenever setting up or executing Jest test workflows. Not for writing test assertions, mocking, or test architecture decisions."
---

# Script de Teste com Jest

> Configure e execute testes Jest de forma eficiente, desde arquivos individuais ate suites completas via npm scripts.

## Rules

1. **Use `npx jest <path>` para testar arquivo especifico** — `npx jest src/sum.test.ts`, porque permite validar rapidamente um unico arquivo sem rodar toda a suite
2. **Use `npx jest` sem argumentos para rodar todos os testes** — Jest encontra automaticamente todos os arquivos `*.test.ts`, porque elimina a necessidade de listar arquivos manualmente
3. **Crie um script `test` no package.json** — use apenas `jest` (sem `npx`) no script, porque o pacote ja esta instalado localmente e npm resolve o binario
4. **Prefira `npm test` ao inves de `npx jest`** — `npm test` e o atalho padrao do npm (equivalente a `npm run test`), porque e mais curto e segue a convencao universal de projetos Node

## Steps

### Step 1: Testar arquivo especifico

```bash
npx jest src/sum.test.ts
```

Util durante desenvolvimento ativo de um teste individual.

### Step 2: Testar todos os arquivos de uma vez

```bash
npx jest
```

Jest busca automaticamente todos os arquivos que seguem o padrao `*.test.ts` / `*.test.js`.

### Step 3: Criar script no package.json

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

No script, use `jest` diretamente (sem `npx`), porque o pacote esta instalado como dependencia local.

### Step 4: Executar via npm

```bash
npm test
# ou equivalente:
npm run test
```

`npm test` e um alias especial do npm — nao precisa de `run`.

## Output format

Jest exibe:
- Nome do arquivo de teste executado
- Titulo de cada teste (`describe`/`it`)
- Status PASS ou FAIL
- Quantidade de arquivos de teste encontrados

## Error handling

- Se `npx jest` nao encontra testes: verificar se os arquivos seguem o padrao `*.test.ts` ou configurar `testMatch` no `jest.config`
- Se `npm test` falha com "missing script": adicionar `"test": "jest"` em `scripts` no `package.json`
- Se Jest nao e reconhecido no script: verificar se `jest` e `ts-jest` estao em `devDependencies`

## Heuristics

| Situacao | Faca |
|----------|------|
| Desenvolvendo um teste novo | `npx jest src/arquivo.test.ts` |
| Validando antes de commit | `npm test` (roda tudo) |
| Projeto sem script de teste | Adicionar `"test": "jest"` no package.json |
| CI/CD pipeline | Usar `npm test` no step de testes |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Testar arquivos um por um manualmente | `npx jest` sem argumentos |
| Usar `npx jest` repetidamente no terminal | Criar script `"test": "jest"` |
| Usar `npx jest` dentro do script do package.json | Usar apenas `jest` (ja instalado local) |
| Esquecer de rodar todos os testes antes de finalizar | `npm test` como passo final |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre execucao de testes e convencoes npm
- [code-examples.md](references/code-examples.md) — Todos os exemplos de configuracao e execucao expandidos

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-script-de-teste/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-script-de-teste/references/code-examples.md)
