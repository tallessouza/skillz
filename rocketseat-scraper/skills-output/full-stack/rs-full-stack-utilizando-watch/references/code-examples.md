# Code Examples: Jest Watch Mode

## Configuracao basica do package.json

### Antes (so execucao manual)
```json
{
  "name": "meu-projeto",
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

### Depois (com watch mode separado)
```json
{
  "name": "meu-projeto",
  "scripts": {
    "test": "jest",
    "test:dev": "jest --watchAll"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

## Comandos de execucao

### Execucao unica (CI, pre-commit)
```bash
npm test
# ou equivalente:
npm run test
```

Output:
```
PASS  ./sum.test.js
  ✓ should sum 5 + 5 and return 10 (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```
O processo termina apos a execucao.

### Watch mode (desenvolvimento)
```bash
npm run test:dev
```

Output:
```
PASS  ./sum.test.js
  ✓ should sum 5 + 5 and return 10 (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total

Watch Usage
 › Press f to run only failed tests.
 › Press o to only run tests related to changed files.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```
O processo fica ativo, aguardando mudancas nos arquivos.

## Variacao: com --watch (requer git)

Se o projeto ja esta em um repositorio git:
```json
{
  "scripts": {
    "test": "jest",
    "test:dev": "jest --watch"
  }
}
```
`--watch` e mais eficiente porque so re-executa testes afetados por arquivos modificados no git. Porem, se o projeto nao tem git inicializado, o Jest exibe erro e sugere usar `--watchAll`.

## Variacao: com coverage na execucao unica

```json
{
  "scripts": {
    "test": "jest",
    "test:dev": "jest --watchAll",
    "test:coverage": "jest --coverage"
  }
}
```

## Fluxo completo demonstrado

### Arquivo de teste (sum.test.js)
```javascript
const sum = require('./sum')

test('should sum 5 + 5 and return 10', () => {
  const result = sum(5, 5)
  expect(result).toBe(10)  // passa
})
```

### Simulando falha (muda o expect)
```javascript
expect(result).toBe(12)  // falha — 10 !== 12
```
Ao salvar, watch mode re-executa automaticamente e mostra o erro.

### Corrigindo de volta
```javascript
expect(result).toBe(10)  // passa novamente
```
Ao salvar, watch mode re-executa e confirma que os testes passam.