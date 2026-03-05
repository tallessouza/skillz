---
name: rs-node-js-2023-clean-architecture
description: "Enforces Clean Architecture layer separation and dependency rules when structuring Node.js/TypeScript projects. Use when user asks to 'create a project structure', 'organize folders', 'separate concerns', 'implement use cases', or 'decouple infrastructure'. Applies dependency direction rules, layer protection via interface adapters, and infrastructure isolation. Make sure to use this skill whenever designing or reviewing application architecture with multiple layers. Not for UI component design, database queries, or specific framework configuration."
---

# Fundamentos de Clean Architecture

> Camadas internas nunca conhecem detalhes de implementacao das camadas externas — dependencias apontam sempre para dentro.

## Rules

1. **Dependencias apontam para dentro** — camadas internas importam de camadas mais internas ou delas mesmas, nunca de camadas externas, porque isso garante que o dominio sobrevive a troca de qualquer ferramenta
2. **Entidades nao importam nada** — a camada de entidades e a mais interna e nao depende de use cases, adapters ou infraestrutura, porque entidades representam regras de negocio puras
3. **Use cases importam apenas entidades** — um caso de uso pode importar entidades diretamente, mas nunca importa controllers, repositorios concretos ou frameworks, porque o caso de uso e a funcionalidade pura
4. **Interface adapters protegem o dominio** — a camada verde (adapters) converte dados do formato externo para o formato que use cases entendem, porque isso isola o dominio da infraestrutura
5. **Infraestrutura e substituivel** — trocar Postgres por Mongo, Express por Fastify, nao deve alterar nenhum codigo nas camadas de use cases ou entidades, porque estao desacopladas via contratos
6. **Nao existe estrutura de pastas obrigatoria** — Clean Architecture define regras de dependencia entre camadas, nao nomes de pastas, porque o conceito e o desacoplamento, nao a nomenclatura

## Camadas (de fora para dentro)

### Infraestrutura (azul)
```
Banco de dados, frameworks HTTP, cache, filas, UI
Tudo que a aplicacao NAO tem controle total
```

### Interface Adapters (verde)
```
Controllers — recebem requisicoes HTTP
Gateways — adaptam acesso a servicos externos
Presenters — formatam dados de saida
Repositorios (implementacao concreta)
```

### Use Cases (vermelha)
```typescript
// Caso de uso importa APENAS entidades e contratos
import { Answer } from '../entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute(input: AnswerQuestionInput): Promise<Answer> {
    const answer = Answer.create(input)
    await this.answerRepository.save(answer)
    return answer
  }
}
```

### Entities (amarela)
```typescript
// Entidade NAO importa nada de outras camadas
export class Answer {
  readonly id: string
  readonly content: string
  readonly authorId: string
  readonly questionId: string
  readonly createdAt: Date

  static create(props: AnswerProps): Answer {
    return new Answer(props)
  }
}
```

## Example

**Before (acoplado — use case depende de infraestrutura):**
```typescript
import { PrismaClient } from '@prisma/client'

export class AnswerQuestionUseCase {
  private prisma = new PrismaClient()

  async execute(input: Input) {
    // Use case conhece Prisma diretamente
    return this.prisma.answer.create({ data: input })
  }
}
```

**After (desacoplado — use case depende de contrato):**
```typescript
import { Answer } from '../entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute(input: Input) {
    const answer = Answer.create(input)
    await this.answerRepository.save(answer)
    return answer
  }
}
```

## Fluxo de uma requisicao

| Etapa | Camada | Direcao |
|-------|--------|---------|
| Request HTTP chega | Infraestrutura | → dentro |
| Controller recebe e adapta dados | Interface Adapters | → dentro |
| Use Case executa logica | Use Cases | → dentro |
| Entidade aplica regras de negocio | Entities | (mais interna) |
| Resposta volta pelo Presenter | Interface Adapters | ← fora |
| Response HTTP enviada | Infraestrutura | ← fora |

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando novo use case | Importe apenas entidades e contratos (interfaces de repositorio) |
| Criando repositorio concreto | Coloque na camada de infraestrutura, implemente o contrato da camada de dominio |
| Trocando banco de dados | Crie nova implementacao do repositorio, nao altere use cases |
| Trocando framework HTTP | Crie novos controllers, nao altere use cases nem entidades |
| Entidade precisa de dado externo | Passe como parametro via use case, nunca importe servico externo na entidade |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `import { PrismaClient } from '@prisma/client'` dentro de use case | Injete `AnswerRepository` (contrato) via constructor |
| Entidade importando use case | Entidade e pura, sem dependencias externas |
| Controller acessando banco diretamente | Controller chama use case, use case usa repositorio |
| Use case retornando Response HTTP | Use case retorna dados puros, presenter formata |
| Criar pastas fixas achando que isso e Clean Architecture | Respeitar direcao de dependencias entre camadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-fundamentos-de-clean-architecture/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-fundamentos-de-clean-architecture/references/code-examples.md)
