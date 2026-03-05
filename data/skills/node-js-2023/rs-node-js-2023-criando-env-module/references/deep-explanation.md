# Deep Explanation: Criando EnvModule

## Por que encapsular o ConfigService?

O ConfigService do NestJS exige uma sintaxe verbosa para respeitar tipagem TypeScript:

```typescript
configService.get<Env['PORT'], true>('PORT', { infer: true })
```

Essa sintaxe precisa ser repetida em **todo ponto de uso**: main.ts, strategies, factories (useFactory), etc. O Diego identifica isso como "maracutaia" — codigo boilerplate que polui cada consumer.

A solucao e o padrao **Facade/Wrapper**: um servico proprio que encapsula a complexidade em um unico lugar.

## O problema do generic no metodo get

O Diego mostra ao vivo um bug sutil. A primeira versao:

```typescript
get(key: keyof Env) {
  return this.configService.get(key, { infer: true })
}
```

Retorna `string | number` — a **uniao de todos os tipos possiveis** das chaves do Env. O TypeScript nao consegue inferir QUAL chave especifica foi passada.

A solucao e usar **generics** para "capturar" a chave especifica:

```typescript
get<T extends keyof Env>(key: T): Env[T] {
  return this.configService.get(key, { infer: true })
}
```

Aqui, `T` e uma "variavel de tipo" que captura o valor literal passado pelo caller. Se o caller chama `get('PORT')`, T = `'PORT'`, e o retorno e `Env['PORT']` = `number`.

O Diego explica: "o parametro que o usuario enviar aqui vai ser assinado a esse generic, que e digamos uma variavel dentro do TypeScript."

## O problema de visibilidade entre modulos

Ao mover de provider simples para modulo, o Diego encontra um erro real:

```
Please make sure that the argument EnvService at index [0] is available in the JWT context
```

Isso acontece porque `JwtModule.registerAsync()` cria um **contexto de modulo separado**. Providers registrados no AppModule nao sao vissiveis dentro do JwtModule.

A solucao e:
1. Criar `EnvModule` com `exports: [EnvService]`
2. Passar `EnvModule` no `imports` do `JwtModule.registerAsync()`

```typescript
JwtModule.registerAsync({
  imports: [EnvModule],
  inject: [EnvService],
  useFactory(env: EnvService) {
    const privateKey = env.get('JWT_PRIVATE_KEY')
    return { /* ... */ }
  },
})
```

## Estrutura final de arquivos

```
src/infra/env/
├── env.ts            # Schema Zod + tipo Env (ja existia)
├── env.service.ts    # Wrapper tipado do ConfigService
└── env.module.ts     # Modulo que exporta EnvService
```

O Diego move os arquivos para uma pasta dedicada `env/` dentro de `infra/`, agrupando schema, servico e modulo pela coesao do dominio.