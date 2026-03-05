# Code Examples: Conhecendo o JavaScript

## Nota sobre esta aula

Esta e uma aula **conceitual** — o instrutor nao escreveu codigo durante a aula. Os exemplos abaixo ilustram os conceitos ensinados com codigo real para referencia futura.

## Exemplo 1: Interatividade com botao (conceito central da aula)

```html
<!-- HTML: estrutura -->
<button id="addToCart">Adicionar ao Carrinho</button>
<p id="message"></p>
```

```javascript
// JavaScript: interatividade + funcionalidade
const addButton = document.getElementById('addToCart')
const message = document.getElementById('message')

// Identificar interacao do usuario (clique)
addButton.addEventListener('click', () => {
  // Executar funcionalidade
  message.textContent = 'Produto adicionado ao carrinho!'
})
```

Este exemplo demonstra os dois pilares que o instrutor enfatiza:
- **Interatividade**: detectar o clique do usuario
- **Funcionalidade**: executar uma acao (atualizar a mensagem)

## Exemplo 2: Manipulacao de elementos HTML

```javascript
// Acessar elemento HTML
const productTitle = document.querySelector('.product-title')

// Manipular elemento HTML
productTitle.textContent = 'Teclado Mecanico RGB'
productTitle.style.color = 'blue'
```

## Exemplo 3: Comunicacao com servidor

```javascript
// Buscar dados de produtos no servidor
const productsResponse = await fetch('https://api.loja.com/products')
const products = await productsResponse.json()

// Exibir produtos na pagina (manipular HTML)
products.forEach(product => {
  const productElement = document.createElement('div')
  productElement.textContent = product.name
  document.body.appendChild(productElement)
})
```

## Exemplo 4: O trio do navegador em acao

```html
<!-- HTML: estrutura -->
<div class="product-card">
  <h2>Teclado Mecanico</h2>
  <span class="price">R$ 299,90</span>
  <button class="buy-button">Comprar</button>
</div>
```

```css
/* CSS: estilizacao */
.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
}

.buy-button {
  background-color: green;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
}
```

```javascript
// JavaScript: interatividade e funcionalidade
const buyButton = document.querySelector('.buy-button')

buyButton.addEventListener('click', () => {
  alert('Produto adicionado ao carrinho!')
})
```

## JavaScript em diferentes contextos (mencionados pelo instrutor)

### Web client-side (origem)
```javascript
// Roda no navegador
document.addEventListener('DOMContentLoaded', () => {
  console.log('Pagina carregou, JavaScript interpretado!')
})
```

### Back-end com Node.js
```javascript
// Roda no servidor (fora do navegador)
const http = require('http')

const server = http.createServer((request, response) => {
  response.end('Hello from JavaScript no servidor!')
})

server.listen(3000)
```

### Desktop com Electron
```javascript
// Roda como aplicacao desktop
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const window = new BrowserWindow({ width: 800, height: 600 })
  window.loadFile('index.html')
})
```

### Mobile com React Native
```javascript
// Roda em Android e iOS
import { View, Text, Button } from 'react-native'

function App() {
  return (
    <View>
      <Text>JavaScript no celular!</Text>
      <Button title="Clique aqui" onPress={() => alert('Funcionou!')} />
    </View>
  )
}
```