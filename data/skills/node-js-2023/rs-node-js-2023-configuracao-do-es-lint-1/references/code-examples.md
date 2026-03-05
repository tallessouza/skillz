# Code Examples: Configuracao do ESLint com Skillz Config

## Instalacao completa

```bash
# Dependencias base
npm install eslint @skillz/eslint-config -D

# Se usar Vitest
npm install eslint-plugin-vitest-globals -D
```

## .eslintrc.json completo (com Vitest)

```json
{
  "extends": [
    "@skillz/eslint-config/node",
    "plugin:vitest-globals/recommended"
  ],
  "env": {
    "vitest-globals/env": true
  },
  "rules": {
    "no-useless-constructor": "off"
  }
}
```

## .eslintrc.json minimo (sem Vitest)

```json
{
  "extends": ["@skillz/eslint-config/node"]
}
```

## .eslintrc.json para React

```json
{
  "extends": ["@skillz/eslint-config/react"]
}
```

## Scripts no package.json

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

## Exemplo de classe que dispara no-useless-constructor

```typescript
// ESLint reclama: "Useless constructor"
// Mas e valido em TypeScript — parameter property
export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute(data: CreateQuestionRequest) {
    // ...
  }
}
```

## Execucao

```bash
# Desenvolvimento — corrige automaticamente
npm run lint:fix

# CI/CD — apenas valida
npm run lint
```