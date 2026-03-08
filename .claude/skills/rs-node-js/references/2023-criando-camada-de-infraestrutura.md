---
name: 2023-criando-camada-de-infraestrutura
description: "Applies infrastructure layer separation pattern in NestJS clean architecture projects. Use when user asks to 'create infrastructure layer', 'organize nestjs modules', 'separate concerns', 'move controllers to infra', or 'restructure nestjs project'. Enforces src/infra/ subdirectory structure, module-per-concern, entryFile update, and proper provider declarations. Make sure to use this skill whenever restructuring NestJS projects for clean architecture. Not for domain logic, use case implementation, or frontend structure."
category: workflow
tags: [nestjs, infrastructure-layer, clean-architecture, modules, separation-of-concerns]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: infrastructure
  tags: [nestjs, infrastructure-layer, clean-architecture, modules, separation-of-concerns]
---

# Criando Camada de Infraestrutura no NestJS

> Separe tudo que e especifico de framework, banco de dados ou camada externa dentro de `src/infra/`, subdividido por concern.

## Rules

1. **Mova tudo framework-specific para `src/infra/`** — app.module, main.ts, prisma/, controllers/, pipes/, auth/
2. **Subdivida infra/ por concern** — `infra/http/` para controllers e pipes, `infra/database/` para Prisma
3. **Crie um module por sub-pasta** — `HttpModule`, `DatabaseModule`
4. **Services nao-globais devem ser declarados em cada module** — se PrismaService nao e `@Global()`, passe-o em `providers`
5. **Atualize o entryFile no nest-cli.json** — aponte para `infra/main`
6. **Organizacao de pastas nao define Clean Architecture** — a separacao de concerns e o que importa

## Steps

### Step 1: Criar pasta infra e mover arquivos

```
src/
├── infra/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/
│   ├── database/prisma/
│   └── http/controllers/ + pipes/
└── domain/
```

### Step 2: Criar HttpModule

```typescript
@Module({
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class HttpModule {}
```

### Step 3: Simplificar AppModule

```typescript
@Module({
  imports: [ConfigModule.forRoot({ validate: (env) => envSchema.parse(env), isGlobal: true }), AuthModule, HttpModule],
})
export class AppModule {}
```

### Step 4: Atualizar nest-cli.json

```json
{ "entryFile": "infra/main" }
```

## Verification

- `pnpm run start:dev` inicia sem erros
- Testes e2e passam
- Nenhum import aponta para caminhos antigos

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Tudo em um unico AppModule com 20 controllers | Um module por concern |
| PrismaService usado sem declarar no module | Declare em providers de cada module |
| Mover arquivos sem atualizar nest-cli.json | Sempre atualize entryFile |

## Troubleshooting

### Controller nao encontra PrismaService apos reestruturacao
**Symptom:** NestJS lanca erro de resolucao de dependencia
**Cause:** PrismaService nao declarado nos providers do module do controller
**Fix:** Adicione PrismaService em `providers` do HttpModule ou torne-o `@Global()`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-camada-de-infraestrutura/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-camada-de-infraestrutura/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
