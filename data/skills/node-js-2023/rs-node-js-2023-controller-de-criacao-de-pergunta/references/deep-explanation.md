# Deep Explanation: Controller de Criacao de Pergunta

## Por que pipe no @Body() e nao no @UsePipes()?

O instrutor mostra duas formas de aplicar validacao no NestJS:

1. **`@UsePipes(new ZodValidationPipe(schema))`** — aplica no controller inteiro. Qualquer parametro (body, query, params) passa pelo pipe. Funciona, mas e um tiro de canhao.

2. **`@Body(new ZodValidationPipe(schema))`** — aplica so no body. Mais preciso, mais explicito. O NestJS permite passar pipes diretamente nos decorators de parametro (`@Body()`, `@Param()`, `@Query()`).

O instrutor comeca mostrando a forma 1 (que ja vinha usando nas aulas anteriores) e depois migra para a forma 2, explicando que e mais adequada quando voce quer validar apenas um parametro especifico.

## A decisao de extrair o pipe para constante

Quando o pipe e colocado inline no `@Body()`, a linha fica muito longa:

```typescript
@Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBody
```

O instrutor nota que "acaba quebrando a linha" e decide extrair para uma constante:

```typescript
const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)
```

Isso e um padrao pratico: quando a instanciacao inline prejudica legibilidade, extraia para constante no topo do arquivo.

## Geracao de slug com ChatGPT

O instrutor usa o ChatGPT para gerar a funcao de slug, pedindo especificamente: "Create a TypeScript function that converts a string to a slug without accents." A resposta usa `normalize('NFD')` para decompor caracteres acentuados em base + diacritico, e depois remove os diacriticos com regex.

Ele destaca que essa e uma solucao temporaria ("por enquanto"), porque mais adiante no curso irao ter uma abordagem mais robusta. Mas o `normalize('NFD')` e a forma correta — mapear acentos manualmente e fragil e incompleto.

## Slug unico e o problema de duplicatas

O instrutor alerta: "o slug e unico, entao a gente tem que cuidar se cadastrar duas perguntas com o mesmo titulo." Nesta aula ele nao resolve esse problema — se dois titulos iguais forem cadastrados, o segundo vai falhar com erro de constraint unique no banco.

Solucoes futuras incluem: adicionar sufixo numerico (`meu-titulo-2`), ou UUID parcial, ou timestamp.

## Por que nao retornar nada no POST?

O instrutor diz: "eu nao preciso return quando e uma criacao, nao tem muito porque ter um return aqui dentro." A logica e que o status HTTP 201 (Created) ja comunica sucesso. Retornar o objeto criado e opcional e depende da API — aqui, o padrao escolhido e minimalista.

## Fluxo completo demonstrado

1. Define schema Zod com `title` e `content`
2. Infere o tipo TypeScript com `z.infer`
3. Cria constante do pipe de validacao
4. No handler: extrai `user.sub` do JWT (via `@CurrentUser()`), desestrutura body
5. Gera slug a partir do titulo
6. Cria registro no Prisma com `authorId` vinculado ao usuario autenticado
7. Testa com HTTP client — status 201, verifica no Prisma Studio