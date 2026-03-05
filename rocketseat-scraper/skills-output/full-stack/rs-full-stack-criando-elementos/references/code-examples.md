# Code Examples: Criando Elementos na DOM

## Exemplo 1: Estrutura basica da aula

HTML base usado na aula:
```html
<main>
  <ul>
    <li class="guest"><span>Rodrigo</span></li>
    <li class="guest"><span>Mike</span></li>
  </ul>
</main>
```

## Exemplo 2: Selecionar a lista

```javascript
const guests = document.querySelector('ul')
console.log(guests) // <ul>...</ul>
```

## Exemplo 3: Criar elemento li e span

```javascript
const newGuest = document.createElement('li')
const guestName = document.createElement('span')
guestName.textContent = 'Diego'

console.log(guestName) // <span>Diego</span>
console.log(newGuest)  // <li></li> (ainda vazio)
```

## Exemplo 4: Aninhar span dentro de li com append

```javascript
newGuest.append(guestName)
console.log(newGuest) // <li><span>Diego</span></li>
```

## Exemplo 5: append vs prepend com multiplos filhos

```javascript
const newGuest = document.createElement('li')

const guestName = document.createElement('span')
guestName.textContent = 'Diego'

const guestSurname = document.createElement('span')
guestSurname.textContent = 'Fernandes'

// append — Fernandes aparece DEPOIS de Diego
newGuest.append(guestName)
newGuest.append(guestSurname)
// Resultado: <li><span>Diego</span><span>Fernandes</span></li>

// prepend — Fernandes aparece ANTES de Diego
newGuest.append(guestName)
newGuest.prepend(guestSurname)
// Resultado: <li><span>Fernandes</span><span>Diego</span></li>
```

## Exemplo 6: append com multiplos argumentos

```javascript
// Ao inves de dois appends separados:
newGuest.append(guestName)
newGuest.append(guestSurname)

// Use um unico append:
newGuest.append(guestName, guestSurname)
// Mesmo resultado: <li><span>Diego</span><span>Fernandes</span></li>
```

## Exemplo 7: appendChild (mais limitado)

```javascript
// appendChild aceita apenas UM argumento
newGuest.appendChild(guestName) // funciona

// Tentar passar dois NAO funciona:
newGuest.appendChild(guestName, guestSurname) // segundo argumento ignorado
```

## Exemplo 8: Inserir na lista e adicionar classe

```javascript
const guests = document.querySelector('ul')

const newGuest = document.createElement('li')
newGuest.classList.add('guest') // adiciona classe para formatacao

const guestName = document.createElement('span')
guestName.textContent = 'Diego'

newGuest.append(guestName)

// Adicionar no final da lista
guests.append(newGuest)

// OU adicionar no inicio da lista
guests.prepend(newGuest)
```

## Exemplo 9: Fluxo completo — criar e inserir convidado

```javascript
function addGuest(name, position = 'end') {
  const guests = document.querySelector('ul')

  const listItem = document.createElement('li')
  listItem.classList.add('guest')

  const nameSpan = document.createElement('span')
  nameSpan.textContent = name

  listItem.append(nameSpan)

  if (position === 'start') {
    guests.prepend(listItem)
  } else {
    guests.append(listItem)
  }
}

addGuest('Diego')          // adiciona no final
addGuest('Mayk', 'start')  // adiciona no inicio
```

## Exemplo 10: Criar elemento com nome e sobrenome

```javascript
function addGuestWithSurname(firstName, lastName) {
  const guests = document.querySelector('ul')

  const listItem = document.createElement('li')
  listItem.classList.add('guest')

  const firstNameSpan = document.createElement('span')
  firstNameSpan.textContent = firstName

  const lastNameSpan = document.createElement('span')
  lastNameSpan.textContent = ` ${lastName}`

  listItem.append(firstNameSpan, lastNameSpan)
  guests.append(listItem)
}

addGuestWithSurname('Diego', 'Fernandes')
```