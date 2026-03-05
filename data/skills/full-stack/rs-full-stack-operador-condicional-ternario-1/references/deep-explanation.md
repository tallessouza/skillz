# Deep Explanation: Operador Condicional Ternário

## Por que "ternário"?

O instrutor enfatiza: chama-se ternário porque tem **três etapas** (do latim "ternarius" = grupo de três):

1. **Condição** — o teste lógico (`age >= 18`)
2. **Se verdadeiro** — o valor após o `?`
3. **Se falso** — o valor após o `:`

Essa estrutura é **rígida**. Se você inverter `?` e `:`, o JavaScript não reconhece a estrutura e acusa erro de sintaxe. Diferente de um `if/else` onde a ordem das keywords é mais flexível visualmente, o ternário exige exatamente: `condição ? verdadeiro : falso`.

## Modelo mental: é uma expressão, não um statement

A diferença fundamental entre ternário e `if/else`:

- **`if/else`** é um statement — controla fluxo, não produz valor
- **Ternário** é uma expressão — sempre produz um valor

Isso significa que o ternário pode ser usado dentro de:
- Atribuições: `const x = condition ? a : b`
- Template literals: `` `Status: ${isActive ? 'ativo' : 'inativo'}` ``
- Argumentos de função: `console.log(age >= 18 ? 'sim' : 'não')`
- JSX: `{isLoading ? <Spinner /> : <Content />}`

Mas **não** deve ser usado para executar side effects, porque o propósito é retornar um valor, não controlar o que acontece.

## Insight do instrutor: inversão de lógica

O instrutor demonstra que você pode inverter a condição e trocar os resultados:

```javascript
// Versão 1: verificar se PODE
age >= 18 ? "Pode dirigir" : "Não pode dirigir"

// Versão 2: verificar se NÃO PODE (invertido)
age < 18 ? "Não pode dirigir" : "Pode dirigir"
```

Ambas produzem o mesmo resultado. A escolha depende de qual leitura é mais natural para o contexto. Prefira a versão positiva (verificar se PODE) porque é mais fácil de ler.

## Quando o ternário brilha vs. quando atrapalha

### Brilha
- Atribuição condicional simples
- Valores default inline
- Renderização condicional em JSX/templates

### Atrapalha
- Lógica com mais de 2 branches (ternários aninhados são ilegíveis)
- Quando cada branch executa side effects diferentes
- Quando a condição é muito complexa (múltiplos `&&` e `||`)

## Operadores lógicos dentro do ternário

O instrutor menciona que todos os operadores lógicos podem ser usados na condição:
- Comparação: `>`, `<`, `>=`, `<=`, `===`, `!==`
- Lógicos: `&&`, `||`, `!`
- Combinações: `age >= 18 && hasLicense`

A condição do ternário é avaliada como qualquer expressão booleana em JavaScript — as mesmas regras de truthy/falsy se aplicam.

## Edge case: precedência de operadores

O ternário tem precedência muito baixa. Em expressões complexas, use parênteses:

```javascript
// Ambíguo
const result = a + b ? "yes" : "no"
// Claro
const result = (a + b) ? "yes" : "no"
```