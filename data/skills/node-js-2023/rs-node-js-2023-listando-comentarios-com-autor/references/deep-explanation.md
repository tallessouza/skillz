# Deep Explanation: Listando Comentários com Autor

## Por que criar um novo método ao invés de modificar o existente?

O Diego explica que o `findManyByQuestionId` original serve para operações internas — verificar se um comentário existe na hora de editar ou deletar. Essas operações não precisam dos dados do autor. A listagem para o front-end, sim. São casos de uso diferentes que justificam métodos diferentes.

Isso segue o princípio de que cada método deve ter uma responsabilidade clara. O método original retorna entidades puras (`QuestionComment[]`), o novo retorna Value Objects compostos (`CommentWithAuthor[]`).

## A questão dos nomes longos

O Diego aborda diretamente a objeção: "Daqui a pouco o nome do meu método vai ficar gigantesco, isso tá feio demais". Sua resposta:

> "Não tá. Cuidado com essa obsessão por coisinhas pequenas. O nome precisa ser semântico. Não interessa se o nome do método tiver 40 palavras. Se ele for semântico e a pessoa entender exatamente pra que vai utilizar aquele método, show de bola."

Porém ele também pondera o outro extremo: se você precisa de author + likes + outras coisas, não crie `WithAuthorAndLikesAndNotSeiOQue`. Nesse caso, use `WithDetails` como nome genérico.

## Por que tipar como InMemory concreto e não como o contrato?

Essa é uma dica prática importante. O `StudentsRepository` (contrato/interface) pode ter apenas `findByEmail` e `create`. Mas no InMemory, você precisa buscar por ID para resolver o relacionamento.

Criar um método `findById` no contrato só para esse uso interno não faz sentido — não é uma funcionalidade da aplicação, é uma necessidade específica do repositório InMemory para testes.

Ao tipar como `InMemoryStudentsRepository`, você ganha acesso a `.items` (array público) e pode fazer qualquer operação JavaScript diretamente: `.find()`, `.filter()`, etc.

Isso só é válido para repositórios InMemory (testes). Na implementação real (Prisma, por exemplo), o JOIN é feito na query SQL.

## O erro explícito para relacionamento inexistente

O Diego adiciona uma verificação:

```typescript
if (!author) {
  throw new Error(`Author with ID ${comment.authorId.toString()} does not exist.`)
}
```

Justificativa: "Isso aqui vai ser só para testes, mas pelo menos lá no teste vai aparecer o erro. A gente não vai ficar se batendo tentando encontrar o erro."

## Impacto em cascata nos testes

Quando o `InMemoryQuestionCommentsRepository` ganha uma dependência (`StudentsRepository`), TODOS os testes que instanciam esse repositório quebram. Cada um precisa:

1. Instanciar o `InMemoryStudentsRepository`
2. Passá-lo como dependência
3. Criar e inserir students associados aos comentários

O Diego mostra isso explicitamente: o primeiro teste que ele corrige passa, mas outros testes na suíte quebram com o mesmo erro `"Author with ID does not exist"` porque não foram atualizados.

## Separação das camadas

O Diego enfatiza que todo esse trabalho ainda está na camada de domínio. Depois disso, vem a camada de infra — onde o controller e o Prisma precisam implementar o mesmo comportamento. Essa separação é fundamental na Clean Architecture.