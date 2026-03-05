# Code Examples: Estrutura de Condicao IF

## Exemplo 1: IF basico com chaves

```javascript
let hour = 11

if (hour <= 12) {
  console.log("Bom dia")
}
// Output: "Bom dia"
```

Mudando `hour` para 13:

```javascript
let hour = 13

if (hour <= 12) {
  console.log("Bom dia")
}
// Output: (nada — condicao nao atendida)
```

## Exemplo 2: Multiplas instrucoes com chaves

```javascript
let hour = 11

if (hour <= 12) {
  console.log("Bom dia")
  console.log("Seja bem-vindo")
}
// Output:
// "Bom dia"
// "Seja bem-vindo"
```

## Exemplo 3: A armadilha — sem chaves com multiplas linhas

```javascript
let hour = 13

if (hour <= 12)
  console.log("Bom dia")
  console.log("Seja bem-vindo")

// Output: "Seja bem-vindo"
// "Bom dia" NAO aparece (condicao falsa)
// "Seja bem-vindo" APARECE (nao pertence ao IF!)
```

O JavaScript interpreta isso como:

```javascript
if (hour <= 12) {
  console.log("Bom dia")  // dentro do IF
}
console.log("Seja bem-vindo")  // FORA do IF — executa sempre
```

## Exemplo 4: Sem chaves com uma unica instrucao (funciona, mas evite)

```javascript
let hour = 11

if (hour <= 12) console.log("Bom dia")
// Output: "Bom dia"
// Funciona, mas prefira usar chaves para clareza
```

## Variacoes praticas

### Verificando se usuario esta logado

```javascript
const isLoggedIn = true

if (isLoggedIn) {
  console.log("Bem-vindo de volta!")
}
```

### Verificando idade

```javascript
const age = 20

if (age >= 18) {
  console.log("Acesso permitido")
  console.log("Voce e maior de idade")
}
```