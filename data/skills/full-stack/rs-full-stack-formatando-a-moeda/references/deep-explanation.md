# Deep Explanation: Formatando Moeda BRL

## Por que dividir por 100 (logica dos centavos)

O instrutor explica um racional importante: quando o usuario digita em um input numerico, ele digita digitos sequenciais. Por exemplo, se quer digitar R$ 1,50, ele digita "1", "5", "0" — formando "150".

A divisao por 100 transforma esse numero bruto na representacao decimal correta:
- 150 / 100 = 1.50
- 1 / 100 = 0.01
- 15 / 100 = 0.15
- 150000 / 100 = 1500.00

Isso cria o efeito de "formatacao em tempo real" — conforme o usuario digita, os centavos vao se posicionando automaticamente.

## toLocaleString — como funciona

O metodo `toLocaleString` pertence ao prototipo de `Number` e aceita dois argumentos:

1. **locale** (string): Define a localidade. `"pt-BR"` define separador decimal como `,` e separador de milhar como `.`
2. **options** (objeto):
   - `style: "currency"` — indica que queremos formatacao monetaria
   - `currency: "BRL"` — define o codigo ISO 4217 da moeda (Brazilian Real)

O metodo retorna uma string formatada como `"R$ 1,50"` ou `"R$ 1.500,00"`.

## Fluxo completo do dado no input

```
Usuario digita "1" → remove nao-numericos → "1" → /100 → 0.01 → toLocaleString → "R$ 0,01"
Usuario digita "15" → remove nao-numericos → "15" → /100 → 0.15 → toLocaleString → "R$ 0,15"
Usuario digita "150" → remove nao-numericos → "150" → /100 → 1.50 → toLocaleString → "R$ 1,50"
```

Note que a cada digitacao, o valor anterior ja esta formatado com "R$", virgulas etc. Por isso e essencial o `replace(/\D/g, "")` — ele limpa TUDO que nao e digito antes de processar novamente.

## Reaproveitamento de variavel

O instrutor destaca como otimizacao de codigo: ao inves de criar `let formatted = ...`, ele reutiliza o proprio parametro `value`:

```javascript
function formatCurrencyBRL(value) {
  value = Number(value) / 100  // reutiliza value
  value = value.toLocaleString(...)  // reutiliza novamente
  return value
}
```

Isso e seguro porque:
- Parametros de funcao sao copias locais (para primitivos como string/number)
- A variavel original fora da funcao nao e afetada
- Reduz declaracoes desnecessarias em funcoes simples de transformacao

## Placeholder com R$

O instrutor adiciona "R$" ao placeholder do input no HTML para manter consistencia visual — quando o campo esta vazio, o usuario ja ve o formato esperado. Pequeno detalhe de UX que faz diferenca.