# Deep Explanation: Controller de Listagem com Paginacao

## Por que retornar objeto e nao array

O instrutor enfatiza: "Gosto sempre de retornar o objeto e não retornar direto o array de questions. Porque mais pra frente, se a gente precisar retornar mais informações, como por exemplo, qual que é o total de perguntas que existem no banco de dados pra fazer uma paginação no front-end, só vem aqui e adiciona uma coisa nova. Eu não preciso mudar a estrutura de dado que eu estou retornando."

Isso e um principio de design de API: manter o contrato extensivel. Se a resposta e `[...]`, adicionar `total` exige mudar para `{ items: [...], total: N }` — breaking change. Se ja comeca como `{ questions: [...] }`, basta adicionar `{ questions: [...], total: N }`.

## O bug do ZodValidationPipe sem return

Este foi o problema central da aula. O instrutor encontrou um `Internal Server Error` porque o `skip` recebia `undefined`. A investigacao revelou:

1. O `ZodValidationPipe` original usava apenas `this.schema.parse(value)` — so validava
2. Com transforms (`.optional().default('1').transform(Number)`), o parse PRODUZ um novo valor
3. Sem `return`, o valor transformado era descartado e o valor original (undefined) era passado ao controller
4. Solucao: `return this.schema.parse(value)` — retorna o valor transformado

O instrutor explicou: "Nesse caso aqui, eu faço uma transformação, porque o dado pode vir undefined. Se ele vier undefined, eu tenho que dar um novo valor para aquela página. Ou seja, eu não quero só validar, eu quero transformar, criar novos dados também."

## Por que .pipe() e necessario apos transform

Quando voce faz `z.string().transform(Number)`, o Zod sabe que o OUTPUT e number, mas `.min(1)` e um metodo de string schema, nao de number. O `.pipe()` cria uma NOVA validacao que recebe o output do transform como input:

```
string → optional() → default('1') → transform(Number) → pipe(number().min(1))
  "2"  →   "2"     →     "2"      →        2          →      2 (valido, >= 1)
  undefined → undefined → "1"     →        1          →      1 (valido, >= 1)
  "0"  →   "0"     →     "0"      →        0          →      ERRO (< 1)
  "-5" →  "-5"     →    "-5"      →       -5          →      ERRO (< 1)
```

## Matematica do skip

O calculo `(page - 1) * perPage` e a formula padrao de offset pagination:

- Page 1: `(1-1) * 20 = 0` → pula 0, mostra os 20 primeiros
- Page 2: `(2-1) * 20 = 20` → pula 20, mostra do 21 ao 40
- Page 3: `(3-1) * 20 = 40` → pula 40, mostra do 41 ao 60

O instrutor usou `perPage = 1` na aula para facilitar o teste com apenas 2 registros, mas em producao seria 20.

## Query params sempre sao string

Todo query param vem como string do HTTP. O decorator `@Query('page')` retorna `string | undefined`. Por isso o schema precisa comecar com `z.string()` e nao `z.number()`. A transformacao para numero acontece via `.transform(Number)`.