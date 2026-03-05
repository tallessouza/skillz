# Deep Explanation: Fetch com Paginacao em DDD

## Por que array vazio e nao null?

O instrutor enfatiza explicitamente: "aqui não pode ser nulo, porque mesmo que o array esteja vazio, essa vai ser a forma de representar que ele não encontrou nada, e não nulo."

A distincao e semantica:
- `null` significa "nao sei" ou "erro" — ausencia de informacao
- `[]` significa "busquei e nao encontrei nada" — informacao completa

Isso simplifica o codigo do consumidor: nao precisa de null-check antes de iterar.

## Padrao de reaproveitamento entre use cases

O instrutor demonstra que casos de uso de listagem sao extremamente similares entre si. O `FetchQuestionComments` foi criado copiando `FetchQuestionAnswers` e trocando nomes. Isso nao e preguica — e reconhecimento de que a estrutura e identica:

1. Recebe `entityId` + `page`
2. Chama `repository.findManyByEntityId(id, { page })`
3. Retorna o array tipado

A variacao esta apenas no tipo da entidade e no repositorio usado.

## PaginationParams como interface compartilhada

O instrutor destaca: "toda a parte de listagem, sempre que for um findMany, que eu vou retornar vários dados, a maioria das vezes eu vou estar utilizando a parte de paginação. Por isso que eu uso a nossa interface do Pagination Params que a gente criou para reaproveitar."

Isso cria consistencia: todo endpoint de listagem se comporta da mesma forma, com a mesma interface de paginacao.

## Estrategia de teste: por que 22 itens?

O padrao de paginacao usa 20 itens por pagina. Criando 22 itens:
- Pagina 1: 20 itens
- Pagina 2: 2 itens

Isso valida que o offset (`(page - 1) * 20`) e o slice (`page * 20`) funcionam corretamente. Se o teste passasse com 20 itens na pagina 2, significaria que a paginacao nao esta pulando nada.

## Reaproveitamento do in-memory repository

O instrutor mostra que o metodo `findManyByQuestionId` no `InMemoryQuestionCommentsRepository` e identico ao do `InMemoryAnswersRepository` — ambos filtram por um ID pai e aplicam slice para paginacao. A unica diferenca e o nome da propriedade filtrada. Isso reforca que o padrao de listagem e universal.

## Convencao de nomenclatura: UseCase no sufixo

O instrutor nota que esqueceu o sufixo `UseCase` no nome da classe e corrige: `FetchQuestionComments` → `FetchQuestionCommentsUseCase`. Manter o sufixo e uma convencao do projeto para distinguir use cases de outras classes.