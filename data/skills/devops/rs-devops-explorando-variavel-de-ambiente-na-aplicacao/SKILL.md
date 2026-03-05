---
name: rs-devops-explorando-variavel-de-ambiente
description: "Enforces environment variable best practices when configuring Node.js/NestJS applications for Kubernetes deployment. Use when user asks to 'add env vars', 'configure environment', 'setup .env', 'prepare app for kubernetes', or 'configure configmap'. Applies rules: never commit .env to git, use @nestjs/config for loading, separate config per environment, never hardcode secrets in code. Make sure to use this skill whenever setting up application configuration for containerized or Kubernetes environments. Not for Kubernetes manifest writing, ConfigMap/Secret YAML creation, or CI/CD pipeline configuration."
---

# Variaveis de Ambiente na Aplicacao

> Variaveis de ambiente separam configuracao do codigo — nunca hardcode valores que mudam entre ambientes.

## Rules

1. **Nunca commite o .env** — adicione ao `.gitignore`, porque valores sensiveis (tokens, URLs de banco, API keys) expostos no git sao furos de seguranca irreversiveis
2. **Crie um .env.example** — esqueleto com as chaves sem valores, porque novos devs precisam saber quais variaveis configurar
3. **Nunca hardcode valores de ambiente no codigo** — use `process.env.VARIAVEL`, porque voce tera pelo menos staging e producao com valores diferentes
4. **Carregue o .env no bootstrap** — no NestJS use `ConfigModule.forRoot()` nos imports do AppModule, porque sem isso `process.env` retorna `undefined` para variaveis do .env
5. **O .env nao existe na imagem Docker** — ele nao vai para o `docker build`, porque a configuracao sera injetada em runtime via ConfigMap/Secret do Kubernetes
6. **Minimo dois ambientes** — staging/homologacao e producao, porque homologar no mesmo ambiente do cliente causa incidentes (twelve-factor app)

## How to write

### Arquivo .env (raiz do projeto)

```bash
# .env — NUNCA commitar, sempre no .gitignore
APP=SkillzApp
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
API_TOKEN=seu-token-aqui
```

### .env.example (commitado no git)

```bash
# .env.example — esqueleto sem valores sensiveis
APP=
DATABASE_URL=
API_TOKEN=
```

### Carregar no NestJS

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

### Acessar variaveis no codigo

```typescript
// Acesso direto via process.env
const appName = process.env.APP;

// Ou via ConfigService do NestJS (preferivel — tipado e testavel)
constructor(private configService: ConfigService) {}
getAppName(): string {
  return this.configService.get<string>('APP');
}
```

## Example

**Before (variavel nao carrega — undefined):**

```typescript
// app.module.ts — SEM ConfigModule
@Module({ imports: [] })
export class AppModule {}

// app.service.ts
console.log(process.env.APP); // undefined
```

**After (variavel carregada corretamente):**

```typescript
// app.module.ts — COM ConfigModule
@Module({ imports: [ConfigModule.forRoot()] })
export class AppModule {}

// app.service.ts
console.log(process.env.APP); // "SkillzApp"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto NestJS | Instale `@nestjs/config` e adicione `ConfigModule.forRoot()` imediatamente |
| Valor muda entre ambientes | Variavel de ambiente, nunca constante no codigo |
| Token, senha, API key | Variavel de ambiente + nunca no git |
| Preparando para Kubernetes | Aceite que .env nao existira na imagem — config vem do ConfigMap/Secret |
| Arquivo .env nao esta funcionando | Verifique se `ConfigModule.forRoot()` esta nos imports do AppModule |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `const dbUrl = "postgresql://..."` hardcoded | `const dbUrl = process.env.DATABASE_URL` |
| Commitar `.env` no repositorio | Adicionar `.env` ao `.gitignore` + criar `.env.example` |
| Um unico .env com valores de prod e staging | Um .env por ambiente, injetado em runtime |
| Acessar `process.env` sem carregar ConfigModule | Adicionar `ConfigModule.forRoot()` no AppModule |
| Colocar .env dentro do Dockerfile/imagem | Injetar via ConfigMap/Secret do Kubernetes em runtime |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
