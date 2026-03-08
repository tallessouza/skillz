---
name: rs-clean-code-exemplo-pratico-de-ddd
description: "Enforces Domain-Driven Design structure when organizing Node.js/TypeScript projects. Use when user asks to 'create entities', 'organize domain', 'structure project folders', 'implement use cases', 'design domain model', or starts a new backend project. Applies rules: code independent of database, entities reflect business domain not DB tables, same real-world concept becomes different entities per subdomain, use cases as single-method classes. Make sure to use this skill whenever structuring backend domain logic or creating entities. Not for database schema design, ORM configuration, or frontend component architecture."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: ddd-pratico
  tags: [ddd, domain-driven-design, entities, use-cases, subdomains, typescript, backend]
---

# Exemplo Pratico de DDD

> Estruture o codigo como representacao do mundo real, nao como reflexo do banco de dados.

## Rules

1. **Codigo desconexo do banco de dados** — entidades no codigo representam conceitos de negocio, nao tabelas do banco, porque o banco e apenas uma camada de persistencia
2. **Entidades diferentes por subdominio** — a mesma entidade do mundo real (ex: cliente) vira entidades distintas em subdominios diferentes (Customer em compras, Recipient em logistica), porque cada contexto precisa de dados diferentes
3. **Aplicacao funciona sem dependencia externa** — regras de negocio devem funcionar sem banco de dados, sem rotas, sem framework, validaveis apenas com testes automatizados
4. **Casos de uso como classes com metodo unico** — cada caso de uso e uma classe com um metodo execute (geralmente async), recebendo request tipada e retornando response opcional
5. **Estrutura de pastas reflete dominios, nao tecnologia** — organize por `domain/purchases/`, `domain/logistics/`, nao por `controllers/`, `models/`, `services/`
6. **Entidades existem independentemente** — pergunte "esta entidade depende da outra para existir?" para definir relacionamentos (Customer existe antes de Order, entao Order referencia Customer por ID)

## How to write

### Estrutura de pastas por dominio

```
src/
├── domain/
│   ├── purchases/        # Subdominio de compras
│   │   ├── customer.ts
│   │   └── order.ts
│   ├── logistics/        # Subdominio de logistica
│   │   └── recipient.ts
│   └── use-cases/
│       └── submit-order.ts
```

### Entidade de dominio (sem dependencia de banco)

```typescript
export class Customer {
  public name: string
  public email: string

  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
}
```

### Mesma entidade real, subdominios diferentes

```typescript
// domain/purchases/customer.ts — contexto de compras
export class Customer {
  public name: string
  public email: string
  public document: string // CPF

  constructor(name: string, email: string, document: string) {
    this.name = name
    this.email = email
    this.document = document
  }
}

// domain/logistics/recipient.ts — contexto de logistica
export class Recipient {
  public street: string
  public number: number
  public zipCode: string

  constructor(street: string, number: number, zipCode: string) {
    this.street = street
    this.number = number
    this.zipCode = zipCode
  }
}
```

### Caso de uso como classe

```typescript
interface SubmitOrderRequest {
  customerDocument: string
  total: number
}

export class SubmitOrder {
  async execute({ customerDocument, total }: SubmitOrderRequest): Promise<void> {
    const order = new Order(total, new Date(), customerDocument)
    // Regras de negocio aqui (ex: verificar se cliente tem endereco)
    // Persistencia viria depois, injetada via interface
  }
}
```

## Example

**Before (estrutura acoplada ao banco):**
```
src/
├── models/          # Espelho do banco
│   └── User.ts      # Tem name, email, street, zipCode (tudo junto)
├── controllers/
│   └── OrderController.ts
└── services/
    └── OrderService.ts
```

**After (estrutura por dominio):**
```
src/
├── domain/
│   ├── purchases/
│   │   ├── customer.ts    # name, email, document
│   │   └── order.ts       # total, createdAt, customerDocument
│   ├── logistics/
│   │   └── recipient.ts   # street, number, zipCode
│   └── use-cases/
│       └── submit-order.ts
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando nova entidade | Pergunte: "isso representa um conceito de negocio ou uma tabela?" |
| Entidade tem dados demais | Separe por subdominio — cada contexto usa campos diferentes |
| Referenciando outra entidade | Use apenas o ID/documento, nao a entidade inteira (a menos que estude aggregates) |
| Definindo relacionamento | Pergunte: "A depende de B para existir, ou pode existir antes?" |
| Tentando usar ORM primeiro | Pare — projete as entidades de dominio primeiro, banco vem depois |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Uma entidade User com todos os campos de todos os contextos | Customer (compras) + Recipient (logistica) separados |
| `models/` espelhando tabelas do banco | `domain/{subdominio}/` com entidades de negocio |
| Caso de uso como funcao solta | Classe com metodo `execute` tipado |
| Regras de negocio no controller/route | Regras de negocio no caso de uso |
| Projetar banco primeiro, codigo depois | Projetar dominio primeiro, banco e persistencia depois |

## Troubleshooting

### Entidades de subdominios diferentes ficam duplicando dados
**Symptom:** Customer e Recipient possuem campos identicos (nome, email) e parece redundante manter duas classes.
**Cause:** A separacao por subdominio parece desnecessaria quando os campos se sobrepoem, mas cada contexto evolui independentemente e pode ganhar campos especificos ao longo do tempo.
**Fix:** Mantenha as entidades separadas. Se a duplicacao incomoda, confirme que cada subdominio realmente precisa daqueles campos. A sobreposicao inicial e esperada — com o tempo, cada entidade diverge naturalmente.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-exemplo-pratico-de-ddd/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-exemplo-pratico-de-ddd/references/code-examples.md)
