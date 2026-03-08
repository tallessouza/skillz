---
name: rs-full-stack-formatando-a-moeda
description: "Applies Brazilian Real (BRL) currency formatting to input fields using toLocaleString. Use when user asks to 'format currency', 'format money input', 'mask input as BRL', 'Brazilian Real formatting', or 'format price field'. Converts raw digits to centavos then formats with pt-BR locale and BRL currency style. Make sure to use this skill whenever formatting monetary values in Brazilian Portuguese applications. Not for date formatting, number formatting without currency, or international currency beyond BRL."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, currency, brl, toLocaleString, formatting, input-mask]
---

# Formatando Moeda BRL em Inputs

> Formate valores monetarios convertendo digitos brutos para centavos e aplicando toLocaleString com pt-BR e BRL.

## Rules

1. **Converta para centavos antes de formatar** — divida o valor numerico por 100, porque o usuario digita digitos sequenciais (ex: 150 → 1,50) e a divisao posiciona os centavos corretamente
2. **Use toLocaleString com locale e options** — `Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`, porque garante formatacao padrao com separadores e simbolo corretos
3. **Remova caracteres nao-numericos antes de processar** — limpe o valor do input com replace antes de converter, porque o campo pode conter simbolos da formatacao anterior
4. **Reaprovite a variavel do parametro** — atualize a propria variavel recebida ao inves de criar novas, porque reduz complexidade em funcoes de transformacao simples
5. **Extraia a formatacao em funcao separada** — crie `formatCurrencyBRL(value)` reutilizavel, porque outros inputs monetarios do projeto vao precisar da mesma logica

## How to write

### Funcao de formatacao

```javascript
function formatCurrencyBRL(value) {
  // Transforma o valor em centavos (ex: 150 / 100 = 1.50)
  value = Number(value) / 100

  // Formata o valor no padrao BRL
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado
  return value
}
```

### Event listener no input

```javascript
inputAmount.addEventListener("input", (event) => {
  // Obtem o valor atual e remove caracteres nao-numericos
  let value = event.target.value.replace(/\D/g, "")

  // Atualiza o input com o valor formatado
  event.target.value = formatCurrencyBRL(value)
})
```

## Example

**Before (sem formatacao):**
```javascript
// Usuario digita 15000 → input mostra "15000"
inputAmount.addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "")
})
```

**After (com formatacao BRL):**
```javascript
// Usuario digita 15000 → input mostra "R$ 150,00"
inputAmount.addEventListener("input", (event) => {
  let value = event.target.value.replace(/\D/g, "")
  event.target.value = formatCurrencyBRL(value)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input de valor monetario em formulario | Aplique formatCurrencyBRL no evento input |
| Exibicao de preco vindo da API | Use toLocaleString direto (sem divisao por 100 se ja em reais) |
| Valor ja em centavos (ex: Stripe) | Divida por 100 antes de formatar |
| Placeholder do input monetario | Inclua "R$" no placeholder para consistencia visual |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `value.toFixed(2)` para exibir moeda | `value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })` |
| Concatenar `"R$ " + value` manualmente | Usar toLocaleString que insere o simbolo automaticamente |
| Formatar sem converter centavos primeiro | `Number(value) / 100` antes de formatar |
| Criar regex custom para separar milhares | Usar toLocaleString que faz isso nativamente |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Input mostra `NaN` apos digitar | Valor nao-numerico nao foi limpo antes de converter | Aplique `.replace(/\D/g, "")` antes de `Number(value)` |
| Valor formatado mostra `R$ 0,00` ao digitar | Evento errado ou value vazio | Verifique que o evento `input` esta correto e value nao e string vazia |
| Centavos nao aparecem corretamente | Divisao por 100 nao aplicada | Garanta `Number(value) / 100` antes de `toLocaleString` |
| Cursor pula para o final do input | Formatacao reescreve o valor inteiro | Isso e esperado com mascaras simples; use biblioteca de mask para cursor control |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre conversao de centavos, toLocaleString e fluxo de dados no input
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes