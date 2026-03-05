# Code Examples: Variaveis de Ambiente na Aplicacao

## Exemplo 1: Arquivo .env

```bash
# .env na raiz do projeto
APP=SkillzApp
```

Estrutura chave-valor simples. A chave (`APP`) e o que voce usa no `process.env`, o valor (`SkillzApp`) e o que sera retornado.

## Exemplo 2: Acessando sem ConfigModule (FALHA)

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.APP); // undefined!
    return 'Hello World!';
  }
}
```

**Por que falha:** O NestJS nao carrega automaticamente o arquivo `.env`. O `process.env` so contem variaveis do sistema operacional e do processo Node.js, nao do arquivo `.env`.

## Exemplo 3: Instalando a dependencia

```bash
yarn add @nestjs/config
```

Isso adiciona o modulo de configuracao do NestJS que sabe ler arquivos `.env`.

## Exemplo 4: Configurando o AppModule (CORRECAO)

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**O que `ConfigModule.forRoot()` faz:** Carrega o arquivo `.env` da raiz do projeto durante o bootstrap da aplicacao, tornando todas as variaveis acessiveis via `process.env`.

## Exemplo 5: Acessando com ConfigModule (SUCESSO)

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.APP); // "SkillzApp"
    return 'Hello World!';
  }
}
```

## Exemplo 6: .env.example (boa pratica)

```bash
# .env.example — commitado no git como referencia
APP=
DATABASE_URL=
NODE_ENV=
```

Serve como documentacao viva das variaveis necessarias, sem expor valores reais.

## Exemplo 7: .gitignore

```gitignore
# Variaveis de ambiente
.env
.env.local
.env.*.local
```

O `.env` nunca vai para o repositorio. Apenas `.env.example` e commitado.

## Fluxo completo de teste

```bash
# 1. Criar .env na raiz
echo "APP=SkillzApp" > .env

# 2. Instalar dependencia
yarn add @nestjs/config

# 3. Adicionar ConfigModule.forRoot() no AppModule

# 4. Rodar aplicacao
yarn run start:dev

# 5. Testar
curl http://localhost:3000
# Console mostra: SkillzApp
```