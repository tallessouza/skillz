---
name: 2023-entendendo-as-camadas
description: "Organizes NestJS code into Clean Architecture layers: infrastructure (controllers, Prisma), adapters (presenters, gateways, repositories), application (use cases), and domain (entities). Use when user asks to 'organize NestJS layers', 'separate controller from business logic', 'implement Clean Architecture', or 'create a presenter'. Make sure to use this skill whenever structuring a NestJS application with proper layer separation or deciding where to place a new file. Not for Fastify projects, frontend architecture, or microservice orchestration."
category: coding-lens
tags: [cache, entities, nestjs, prisma, repository, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: clean-architecture
  tags: [clean-architecture, nestjs, camadas, controller, use-case, presenter, gateway, repository]
---

# Clean Architecture no NestJS — Camadas

> Organize cada arquivo do NestJS na camada correta da Clean Architecture: infraestrutura (externa), adaptadores, aplicacao (use cases) e dominio (entidades).

## Rules

1. **Requisicao HTTP entra pela camada mais externa** — Controllers ficam na camada de infraestrutura, porque recebem input externo diretamente
2. **Controllers nunca contem logica de negocio** — eles delegam para Use Cases, porque a responsabilidade do controller e apenas receber e responder
3. **Use Cases orquestram a logica** — ficam na camada de aplicacao, podem chamar entidades E repositorios, porque representam um fluxo completo de negocio
4. **Entidades ficam na camada mais interna** — representam o dominio puro, sem dependencia de framework ou infraestrutura
5. **Presenters adaptam a saida** — transformam dados internos (entidades) no formato que a camada HTTP precisa retornar, porque nem todos os campos devem ser expostos
6. **Gateways adaptam a entrada de servicos externos** — email, APIs externas, qualquer coisa que nao e controller usa gateway para inversao de dependencia
7. **Repositorios sao gateways para banco de dados** — o ORM (Prisma) fica na camada mais externa, o repositorio adapta para as camadas internas

## Mapa de Camadas

| Camada | Elementos | Responsabilidade |
|--------|-----------|-----------------|
| **Externa (Infra)** | Prisma, HTTP, APIs externas, dispositivos | Comunicacao com mundo externo |
| **Adaptadores** | Controllers, Presenters, Gateways, Repositories | Traduzem externo ↔ interno |
| **Aplicacao** | Use Cases | Orquestram fluxos de negocio |
| **Dominio** | Entities, Value Objects | Regras de negocio puras |

## Fluxo de uma Requisicao

```
HTTP Request
  → Controller (infra)
    → Use Case (aplicacao)
      → Entity (dominio)
      → Repository (adaptador → Prisma/DB)
    ← Use Case retorna dados
  ← Presenter adapta resposta
HTTP Response
```

## Estrutura de Pastas no NestJS

```
src/
├── infra/                    # Camada externa
│   ├── http/
│   │   ├── controllers/      # Recebem requisicoes HTTP
│   │   └── presenters/       # Adaptam resposta para HTTP
│   ├── database/
│   │   └── prisma/           # ORM, camada mais externa
│   └── gateways/             # Adaptadores de servicos externos
├── domain/                   # Camada interna
│   ├── entities/             # Entidades de dominio
│   └── value-objects/        # Objetos de valor
└── application/              # Camada de aplicacao
    ├── use-cases/            # Casos de uso
    └── repositories/         # Interfaces (contratos) dos repositorios
```

## Example

**Before (tudo misturado no controller):**
```typescript
@Controller('/users')
export class UsersController {
  @Get()
  async list() {
    const users = await this.prisma.user.findMany()
    return users // expoe todos os campos, incluindo senha
  }
}
```

**After (com camadas separadas):**
```typescript
// infra/http/controllers/users.controller.ts
@Controller('/users')
export class UsersController {
  constructor(private listUsers: ListUsersUseCase) {}

  @Get()
  async list() {
    const users = await this.listUsers.execute()
    return users.map(UserPresenter.toHTTP)
  }
}

// application/use-cases/list-users.ts
export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    return this.usersRepository.findAll()
  }
}

// infra/http/presenters/user-presenter.ts
export class UserPresenter {
  static toHTTP(user: User) {
    return { id: user.id, name: user.name, email: user.email }
    // senha NAO e retornada
  }
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Preciso buscar dados no banco dentro de um use case | Use case chama interface do repositorio, implementacao fica na infra |
| Preciso enviar email apos criar usuario | Crie um gateway de email, injete no use case via interface |
| Controller esta com logica de negocio | Extraia para um use case |
| Resposta da API expoe campos demais | Crie um Presenter que filtra os campos |
| Servico externo (API, fila, cache) | Adapte com Gateway, nunca acesse direto do use case |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| Chamar Prisma direto no controller | Controller → Use Case → Repository → Prisma |
| Retornar entidade completa na resposta HTTP | Use Presenter para filtrar campos |
| Colocar regra de negocio no controller | Mova para Use Case ou Entity |
| Importar ORM dentro da camada de dominio | Dominio nao conhece infraestrutura |
| Acessar API externa direto no use case | Crie Gateway com interface + implementacao |

## Troubleshooting

### Controller contem logica de negocio e acessa Prisma diretamente
**Symptom:** Controller faz queries ao banco, valida regras e retorna entidade completa com campos sensiveis
**Cause:** Violacao de camadas — controller assumiu responsabilidade de use case e repositorio
**Fix:** Extraia a logica para um Use Case, crie um Repository para acesso a dados e um Presenter para filtrar a resposta

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
