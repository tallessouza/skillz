# Deep Explanation: Presenter Pattern na Camada HTTP

## Por que o Presenter existe

O Presenter resolve um problema fundamental: entidades de dominio carregam informacoes internas (Value Objects, IDs compostos, campos que nao fazem sentido para o front-end) que nao devem vazar para a resposta HTTP.

O Diego faz uma analogia direta com o Mapper do Prisma — ambos convertem dados de um formato para outro. A diferenca e a direcao:
- **Mapper (Prisma):** banco de dados → dominio
- **Presenter:** dominio → resposta HTTP

## Naming e contexto

Quando a aplicacao so tem uma porta de saida (HTTP), o nome `QuestionPresenter` e suficiente. Mas se houver multiplas portas (HTTP, GraphQL, gRPC), cada porta precisa seu proprio Presenter com prefixo: `HttpQuestionPresenter`, `GqlQuestionPresenter`.

O Diego compara isso com a convencao que usou no Mapper do Prisma (`PrismaQuestionMapper`) — o prefixo indica a camada/tecnologia.

## Controle de campos expostos

Um ponto central da aula: sem GraphQL (que permite o front-end escolher campos), o back-end REST precisa controlar explicitamente o que retorna. O Presenter e a ferramenta para isso.

Exemplo pratico do Diego: numa listagem de forum, voce mostra titulo, slug, melhor resposta — mas NAO o conteudo completo da pergunta. O conteudo so aparece na pagina de detalhe. Isso implica que voce pode ter **multiplos Presenters para a mesma entidade**:
- `QuestionPresenter` — para listagens (sem content)
- `QuestionDetailPresenter` — para detalhe (com content)

## Tratamento do Result/Either no controller

O Diego mostra o padrao de extrair o valor do Result antes de usar o Presenter:

```typescript
const result = await useCase.execute(params)

if (result.isLeft()) {
  throw new Error() // temporario — tratativa de erros vem depois
}

const questions = result.value.questions
```

O `result.value` so e seguro apos o check `isLeft()`, porque o TypeScript infere que apos essa guarda o valor e o caso de sucesso.

## Erros comuns que o Diego corrigiu ao vivo

1. **`question.slug`** — retornava o objeto Slug inteiro ao inves de `question.slug.value`
2. **`question.bestAnswerId.toString()`** — falhava quando `bestAnswerId` era `undefined`. Correcao: `question.bestAnswerId?.toString()`

Esses sao erros tipicos ao trabalhar com Value Objects e campos opcionais — o Presenter e exatamente onde voce resolve essas conversoes.

## Comparacao com GraphQL

O Diego menciona que com GraphQL o Presenter seria mais simples porque o front-end declara quais campos quer. Porem, GraphQL traz complexidade em outras pontas (resolvers, schema, N+1 queries). E um trade-off, nao uma superioridade.