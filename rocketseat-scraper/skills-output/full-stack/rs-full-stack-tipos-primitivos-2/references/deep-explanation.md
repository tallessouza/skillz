# Deep Explanation: Tipos Primitivos do TypeScript

## Por que anotar tipos?

O instrutor demonstra um conceito fundamental: sem anotacao de tipo, uma variavel aceita **qualquer valor**. Isso significa que `username` poderia receber `"rodrigo"`, `17`, ou `true` — todos sem erro. O TypeScript so protege quando voce **explicitamente declara** o tipo.

A mensagem de erro que o TypeScript gera e precisa: "Type 'number' is not assignable to type 'string'". Isso acontece em **tempo de desenvolvimento**, antes de rodar o codigo — e essa e a proposta central do TypeScript: antecipar erros.

## Os tres tipos primitivos basicos

### `string`
- Para qualquer conteudo textual
- Aspas simples, duplas ou template literals
- Quando voce define `let username: string`, apenas texto e aceito

### `number`
- TypeScript **nao diferencia** inteiro de decimal (diferente de linguagens como Java/C# que tem `int`, `float`, `double`)
- `3` e `7.5` sao ambos `number`
- Decimais usam **ponto** (notacao inglesa): `7.5`, nao `7,5`
- O instrutor destaca: "seja numero inteiro ou real, com o ponto, com o caso decimal"

### `boolean`
- Apenas `true` ou `false`
- Usado para estados e flags
- O instrutor usa o exemplo `isLoading` — um padrao muito comum em aplicacoes frontend

## Analogia do instrutor

O instrutor usa o TypeScript Playground para demonstrar visualmente. Ao passar o mouse sobre um erro, o Playground mostra a mensagem exata do TypeScript. Isso reforca que o TypeScript funciona como um "assistente" que avisa erros **enquanto voce desenvolve**, nao em runtime.

## Ponto importante: `any` implicito

Quando voce nao declara tipo, o TypeScript pode inferir `any` (depende da configuracao `strict`). O instrutor mostra isso ao criar `let username` sem tipo — a variavel aceita qualquer coisa. Com `strict: true` (recomendado), isso gera um erro, forcando voce a anotar.

## Edge cases

- `number` inclui `NaN`, `Infinity` e `-Infinity` — todos sao tecnicamente `number`
- `string` vazia `""` e valida como `string`
- `boolean` nao aceita `0`, `1`, `""`, `null`, ou `undefined` — apenas `true` e `false`