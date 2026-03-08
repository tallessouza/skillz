# Code Examples: Configurando Suite de Testes com Jest e TypeScript

## Instalação do ts-node

```bash
# Instalar versão específica como dependência de desenvolvimento
npm i ts-node@10.9.2 -D
```

Após instalação, verificar no `package.json`:
```json
{
  "devDependencies": {
    "ts-node": "^10.9.2"
  }
}
```

## Estrutura de diretórios

```
src/
└── tests/
    └── users-controller.test.ts
```

## Arquivo de teste inicial (validação de infraestrutura)

```typescript
// src/tests/users-controller.test.ts
describe("Users controller", () => {
  it("teste", () => {
    console.log("passou por aqui")
  })
})
```

Este teste mínimo serve para validar que toda a cadeia funciona: Jest encontra o arquivo → ts-node transpila → teste executa → output aparece no terminal.

## Script no package.json

### Versão incorreta (causa problemas):

```json
{
  "scripts": {
    "test:dev": "node --experimental-vm-modules npx jest --watch --runInBand"
  }
}
```

`--watch` falha se arquivos não estão rastreados pelo git.

### Versão correta:

```json
{
  "scripts": {
    "test:dev": "node --experimental-vm-modules npx jest --watchAll --runInBand"
  }
}
```

`--watchAll` observa todos os arquivos independente do git.

## Execução

```bash
# Executar os testes em modo watch
npm run test:dev
```

### Output esperado (sucesso):

```
PASS  src/tests/users-controller.test.ts
  Users controller
    ✓ teste (X ms)

  console.log
    passou por aqui

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

### Output de erro (describe vazio):

```
FAIL  src/tests/users-controller.test.ts
  ● Test suite failed to run
    Your test suite must contain at least one test.
```

Solução: adicionar pelo menos um `it()` dentro do `describe`.

### Output de erro (ts-node ausente):

```
Error: Cannot find module 'ts-node'
```

Solução: `npm i ts-node@10.9.2 -D`

## Variações de configuração de script

### Apenas execução única (sem watch):

```json
{
  "scripts": {
    "test": "node --experimental-vm-modules npx jest --runInBand"
  }
}
```

### Com cobertura de código:

```json
{
  "scripts": {
    "test:dev": "node --experimental-vm-modules npx jest --watchAll --runInBand",
    "test:coverage": "node --experimental-vm-modules npx jest --runInBand --coverage"
  }
}
```

### Filtrando por arquivo específico:

```bash
# Executar apenas testes do users-controller
npm run test:dev -- --testPathPattern=users-controller
```

## Exemplo expandido: suite com múltiplos testes

```typescript
// src/tests/users-controller.test.ts
describe("Users controller", () => {
  describe("POST /users", () => {
    it("should create a new user", () => {
      // teste de criação
    })

    it("should return 400 for invalid data", () => {
      // teste de validação
    })
  })

  describe("GET /users", () => {
    it("should list all users", () => {
      // teste de listagem
    })
  })
})
```

## Controles do modo watch

Quando o Jest está em modo watch, o terminal mostra:

```
Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

- `a` — executa todos os testes
- `f` — executa apenas os que falharam
- `p` — filtra por nome de arquivo
- `Ctrl+C` — interrompe a execução