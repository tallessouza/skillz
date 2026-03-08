# Code Examples: Estrutura e Renderizacao React

## Estrutura de arquivos do projeto

```
projeto-react/
├── public/
│   └── vite.svg          ← favicon exibido na aba do navegador
├── src/
│   ├── App.jsx            ← componente principal
│   └── main.jsx           ← ponto de entrada, conecta React ao DOM
├── index.html             ← unica pagina HTML (SPA)
└── package.json
```

## index.html — A unica pagina

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- Favicon da pasta public -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Titulo que aparece na aba do navegador -->
    <title>Fundamentos do React</title>
  </head>
  <body>
    <!-- Div root: vazia por padrao, React insere conteudo aqui -->
    <div id="root"></div>
    <!-- Carrega main.jsx como modulo ES -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Pontos chave:
- A `<div id="root">` esta vazia — todo conteudo e injetado pelo React
- O `type="module"` permite import/export no main.jsx
- O `<title>` e editado diretamente aqui para mudar o nome na aba

## main.jsx — Ponto de entrada

```jsx
// StrictMode para detectar erros silenciosos
import { StrictMode } from 'react'
// createRoot do react-dom/client para renderizacao
import { createRoot } from 'react-dom/client'
// Componente principal da aplicacao
import App from './App'

// 1. Seleciona a div com id="root" no HTML
// 2. Cria a raiz do React nessa div
// 3. Renderiza o App envolvido em StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Decompondo cada parte:

```jsx
// Passo 1: Selecionar o elemento DOM
const rootElement = document.getElementById('root')
// Equivalente ao document.getElementById que voce ja conhece do JS puro

// Passo 2: Criar a raiz React
const root = createRoot(rootElement)
// Isso diz ao React: "esse e o container onde voce vai trabalhar"

// Passo 3: Renderizar o conteudo
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
// O React insere o retorno de <App /> dentro da div root
```

## App.jsx — Componente principal

```jsx
function App() {
  // O return e obrigatorio: diz ao React o que renderizar
  return (
    <h1>Hello World</h1>
  )
}

export default App
```

### Por que o return e essencial:

```jsx
// SEM return — nao renderiza nada
function App() {
  const message = "Hello World"
  // Esqueceu o return? Nada aparece na tela
}

// COM return — conteudo aparece
function App() {
  const message = "Hello World"
  return <h1>{message}</h1>
}
```

## Como o conteudo aparece no DOM final

Antes do React (HTML puro):
```html
<div id="root"></div>
```

Depois do React renderizar:
```html
<div id="root">
  <h1>Hello World</h1>
</div>
```

O inspector do navegador mostra o resultado final, nao o HTML original.

## Mudando o titulo da pagina

```html
<!-- Antes (padrao do Vite) -->
<title>Vite + React</title>

<!-- Depois (editado no index.html) -->
<title>Fundamentos do React</title>
```

O titulo muda imediatamente ao salvar o arquivo, gracas ao hot reload do Vite.

## Variacao: Estrutura sem StrictMode

```jsx
// Funciona, mas perde as verificacoes extras em desenvolvimento
createRoot(document.getElementById('root')).render(
  <App />
)
```

Nao recomendado — StrictMode ajuda a detectar problemas cedo.

## Variacao: Multiplos elementos no App

```jsx
function App() {
  return (
    // Precisa de um elemento pai (ou Fragment)
    <>
      <h1>Hello World</h1>
      <p>Minha primeira aplicacao React</p>
    </>
  )
}
```

O React exige um unico elemento raiz no return. O Fragment (`<>...</>`) resolve isso sem adicionar uma div extra ao DOM.