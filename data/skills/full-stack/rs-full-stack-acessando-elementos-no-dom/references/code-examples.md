# Code Examples: Acessando Elementos no DOM

## Estrutura HTML usada na aula

```html
<!DOCTYPE html>
<html>
<head>
  <title>Aulas de JavaScript</title>
</head>
<body>
  <main>
    <h1>Titulo</h1>
    <ul>
      <li id="guest-1" class="guest">Rodrigo</li>
      <li id="guest-2" class="guest">Mike</li>
    </ul>
  </main>
  <script src="scripts.js"></script>
</body>
</html>
```

## Exemplo 1: Visualizar o documento

```javascript
// Exibe a estrutura completa do DOM no console
console.log(document)

// Exibe o titulo da pagina
console.log(document.title) // "Aulas de JavaScript"
```

## Exemplo 2: Selecionar por ID

```javascript
// Seleciona o elemento com id="guest-2"
const guest = document.getElementById("guest-2")
console.log(guest) // <li id="guest-2" class="guest">Mike</li>

// Trocando para id="guest-1"
const guest1 = document.getElementById("guest-1")
console.log(guest1) // <li id="guest-1" class="guest">Rodrigo</li>
```

## Exemplo 3: Inspecionar propriedades com console.dir

```javascript
const guest = document.getElementById("guest-2")
console.dir(guest)
// Exibe todas propriedades do objeto:
// textContent: "Mike"
// tagName: "LI"
// className: "guest"
// id: "guest-2"
// ... muitas outras propriedades
```

## Exemplo 4: Selecionar por classe

```javascript
const guestsByClass = document.getElementsByClassName("guest")
console.log(guestsByClass) // HTMLCollection(2) [li.guest, li.guest]

// Acessar primeiro elemento (indice 0)
console.log(guestsByClass.item(0)) // <li id="guest-1">Rodrigo</li>
console.log(guestsByClass[0])       // mesmo resultado

// Acessar segundo elemento (indice 1)
console.log(guestsByClass.item(1)) // <li id="guest-2">Mike</li>
console.log(guestsByClass[1])       // mesmo resultado
```

## Exemplo 5: Selecionar por tag

```javascript
const guestsByTag = document.getElementsByTagName("li")
console.log(guestsByTag) // HTMLCollection(2) [li.guest, li.guest]
```

## Variacoes adicionais

### Selecionar por tag diferentes

```javascript
// Todos os paragrafos
const paragraphs = document.getElementsByTagName("p")

// Todos os headings h2
const headings = document.getElementsByTagName("h2")

// Todos os links
const links = document.getElementsByTagName("a")
```

### Verificar se elemento existe antes de usar

```javascript
const element = document.getElementById("maybe-exists")
if (element) {
  console.log(element.textContent)
}
```

### Iterar sobre HTMLCollection

```javascript
const guests = document.getElementsByClassName("guest")
for (let i = 0; i < guests.length; i++) {
  console.log(guests[i].textContent)
}
// Output:
// "Rodrigo"
// "Mike"
```

### Acessar propriedades especificas apos selecao

```javascript
const guest = document.getElementById("guest-1")
console.log(guest.textContent)  // "Rodrigo"
console.log(guest.tagName)      // "LI"
console.log(guest.className)    // "guest"
console.log(guest.id)           // "guest-1"
```