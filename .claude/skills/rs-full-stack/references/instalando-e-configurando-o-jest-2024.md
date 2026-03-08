---
name: rs-full-stack-instalando-e-configurando-o-jest-2024
description: "Generates Jest configuration for TypeScript Node.js projects. Use when user asks to 'setup jest', 'configure testing', 'add unit tests to typescript project', 'install jest', or 'create jest.config.ts'. Installs jest, @types/jest, ts-jest as devDependencies, creates jest.config.ts with bail, ts-jest preset, and node environment. Make sure to use this skill whenever initializing a testing setup in a TypeScript Node.js project. Not for React/React Native testing environments, Vitest, or E2E testing with Playwright/Cypress."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: jest-config
  tags: [jest, testing, typescript, ts-jest, configuration]
---

# Instalando e Configurando o Jest

> Configure Jest para testes automatizados em projetos TypeScript Node.js com tres dependencias e um arquivo de configuracao tipado.

## Prerequisites

- Projeto Node.js com TypeScript configurado
- `package.json` existente
- Se nao encontrar `tsconfig.json`: configurar TypeScript primeiro

## Steps

### Step 1: Instalar dependencias de desenvolvimento

```bash
npm i jest@29.7.0 @types/jest@29.5.13 ts-jest@29.2.5 -D
```

Tres pacotes necessarios:
- **jest** — framework de testes
- **@types/jest** — tipagens TypeScript para Jest (autocomplete de `describe`, `it`, `expect`)
- **ts-jest** — preset que permite escrever testes em TypeScript diretamente

### Step 2: Criar jest.config.ts na raiz do projeto

```typescript
import type { Config } from "jest"

const config: Config = {
  bail: true,
  preset: "ts-jest",
  testEnvironment: "node",
}

export default config
```

### Step 3: Adicionar script no package.json

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## Propriedades da configuracao

| Propriedade | Valor | Porque |
|-------------|-------|--------|
| `bail: true` | Para execucao no primeiro teste que falhar | Evita esperar 10 testes rodarem quando o primeiro ja falhou — feedback rapido |
| `preset: "ts-jest"` | Usa ts-jest como preset | Permite escrever testes em TypeScript sem compilacao manual previa |
| `testEnvironment: "node"` | Define ambiente Node.js | Jest suporta multiplos ambientes (jsdom, react-native) — explicitar Node evita comportamento inesperado |

## Output format

Apos configuracao, a estrutura deve conter:

```
project-root/
├── jest.config.ts        # Configuracao tipada do Jest
├── package.json          # Com jest, @types/jest, ts-jest em devDependencies
├── tsconfig.json         # TypeScript config existente
└── src/
    └── **/*.spec.ts      # Arquivos de teste (convencao)
```

## Verification

- Executar `npx jest` — deve rodar sem erros (mesmo sem testes ainda)
- Verificar que `jest`, `@types/jest` e `ts-jest` estao em `devDependencies`
- Confirmar que `jest.config.ts` exporta configuracao tipada com `Config`

## Error handling

- Se `ts-jest` falhar com erro de TypeScript: verificar compatibilidade entre versoes de `ts-jest` e `typescript`
- Se `testEnvironment: 'node'` causar erro: verificar que nao ha conflito com configuracao jsdom de outro preset
- A aplicacao NAO precisa estar rodando para executar testes — Jest roda independente do servidor

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Instalar jest como dependencia normal | Usar flag `-D` porque e dependencia de desenvolvimento |
| Criar `jest.config.js` em projeto TypeScript | Criar `jest.config.ts` para ter autocomplete e tipagem |
| Usar `npx jest --init` sem entender as opcoes | Criar o arquivo manualmente para controlar cada propriedade |
| Omitir `testEnvironment` | Explicitar `"node"` para evitar ambiente errado |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| ts-jest falha com erro de TypeScript | Versoes incompativeis entre ts-jest e typescript | Verificar compatibilidade na documentacao do ts-jest |
| `testEnvironment: 'node'` causa erro | Conflito com configuracao jsdom de outro preset | Remover presets conflitantes ou explicitar o environment |
| Jest nao encontra arquivos `.spec.ts` | Configuracao de testMatch ausente | Verificar que jest.config.ts usa preset ts-jest que ja inclui pattern correto |
| Erro "Cannot use import statement" | ts-jest nao configurado como preset | Adicionar `preset: "ts-jest"` no jest.config.ts |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada propriedade e decisao de versao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes