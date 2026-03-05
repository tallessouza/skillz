# Deep Explanation: Listando Perguntas Recentes

## Por que as entidades vazam com formato estranho?

O instrutor mostra na pratica o que acontece quando voce retorna entidades de dominio diretamente do controller. A entidade `Question` internamente usa:

- `_id` em vez de `id` — porque a classe base `Entity` armazena o identificador como propriedade privada `_id`
- `props` — porque todos os campos da entidade ficam encapsulados dentro de um objeto `props` (pattern comum em DDD com TypeScript)
- `WatchedList` para attachments — uma estrutura interna que rastreia adicoes/remocoes, com campos como `currentItems`, `initial`, etc.
- `DomainEvents` — eventos de dominio anexados a entidade

Nenhum desses formatos faz sentido para o frontend. O frontend espera um JSON plano e previsivel.

## O papel do Presenter na Clean Architecture

O Presenter e um conceito da Clean Architecture que fica na **camada de infraestrutura** (junto com controllers, gateways, etc.). Seu papel e unico: **traduzir entidades de dominio para o formato que a camada de entrega (HTTP, GraphQL, CLI) espera.**

Diferente de um DTO (Data Transfer Object), o Presenter e unidirecional: dominio → HTTP. Ele nao valida entrada, apenas formata saida.

## O trade-off do @Injectable()

O instrutor menciona explicitamente que adicionar `@Injectable()` no UseCase "suja" a camada de dominio, porque introduz uma dependencia do NestJS (framework) dentro do dominio (regras de negocio). Porem, ele argumenta que:

1. E apenas um decorator — nao muda a logica
2. A alternativa seria criar factories ou adapters complexos
3. O ganho pratico de simplicidade supera a "pureza" arquitetural
4. Em projetos reais, esse tipo de pragmatismo e necessario

## Fluxo completo da requisicao

```
HTTP Request (GET /questions?page=1)
    ↓
Controller (FetchRecentQuestionsController)
    ↓ chama
UseCase (FetchRecentQuestionsUseCase)
    ↓ usa
Repository (QuestionsRepository → PrismaQuestionsRepository)
    ↓ retorna
Entidades de Dominio (Question[])
    ↓ volta para
Controller
    ↓ formata com
Presenter (QuestionPresenter.toHTTP)
    ↓
HTTP Response (JSON plano)
```

## Erro comum: esquecer o provider

O instrutor encontra um erro ao vivo porque esqueceu de registrar o `FetchRecentQuestionsUseCase` nos `providers` do `HttpModule`. Esse e um dos erros mais comuns ao trabalhar com NestJS + Clean Architecture:

- O controller referencia o UseCase no constructor
- O NestJS tenta injetar, mas nao encontra o provider
- Erro: `Nest can't resolve dependencies of FetchRecentQuestionsController`
- Solucao: adicionar o UseCase no array de `providers` do modulo

## Similaridade com o fluxo de criacao

O instrutor destaca que este fluxo e identico ao que ja foi feito para `CreateQuestion`:

1. Remover acesso direto ao Prisma do controller
2. Injetar o UseCase
3. Chamar `execute()` com os parametros necessarios
4. Registrar no modulo

A unica diferenca e que na listagem, o retorno e um array de entidades que precisa ser formatado (onde entra o Presenter), enquanto na criacao o retorno e mais simples.