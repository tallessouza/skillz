# Deep Explanation: Criando Service do Redis

## Por que estender a classe Redis ao inves de compor?

O instrutor usa o mesmo padrao do PrismaService: heranca direta. Quando `RedisService extends Redis`, ao instanciar `new RedisService()`, o constructor da classe pai (`Redis` do ioredis) e chamado via `super()`. Isso significa que o `RedisService` **e** uma instancia de Redis — tem todos os metodos (`get`, `set`, `del`, etc.) disponiveis diretamente.

A alternativa seria composicao (ter um `private redis: Redis` interno), mas heranca e mais simples aqui porque:
- O service **e** a conexao, nao **tem** uma conexao
- Nao precisa de proxy methods para cada operacao
- Segue o mesmo padrao ja estabelecido com o PrismaService no projeto

## Redis DB: numeracao vs nomeacao

Uma diferenca importante entre Redis e bancos relacionais que o instrutor destaca:

- **Postgres**: cada aplicacao tem seu banco com um **nome** (`myapp_db`, `users_db`)
- **Redis**: bancos sao identificados por **numeros** (0, 1, 2, ..., 15 por padrao)

Na pratica, quando se usa Docker Compose (cada app com seu proprio container Redis), essa limitacao nao importa — cada container e isolado. Mas em Redis compartilhado, separe por numero de DB.

## onModuleDestroy vs onModuleInit

O instrutor faz uma comparacao direta com o PrismaService:

| Hook | PrismaService | RedisService |
|------|--------------|--------------|
| `onModuleInit` | Sim — chama `this.$connect()` | Nao necessario — ioredis conecta no constructor |
| `onModuleDestroy` | Sim — chama `this.$disconnect()` | Sim — chama `this.disconnect()` |

Chamar `connect()` manualmente no ioredis apos o constructor **causa erro**, porque a conexao ja foi estabelecida. Esse e um detalhe sutil que evita bugs.

## Estrutura de pastas: espelhamento Database/Cache

```
src/infra/
├── database/
│   └── prisma/
│       ├── prisma.service.ts
│       └── ...
├── cache/
│   ├── redis/
│   │   └── redis.service.ts
│   └── cache.module.ts
```

O instrutor enfatiza que a pasta `redis/` fica dentro de `cache/` pelo mesmo motivo que `prisma/` fica dentro de `database/`: amanha pode haver outro provider (ex: Memcached, in-memory cache) e a estrutura ja esta preparada para isso.

## Por que importar CacheModule no DatabaseModule?

Os repositorios (ex: `PrismaQuestionRepository`) vivem no `DatabaseModule`. Quando um repositorio precisa usar cache, ele precisa injetar o `RedisService`. Para isso funcionar no NestJS, o `CacheModule` precisa estar importado no modulo que contem o repositorio — neste caso, o `DatabaseModule`.

## EnvService com defaults: pattern do curso

O padrao usado no curso e:
1. Definir variaveis no schema Zod com `.optional().default(valor)`
2. Nao precisar criar as variaveis no `.env`
3. O `EnvService.get()` sempre retorna um valor tipado

Isso e especialmente util para Redis onde os defaults (`127.0.0.1:6379/0`) sao universais em desenvolvimento.