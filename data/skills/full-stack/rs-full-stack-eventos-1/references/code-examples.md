# Code Examples: Eventos no JavaScript

## Exemplo 1: Evento de carregamento da pagina

```javascript
// Observa quando a pagina termina de carregar
window.addEventListener('load', () => {
  console.log('A pagina foi carregada')
})
```

**O que acontece:** Toda vez que a pagina e carregada (ou recarregada), a mensagem aparece no console. O console e limpo a cada recarga, entao sempre aparece uma unica vez.

## Exemplo 2: Listener global de clique

```javascript
// Observa cliques em QUALQUER lugar da pagina
addEventListener('click', (event) => {
  console.log(event)
})
```

**O que acontece:** Clicar em qualquer lugar gera um log do objeto event completo. Ao expandir no console, voce ve propriedades como:
- `clientX`, `clientY` — coordenadas do clique
- `pointerType` — "mouse" (se clicou com mouse)
- `target` — o elemento HTML exato que recebeu o clique

## Exemplo 3: preventDefault em botao submit

```javascript
addEventListener('click', (event) => {
  event.preventDefault()
  console.log(event)
})
```

**Antes do preventDefault:** Clicar no botao submit dentro de um form recarregava a pagina.
**Depois do preventDefault:** O clique e capturado sem recarregar, permitindo tratamento via JavaScript.

## Exemplo 4: Acessando event.target

```javascript
addEventListener('click', (event) => {
  event.preventDefault()
  // Retorna o elemento HTML clicado
  console.log(event.target)
})
```

**Saida ao clicar em um `<button>`:** `<button type="submit">Enviar</button>`
**Saida ao clicar em um `<h1>`:** `<h1>Titulo</h1>`

## Exemplo 5: Acessando textContent do elemento clicado

```javascript
addEventListener('click', (event) => {
  event.preventDefault()
  // Retorna o texto dentro do elemento clicado
  console.log(event.target.textContent)
})
```

**Saida ao clicar em "Rodrigo":** `Rodrigo`
**Saida ao clicar em "Mike":** `Mike`

## Variacoes praticas

### Listener em elemento especifico

```javascript
const button = document.querySelector('#meu-botao')

button.addEventListener('click', (event) => {
  event.preventDefault()
  console.log('Botao clicado:', event.target.textContent)
})
```

### Multiplos tipos de evento no mesmo elemento

```javascript
const input = document.querySelector('#meu-input')

input.addEventListener('focus', (event) => {
  console.log('Input recebeu foco')
})

input.addEventListener('blur', (event) => {
  console.log('Input perdeu foco')
})

input.addEventListener('input', (event) => {
  console.log('Valor atual:', event.target.value)
})
```

### Delegacao de eventos (padrao avancado)

```javascript
// Um unico listener no container pai
const lista = document.querySelector('#lista-usuarios')

lista.addEventListener('click', (event) => {
  // Verifica se o clique foi em um item da lista
  if (event.target.tagName === 'LI') {
    console.log('Usuario clicado:', event.target.textContent)
  }
})
```

### Evento de submit no formulario (alternativa ao clique no botao)

```javascript
const formulario = document.querySelector('#meu-form')

formulario.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const nome = formData.get('nome')
  const email = formData.get('email')

  console.log('Dados:', { nome, email })
})
```

### Removendo um event listener

```javascript
function handleClick(event) {
  console.log('Clicou!')
  // Remove o listener apos o primeiro clique
  button.removeEventListener('click', handleClick)
}

const button = document.querySelector('#meu-botao')
button.addEventListener('click', handleClick)
```