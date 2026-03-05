# Deep Explanation: Listar Comentarios da Resposta

## Raciocinio do Instrutor

O instrutor demonstra um principio fundamental de DDD com Clean Architecture: **quando o padrao ja esta estabelecido, replicar e trivial e seguro**. A aula inteira e sobre copiar o `FetchQuestionComments` e substituir "question" por "answer" em todos os lugares.

Isso nao e preguica — e o ponto. Se a arquitetura foi bem desenhada, adicionar um novo caso de uso de listagem paginada para outra entidade e um processo mecanico de 4 passos:

1. **Contrato do repository** — adicionar o metodo na interface
2. **In-memory** — implementar o filtro e paginacao em memoria
3. **Use case** — criar a classe que orquestra
4. **Teste** — validar o comportamento

## Por que a ordem importa

O instrutor comeca pelo repository interface (contrato), nao pelo use case. Isso e intencional:

- O contrato define O QUE o sistema precisa
- O in-memory implementa COMO testar
- O use case ORQUESTRA a chamada
- O teste VALIDA o comportamento

Se voce comecar pelo use case, vai descobrir que precisa do metodo no repository depois e vai ficar indo e voltando entre arquivos.

## Reaproveitamento como validacao de arquitetura

O fato de que a substituicao mecanica de "question" por "answer" funciona perfeitamente e uma **prova de que a arquitetura esta bem feita**. Se a troca quebrasse algo, significaria que havia acoplamento indevido entre as entidades.

O instrutor diz: "Bem rapido quando a gente tem esse tipo de reaproveitamento" — isso e o dividendo da arquitetura limpa.

## Paginacao com slice

O padrao `slice((page - 1) * 20, page * 20)` e usado no in-memory repository. No repository real (Prisma, TypeORM, etc), isso seria um `OFFSET/LIMIT` na query SQL. O in-memory simula exatamente esse comportamento para que os testes sejam confiaveis.

## Seguranca via testes

O instrutor finaliza executando os testes e confirmando que "tudo esta passando". Isso valida que a substituicao mecanica nao introduziu nenhum bug — os testes sao a rede de seguranca que permite esse tipo de reaproveitamento rapido.