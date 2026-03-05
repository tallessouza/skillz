# Code Examples: Script de Teste com Jest

## Estrutura de arquivos do exemplo

```
projeto/
├── src/
│   ├── sum.test.ts
│   └── subtraction.test.ts
├── package.json
└── jest.config.ts
```

## Arquivo sum.test.ts (da aula)

```typescript
describe('teste sum', () => {
  it('teste sum ok', () => {
    // logica do teste de soma
  })
})
```

## Arquivo subtraction.test.ts (da aula)

```typescript
describe('teste subtraction', () => {
  it('teste subtraction ok', () => {
    // logica do teste de subtracao
  })
})
```

## Comandos de execucao demonstrados

### Testar arquivo especifico

```bash
# Testar apenas o arquivo de soma
npx jest src/sum.test.ts

# Testar apenas o arquivo de subtracao
npx jest src/subtraction.test.ts
```

### Testar todos os arquivos

```bash
# Jest encontra automaticamente todos os *.test.ts
npx jest
```

Saida esperada:
```
PASS  src/subtraction.test.ts
  teste subtraction
    ✓ teste subtraction ok

PASS  src/sum.test.ts
  teste sum
    ✓ teste sum ok

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
```

## Configuracao do package.json

### Antes (sem script de teste)

```json
{
  "name": "meu-projeto",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

### Depois (com script de teste)

```json
{
  "name": "meu-projeto",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

### Executando via npm

```bash
# Ambos sao equivalentes:
npm test
npm run test
```

## Variacoes uteis do script de teste

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

## Testando com filtro por nome

```bash
# Rodar apenas testes cujo nome do arquivo contem "sum"
npx jest sum

# Rodar apenas testes cujo nome do arquivo contem "subtraction"
npx jest subtraction
```

Jest faz match parcial no nome do arquivo, entao nao precisa do path completo.