# Code Examples: SOLID na Pratica

## Exemplo 1: Codigo SEM SOLID (ponto de partida)

```typescript
// Tipos de pagamento
type PaymentMethodType = 'billet' | 'credit' | 'debit'

class CalculateOrderDiscount {
  execute(amount: number, paymentMethod: string, installments: number) {
    if (paymentMethod === 'billet') {
      return amount * 0.05
    }

    if (paymentMethod === 'credit') {
      if (installments === 1) {
        return amount * 0.05
      }
      if (installments <= 6) {
        return amount * 0.02
      }
      return 0
    }

    if (paymentMethod === 'debit') {
      return amount * 0.05
    }

    return 0
  }
}
```

### Problemas identificados:
- `installments` e recebido mesmo quando irrelevante (boleto, debito)
- Novo meio de pagamento = novo `if` = modificacao da classe
- Logica de cada meio de pagamento misturada num unico metodo

## Exemplo 2: Separacao de responsabilidades (SRP)

```typescript
// Cada servico tem UMA responsabilidade
class CalculateOrderDiscount {
  execute() { /* calcula desconto */ }
}

class SubmitOrderInvoice {
  execute() { /* emite nota fiscal */ }
}

// Caso de uso orquestra
class CreateOrder {
  // Usa CalculateOrderDiscount + SubmitOrderInvoice
  // Mas cada um faz so uma coisa
}
```

## Exemplo 3: Interface + implementacoes (OCP + LSP)

```typescript
interface PaymentMethod {
  getDiscountAmount(amount: number): number
}

class Billet implements PaymentMethod {
  getDiscountAmount(amount: number): number {
    return amount * 0.10 // 10% desconto no boleto
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
    return amount * 0.05 // 5% desconto no debito
  }
}

// Extensao: novo meio sem modificar nada existente
class Pix implements PaymentMethod {
  getDiscountAmount(amount: number): number {
    return amount * 0.20 // 20% desconto no Pix
  }
}
```

## Exemplo 4: Injecao de dependencia no metodo (DIP)

```typescript
class CalculateOrderDiscount {
  execute(amount: number, paymentMethod: PaymentMethod): number {
    return paymentMethod.getDiscountAmount(amount)
  }
}

// Uso
const calc = new CalculateOrderDiscount()
calc.execute(2000, new Debit())    // 100
calc.execute(2000, new Billet())   // 200
calc.execute(2000, new Credit(6))  // 40
```

## Exemplo 5: Injecao de dependencia no construtor (DIP melhorado)

```typescript
class CalculateOrderDiscount {
  private paymentMethod: PaymentMethod

  constructor(paymentMethod: PaymentMethod) {
    this.paymentMethod = paymentMethod
  }

  execute(amount: number): number {
    return this.paymentMethod.getDiscountAmount(amount)
  }
}

// Uso — dependencia definida na criacao
const discountCalc = new CalculateOrderDiscount(new Credit(6))
discountCalc.execute(2000) // 40
discountCalc.execute(500)  // 10

// Facil trocar a dependencia
const pixCalc = new CalculateOrderDiscount(new Pix())
pixCalc.execute(2000) // 400
```

## Exemplo 6: Interface Segregation (ISP)

```typescript
// Interface especifica para cartoes
interface Card {
  number: number
  cvv: number
  expiration: number
}

// Interface para meios de pagamento
interface PaymentMethod {
  getDiscountAmount(amount: number): number
}

// Credit implementa AMBAS
class Credit implements PaymentMethod, Card {
  number: number
  cvv: number
  expiration: number

  constructor(private installments: number) {}

  getDiscountAmount(amount: number): number {
    if (this.installments === 1) return amount * 0.05
    if (this.installments <= 6) return amount * 0.02
    return 0
  }
}

// Debit tambem implementa ambas
class Debit implements PaymentMethod, Card {
  number: number
  cvv: number
  expiration: number

  getDiscountAmount(amount: number): number {
    return amount * 0.05
  }
}

// Billet e Pix NAO implementam Card
class Billet implements PaymentMethod {
  getDiscountAmount(amount: number): number {
    return amount * 0.10
  }
}

class Pix implements PaymentMethod {
  getDiscountAmount(amount: number): number {
    return amount * 0.20
  }
}
```

## Evolucao completa: antes vs depois

### ANTES (1 arquivo, tudo acoplado):
```typescript
class CalculateOrderDiscount {
  execute(amount: number, paymentMethod: string, installments: number) {
    if (paymentMethod === 'billet') return amount * 0.05
    if (paymentMethod === 'credit') {
      if (installments === 1) return amount * 0.05
      if (installments <= 6) return amount * 0.02
      return 0
    }
    if (paymentMethod === 'debit') return amount * 0.05
    return 0
  }
}

const calc = new CalculateOrderDiscount()
calc.execute(2000, 'credit', 6)
```

### DEPOIS (SOLID aplicado):
```typescript
// payment-method.ts
interface PaymentMethod {
  getDiscountAmount(amount: number): number
}

// billet.ts
class Billet implements PaymentMethod {
  getDiscountAmount(amount: number) { return amount * 0.10 }
}

// credit.ts
class Credit implements PaymentMethod {
  constructor(private installments: number) {}
  getDiscountAmount(amount: number) {
    if (this.installments === 1) return amount * 0.05
    if (this.installments <= 6) return amount * 0.02
    return 0
  }
}

// calculate-order-discount.ts
class CalculateOrderDiscount {
  constructor(private paymentMethod: PaymentMethod) {}
  execute(amount: number) {
    return this.paymentMethod.getDiscountAmount(amount)
  }
}

// uso
new CalculateOrderDiscount(new Credit(6)).execute(2000)
```