# Code Examples: Front-end vs Back-end

## Exemplo 1: Request basica no navegador

Quando o usuario digita `google.com`, o navegador faz algo equivalente a:

```http
GET / HTTP/1.1
Host: google.com
```

O servidor responde com:

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
  <head><title>Google</title></head>
  <body><!-- conteudo da pagina --></body>
</html>
```

## Exemplo 2: Front-end (o que o navegador recebe e renderiza)

```html
<!-- HTML: estrutura da pagina -->
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Bem-vindo</h1>
    <button id="btn">Clique aqui</button>
    <script src="app.js"></script>
  </body>
</html>
```

```css
/* CSS: aparencia visual */
h1 {
  color: blue;
  font-size: 24px;
}
```

```javascript
// JavaScript: interatividade no navegador
document.getElementById('btn').addEventListener('click', () => {
  alert('Voce clicou!')
})
```

Tudo isso roda **no navegador do usuario** = front-end.

## Exemplo 3: Back-end (o que roda no servidor)

```javascript
// Servidor Node.js simples
const http = require('http')

const server = http.createServer((request, response) => {
  // O servidor recebe o pedido (request)
  // e envia uma resposta (response)
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end('<h1>Resposta do servidor</h1>')
})

server.listen(3000)
// Isso roda num computador "em outro lugar do mundo"
```

## Exemplo 4: Visualizando a separacao

```
┌─────────────────────────────┐     ┌─────────────────────────────┐
│         FRONT-END           │     │         BACK-END            │
│      (cliente/navegador)    │     │        (servidor)           │
│                             │     │                             │
│  HTML  ← estrutura          │     │  Logica de negocio          │
│  CSS   ← aparencia          │◄───►│  Banco de dados             │
│  JS    ← interatividade     │     │  Autenticacao               │
│                             │     │  Processamento              │
│  O usuario VE e INTERAGE    │     │  O usuario NAO VE           │
└─────────────────────────────┘     └─────────────────────────────┘
         REQUEST (pedido) ──────►
         ◄────── RESPONSE (resposta: HTML, CSS, JS, imagens)
```

## Exemplo 5: Analogia da farmacia em codigo

```javascript
// A "farmacia" em codigo

// FRONT-END (cliente no balcao)
async function pedirRemedio(nomeRemedio) {
  // Cliente faz o pedido ao farmaceutico (servidor)
  const resposta = await fetch(`/farmacia/remedios/${nomeRemedio}`)
  const remedio = await resposta.json()
  
  // Cliente recebe o remedio e usa
  mostrarNaTela(remedio)
}

// BACK-END (farmaceutico nos fundos)
app.get('/farmacia/remedios/:nome', (request, response) => {
  const nomeRemedio = request.params.nome
  
  // Farmaceutico vai aos fundos (banco de dados)
  const remedio = estoque.buscar(nomeRemedio)
  
  // Farmaceutico entrega o remedio (resposta)
  response.json(remedio)
})
```