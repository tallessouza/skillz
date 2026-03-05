# Deep Explanation: Caso de Uso Criar Pergunta

## Por que retornar objeto e nao a entidade direta

O instrutor enfatiza um padrao que parece simples mas tem impacto arquitetural significativo: sempre retornar um objeto `{ question }` em vez de `question` diretamente.

A razao e extensibilidade sem breaking changes. Se o caso de uso retorna `question` diretamente e amanha voce precisa retornar tambem um `notificationId` ou um `wasAutoApproved`, voce precisa mudar a assinatura de retorno — o que quebra todos os consumidores (controllers, outros use cases, testes).

Com objeto, voce simplesmente adiciona `{ question, notificationId }` e os consumidores que so usam `question` continuam funcionando sem alteracao.

## Por que tipar Request e Response separadamente

O instrutor cria interfaces explicitas para request e response. Isso serve para:

1. **Documentacao viva** — qualquer dev olha a interface e sabe exatamente o que o use case precisa e o que retorna
2. **Desacoplamento do framework** — o use case nao sabe se os dados vem de HTTP, CLI, ou fila. Recebe primitivos, nao objetos do Express/Fastify
3. **Facilidade de teste** — o teste monta o objeto request sem precisar simular HTTP

## Conversao de primitivos para Value Objects

O `authorId` chega como `string` (vindo do mundo externo) mas o dominio trabalha com `UniqueEntityId`. A conversao acontece na fronteira do caso de uso — este e o ponto exato onde dados "sujos" do mundo externo se tornam objetos ricos do dominio.

Isso segue o principio de que a camada de aplicacao (use cases) e a "alfandega" entre o mundo externo e o dominio.

## Construcao incremental e pragmatica

O instrutor destaca uma abordagem realista: "Na grande maioria das vezes, voce dificilmente vai ter todo o sistema mapeado desde o comeco." Ele cria o repositorio como interface (contrato) sem implementacao, cria o use case, testa com fake — e so depois vai implementar a persistencia real.

Isso e DDD pragmatico: voce nao precisa modelar tudo antes de comecar. Crie entidades conforme a necessidade surge, implemente use cases conforme as funcionalidades sao demandadas.

## Delegacao de comportamento para a entidade

Quando o instrutor cria a Question sem passar slug, ele confia que a entidade vai gerar o slug a partir do titulo. Isso e responsabilidade da entidade, nao do caso de uso. O use case orquestra, a entidade contem o comportamento de negocio.

## Fake repository no teste

O teste usa um `InMemoryQuestionsRepository` que implementa a interface `QuestionsRepository`. O metodo `create` simplesmente armazena em array. Isso permite testar o use case isoladamente, sem banco de dados, sem I/O — teste rapido e deterministico.

O instrutor comenta que "o teste ainda esta fraquinho" e que sera melhorado, mas o padrao base ja esta correto: instanciar fake, instanciar use case com fake, executar, validar retorno.