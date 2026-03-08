---
name: rs-clean-code-exemplo-pratico-de-solid
description: "Enforces SOLID principles when writing TypeScript/JavaScript classes and modules. Use when user asks to 'refactor code', 'apply SOLID', 'create a service', 'implement a use case', 'design classes', or 'separate responsibilities'. Applies interconnected SRP, OCP, LSP, DIP, and ISP through interfaces, dependency injection, and class segregation. Make sure to use this skill whenever creating classes, services, or use cases that handle multiple variants or payment/pricing logic. Not for folder structure, database design, or architecture decisions."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: solid-pratico
  tags: [solid, srp, ocp, lsp, dip, isp, typescript, dependency-injection, strategy-pattern]
---

# SOLID na Pratica

> Aplique os 5 principios SOLID como um sistema interconectado, nao como regras isoladas — cada principio reforça os outros.

## Rules

1. **Uma classe, uma responsabilidade (SRP)** — `CalculateOrderDiscount` so calcula desconto, `SubmitOrderInvoice` so emite nota, porque quando responsabilidades se misturam, mudanca em uma quebra a outra
2. **Aberta para extensao, fechada para modificacao (OCP)** — adicionar novo meio de pagamento NAO deve exigir modificar a classe original, porque cada `if` adicionado aumenta acoplamento e risco de regressao
3. **Substitua dependencias sem quebrar (LSP)** — qualquer classe que implemente `PaymentMethod` deve funcionar no lugar de outra sem erro, porque o chamador nao deve conhecer a implementacao concreta
4. **Inverta dependencias (DIP)** — quem chama injeta a dependencia, a classe nunca importa implementacoes concretas, porque isso desacopla modulos e facilita testes
5. **Segregue interfaces (ISP)** — separe `Card` de `PaymentMethod` ao inves de campos opcionais numa interface unica, porque interfaces gordas forcam implementacoes vazias
6. **Principios se conectam** — uma mesma linha de codigo pode justificar 3 principios simultaneamente, porque SOLID nao sao 5 regras separadas, sao um sistema coeso

## How to write

### Interface + implementacoes (OCP + LSP + DIP)

```typescript
interface PaymentMethod {
  getDiscountAmount(amount: number): number
}

class Billet implements PaymentMethod {
  getDiscountAmount(amount: number): number {
    return amount * 0.10
  }
}

class Credit implements PaymentMethod {
  constructor(private installments: number) {}

  getDiscountAmount(amount: number): number {
    if (this.installments === 1) return amount * 0.05
    if (this.installments <= 6) return amount * 0.02
    return 0
  }
}

class Debit implements PaymentMethod {
  getDiscountAmount(amount: number): number {
    return amount * 0.05
  }
}
```

### Servico desacoplado com injecao no construtor (DIP)

```typescript
class CalculateOrderDiscount {
  constructor(private paymentMethod: PaymentMethod) {}

  execute(amount: number): number {
    return this.paymentMethod.getDiscountAmount(amount)
  }
}

// Uso: quem chama decide a dependencia
const discount = new CalculateOrderDiscount(new Credit(6))
discount.execute(2000)
```

### Interface segregation (ISP)

```typescript
interface Card {
  number: number
  cvv: number
  expiration: number
}

// Credit e Debit estendem AMBAS interfaces
class Credit implements PaymentMethod, Card {
  number: number
  cvv: number
  expiration: number
  constructor(private installments: number) {}
  getDiscountAmount(amount: number): number { /* ... */ }
}

// Billet e Pix NAO implementam Card — nao precisam
```

## Example

**Before (violando OCP, SRP, DIP):**

```typescript
class CalculateOrderDiscount {
  execute(amount: number, paymentMethod: string, installments: number) {
    if (paymentMethod === 'billet') return amount * 0.10
    if (paymentMethod === 'credit') {
      if (installments === 1) return amount * 0.05
      if (installments <= 6) return amount * 0.02
      return 0
    }
    if (paymentMethod === 'debit') return amount * 0.05
    return 0
  }
}
```

**After (SOLID aplicado):**

```typescript
// Cada meio de pagamento e uma classe propria (SRP)
// Todas implementam PaymentMethod (LSP)
// Novo meio = nova classe, sem alterar existente (OCP)
// Dependencia injetada no construtor (DIP)
class CalculateOrderDiscount {
  constructor(private paymentMethod: PaymentMethod) {}
  execute(amount: number): number {
    return this.paymentMethod.getDiscountAmount(amount)
  }
}

const result = new CalculateOrderDiscount(new Pix()).execute(2000)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Classe recebe parametro que so uma variante usa (ex: `installments` no boleto) | Extraia para classe propria com interface |
| Adicionando `if/else` para nova variante | Crie nova classe que implementa a interface |
| Interface tem campos que nem todos implementam | Segregue em interfaces menores |
| Classe importa implementacoes concretas | Inverta: receba via construtor |
| Classe faz 2+ coisas (calcula e emite nota) | Separe em classes distintas |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `if (type === 'x') ... else if (type === 'y')` em cadeia | Classes por variante + interface |
| Parametros que so uma variante usa | Propriedade dentro da classe especifica |
| Interface com campos opcionais por variante | Interfaces segregadas |
| Classe que importa todas as implementacoes | Injecao de dependencia via construtor |
| Uma classe que calcula, valida e persiste | Uma classe por responsabilidade |

## Troubleshooting

### Nova implementacao da interface quebra em runtime mas compila sem erro
**Symptom:** Uma nova classe que implementa a interface compila corretamente, mas ao ser usada no lugar de outra implementacao, o comportamento e inesperado (ex: retorna undefined em vez de numero).
**Cause:** A interface define a assinatura dos metodos mas nao garante semantica. A nova implementacao pode retornar tipos corretos mas com logica errada (violando LSP).
**Fix:** Escreva testes unitarios para cada implementacao da interface validando o contrato esperado (ex: desconto nunca negativo, sempre menor que o valor original). Isso garante LSP em runtime, nao apenas em compilacao.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-exemplo-pratico-de-solid/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-exemplo-pratico-de-solid/references/code-examples.md)
