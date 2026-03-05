# Deep Explanation: Registrando Eventos de Domínio

## Por que um módulo separado para eventos?

O instrutor explica que a comunicação entre subdomínios (forum → notification) não está relacionada à camada HTTP. Colocar subscribers dentro de um controller module seria um erro arquitetural — eventos são infraestrutura de comunicação interna, não endpoints.

A pasta `src/infra/events/` fica ao lado de `auth/`, `cryptography/`, `database/`, `env/`, `http/`, `storage/` como uma preocupação de infraestrutura independente.

## O problema das interfaces no NestJS

O TypeScript remove interfaces durante a compilação (type erasure). O NestJS precisa de tokens de injeção que existam em runtime. Por isso, repositórios definidos como `interface` na camada de domínio precisam ser convertidos para `abstract class` quando usados com NestJS DI.

```typescript
// Não funciona com NestJS DI (removido em runtime)
export interface NotificationsRepository { ... }

// Funciona (existe em runtime como classe)
export abstract class NotificationsRepository { ... }
```

## Padrão de reuso via DatabaseModule exports

O instrutor destaca um padrão importante: repositórios registrados no `DatabaseModule` com `exports` ficam disponíveis para qualquer módulo que importe o `DatabaseModule`. Isso evita duplicação de providers.

```
DatabaseModule (exports: [NotificationsRepository])
    ↓ importado por
EventsModule (usa NotificationsRepository sem re-registrar)
```

## Por que @Injectable em subscribers?

Subscribers funcionam como use cases — têm dependências injetadas via construtor. O decorator `@Injectable()` do NestJS é necessário para que o container de DI saiba como instanciá-los e resolver suas dependências.

## Fluxo de dados: do schema ao mapper

O instrutor segue um padrão consistente ao criar novos repositórios Prisma:

1. Criar model no `schema.prisma`
2. Rodar `prisma migrate dev`
3. Reiniciar TS server (necessário para o TypeScript reconhecer novos tipos do Prisma Client)
4. Criar mapper (`toDomain` + `toPrisma`)
5. Criar repositório usando o mapper
6. Registrar no DatabaseModule

## Observação sobre readAt opcional

O campo `readAt` é `DateTime?` (opcional) no Prisma e pode vir como `null`. O mapper precisa tratar isso. O instrutor menciona que esse padrão já foi discutido em aulas anteriores sobre mappers.

## Estado incompleto proposital

O instrutor deixa claro que após esta aula os eventos ainda não serão disparados corretamente — falta a parte de dispatch que será implementada em aula posterior. Esta aula foca exclusivamente na infraestrutura de wiring (módulo, DI, repositório, schema).