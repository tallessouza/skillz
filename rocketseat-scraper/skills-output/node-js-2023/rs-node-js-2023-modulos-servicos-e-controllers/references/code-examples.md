# Code Examples: Módulos, Serviços e Controllers no NestJS

## Exemplo 1: Estrutura inicial do projeto

O NestJS gera três arquivos além do `main.ts`:

### app.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
```

### app.service.ts

```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
```

### app.module.ts

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

## Exemplo 2: Adicionando path ao decorator

```typescript
// Rota raiz: GET http://localhost:3333/
@Get()
getHello() {
  return 'Hello World!'
}

// Rota com path: GET http://localhost:3333/hello
@Get('/hello')
getHello() {
  return 'Hello World!'
}
```

## Exemplo 3: Prefixo no Controller

```typescript
@Controller('/api')
export class AppController {
  @Get('/hello')
  getHello() {
    return 'Hello World!'
    // Acessível em: GET http://localhost:3333/api/hello
  }
}
```

## Exemplo 4: Múltiplos métodos HTTP na mesma rota

```typescript
@Controller('/api')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/hello')
  getHello() {
    return this.appService.getHello()
    // GET http://localhost:3333/api/hello
  }

  @Post('/hello')
  createHello() {
    return 'test'
    // POST http://localhost:3333/api/hello
  }
}
```

O NestJS diferencia pela combinação path + método HTTP. Mesma rota `/hello` pode ter GET e POST apontando para métodos diferentes.

## Exemplo 5: Decorator como função (modelo mental)

```typescript
// Decorator é conceitualmente isso:
function Controller(classe) {
  // Recebe a classe
  // Modifica: registra como handler HTTP
  // Retorna a classe modificada
  return classeModificada
}

// Quando você escreve:
@Controller()
export class AppController {}

// É como se fosse:
export class AppController {}
AppController = Controller(AppController)
```

## Exemplo 6: Todos os decorators de método HTTP disponíveis

```typescript
import { Controller, Get, Post, Put, Delete, Patch } from '@nestjs/common'

@Controller('/resources')
export class ResourceController {
  @Get()
  findAll() { /* ... */ }

  @Get('/:id')
  findOne() { /* ... */ }

  @Post()
  create() { /* ... */ }

  @Put('/:id')
  update() { /* ... */ }

  @Patch('/:id')
  partialUpdate() { /* ... */ }

  @Delete('/:id')
  remove() { /* ... */ }
}
```

## Exemplo 7: Injeção de dependência completa

```typescript
// 1. Provider com @Injectable()
@Injectable()
export class UserRepository {
  findAll() { return [] }
}

// 2. Controller recebe via construtor
@Controller('/users')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Get()
  list() {
    return this.userRepository.findAll()
  }
}

// 3. Module registra ambos
@Module({
  controllers: [UserController],
  providers: [UserRepository],
})
export class UserModule {}
```

Se `UserRepository` não estiver em `providers[]`, o NestJS lança erro em runtime dizendo que não consegue resolver a dependência.