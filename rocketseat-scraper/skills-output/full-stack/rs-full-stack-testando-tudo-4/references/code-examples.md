# Code Examples: Teste Manual de Aplicacao Frontend

## Contexto da aplicacao testada

A aplicacao e um conversor de moedas com:
- Input numerico (bloqueia letras)
- Select com opcoes: Dolar, Euro, Libra
- Botao "Converter"
- Exibicao: simbolo da moeda, cotacao formatada, total em reais

## Validacao de input que foi testada

```html
<input type="number" id="amount" placeholder="Digite o valor" />
```

```javascript
// Alternativa com event listener para bloquear letras
input.addEventListener("keypress", (event) => {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault()
  }
})
```

## Formatacao que foi verificada nos testes

```javascript
// Cotacao formatada (ex: 4.87 para dolar)
const cotacaoFormatada = cotacao.toFixed(2)

// Total formatado com separador de milhar (ex: R$ 3.409,00)
const totalFormatado = total.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
})
```

## Cenarios testados na aula

### Cenario 1: Dolar com valor 700
```
Input: 700
Moeda: Dolar ($)
Cotacao exibida: 4.87
Total exibido: R$ 3.409,00
```

### Cenario 2: Dolar com valor 350
```
Input: 350
Moeda: Dolar ($)
Cotacao exibida: 4.87
Total exibido: R$ 1.704,50
Verificacao: total atualizou, simbolo manteve (mesma moeda)
```

### Cenario 3: Euro com valor 350
```
Input: 350
Moeda: Euro (€)
Cotacao exibida: [valor do euro]
Total exibido: [valor atualizado em reais]
Verificacao: simbolo mudou, cotacao mudou, total mudou
```

### Cenario 4: Libra com valor 425
```
Input: 425
Moeda: Libra (£)
Cotacao exibida: [valor da libra]
Total exibido: [valor atualizado em reais]
Verificacao: todos os campos atualizaram corretamente
```

## Checklist automatizavel (para futuro)

```javascript
// Se quiser automatizar estes testes com Playwright/Cypress:
describe("Conversor de Moedas", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("bloqueia input de letras", () => {
    cy.get("#amount").type("abc")
    cy.get("#amount").should("have.value", "")
  })

  it("converte dolar corretamente", () => {
    cy.get("#amount").type("700")
    cy.get("#currency").select("USD")
    cy.get("#convert-btn").click()
    cy.get("#result").should("contain", "$")
    cy.get("#total").should("contain", "R$")
  })

  it("atualiza ao trocar moeda", () => {
    cy.get("#amount").type("350")
    cy.get("#currency").select("USD")
    cy.get("#convert-btn").click()
    cy.get("#result").then(($el) => {
      const dolarResult = $el.text()
      cy.get("#currency").select("EUR")
      cy.get("#convert-btn").click()
      cy.get("#result").should("not.contain", dolarResult)
    })
  })
})
```