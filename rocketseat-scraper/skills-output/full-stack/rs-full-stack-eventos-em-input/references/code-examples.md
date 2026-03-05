# Code Examples: Eventos em Input

## Setup basico (usado em todos os exemplos)

```html
<input type="text" placeholder="Digite seu nome" />
```

```javascript
const input = document.querySelector("input")
```

## Exemplo 1: keydown — Capturando todas as teclas

```javascript
// Captura QUALQUER tecla, incluindo Ctrl, Shift, Alt
input.addEventListener("keydown", (event) => {
  console.log(event) // Objeto completo do evento
})
```

### Acessando apenas a tecla pressionada

```javascript
input.addEventListener("keydown", (event) => {
  console.log(event.key) // "r", "Shift", "Control", etc.
})
```

### Saida ao digitar "Rodrigo" (com Shift+R):
```
Shift
R
o
d
r
i
g
o
```
Note: Shift aparece como evento separado ANTES do "R".

## Exemplo 2: keypress — Apenas caracteres imprimiveis

```javascript
input.addEventListener("keypress", (event) => {
  console.log(event.key)
})
```

### Saida ao digitar "Rodrigo Goncalves":
```
R
o
d
r
i
g
o

G
o
n
c
a
l
v
e
s
```
Note: Shift NAO aparece. Espaco aparece como caractere. Apenas teclas que produzem caracteres visíveis disparam o evento.

### Teste de modificadores (nenhum output):
- Apertar Shift: nada
- Apertar Ctrl: nada
- Apertar Alt: nada

## Exemplo 3: change — Ao sair do input

### Com funcao inline (onchange)

```javascript
input.onchange = function () {
  console.log("O input mudou")
}
```

### Com funcao nomeada separada

```javascript
function inputChange() {
  console.log("O input mudou")
}

input.onchange = function () {
  inputChange()
}
```

### Comportamento:
1. Digitar "Rodrigo" → nenhum output
2. Apertar Tab (sair do input) → "O input mudou"
3. Clicar no input novamente
4. Digitar " Goncalves" → nenhum output
5. Apertar Tab → "O input mudou"

## Variacoes praticas

### Validacao em tempo real com keypress

```javascript
input.addEventListener("keypress", (event) => {
  // Permitir apenas letras
  if (!/[a-zA-Z]/.test(event.key)) {
    event.preventDefault()
    console.log("Apenas letras permitidas")
  }
})
```

### Detectar atalho Ctrl+Enter com keydown

```javascript
input.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    console.log("Ctrl+Enter pressionado — enviar formulario")
    submitForm()
  }
})
```

### Salvar rascunho ao sair do campo com change

```javascript
input.addEventListener("change", (event) => {
  const valorFinal = event.target.value
  localStorage.setItem("rascunho", valorFinal)
  console.log("Rascunho salvo:", valorFinal)
})
```

### Comparacao lado a lado dos tres eventos

```javascript
const input = document.querySelector("input")

input.addEventListener("keydown", (event) => {
  console.log("[keydown]", event.key)
})

input.addEventListener("keypress", (event) => {
  console.log("[keypress]", event.key)
})

input.addEventListener("change", () => {
  console.log("[change] valor final:", input.value)
})
```

**Ao digitar "Hi" (Shift+H, i) e apertar Tab:**
```
[keydown] Shift
[keydown] H
[keypress] H
[keydown] i
[keypress] i
[keydown] Tab
[change] valor final: Hi
```

Essa comparacao mostra claramente:
- keydown captura Shift e Tab
- keypress ignora Shift e Tab, captura apenas H e i
- change dispara uma unica vez ao final