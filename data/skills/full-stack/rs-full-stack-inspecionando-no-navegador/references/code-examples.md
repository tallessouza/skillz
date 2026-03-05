# Code Examples: Inspecionando no Navegador

## Estrutura HTML da Aplicação de Exemplo

Este é o HTML que o instrutor apresenta na aula:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- meta tags, title, link to CSS -->
</head>
<body>
  <main>
    <h1>Convidados</h1>

    <form>
      <input type="text" />
      <button>Adicionar</button>
    </form>

    <ul>
      <li>Pessoa 1</li>
      <li>Pessoa 2</li>
    </ul>
  </main>
</body>
</html>
```

## Representação da Árvore DOM

```
document
└── html
    ├── head
    │   ├── meta
    │   ├── title
    │   └── link (CSS)
    └── body
        └── main
            ├── h1 ("Convidados")
            ├── form
            │   ├── input
            │   └── button ("Adicionar")
            └── ul
                ├── li ("Pessoa 1")
                └── li ("Pessoa 2")
```

## Acessando Elementos via JavaScript (preview das próximas aulas)

### Seleção direta

```javascript
// Selecionar pelo tag name
const heading = document.querySelector('h1')
console.log(heading.textContent) // "Convidados"

// Selecionar o formulário
const form = document.querySelector('form')

// Selecionar o input dentro do form
const input = document.querySelector('form input')
// ou
const input = form.querySelector('input')

// Selecionar a lista
const guestList = document.querySelector('ul')

// Selecionar todos os itens da lista
const guests = document.querySelectorAll('ul li')
console.log(guests.length) // 2
```

### Navegação por hierarquia (parent/child)

```javascript
const main = document.querySelector('main')

// Filhos diretos
console.log(main.children)
// HTMLCollection [h1, form, ul]

// Primeiro e último filho
console.log(main.firstElementChild) // h1
console.log(main.lastElementChild)  // ul

// Pai de um elemento
const heading = document.querySelector('h1')
console.log(heading.parentElement) // main

// Irmãos
console.log(heading.nextElementSibling) // form
```

### Verificando a estrutura no console

```javascript
// Ver a árvore a partir de um elemento
const main = document.querySelector('main')
console.dir(main) // mostra todas as propriedades do nó

// Contar filhos
console.log(main.childElementCount) // 3

// Verificar se um elemento contém outro
const list = document.querySelector('ul')
const item = document.querySelector('li')
console.log(list.contains(item)) // true
console.log(main.contains(item)) // true (hierarquia transitiva)
```

## Como Inspecionar — Passo a Passo

```
1. Abra a página no navegador (Chrome, Firefox, Edge)
2. Botão direito → Inspecionar (ou F12 / Ctrl+Shift+I)
3. Vá para a aba "Elements" (Chrome/Edge) ou "Inspector" (Firefox)
4. Recolha todos os nós clicando nas setas ▶
5. Expanda nível por nível para mapear a hierarquia
6. Passe o mouse sobre cada nó para ver o highlight na página
7. Use essa compreensão antes de escrever querySelector no JavaScript
```