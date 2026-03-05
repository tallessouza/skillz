# Code Examples: Query Selector

## Exemplo 1: Selecionar por ID (da aula)

```javascript
// Seleciona o convidado com id="guest1"
const guest = document.querySelector('#guest1')
console.log(guest) // <li id="guest1">Rodrigo</li>
```

```javascript
// Trocando para guest2
const guest = document.querySelector('#guest2')
console.log(guest) // <li id="guest2">Mike</li>
```

## Exemplo 2: Selecionar por classe — primeiro elemento (da aula)

```javascript
// querySelector retorna APENAS o primeiro
const guest = document.querySelector('.guest')
console.log(guest) // Apenas o primeiro elemento com classe "guest"
```

## Exemplo 3: Selecionar por classe — todos os elementos (da aula)

```javascript
// querySelectorAll retorna TODOS
const guests = document.querySelectorAll('.guest')
console.log(guests) // NodeList com todos os elementos com classe "guest"
```

## Variacoes adicionais

### Seletor por tag

```javascript
const allListItems = document.querySelectorAll('li')
const firstParagraph = document.querySelector('p')
```

### Seletores compostos (CSS combinators)

```javascript
// Filho direto de um container
const item = document.querySelector('.list > .item')

// Descendente dentro de um ID
const nestedElement = document.querySelector('#main .content')

// Por atributo
const input = document.querySelector('input[type="email"]')

// Pseudo-seletor
const firstItem = document.querySelector('li:first-child')
const lastItem = document.querySelector('li:last-child')
```

### Iterando sobre querySelectorAll

```javascript
const guests = document.querySelectorAll('.guest')

// forEach funciona direto no NodeList
guests.forEach(guest => {
  console.log(guest.textContent)
})

// Para usar .map, .filter — converta para Array
const names = Array.from(guests).map(guest => guest.textContent)
// ou
const names = [...guests].map(guest => guest.textContent)
```

### Verificacao de existencia (seguranca)

```javascript
const element = document.querySelector('#maybe-exists')

if (element) {
  element.textContent = 'Found!'
}
```

### Escopo de busca (querySelector em elemento, nao no document)

```javascript
const container = document.querySelector('#my-list')
// Busca APENAS dentro do container
const firstItem = container.querySelector('.item')
```