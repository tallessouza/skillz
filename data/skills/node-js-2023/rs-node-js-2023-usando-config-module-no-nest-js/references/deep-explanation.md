# Deep Explanation: ConfigModule no NestJS com Zod

## Por que nao usar process.env diretamente?

O `process.env` tem dois problemas fundamentais:
1. **Sem validacao** — voce nao sabe se a variavel existe ate a aplicacao quebrar em runtime
2. **Sem parse** — tudo e string, entao `PORT=3333` vira `"3333"`, nao `3333`

O Zod resolve ambos: valida a existencia e transforma o tipo.

## Por que ConfigModule e nao apenas Zod?

O Zod sozinho valida e parseia, mas o ConfigModule do NestJS resolve a **distribuicao** das variaveis. Sem ele, voce teria que importar o schema e chamar `parse` em cada arquivo que precisa de uma variavel. O ConfigModule:
- Faz a validacao uma unica vez (no boot)
- Distribui via injecao de dependencia (padrao do Nest)
- Com `isGlobal: true`, esta disponivel em todos os modulos sem re-importar

## O padrao forRoot

O `forRoot` e o padrao do Nest para modulos que precisam de configuracao. Se o modulo nao precisa de configuracao, voce importa direto: `imports: [SomeModule]`. Se precisa, usa `SomeModule.forRoot({ ... })`. Internamente, `forRoot` e um metodo estatico que retorna um `DynamicModule`.

## validate vs validationSchema

O `validationSchema` do ConfigModule usa Joi por padrao. Como o ecossistema Skillz usa Zod, a opcao `validate` e mais adequada — ela recebe uma funcao que voce controla totalmente. O `envSchema.parse()` do Zod faz throw se invalido, que e exatamente o que o ConfigModule espera.

## Os 3 parametros de tipagem do ConfigService

1. **Generic `<Env>`** — diz ao TypeScript quais variaveis existem
2. **Segundo parametro `true` (isValidated)** — remove `| undefined` do retorno, porque voce garantiu via validate que as variaveis existem
3. **`{ infer: true }` no get()** — ativa inferencia do tipo correto (ex: `number` para PORT em vez de `string`)

Sem `isValidated: true`, o Nest assume que qualquer variavel pode ser `undefined` — porque ele nao sabe que voce validou. Voce precisa dizer explicitamente "eu validei, confia".

## Por que z.coerce.number() e nao z.string().transform(Number)?

Ambos funcionam. O `z.coerce.number()` e um atalho que faz exatamente o `transform` internamente. E mais legivel e idiomatico no Zod.

## isGlobal: true — quando e por que

Aplicacoes NestJS crescem em modulos. Eventualmente voce tera `AuthModule`, `UsersModule`, `OrdersModule`, etc. Sem `isGlobal: true`, cada modulo precisaria importar `ConfigModule` nos seus proprios imports. Com `isGlobal: true`, o ConfigModule e registrado uma vez no AppModule e fica disponivel para injecao em qualquer lugar.

## Acessando ConfigService no main.ts

O `main.ts` nao e um modulo — e o bootstrap da aplicacao. Nao ha injecao de dependencia automatica. Por isso, usamos `app.get(ConfigService)` para buscar o servico manualmente do container de DI do Nest.