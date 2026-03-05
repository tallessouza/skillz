# Code Examples: Sintaxe JavaScript

## Exemplo 1: console.log correto vs incorreto

```javascript
// CORRETO — sintaxe exata do comando
console.log("Olá Rodrigo")
// Output: Olá Rodrigo

// INCORRETO — separacao errada das palavras
// con.sole.log("Olá Rodrigo")
// ReferenceError: con is not defined
```

**Por que falha:** `con` nao existe como objeto no JavaScript. O comando correto e `console` (uma palavra so), seguido de `.log`.

## Exemplo 2: Ponto e virgula opcional

```javascript
// Com ponto e virgula — funciona
console.log("Olá João");

// Sem ponto e virgula — tambem funciona
console.log("Olá João")
```

Ambas as formas sao validas em JavaScript. A escolha e de estilo/preferencia.

## Exemplo 3: Palavras reservadas

```javascript
// Correto — palavras reservadas em minusculo
let nome = "Maria"
var idade = 25
const PI = 3.14

// Incorreto — JavaScript e case-sensitive
// Let nome = "Maria"    // SyntaxError
// VAR idade = 25        // SyntaxError
// Const PI = 3.14       // SyntaxError
```

## Exemplo 4: Variacoes comuns de erros de sintaxe

```javascript
// Esqueceu os parenteses
// console.log "Ola"     // SyntaxError

// Esqueceu as aspas
// console.log(Ola)      // ReferenceError: Ola is not defined

// Usou aspas erradas (smart quotes de editores de texto)
// console.log("Ola")   // SyntaxError (aspas tipograficas)

// Correto
console.log("Ola")      // aspas retas
```

## Exemplo 5: Comparacao com outras linguagens

```javascript
// JavaScript — ponto e virgula opcional
console.log("JS")

// C# — ponto e virgula obrigatorio
// Console.WriteLine("C#");  // sem ; = erro de compilacao

// Python — sem ponto e virgula
// print("Python")
```