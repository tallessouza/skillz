# Code Examples: DOM — Document Object Model

## Estrutura HTML base da aula

O instrutor usou esta estrutura como exemplo visual:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Meu Site</title>
  </head>
  <body>
    <h1>Ola</h1>
    <p>E bom ter voce por aqui</p>
  </body>
</html>
```

## Representacao como arvore DOM

```
document
  └── html
        ├── head
        │     └── title
        │           └── #text "Meu Site"
        └── body
              ├── h1
              │     └── #text "Ola"
              └── p
                    └── #text "E bom ter voce por aqui"
```

## Acessando nos na pratica (extensao da aula)

Embora a aula seja conceitual, estes sao os metodos que se aplicam a estrutura apresentada:

### Acessar o document (raiz)

```javascript
// O document e o ponto de entrada para toda a arvore
console.log(document)              // o documento inteiro
console.log(document.documentElement) // o elemento <html> (root)
```

### Navegar pela arvore

```javascript
// Acessar head e body (children diretos de html)
const head = document.head        // <head>
const body = document.body        // <body>

// Children de um elemento
const bodyChildren = body.children // HTMLCollection [h1, p]

// Parent de um elemento
const h1 = document.querySelector('h1')
console.log(h1.parentElement)     // <body>
```

### Ler conteudo de text nodes

```javascript
const title = document.querySelector('title')
console.log(title.textContent)    // "Meu Site"

const h1 = document.querySelector('h1')
console.log(h1.textContent)       // "Ola"

const p = document.querySelector('p')
console.log(p.textContent)        // "E bom ter voce por aqui"
```

### Modificar o DOM (nao o HTML)

```javascript
// Mudar o texto do h1
const h1 = document.querySelector('h1')
h1.textContent = 'Bem-vindo!'
// O DOM muda, a pagina atualiza, mas o arquivo HTML permanece com "Ola"
```

### Verificar tipos de nos

```javascript
const h1 = document.querySelector('h1')
console.log(h1.nodeType)          // 1 (Element)
console.log(h1.firstChild.nodeType) // 3 (Text)
console.log(document.nodeType)    // 9 (Document)
```

## Arvore maior (variacao)

Para ilustrar que o tamanho nao muda a abordagem:

```html
<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">Sobre</a></li>
        <li><a href="/contact">Contato</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section>
      <h1>Titulo</h1>
      <p>Paragrafo 1</p>
      <p>Paragrafo 2</p>
    </section>
  </main>
  <footer>
    <p>Rodape</p>
  </footer>
</body>
```

```
body
  ├── header
  │     └── nav
  │           └── ul
  │                 ├── li → a → #text "Home"
  │                 ├── li → a → #text "Sobre"
  │                 └── li → a → #text "Contato"
  ├── main
  │     └── section
  │           ├── h1 → #text "Titulo"
  │           ├── p → #text "Paragrafo 1"
  │           └── p → #text "Paragrafo 2"
  └── footer
        └── p → #text "Rodape"
```

A manipulacao e identica:

```javascript
// Mesmos metodos, independente do tamanho
const links = document.querySelectorAll('nav a')
const titulo = document.querySelector('main h1')
const rodape = document.querySelector('footer p')
```