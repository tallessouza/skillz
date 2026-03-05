# Deep Explanation: Enviando Notificação no Subscriber

## Por que o subscriber pode usar repositórios de outro subdomínio?

O Diego faz uma observação crucial: o `OnAnswerCreated` subscriber **só existe porque o subdomínio de fórum existe**. Se removêssemos o fórum, esse subscriber não teria razão de ser. Portanto, o acoplamento não é acidental — é intencional e estrutural.

A regra é: **mantenha tudo que está acoplado exclusivamente dentro da pasta subscriber**. O subscriber é o ponto de conexão entre subdomínios. Fora dele, cada subdomínio permanece independente.

Isso é diferente de, por exemplo, um use case de notificação importar diretamente o `QuestionsRepository`. O use case deve ser agnóstico. O subscriber é o orquestrador.

## O problema do recipientId

Quando uma resposta é criada, o evento carrega informações da resposta (`answer`). Mas quem deve receber a notificação não é o autor da resposta — é o autor da pergunta. O Diego destaca essa lógica: "eu crio uma resposta e eu recebo a notificação? Não faz sentido."

Por isso o subscriber precisa buscar a `question` no repositório para obter o `authorId` correto. Esse é um padrão comum: **o evento carrega o mínimo necessário, e o subscriber enriquece os dados**.

## Por que o teste falha sem waitFor?

O processo de publish/subscribe, mesmo sendo "quase instantâneo", é assíncrono. Quando `answersRepository.create(answer)` é chamado:

1. O `create` salva e dispara `DomainEvents.dispatch()`
2. O dispatch percorre os handlers registrados
3. O handler (`sendNewAnswerNotification`) faz `await` no repositório e no use case

O passo 3 envolve Promises. No momento que o `expect` executa sincronamente logo após o `create`, o handler ainda não completou. O `waitFor` resolve isso fazendo polling a cada 10ms, re-executando a assertion até ela passar (ou timeout de 1s).

## SpyInstance vs MockInstance

O Diego menciona `SpyInstance` do Vitest, mas conforme a nota da aula, versões mais recentes do Vitest renomearam para `MockInstance`. O conceito é o mesmo: uma variável que observa chamadas a um método sem alterar seu comportamento.

Os generics do spy são opcionais mas valiosos:
- Primeiro generic: array com tipos dos parâmetros (`[SendNotificationUseCaseRequest]`)
- Segundo generic: tipo do retorno (`Promise<SendNotificationUseCaseResponse>`)

Isso habilita IntelliSense completo em `toHaveBeenCalledWith()`.

## Testes de subscriber são naturalmente maiores

O Diego normaliza isso: "geralmente os testes relacionados a subscriber são bem maiores, têm bem mais dependência, porque lidam com muitas partes do sistema ao mesmo tempo." Um teste de subscriber precisa:

1. Instanciar repositórios de múltiplos subdomínios
2. Criar entidades relacionadas (question + answer)
3. Registrar o subscriber (geralmente no `beforeEach`)
4. Usar spy + waitFor para verificação assíncrona

Isso é esperado e não indica code smell.