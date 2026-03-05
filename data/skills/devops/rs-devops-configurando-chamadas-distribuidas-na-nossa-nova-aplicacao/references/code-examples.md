# Code Examples: Estrutura de Chamadas Distribuidas

## Estrutura completa do servico upstream (app2)

### user.service.ts
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  list(): { name: string; email: string }[] {
    return [
      { name: 'user1', email: 'user1@site.com' },
      { name: 'user2', email: 'user2@site.com' },
      { name: 'user3', email: 'user3@site.com' },
    ];
  }
}
```

### user.controller.ts
```typescript
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  list(): { name: string; email: string }[] {
    return this.userService.list();
  }
}
```

### user.module.ts
```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

### app.module.ts (registrando o UserModule)
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domain/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Estrutura completa do servico downstream (app1)

### Instalacao do Undici
```bash
yarn add undici
```

### user.service.ts (downstream — faz a chamada HTTP)
```typescript
import { Injectable } from '@nestjs/common';
import { request } from 'undici';

@Injectable()
export class UserService {
  async list(): Promise<{ name: string; email: string }[]> {
    const { statusCode, body } = await request(
      'http://localhost:3002/users',
    );

    const payload = await body.json();

    console.info({ statusCode, payload });

    return JSON.stringify(payload);
  }
}
```

### user.controller.ts (downstream)
```typescript
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async list(): Promise<any> {
    return this.userService.list();
  }
}
```

## Undici — API basica

### GET request (default)
```typescript
import { request } from 'undici';

const { statusCode, body } = await request('http://localhost:3002/users');
const data = await body.json();
```

### POST request
```typescript
import { request } from 'undici';

const { statusCode, body } = await request('http://localhost:3002/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'newuser', email: 'new@site.com' }),
});
const data = await body.json();
```

## Verificacao no Grafana

Apos configurar ambos os servicos:

1. Acesse `http://localhost:3000/users` (app1)
2. Abra Grafana → Explore → Tempo (traces)
3. O trace deve mostrar:
   - Span 1: `GET /users` no app1 (controller)
   - Span 2: `HTTP GET localhost:3002/users` (chamada Undici)
   - Span 3: `GET /users` no app2 (controller)
4. Verifique o tempo de cada span — o instrutor viu ~5ms no app2

## Estrutura de diretorios final

```
app1/src/
├── app.module.ts          # importa UserModule
├── app.controller.ts
├── app.service.ts
└── domain/
    └── users/
        ├── user.module.ts
        ├── user.controller.ts
        └── user.service.ts   # faz HTTP call para app2

app2/src/
├── app.module.ts          # importa UserModule
├── app.controller.ts
├── app.service.ts
└── domain/
    └── users/
        ├── user.module.ts
        ├── user.controller.ts
        └── user.service.ts   # retorna lista de usuarios
```