# Code Examples: Tipos de Dados em JavaScript

## String

```javascript
// Tres formas de criar strings
let nome = "Mayk";
let sobrenome = 'Brito';
let saudacao = `Ola, ${nome} ${sobrenome}!`; // template literal

// Tipo
typeof nome; // "string"
typeof ""; // "string" (string vazia ainda e string)
```

## Number

```javascript
// Inteiros e decimais — mesmo tipo
let idade = 30;
let preco = 29.90;
let negativo = -5;

typeof idade; // "number"
typeof preco; // "number"

// Valores especiais do tipo Number
typeof NaN;       // "number" (ironico mas verdadeiro)
typeof Infinity;  // "number"

// Cuidado com operacoes que geram NaN
let resultado = "texto" * 2; // NaN
isNaN(resultado); // true
```

## Boolean

```javascript
let ativo = true;
let bloqueado = false;

typeof ativo; // "boolean"

// Valores falsy (avaliados como false em contexto booleano)
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false

// Valores truthy (tudo que nao e falsy)
Boolean(1);         // true
Boolean("texto");   // true
Boolean([]);        // true (array vazio e truthy!)
Boolean({});        // true (objeto vazio e truthy!)
```

## null

```javascript
let usuarioSelecionado = null; // vazio intencional

typeof null; // "object" — bug historico, mas o valor E null

// Verificacao correta
usuarioSelecionado === null; // true
```

## undefined

```javascript
// Caso 1: variavel declarada sem valor
let x;
console.log(x); // undefined

// Caso 2: propriedade inexistente
let obj = { nome: "Mayk" };
console.log(obj.idade); // undefined

// Caso 3: funcao sem return
function semRetorno() {
  let a = 1;
}
console.log(semRetorno()); // undefined

// Caso 4: hoisting com var
console.log(y); // undefined (hoisting)
var y = 10;
```

## Tipagem dinamica em acao

```javascript
// A mesma variavel pode mudar de tipo
let variavel = "texto";   // String
console.log(typeof variavel); // "string"

variavel = 42;             // Number
console.log(typeof variavel); // "number"

variavel = true;           // Boolean
console.log(typeof variavel); // "boolean"

variavel = null;           // null
console.log(typeof variavel); // "object" (bug historico)

variavel = undefined;      // undefined
console.log(typeof variavel); // "undefined"
```

## Armadilhas comuns de tipo

```javascript
// Concatenacao vs soma
"5" + 3;   // "53" (string + number = concatenacao)
"5" - 3;   // 2   (string - number = coercao para number)
"5" * 2;   // 10  (coercao para number)

// Comparacao loose vs strict
null == undefined;  // true (coercao)
null === undefined; // false (tipos diferentes)

0 == "";   // true (coercao)
0 === "";  // false (tipos diferentes)

// NaN nunca e igual a si mesmo
NaN === NaN; // false
// Use Number.isNaN() para verificar
Number.isNaN(NaN); // true
```

## Verificacao robusta de tipos

```javascript
// Funcao utilitaria para verificar tipo real
function getTrueType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

getTrueType("hello");    // "string"
getTrueType(42);         // "number"
getTrueType(true);       // "boolean"
getTrueType(null);       // "null" (corrigido!)
getTrueType(undefined);  // "undefined"
getTrueType([1, 2]);     // "array"
getTrueType({ a: 1 });   // "object"
```