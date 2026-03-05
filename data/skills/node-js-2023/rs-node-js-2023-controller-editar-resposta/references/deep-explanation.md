# Deep Explanation: Controller Editar Resposta

## Filosofia de tratativa de erros: esperados vs inesperados

O Diego faz uma distincao crucial entre erros esperados e inesperados nos controllers. No `AuthenticateController`, o `WrongCredentialsError` recebe tratativa especifica porque e um erro esperado — o usuario pode errar a senha, isso e normal no fluxo.

Ja no `EditAnswerController`, erros como `ResourceNotFoundError` e `NotAllowedError` existem no use case como protecao do back-end, mas sao extremamente improvaveis no fluxo real. Para o `ResourceNotFoundError` acontecer, o usuario teria que:
1. Abrir o formulario de edicao de uma resposta
2. Em outra aba, deletar essa resposta
3. Voltar e tentar salvar a edicao

Para o `NotAllowedError`, o front-end teria que mostrar o botao de editar para um usuario que nao e o autor — o que ja seria um bug do front-end.

A conclusao do Diego: **invista tempo de tratativa proporcional a probabilidade do erro**. Erros esperados merecem tratativa rica (mensagens claras, status codes corretos). Erros inesperados podem ter tratativa generica porque nao deveriam chegar a acontecer.

"Voce pode fazer a tratativa de tudo? Pode. Mas coloque na balanca o quanto vale a pena o investimento de tempo."

## Design de rotas: so parametros necessarios

O Diego destaca que ao editar uma resposta, o `questionId` e "informacao inutil". Diferente de criar uma resposta (onde voce precisa saber a qual pergunta pertence), a edicao opera apenas sobre a resposta em si. Incluir o `questionId` na rota seria ruido sem valor.

Principio: **cada parametro na rota deve ser consumido pela operacao**. Se o controller nao usa o parametro, ele nao pertence a rota.

## Foreign keys em testes e2e

Ao criar uma `Answer` no teste, o Diego destaca que tanto o `questionId` quanto o `authorId` precisam apontar para registros reais no banco. Se voce deixar a factory gerar IDs aleatorios, o banco de dados vai rejeitar a insercao por violacao de chave estrangeira.

O padrao e: crie os registros pai primeiro (user, question), depois crie a entidade de teste (answer) referenciando os IDs reais.

## Padrao de copia e adaptacao

O Diego começa copiando o `EditQuestionController` e fazendo search-and-replace de "question" para "answer". Isso e intencional — em clean architecture, controllers seguem uma estrutura muito parecida. Copiar e adaptar e mais seguro que escrever do zero porque mantem consistencia de patterns.

Porem, ele destaca que a copia nunca e 1:1. Sempre ha diferencas:
- A rota muda (sem `questionId`)
- O body muda (sem `title`, so `content`)
- O use case muda (nome diferente, parametros diferentes)