# Deep Explanation: Validações em Hub de Conexão Real-Time

## Por que error codes em vez de strings?

O instrutor enfatiza por experiência própria: fazer o aplicativo mobile decidir seu fluxo baseado em comparação de texto é errado. Se a mensagem de erro mudar (tradução, correção de typo, refatoração), o app quebra silenciosamente. Seria necessário republicar o app na store — trabalho completamente desnecessário.

Com enum error codes, o contrato é estável. O app recebe `InvalidCode` e sabe: limpar o campo, pedir ao usuário para digitar novamente, sem fechar a página. Se recebe `UnknownError`, aí sim fecha a conexão e reinicia o fluxo. O error code permite ao cliente decidir o próximo passo de forma inteligente.

## Refatoração como parte natural do desenvolvimento

O instrutor faz questão de normalizar a refatoração: "Vida de Dev é assim, não é só implementar novas funcionalidades. É também fazer refatorações quando necessário." À medida que novas informações surgem sobre o projeto, código anterior precisa ser modificado. Isso não é sinal de erro — é o fluxo natural.

Nesta aula especificamente, o tipo de retorno mudou de `Task` para `Task<HubOperationResult<string>>`, e o DTO `ConnectingUserDTO` foi substituído por `ConnectionUsersDTO` (que inclui dados de ambos os usuários, não apenas quem está se conectando).

## ErrorCode como propriedade nullable

A decisão de fazer `UserConnectionErrorCode?` (nullable) é intencional: em caso de sucesso, não existe error code. A propriedade só é preenchida na função `Failure()`. No `Success()`, ela permanece null naturalmente.

## Segurança em mensagens sobre pessoas

O instrutor tem uma preferência clara: quando erros envolvem pessoas/usuários, não expor detalhes como IDs ou documentos. "Usuário não encontrado" é suficiente — sem "Usuário com ID xyz não encontrado". Isso evita vazamento de informações sobre existência de contas.

## Validação de auto-conexão

Um cenário real: a pessoa tem dois dispositivos. Em um gera o código, no outro (mesma conta) tenta se conectar consigo mesma. O instrutor destaca que é obrigação do backend validar isso, especialmente porque o ID vem de fonte externa (do Hub) e pode estar sujeito a erros ou manipulação.

## Organização em Resource files

Todas as mensagens de erro ficam centralizadas em `ResourceMessageException` dentro do projeto de exceptions. Benefícios: reutilização entre classes, tradução (português/inglês), e organização em um lugar só. As chaves seguem padrão descritivo: `PROVIDED_CODE_DOES_NOT_EXIST`, `USER_NOT_FOUND`, `CANNOT_CONNECT_TO_SELF`.

## Renomeação para clareza

`LogitsUser` foi renomeado para `JoinerUser` quando surgiu `CodeOwner` — para que "ao bater o olho nas variáveis, a gente entenda o que está acontecendo". Dois participantes no fluxo precisam de nomes que descrevem seus papéis, não apenas "usuário logado".