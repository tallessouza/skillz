---
name: rs-clean-code-principios-de-ddd
description: "Applies Domain-Driven Design thinking when structuring backend applications. Use when user asks to 'design a system', 'create entities', 'model a domain', 'structure a backend', or 'name entities'. Enforces correct identification of domains, subdomains, entities, and use cases. Ensures context-specific entity naming instead of generic 'user' everywhere. Make sure to use this skill whenever designing or restructuring backend domain models. Not for infrastructure, deployment, frontend components, or database schema details."
---

# Princípios de DDD

> Antes de escrever código, identifique o domínio, subdomínios, entidades e casos de uso conversando com quem entende do problema.

## Rules

1. **DDD vem antes da arquitetura** — primeiro desenhe o domínio, depois escolha Clean Architecture, Ports & Adapters etc., porque arquitetura é como construir, DDD é o que construir
2. **Domínio é o problema, não o código** — domínio não vira pasta nem classe diretamente, é o contexto completo do problema que o software resolve
3. **Separe subdomínios por área de negócio** — logística, faturamento, pagamento, estoque são subdomínios distintos, porque cada um tem regras, entidades e vocabulário próprios
4. **Entidades são atores palpáveis do negócio** — identifique-as pela fala dos domain experts: substantivos recorrentes que transitam entre processos
5. **Casos de uso são ações entre entidades** — verbos que descrevem como entidades se relacionam: "emitir nota fiscal", "processar pedido"
6. **Nomeie entidades pelo contexto do subdomínio** — a mesma pessoa é `comprador` no checkout, `destinatario` na logística, nunca apenas `user`, porque nomes genéricos escondem o papel real da entidade

## How to write

### Entidades com nomes contextuais

```typescript
// NO subdomínio de compras
class Comprador {
  readonly id: string
  readonly nome: string
  readonly email: string
}

// NO subdomínio de logística — mesma pessoa, nome diferente
class Destinatario {
  readonly id: string
  readonly nome: string
  readonly enderecoEntrega: Endereco
}

// NO subdomínio de faturamento
class ContribuinteFiscal {
  readonly id: string
  readonly cpfCnpj: string
  readonly inscricaoEstadual?: string
}
```

### Casos de uso como ações explícitas

```typescript
// Caso de uso identificado pela fala do domain expert:
// "pegar as ordens de pedido e emitir notas fiscais"
class EmitirNotaFiscal {
  execute(ordemDePedido: OrdemDePedido): NotaFiscal {
    // lógica do caso de uso
  }
}
```

## Example

**Before (genérico, sem DDD):**
```typescript
class User {
  id: string
  name: string
  email: string
  address: string
  cpf: string
}

class OrderService {
  process(user: User, items: any[]) { /* tudo misturado */ }
  ship(user: User, orderId: string) { /* quem é user aqui? */ }
  invoice(user: User, orderId: string) { /* e aqui? */ }
}
```

**After (com DDD aplicado):**
```typescript
// Subdomínio: Compras
class Comprador { id: string; nome: string; email: string }
class RealizarPedido { execute(comprador: Comprador, itens: ItemPedido[]): Pedido {} }

// Subdomínio: Logística
class Destinatario { id: string; nome: string; endereco: Endereco }
class DespacharEncomenda { execute(pedido: Pedido, destinatario: Destinatario): Rastreio {} }

// Subdomínio: Faturamento
class ContribuinteFiscal { id: string; cpfCnpj: string }
class EmitirNotaFiscal { execute(pedido: Pedido, contribuinte: ContribuinteFiscal): NotaFiscal {} }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Começando projeto novo | Identifique domínio e subdomínios antes de criar qualquer arquivo |
| Entidade chamada "User" | Pergunte: qual o papel dessa pessoa NESTE subdomínio? Renomeie |
| Classe com muitos métodos desconexos | Provavelmente mistura subdomínios — separe |
| Domain expert usa um termo específico | Use exatamente esse termo no código, não traduza para jargão técnico |
| Não sabe como modelar | Converse com domain experts — identifique substantivos (entidades) e verbos (casos de uso) |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `class User` (genérico em todo lugar) | `Comprador`, `Destinatario`, `Instrutor` (pelo papel no subdomínio) |
| `class OrderService` (god service) | `RealizarPedido`, `EmitirNotaFiscal` (um caso de uso por classe) |
| `function processData(data)` | `function emitirNotaFiscal(ordemDePedido)` (ação + entidade do domínio) |
| Modelar domínio pela estrutura do banco | Modelar domínio pela conversa com domain experts |
| Começar pela arquitetura de pastas | Começar pelo desenho do domínio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
