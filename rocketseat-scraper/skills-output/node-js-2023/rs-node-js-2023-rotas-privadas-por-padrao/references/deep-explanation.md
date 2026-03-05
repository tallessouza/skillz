# Deep Explanation: Rotas Privadas por Padrao

## Por que inverter a logica de autenticacao?

O instrutor explica que conforme a aplicacao cresce e voce tem dezenas de controllers, o padrao de decorar cada controller com `@UseGuards()` se torna insustentavel. O risco real e esquecer de adicionar o guard em uma rota nova — criando uma falha de seguranca silenciosa.

A inversao da logica e um principio de seguranca chamado **deny by default**: tudo e bloqueado ate que voce explicitamente libere. Isso e muito mais seguro porque uma rota esquecida fica protegida (fail-safe), em vez de ficar exposta (fail-open).

## Como o APP_GUARD funciona

O `APP_GUARD` e um token especial do NestJS (`@nestjs/core`) que permite registrar um guard de forma global. Quando voce faz:

```typescript
{
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
}
```

O NestJS aplica esse guard em TODAS as rotas da aplicacao automaticamente, sem precisar de `@UseGuards()` em cada controller.

## O papel do Metadata no NestJS

O instrutor faz uma analogia com Express/Fastify: em frameworks tradicionais, voce passa informacoes entre middlewares atraves do objeto `request`. No NestJS, o equivalente e o **metadata** — uma forma de transicionar informacoes entre decorators, guards, interceptors e pipes.

O `SetMetadata` cria um metadata na rota. O `Reflector` (injetado no guard) le esse metadata. O guard do Passport (`AuthGuard('jwt')`) ja busca um metadata chamado `isPublic` — se for `true`, pula a verificacao JWT.

## Por que `@Injectable()` e obrigatorio

O `Reflector` e um servico do NestJS que precisa ser injetado via dependency injection. Sem o decorator `@Injectable()`, o NestJS nao sabe que precisa injetar dependencias naquela classe. O resultado e `this.reflector` sendo `undefined`, causando o erro:

```
Cannot read properties of undefined (reading 'getAllAndOverride')
```

## O metodo `getAllAndOverride`

O `reflector.getAllAndOverride()` busca o metadata em dois niveis:
1. No **handler** (metodo do controller)
2. Na **classe** (controller inteiro)

O "override" significa que se o metadata existir no handler, ele prevalece sobre o da classe. Isso permite granularidade: um controller inteiro pode ser publico, mas um metodo especifico pode nao ser (ou vice-versa).

## Por que remover `declaration: true`

O `declaration: true` no tsconfig faz o TypeScript gerar arquivos `.d.ts` (definicoes de tipo) durante o build. Isso causa um erro de inferencia de tipo com o RxJS (que o `canActivate` usa internamente):

```
The inferred type of 'canActivate' cannot be named without a reference to RxJS
```

Em um projeto NestJS final (que nao e uma lib para ser instalada por outros), os `.d.ts` nao tem utilidade — o deploy gera apenas JavaScript. Remover essa flag resolve o erro sem consequencias.

## Onde colocar o provider

O instrutor inicialmente pensa em colocar no `HttpModule` (onde estao os controllers), mas decide que o `AuthModule` e mais semantico — o guard de autenticacao pertence ao modulo de autenticacao. Isso segue o principio de coesao: cada modulo agrupa o que pertence ao mesmo dominio.