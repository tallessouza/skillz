# Code Examples: Manipulacao de Estilos via DOM

## Exemplo 1: classList.add — Adicionar classe de erro

HTML do projeto:
```html
<form>
  <input type="text" id="name" placeholder="Digite um item">
  <button id="btn">Adicionar</button>
</form>
```

CSS pre-definido:
```css
.inputError {
  border: 2px solid red;
}
```

JavaScript:
```javascript
const input = document.querySelector('#name')

// Adiciona a classe inputError — borda vermelha aparece
input.classList.add('inputError')
```

## Exemplo 2: classList.remove — Remover classe

```javascript
const input = document.querySelector('#name')

// Remove a classe inputError — borda vermelha desaparece
input.classList.remove('inputError')
```

## Exemplo 3: classList.toggle — Alternar classe

```javascript
const input = document.querySelector('#name')

// Se inputError NAO existe no elemento → adiciona
// Se inputError JA existe no elemento → remove
input.classList.toggle('inputError')
```

Demonstracao do comportamento:
```javascript
const input = document.querySelector('#name')

// Estado inicial: sem classe inputError
input.classList.toggle('inputError') // → adiciona (agora TEM a classe)
input.classList.toggle('inputError') // → remove (agora NAO tem)
input.classList.toggle('inputError') // → adiciona novamente
```

## Exemplo 4: element.style — Alterar propriedade CSS diretamente

```javascript
const button = document.querySelector('button')

// Muda a cor de fundo do botao para vermelho
button.style.backgroundColor = 'red'
```

O instrutor nota que voce pode usar:
- Nome da cor: `'red'`, `'blue'`, `'green'`
- Hexadecimal: `'#ff0000'`, `'#3498db'`

## Exemplo 5: Seletor por tag vs por ID

```javascript
// Por tag — funciona se so tem um button na pagina
const button = document.querySelector('button')

// Por ID — mais seguro e especifico
const button = document.querySelector('#btn')
```

## Variacoes praticas (alem da aula)

### Toggle para modal

```css
.modal { display: none; }
.modal.visible { display: flex; }
```

```javascript
const modal = document.querySelector('#modal')
const openBtn = document.querySelector('#open')
const closeBtn = document.querySelector('#close')

openBtn.addEventListener('click', () => {
  modal.classList.toggle('visible')
})

closeBtn.addEventListener('click', () => {
  modal.classList.toggle('visible')
})
```

### Validacao visual de formulario

```javascript
const input = document.querySelector('#name')
const form = document.querySelector('form')

form.addEventListener('submit', (event) => {
  event.preventDefault()

  if (input.value.trim() === '') {
    input.classList.add('inputError')
  } else {
    input.classList.remove('inputError')
    // processar formulario...
  }
})
```

### Multiplas classes de uma vez

```javascript
const element = document.querySelector('#card')

// Adicionar varias classes
element.classList.add('active', 'highlighted', 'animated')

// Remover varias classes
element.classList.remove('active', 'highlighted')
```

### Style com valor dinamico (caso de uso valido)

```javascript
// Cor vem de um color picker — nao da pra usar classe CSS
const colorPicker = document.querySelector('#color')
const box = document.querySelector('#box')

colorPicker.addEventListener('input', (event) => {
  box.style.backgroundColor = event.target.value
})
```