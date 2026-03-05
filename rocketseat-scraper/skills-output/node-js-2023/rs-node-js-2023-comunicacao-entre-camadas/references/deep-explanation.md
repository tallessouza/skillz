# Deep Explanation: Comunicacao entre Camadas

## O trade-off do @Injectable nos use cases

O instrutor Diego apresenta duas alternativas para resolver o problema de use cases do dominio que nao possuem `@Injectable`:

### Alternativa 1: @Injectable direto no use case (RECOMENDADA)

Coloca-se o `@Injectable()` do NestJS diretamente na classe do use case, mesmo estando na camada de dominio.

**Por que e "ruim" em teoria:** Viola a Clean Architecture porque adiciona codigo de framework (NestJS) dentro da camada de dominio, que nao deveria depender de camadas externas.

**Por que e aceitavel na pratica:** O decorator `@Injectable()` nao modifica o comportamento da classe. Se voce rodar os testes unitarios, nenhum teste vai falhar. Nao e como se estivesse "massacrando" a arquitetura limpa. E um trade-off que vale a pena — suja levemente a camada de dominio em troca de simplicidade.

O instrutor menciona que projetos reais da Rocketseat (como o "Pluto", sistema de compras) usam essa abordagem nos use cases.

### Alternativa 2: Wrapper na camada de infra (NAO RECOMENDADA)

Criar uma classe wrapper como `NestCreateQuestionUseCase` que estende o use case original:

```typescript
@Injectable()
class NestCreateQuestionUseCase extends CreateQuestionUseCase {
  constructor(questionsRepository: QuestionsRepository) {
    super(questionsRepository)
  }
}
```

**Problema:** Voce teria que criar um arquivo desse para CADA use case da aplicacao. Codigo repetitivo e desnecessario.

## Por que abstract class e nao interface

O NestJS resolve dependencias em RUNTIME (JavaScript). Interfaces TypeScript sao eliminadas durante o build — elas simplesmente nao existem no JavaScript final. Quando o container de DI do Nest tenta resolver a dependencia, a referencia da interface nao existe.

Classes abstratas, por outro lado, existem como classes reais no JavaScript compilado, entao o Nest consegue usa-las como tokens de injecao.

## O padrao provide/useClass

Quando voce usa uma classe abstrata como dependencia, precisa dizer ao Nest qual implementacao concreta usar:

```typescript
{
  provide: QuestionsRepository,        // "quando alguem pedir isso..."
  useClass: PrismaQuestionsRepository, // "...entregue isso"
}
```

Isso e o que conecta o dominio a infraestrutura sem que o dominio saiba da implementacao concreta.

## Fluxo completo da requisicao

1. Chamada HTTP chega ao controller
2. Controller valida os dados e chama o use case
3. Use case usa entidades de dominio (Question, Attachment) e chama o repositorio abstrato
4. O Nest injeta o PrismaQuestionsRepository no lugar do QuestionsRepository
5. PrismaQuestionsRepository usa o mapper para converter entidade de dominio para entidade de persistencia (Prisma)
6. Dado e salvo no banco
7. Controller devolve a resposta HTTP (201 Created)

## Opiniao do instrutor sobre o DI do NestJS

Diego menciona que a parte de injecao de dependencia e o que ele MENOS gosta no NestJS — acha que o framework torna as coisas mais complicadas do que deveriam ser com essa automatizacao. Mas reconhece que sao coisas que se aprende com o tempo.