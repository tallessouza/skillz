---
name: rs-node-js-2023-modulos-servicos-controllers
description: "Enforces NestJS module-service-controller architecture when scaffolding or reviewing Nest applications. Use when user asks to 'create a NestJS app', 'add a route', 'create a controller', 'add a service', 'setup dependency injection in Nest', or 'organize NestJS modules'. Applies correct decorator usage, provider registration, and DI patterns. Make sure to use this skill whenever generating NestJS code involving controllers, services, or modules. Not for Express.js, Fastify standalone, or non-Nest Node.js frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-fundamentals
  tags: [nestjs, module, controller, service, injectable, dependency-injection, decorators]
---

# Módulos, Serviços e Controllers no NestJS

> Todo código NestJS se organiza em três tipos de arquivo: Controllers recebem HTTP, Providers fazem o resto, e Modules juntam tudo.

## Rules

1. **Controllers só expõem HTTP** — use `@Controller()` apenas em classes que recebem requisições HTTP, porque misturar lógica de negócio no controller viola separação de responsabilidades
2. **Todo o resto é Provider** — repositórios, casos de uso, serviços de email, qualquer classe que não recebe HTTP é um provider com `@Injectable()`, porque o NestJS só conhece duas categorias
3. **Nunca instancie dependências manualmente** — receba via construtor com `private`, porque o NestJS faz injeção de dependência automaticamente quando o provider está registrado no module
4. **Registre providers no module** — toda classe `@Injectable()` usada por um controller deve estar em `providers[]` do módulo, porque sem isso o container de DI não encontra a dependência
5. **Use o decorator do método HTTP correto** — `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()` definem qual verbo HTTP aciona o método, porque o nome do método é irrelevante para o roteamento
6. **Parâmetro no `@Controller()` é prefixo** — `@Controller('/api')` prefixa todas as rotas daquele controller, porque evita repetição em cada decorator de rota

## How to write

### Controller básico

```typescript
import { Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('/api')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/hello')
  index() {
    return this.appService.getHello()
  }

  @Post('/hello')
  create() {
    return this.appService.createHello()
  }
}
```

### Provider (Service/Repository/UseCase)

```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
```

### Module registrando controller e provider

```typescript
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Example

**Before (instanciação manual, sem decorators corretos):**

```typescript
export class UserController {
  private userService = new UserService() // instanciação manual

  getUsers() { // sem decorator de rota
    return this.userService.findAll()
  }
}
```

**After (com DI e decorators corretos):**

```typescript
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findAll()
  }
}

// No module:
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Classe recebe requisição HTTP | `@Controller()` + decorators de rota |
| Classe faz qualquer outra coisa | `@Injectable()` e registre em `providers[]` |
| Controller precisa de dependência | Receba no `constructor(private dep: Dep)` |
| Várias rotas compartilham prefixo | Passe o prefixo em `@Controller('/prefix')` |
| Aplicação crescendo com muitas rotas | Separe em múltiplos modules e use `imports[]` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `new AppService()` dentro do controller | `constructor(private appService: AppService)` |
| Lógica de negócio no controller | Mova para um provider `@Injectable()` |
| Provider sem `@Injectable()` | Adicione o decorator para habilitar DI |
| Provider fora do `providers[]` do module | Registre no array `providers` do `@Module()` |
| Nome do método como definidor de rota | Use `@Get('/path')`, `@Post('/path')` etc. |

## Troubleshooting

### Erro de dependencia nao encontrada ao injetar service no controller
**Symptom:** NestJS lanca erro dizendo que nao consegue resolver dependencia do controller
**Cause:** O service/provider nao foi registrado no array `providers[]` do `@Module()`
**Fix:** Adicione a classe `@Injectable()` no array `providers` do modulo correspondente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
