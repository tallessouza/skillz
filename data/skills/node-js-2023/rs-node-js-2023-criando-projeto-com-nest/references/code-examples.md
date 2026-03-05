# Code Examples: Criando Projeto com NestJS

## Instalacao da CLI global

```bash
# Instalar CLI do NestJS globalmente
npm i -g @nestjs/cli

# Verificar comandos disponiveis
nest -h
# Mostra: new, generate, build, start, info, etc.
```

## Criando o projeto

```bash
# Criar novo projeto
nest new 05-nest-clean

# Quando perguntado pelo package manager, escolher pnpm
# ? Which package manager would you ❤️  to use?
#   npm
#   yarn
# ❯ pnpm
```

## Estrutura gerada pelo scaffolding

```
05-nest-clean/
├── node_modules/
├── src/
│   ├── app.controller.spec.ts   # REMOVER
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts          # REMOVER
│   └── jest-e2e.json            # REMOVER
├── .eslintrc.js                  # REMOVER
├── .prettierrc                   # REMOVER
├── README.md                     # REMOVER
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── tsconfig.build.json
└── tsconfig.json
```

## Limpeza do package.json

### Antes (gerado pelo scaffolding):
```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### Depois (limpo):
```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "source-map-support": "^0.5.21",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  }
}
```

## Trocando a porta padrao

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3353); // Porta dedicada para backend — evita conflito com React/Next na 3000
}
bootstrap();
```

## Verificacao

```bash
# Reinstalar dependencias apos limpeza
pnpm install

# Iniciar em modo desenvolvimento (hot reload)
pnpm run start:dev
# Output esperado:
# [Nest] LOG [NestApplication] Nest application successfully started

# Testar rota padrao
curl http://localhost:3353
# Output: Hello World
```

## Alternativa sem CLI global

```bash
# Se nao quiser instalar CLI globalmente:
git clone https://github.com/nestjs/typescript-starter.git nome-projeto
cd nome-projeto
pnpm install
```