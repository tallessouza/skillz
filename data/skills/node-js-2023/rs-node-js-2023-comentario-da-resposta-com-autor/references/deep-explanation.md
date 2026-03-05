# Deep Explanation: Comentário da Resposta com Autor

## Por que reutilizar o Value Object

O instrutor enfatiza que `CommentWithAuthor` foi criado para comentários de perguntas, mas a estrutura é idêntica para comentários de respostas. No DDD, value objects representam conceitos sem identidade própria — se dois contextos compartilham o mesmo conceito (comentário + nome do autor), criar dois value objects seria duplicação desnecessária.

A decisão-chave: **o value object mora em `enterprise/`** (camada de domínio compartilhada), não dentro de um caso de uso específico. Isso permite que ambos os agregados (Question e Answer) o utilizem.

## Padrão de replicação em Clean Architecture

O processo de estender uma funcionalidade de um agregado para outro segue uma sequência precisa:

1. **Enterprise (domínio)** — verificar se o value object já existe (neste caso, sim)
2. **Caso de uso** — adaptar o retorno e o método chamado no repositório
3. **Repositório (interface)** — criar o método abstrato correspondente
4. **Repositório (in-memory)** — implementar com dependências necessárias
5. **Testes unitários** — adaptar, garantindo dados reais para dependências
6. **Repositório (Prisma)** — implementar o método com o ORM
7. **Controller** — trocar presenter
8. **Testes E2E** — adaptar verificações

## Interdependência entre repositórios in-memory

O instrutor faz uma observação importante: **repositórios in-memory sempre recebem outros repositórios in-memory no constructor**. Da mesma forma, repositórios Prisma recebem repositórios Prisma. Não há problema em criar essa "interindependência" entre repositórios da mesma camada, porque na prática eles sempre operam juntos.

Essa decisão pragmática evita abstrações desnecessárias — não precisa de uma interface genérica para injetar repositórios dentro de repositórios. A tipagem concreta é suficiente.

## Por que o mesmo mapper funciona

Comentários de perguntas e respostas usam a mesma tabela no Prisma (`Comment`). O mapper `CommentWithAuthorMapper` transforma o resultado do Prisma (com include/join do author) no value object `CommentWithAuthor`. Como a estrutura da tabela é a mesma, o mapper é 100% reutilizável.

## Testes — a armadilha do autor real

Quando o `InMemoryAnswerCommentsRepository` passa a depender do `InMemoryStudentsRepository`, todo teste que cria comentários precisa primeiro criar um `Student` real. Sem isso, o `findManyByAnswerIdWithAuthor` não encontra o autor e falha.

O instrutor mostra que é preciso:
1. Criar `inMemoryStudentsRepository` no `beforeEach`
2. Passar como dependência ao `inMemoryAnswerCommentsRepository`
3. Criar um `Student` com nome real (ex: "John Doe")
4. Usar o `studentId` como `authorId` nos comentários
5. Verificar no `expect` que o nome do autor aparece no resultado

## Técnica de refatoração de testes

O instrutor mostra uma técnica prática: quando comentários eram criados inline no `repository.create()`, ele extraiu para variáveis (`comment1`, `comment2`, `comment3`) para poder referenciar seus IDs nos expects. Isso é um padrão comum quando o teste precisa verificar propriedades específicas dos itens criados.