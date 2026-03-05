# Deep Explanation: Case Sensitive em JavaScript

## O que significa case sensitive

Quando uma linguagem de programacao e case sensitive, ela trata letras maiusculas e minusculas como caracteres completamente diferentes. O interpretador JavaScript compara identificadores caractere a caractere, incluindo o case. Isso significa que `Rodrigo` com R maiusculo e `rodrigo` com r minusculo sao duas coisas distintas para o motor JavaScript.

## Onde o case sensitivity se aplica

O instrutor destaca que isso afeta:
- **Nomes de variaveis** — `product` ≠ `Product` ≠ `PRODUCT`
- **Nomes de funcoes** — `getUser()` ≠ `GetUser()` ≠ `getuser()`
- **Propriedades de objetos** — `obj.name` ≠ `obj.Name`
- **Qualquer identificador** na linguagem

## Insight do instrutor: primeira pergunta ao aprender uma linguagem

O instrutor enfatiza que ao aprender uma linguagem nova, uma das primeiras perguntas deve ser: "essa linguagem e case sensitive?" Isso muda fundamentalmente como voce escreve codigo. Linguagens como SQL sao case insensitive para palavras-chave, enquanto JavaScript e estritamente case sensitive.

## Comportamento de sobrescrita com `var`

Um ponto importante demonstrado na aula: `var` permite re-declarar uma variavel com o mesmo nome no mesmo escopo. Quando isso acontece, o valor anterior e sobrescrito silenciosamente:

```javascript
var product = "teclado mecanico"
// ... 50 linhas depois ...
var product = "fone sem fio"
// o "teclado mecanico" sumiu sem aviso
```

Isso e especifico do `var`. Com `let` e `const` (abordados em aulas futuras), essa re-declaracao causa erro, o que e mais seguro.

## Diferenca entre variavel e texto

O instrutor faz uma distincao didatica importante:
- `console.log(product)` → mostra o **conteudo** da variavel `product`
- `console.log("product")` → mostra o **texto** "product"

Quando entre aspas, e texto literal. Sem aspas, JavaScript interpreta como referencia a um identificador.

## ReferenceError como sinal de case errado

Quando voce tenta usar uma variavel que nao foi declarada, JavaScript lanca `ReferenceError: X is not defined`. Na pratica, muitas vezes isso significa que voce escreveu o nome com case diferente:

```javascript
var price = 100
console.log(Price) // ReferenceError — P maiusculo, nao existe
```

## Dica visual do VSCode

O instrutor mostra que o VSCode destaca todas as ocorrencias de um nome quando voce o seleciona. Isso ajuda a identificar visualmente onde o mesmo identificador aparece e se ha inconsistencias de case.

## Edge cases

- Keywords do JavaScript (`var`, `function`, `if`) sao sempre minusculas e reservadas
- `undefined`, `null`, `true`, `false` sao case sensitive — `True` nao e valido
- Nomes de propriedades em objetos tambem sao case sensitive: `obj.Name` ≠ `obj.name`
- Em imports/exports, o case do nome exportado deve bater exatamente