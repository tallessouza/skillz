# Code Examples: Compreendendo Escopos

## 1. Escopo Global vs Bloco — Basico

```javascript
// Escopo global
const mensagem = "Ola mundo"

if (true) {
  // Escopo de bloco
  const saudacao = "Bom dia"
  console.log(mensagem)  // "Ola mundo" — acessa escopo global de dentro do bloco
  console.log(saudacao)  // "Bom dia" — acessa variavel do proprio bloco
}

console.log(mensagem)  // "Ola mundo" — escopo global, acessivel
console.log(saudacao)  // ReferenceError — saudacao nao existe fora do bloco
```

## 2. var vs let — A Armadilha Classica

```javascript
// var ignora escopo de bloco
if (true) {
  var nome = "Maria"
}
console.log(nome) // "Maria" — var vazou do bloco!

// let respeita escopo de bloco
if (true) {
  let idade = 25
}
console.log(idade) // ReferenceError — let ficou no bloco
```

## 3. Shadowing — TVs em Comodos Diferentes

```javascript
const tv = "TV da sala"

if (true) {
  const tv = "TV do quarto"  // shadowing — nova variavel, mesmo nome
  console.log(tv) // "TV do quarto" — contexto do bloco
}

console.log(tv) // "TV da sala" — contexto global preservado
```

## 4. Loop com var vs let

```javascript
// Problema classico com var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 3, 3, 3 — var compartilha a mesma variavel!

// Solucao com let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 0, 1, 2 — let cria escopo por iteracao
```

## 5. Escopos Aninhados — Analogia Brasil/SP/Cidade

```javascript
// Brasil (escopo global)
const pais = "Brasil"

{
  // Estado de Sao Paulo (escopo de bloco nivel 1)
  const estado = "Sao Paulo"
  
  {
    // Cidade (escopo de bloco nivel 2)
    const cidade = "Campinas"
    
    console.log(pais)   // "Brasil" — acessa escopo global
    console.log(estado)  // "Sao Paulo" — acessa escopo pai
    console.log(cidade)  // "Campinas" — acessa proprio escopo
  }
  
  console.log(pais)   // "Brasil" — acessa escopo global
  console.log(estado)  // "Sao Paulo" — acessa proprio escopo
  console.log(cidade)  // ReferenceError — cidade nao existe aqui
}

console.log(pais)   // "Brasil"
console.log(estado)  // ReferenceError — estado nao existe aqui
```

## 6. var no Escopo Global Polui window

```javascript
// No browser
var globalVar = "eu poluo o window"
let globalLet = "eu nao poluo"

console.log(window.globalVar) // "eu poluo o window"
console.log(window.globalLet) // undefined
```

## 7. const — Imutabilidade da Referencia

```javascript
const usuario = { nome: "Maria" }

// Isso funciona — estamos mudando a propriedade, nao a referencia
usuario.nome = "Joao"

// Isso falha — estamos tentando reatribuir a referencia
usuario = { nome: "Pedro" } // TypeError: Assignment to constant variable
```

## 8. Escopo em Funcao (Preview)

```javascript
function cozinha() {
  const fogao = "Fogao industrial"
  console.log(fogao) // acessivel — estamos no contexto da cozinha
}

function quarto() {
  console.log(fogao) // ReferenceError — fogao nao existe no quarto
}

cozinha()
quarto()
```