# Deep Explanation: Caso de Uso Delete com Validacao de Autoria

## Por que o contrato vem primeiro?

O instrutor segue rigorosamente o fluxo contract-first: antes de escrever qualquer logica de delecao, ele adiciona `findById` e `delete` ao repositorio abstrato. Isso garante que o use case depende apenas de abstracoes (Dependency Inversion Principle). A implementacao in-memory vem depois, copiando patterns ja existentes de outros repositorios e adaptando os nomes.

## O padrao de dois metodos no repositorio para delete

Para deletar, voce precisa de DOIS metodos novos no contrato:
1. **`findById`** — para verificar que a entidade existe e carregar seus dados (incluindo `authorId`)
2. **`delete`** — para remover efetivamente

O `delete` recebe a entidade inteira (`QuestionComment`), nao apenas o ID. Isso segue o mesmo padrao do `create` e permite que a implementacao concreta tenha acesso a todos os dados da entidade caso precise (ex: cascade, eventos de dominio).

## Validacao de autoria como regra de dominio

O insight central da aula: a validacao "somente o autor pode deletar seu comentario" e uma **regra de negocio**, nao uma regra de infraestrutura. Por isso vive dentro do use case, nao no middleware, controller ou guard.

O fluxo e:
1. Buscar comentario por ID
2. Se nao existe → erro "not found"
3. Se `comment.authorId !== requestAuthorId` → erro "not allowed"
4. Se tudo OK → `repository.delete(comment)`

Essa separacao de concerns garante que a regra funciona independente do framework HTTP, banco de dados ou mecanismo de autenticacao.

## Por que o delete retorna void?

O instrutor remove explicitamente qualquer tipo de retorno do `execute`. Em operacoes de remocao, nao ha informacao util para devolver — o item foi removido. O chamador pode confiar que, se nao houve excecao, a operacao foi bem-sucedida.

## Reuso de patterns entre repositorios e factories

O instrutor demonstra um workflow pratico: copiar implementacoes de repositorios/factories ja existentes e adaptar nomes. No in-memory:
- `findById` usa `this.items.find(item => item.id === id)`
- `delete` usa `this.items.splice(index, 1)`

Para a factory `makeQuestionComment`, ele copia `makeQuestion` e ajusta os campos (`authorId`, `questionId` em vez de campos de question).

## Teste do caminho de erro

O segundo teste e crucial: cria um comentario com `authorId: 'author-1'` e tenta deletar com `authorId: 'author-2'`. O `expect(...).rejects.toThrow()` verifica que o use case rejeita a operacao. Sem esse teste, a validacao de autoria poderia ser removida acidentalmente sem que ninguem perceba.

## Bug do TypeScript mencionado

O instrutor menciona um bug onde o TypeScript mostrava `any` para `questionComment.authorId`. A solucao foi `Ctrl+Shift+P → Restart TypeScript Server`. Isso e comum quando o TS language server perde sincronia com arquivos recentes — nao e um bug de codigo.