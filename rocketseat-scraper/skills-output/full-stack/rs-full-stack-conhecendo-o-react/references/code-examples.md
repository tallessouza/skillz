# Code Examples: Conhecendo o React

## Nota sobre esta aula

Esta aula e conceitual/introdutoria — o instrutor nao mostra codigo na tela. Os exemplos abaixo ilustram os conceitos apresentados com codigo pratico para referencia.

## Componente reutilizavel — o exemplo do botao

O instrutor descreve um botao que aparece em varios lugares. Veja como isso se traduz em codigo:

### Sem React (HTML repetido)

```html
<!-- pagina-home.html -->
<button class="btn-primary">Salvar</button>

<!-- pagina-perfil.html -->
<button class="btn-primary">Salvar</button>

<!-- pagina-config.html -->
<button class="btn-primary">Salvar</button>

<!-- Se precisar mudar, tem que alterar em 3 lugares -->
```

### Com React (componente reutilizavel)

```jsx
// Button.jsx — componente criado uma unica vez
function Button({ children }) {
  return <button className="btn-primary">{children}</button>
}

// Home.jsx
<Button>Salvar</Button>

// Profile.jsx
<Button>Salvar</Button>

// Settings.jsx
<Button>Salvar</Button>

// Mudou o botao? Altera so no Button.jsx → reflete em todos os lugares
```

## Abordagem declarativa vs imperativa

### Imperativo (JavaScript puro + DOM)

```javascript
// Voce diz COMO fazer cada passo
const list = document.getElementById('user-list')
const item = document.createElement('li')
item.textContent = 'Novo usuario'
list.appendChild(item)
```

### Declarativo (React)

```jsx
// Voce declara O QUE quer na tela
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## Estado refletindo mudancas na interface

O instrutor explica que "sempre que um estado muda, reflete na interface":

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  )
}

// Quando setCount e chamado:
// 1. Estado muda (count: 0 → 1)
// 2. React cria nova Virtual DOM
// 3. Compara com a anterior (diffing)
// 4. Atualiza apenas o <p> na DOM real
// 5. O <button> NAO e re-renderizado (nao mudou)
```

## Virtual DOM diffing — o exemplo da lista

O instrutor descreve uma lista onde um item e adicionado e outro e modificado:

```jsx
// Estado anterior
const items = ['Item A', 'Item B', 'Item C']

// Estado novo (Item B modificado, Item D adicionado)
const items = ['Item A', 'Item B modificado', 'Item C', 'Item D']

// O que o React faz:
// 1. Virtual DOM antiga: [A, B, C]
// 2. Virtual DOM nova:   [A, B*, C, D]
// 3. Diff detecta:
//    - Item A: sem mudanca → ignora
//    - Item B: texto mudou → atualiza na DOM real
//    - Item C: sem mudanca → ignora
//    - Item D: novo → insere na DOM real
// 4. Apenas 2 operacoes na DOM real (nao 4)
```

## DOM como arvore — a estrutura que o instrutor mostrou

```jsx
// A estrutura de arvore DOM que o instrutor ilustrou:
// document → html → head → title → "texto"
//                 → body → h1
//                        → a → href
//                        → span

// Em React, voce declara essa arvore com JSX:
function App() {
  return (
    <html>
      <head>
        <title>Minha App</title>
      </head>
      <body>
        <h1>Titulo</h1>
        <a href="/link">Link</a>
        <span>Texto</span>
      </body>
    </html>
  )
}
```

## Componentizacao — separando responsabilidades

```jsx
// Cada componente tem UMA responsabilidade

// Header.jsx — responsavel pelo cabecalho
function Header() {
  return (
    <header>
      <h1>Minha App</h1>
      <Navigation />
    </header>
  )
}

// Navigation.jsx — responsavel pela navegacao
function Navigation() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/about">Sobre</a>
    </nav>
  )
}

// App.jsx — compoe os componentes (como pecas de Lego)
function App() {
  return (
    <div>
      <Header />
      <main>
        <UserList />
      </main>
      <Footer />
    </div>
  )
}
```