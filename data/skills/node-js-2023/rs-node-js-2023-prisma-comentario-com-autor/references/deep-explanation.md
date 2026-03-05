# Deep Explanation: Prisma Mapper para Relacionamentos

## Por que um mapper separado e nao um metodo novo?

O instrutor explica a decisao arquitetural: ao inves de adicionar um segundo metodo no `PrismaQuestionCommentMapper` (como `toQuestionWithAuthor`), ele cria um mapper completamente novo. A razao e reuso — comentarios existem tanto em perguntas quanto em respostas. Se o mapper ficasse dentro do `QuestionComment`, seria necessario duplicar a logica para `AnswerComment`.

O nome `PrismaCommentWithAuthorMapper` (sem "Question" ou "Answer") reflete essa decisao: ele e generico o suficiente para servir ambos os contextos.

## Eager Loading no Prisma

O Prisma suporta Eager Loading atraves do parametro `include` no `findMany`. Quando voce faz:

```typescript
const comments = await this.prisma.comment.findMany({
  where: { questionId },
  include: { author: true },
})
```

O Prisma retorna cada comentario com um objeto `author` embutido contendo todos os campos do User. O TypeScript infere automaticamente esse tipo, mas para o mapper e melhor ser explicito com o tipo intersecao.

## Tipo intersecao vs tipo inferido

O instrutor cria manualmente o tipo:

```typescript
type PrismaCommentWithAuthor = PrismaComment & { author: PrismaUser }
```

Isso e preferivel a usar o tipo inferido do Prisma (`Prisma.CommentGetPayload<{ include: { author: true } }>`) porque:
- E mais legivel
- Fica explicito quais dados o mapper espera
- Nao depende de generics complexos do Prisma

## Fluxo completo

1. Dominio define `CommentWithAuthor` (value object)
2. Repositorio no dominio define interface com `findManyByQuestionIdWithAuthor`
3. Implementacao Prisma usa `include: { author: true }` na query
4. Mapper compartilhado converte resultado Prisma → value object de dominio
5. Controller usa o repositorio e passa resultado para o Presenter
6. Presenter formata para a API response

## Ajustes no Controller e Presenter

O instrutor menciona que apos criar o mapper, e necessario ajustar o controller (`FetchQuestionCommentsController`) e o presenter para lidar com a nova estrutura. O presenter precisa incluir os campos do autor (como `authorName`) na resposta da API.