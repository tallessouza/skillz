# Deep Explanation: Disparando Eventos de Domínio

## Por que disparar eventos nos repositórios Prisma?

Na Clean Architecture, os eventos de domínio são registrados nas entidades (aggregates) quando algo significativo acontece — por exemplo, quando uma `Answer` é criada, um evento `AnswerCreatedEvent` é adicionado à lista de eventos pendentes do aggregate. Porém, esses eventos só devem ser efetivamente despachados **após a persistência bem-sucedida**.

O repositório Prisma é o ponto ideal para o dispatch porque:
1. É onde a persistência realmente acontece (não no use case)
2. Garante que eventos só disparam após o dado estar salvo
3. Mantém o use case desacoplado da infraestrutura de eventos

## Por que dispatch no `create` E no `save`?

O instrutor enfatiza que ambos os métodos precisam do dispatch:
- **`create`**: Quando uma nova `Answer` é criada, o evento `AnswerCreatedEvent` precisa ser disparado para enviar notificações
- **`save`**: Quando uma `Question` é atualizada (ex: seleção de melhor resposta via `save`), o evento `QuestionBestAnswerChosenEvent` precisa ser disparado

Se colocar apenas no `create`, a seleção de melhor resposta nunca dispararia o evento, porque ela usa `save` (update).

## O problema dos testes E2E sem controle

Quando o dispatch é adicionado nos repositórios Prisma, **todos** os testes E2E passam a disparar eventos de domínio. Isso causa problemas:

1. **Testes de controller ficam acoplados a subscribers**: Um teste que só quer validar "criar resposta retorna 201" acaba disparando o subscriber de notificação
2. **Side effects indesejados**: Subscribers podem falhar por falta de dependências configuradas no contexto do teste
3. **Testes lentos e frágeis**: Mais código executando = mais chance de falha por razões não relacionadas ao que está sendo testado

## A solução elegante: `shouldRun` estático

O instrutor cria uma propriedade estática `shouldRun` na classe `DomainEvents`. A elegância está em:

1. **É um toggle global simples** — uma propriedade estática que qualquer teste pode controlar
2. **Default `true`** — em produção e em testes unitários, eventos funcionam normalmente
3. **Setup E2E seta `false`** — nenhum teste de controller dispara eventos
4. **Testes de evento setam `true`** — apenas os testes específicos reativam

Isso é superior a alternativas como:
- `process.env.NODE_ENV` — muito grosseiro, não permite controle por teste
- Mocks do `DomainEvents` — mais complexo e pode esconder bugs
- Conditional dispatch no repositório — viola separação de responsabilidades

## Fluxo de execução dos testes

```
setup-e2e.ts (beforeAll) → DomainEvents.shouldRun = false
  │
  ├── create-answer.controller.e2e-spec.ts
  │     → Cria answer → Repositório chama dispatch → shouldRun=false → NOOP
  │     → Testa apenas o HTTP response ✓
  │
  ├── on-answer-created.e2e-spec.ts (beforeAll → shouldRun = true)
  │     → Cria answer → Repositório chama dispatch → shouldRun=true → EXECUTA
  │     → Verifica se notificação foi criada ✓
  │
  └── on-question-best-answer-chosen.e2e-spec.ts (beforeAll → shouldRun = true)
        → Choose best answer → Repositório chama dispatch → shouldRun=true → EXECUTA
        → Verifica se notificação foi criada ✓
```

## O dispatch é síncrono

O instrutor explica que `dispatchEventsForAggregate` não retorna uma Promise — é uma execução síncrona. Por isso não deve ser colocado dentro de `Promise.all`. O dispatch percorre a lista de handlers registrados e os executa, mas o mecanismo em si é síncrono (os handlers podem ser assíncronos internamente, mas o dispatch não aguarda).

## Padrão de teste E2E para eventos

O instrutor segue um padrão consistente para testes de eventos:
1. Copiar a estrutura do teste do controller correspondente (setup, autenticação, ação HTTP)
2. Remover assertions sobre o HTTP response (não é o foco)
3. Usar `waitFor` para aguardar o efeito assíncrono do subscriber
4. Verificar no banco se o side effect aconteceu (ex: notificação existe)