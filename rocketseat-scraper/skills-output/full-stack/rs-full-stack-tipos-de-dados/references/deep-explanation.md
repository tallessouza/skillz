# Deep Explanation: Tipos de Dados em JavaScript

## Por que tipos importam

O instrutor abre a aula com uma observacao pratica: quando voce faz um calculo matematico, voce precisa de numeros, nao de texto. Os tipos existem para que a linguagem (e o programador) saibam como operar sobre os dados. Sem tipos, o computador nao saberia se `1 + 1` deveria resultar em `2` (soma) ou `"11"` (concatenacao).

## Tipagem dinamica — o que significa na pratica

JavaScript e descrita como "linguagem dinamica com tipos dinamicos". Isso tem duas implicacoes:

1. **Na declaracao**: voce nao precisa dizer `let x: number = 5` — basta `let x = 5` e o JS infere que e numero
2. **Na reatribuicao**: voce pode fazer `x = "texto"` depois — o tipo muda junto com o valor

Em linguagens estaticamente tipadas (como Java, C#, TypeScript com strict), uma vez que voce declara o tipo, ele e fixo. JavaScript nao tem essa restricao.

### Analogia do copo (do instrutor)

> "Pensa no copo como uma variavel. Ele tem um unico objetivo: guardar o conteudo. Voce vai colocar agua? Refrigerante? O copo continua sendo o mesmo, mas o conteudo muda."

Essa analogia captura perfeitamente: a variavel (copo) e um container generico. O tipo (agua, refrigerante) vem do que voce coloca dentro. E voce pode trocar a qualquer momento.

**Limitacao da analogia**: na vida real, trocar agua por refrigerante no mesmo copo e inofensivo. No codigo, trocar `number` por `string` na mesma variavel pode causar bugs sutis de coercao que so aparecem em runtime.

## Os 5 tipos primitivos principais

### String
- Representa texto
- Delimitado por aspas simples (`'`), duplas (`"`) ou crases (`` ` ``)
- E imutavel — operacoes em strings criam novas strings

### Number
- Representa tanto inteiros quanto decimais (nao ha distincao como em outras linguagens)
- Inclui valores especiais: `Infinity`, `-Infinity`, `NaN`
- Atencao: `NaN` (Not a Number) e ironicamente do tipo `number`

### Boolean
- Apenas dois valores: `true` ou `false`
- Fundamental para controle de fluxo (if/else, while, etc.)
- Outros valores podem ser "truthy" ou "falsy" quando avaliados em contexto booleano

### null
- Valor atribuido intencionalmente pelo programador
- Significa "esta variavel existe, mas esta vazia de proposito"
- Uso tipico: resetar uma variavel, indicar ausencia de objeto

### undefined
- Atribuido automaticamente pelo JavaScript
- Aparece quando: variavel declarada sem valor, propriedade inexistente de objeto, funcao sem return
- O instrutor conecta isso ao hoisting: quando o JS move a declaracao para o topo mas nao o valor, a variavel fica como `undefined`

## null vs undefined — a distincao crucial

O instrutor enfatiza que ambos representam "ausencia", mas de formas diferentes:

- `null`: "eu, programador, decidi que isso e vazio"
- `undefined`: "o JavaScript ainda nao sabe o que colocar aqui"

Na pratica:
```javascript
let a;          // undefined — JS atribuiu
let b = null;   // null — programador atribuiu
a === b         // false (tipos diferentes com ===)
a == b          // true (coercao os trata como equivalentes)
```

## Tipos nao-primitivos mencionados

O instrutor menciona `Object` e `Array` como tipos que serao estudados depois. A distincao importante:

- **Primitivos**: imutaveis, comparados por valor
- **Objetos/Arrays**: mutaveis, comparados por referencia

## Conexao com Hoisting

O instrutor faz uma conexao explicita com a aula de hoisting: quando voce acessa uma variavel antes da declaracao (com `var`), o JS retorna `undefined` porque o hoisting leva a declaracao ao topo, mas nao a atribuicao.

```javascript
console.log(x); // undefined (hoisting da declaracao)
var x = 10;
console.log(x); // 10 (apos atribuicao)
```

Com `let` e `const`, o comportamento e diferente — gera ReferenceError (temporal dead zone), nao `undefined`.