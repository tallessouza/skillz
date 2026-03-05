# Code Examples: Primeira Função em JavaScript

## Exemplo 1: Declaração e chamada básica (do instrutor)

```javascript
function message() {
  console.log("Olá, é bom ter você aqui!")
}

message()
// Output: Olá, é bom ter você aqui!
```

## Exemplo 2: Chamada múltipla (do instrutor)

```javascript
function message() {
  console.log("Olá, é bom ter você aqui!")
}

message()
// Output: Olá, é bom ter você aqui!

message()
// Output: Olá, é bom ter você aqui!
```

O instrutor enfatiza: "posso chamar ela quantas vezes eu quiser, e eu reaproveito o conteúdo dessa função".

## Exemplo 3: Variação — função com múltiplas linhas no escopo

```javascript
function showWelcome() {
  console.log("=== Bem-vindo ===")
  console.log("É bom ter você aqui!")
  console.log("=================")
}

showWelcome()
// Output:
// === Bem-vindo ===
// É bom ter você aqui!
// =================
```

Tudo dentro das chaves é executado na ordem — o escopo pode conter múltiplas instruções.

## Exemplo 4: Variação — reutilização em diferentes momentos

```javascript
function showDivider() {
  console.log("-------------------")
}

console.log("Seção 1")
showDivider()
console.log("Seção 2")
showDivider()
console.log("Seção 3")
showDivider()

// Output:
// Seção 1
// -------------------
// Seção 2
// -------------------
// Seção 3
// -------------------
```

A função `showDivider` é chamada entre seções — escrita uma vez, usada três vezes.

## Exemplo 5: Erro comum — declarar sem chamar

```javascript
function showGreeting() {
  console.log("Olá!")
}

// Nada aparece no console!
// Faltou: showGreeting()
```

## Exemplo 6: Erro comum — chamar sem parênteses

```javascript
function showGreeting() {
  console.log("Olá!")
}

showGreeting   // Isso referencia a função, NÃO executa
showGreeting() // Isso executa a função
```

## Exemplo 7: Múltiplas funções organizando código

```javascript
function showHeader() {
  console.log("=== Meu Programa ===")
}

function showContent() {
  console.log("Conteúdo principal aqui")
}

function showFooter() {
  console.log("=== Fim ===")
}

// Programa organizado em funções reutilizáveis
showHeader()
showContent()
showFooter()
```