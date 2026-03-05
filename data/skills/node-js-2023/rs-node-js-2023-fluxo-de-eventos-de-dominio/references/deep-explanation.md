# Deep Explanation: Fluxo de Eventos de Domínio

## O problema fundamental: acoplamento entre subdomínios

O instrutor (Diego) começa pelo cenário concreto: no subdomínio de Fórum, quando uma resposta é criada, o subdomínio de Notificação precisa enviar uma notificação ao dono da pergunta.

A solução ingênua seria chamar `SendNotificationUseCase` diretamente dentro de `AnswerQuestionUseCase`. Diego identifica dois problemas críticos:

### Problema 1: Acoplamento direto
Se o sistema de notificação for terceirizado (sair da codebase), o caso de uso de resposta quebra. Os subdomínios devem poder existir independentemente.

### Problema 2: Evento atrelado ao caso de uso errado
Hoje existe um único caso de uso que cria respostas. Mas e se amanhã existirem outros? A notificação está atrelada ao `AnswerQuestionUseCase`, não ao fato de uma resposta ter sido criada. Se outro caso de uso criar uma resposta, a notificação não será enviada.

**Insight do Diego:** "Eu não quero que o envio de uma notificação aconteça quando o caso de uso de nova resposta for chamado, e sim quando uma nova resposta for criada, uma nova entidade for criada."

## Por que registrar na entidade e não no caso de uso

O método `Answer.create()` é chamado TODA vez que uma resposta precisa ser criada, independente de qual caso de uso a originou. Por isso é o melhor local para registrar o evento.

Mas registrar na entidade NÃO significa executar o efeito colateral na entidade. A entidade apenas "anota" que o evento aconteceu.

## PubSub: a estrutura de desacoplamento

Diego explica PubSub como "uma estrutura que permite realizar a comunicação entre duas partes de um sistema de maneira que elas duas não se conheçam."

Na prática:
- **Publish:** Quando uma resposta é criada, registra-se uma mensagem numa estrutura de dados (pode ser um array) com informações sobre o evento (a entidade, o tópico, etc.)
- **Subscribe:** Uma classe no subdomínio de Notificação fica ouvindo adições nessa estrutura. Quando detecta um evento relevante, executa a ação (enviar notificação).

**Independência:** A parte de publish pode existir sem a parte de subscribe e vice-versa. Se o subscriber não existir, nenhum erro acontece — o evento simplesmente não é consumido.

## A dupla validação: o insight mais importante

Diego levanta uma problemática crucial: se o evento for disparado no momento do `Answer.create()`, e depois acontecer um erro antes do save no banco de dados, a notificação já terá sido enviada para algo que não foi realmente criado.

**Analogia do Diego (implícita):** "A entidade foi criada dentro do domínio da aplicação" ≠ "a answer foi criada em todas as etapas do sistema." Criação real = persistência no banco.

### Solução: flag de readiness

1. No `create()`: evento é registrado com flag `pending` (não está pronto para consumo)
2. No `repository.save()`: após persistir no banco, o repositório muda a flag para `ready`
3. Subscribers só consomem eventos com flag `ready`

Isso garante que efeitos colaterais (notificações, emails, etc.) só acontecem quando temos certeza absoluta de que o processo principal foi concluído com sucesso.

## Fluxo completo resumido pelo Diego

```
Answer.create() → registra evento (pending)
    ↓
AnswerQuestionUseCase processa lógica
    ↓
answersRepository.create(answer) → persiste no banco
    ↓
Repositório marca eventos como ready → dispara subscribers
    ↓
OnAnswerCreated subscriber → SendNotificationUseCase
```

## Quando essa abordagem brilha

- Múltiplos subdomínios precisam reagir à mesma ação
- O sistema de efeitos colaterais pode ser removido/terceirizado sem impacto
- Novos casos de uso que criam a mesma entidade automaticamente disparam todos os eventos
- Garantia de consistência: efeitos só acontecem após persistência confirmada