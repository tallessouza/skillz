# Code Examples: Front-end e Back-end

## O ciclo request-response visualizado

Esta aula é conceitual e não contém código, mas os conceitos podem ser ilustrados com exemplos práticos:

### Exemplo 1: O pedido mais simples (o que acontece ao digitar uma URL)

```
Usuário digita: google.com

1. Browser resolve DNS:
   google.com → 142.250.80.46

2. Browser envia HTTP Request:
   GET / HTTP/1.1
   Host: google.com

3. Servidor responde:
   HTTP/1.1 200 OK
   Content-Type: text/html

   <!DOCTYPE html>
   <html>
     <head>...</head>
     <body>...</body>
   </html>

4. Browser renderiza o HTML, baixa CSS, JS, imagens referenciados
```

### Exemplo 2: Quando o recurso não existe (404)

```
Usuário digita: google.com/pagina-que-nao-existe

1. Browser envia:
   GET /pagina-que-nao-existe HTTP/1.1
   Host: google.com

2. Servidor responde:
   HTTP/1.1 404 Not Found

   "Não encontrei o pedido"
```

### Exemplo 3: Os arquivos que compõem uma página (front-end)

```html
<!-- HTML — estrutura -->
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="style.css">  <!-- CSS -->
    <script src="app.js"></script>              <!-- JavaScript -->
  </head>
  <body>
    <img src="logo.png" alt="Logo">            <!-- Imagem -->
    <h1>Google</h1>
  </body>
</html>
```

```css
/* CSS — estilização (front-end) */
body {
  font-family: Arial, sans-serif;
  background-color: white;
}
```

```javascript
// JavaScript — comportamento (front-end)
document.querySelector('input').addEventListener('focus', () => {
  console.log('Usuário clicou na busca')
})
```

### Exemplo 4: Back-end respondendo ao pedido (Node.js)

```javascript
// Servidor (back-end) — o que roda "nos fundos"
const http = require('http')

const server = http.createServer((request, response) => {
  // Servidor escuta o pedido
  if (request.url === '/') {
    // Encontrou: responde com a página
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end('<html><body><h1>Google</h1></body></html>')
  } else {
    // Não encontrou: responde 404
    response.writeHead(404)
    response.end('Não encontrei o pedido')
  }
})

// Servidor é "um computador ligado em algum lugar do mundo"
server.listen(3000, () => {
  console.log('Servidor ligado e escutando pedidos')
})
```

### Diagrama ASCII: A comunicação completa

```
┌─────────────┐                          ┌─────────────┐
│             │   1. Pedido (URL)         │             │
│   CLIENTE   │ ──────────────────────►   │  SERVIDOR   │
│  (Browser)  │                          │  (Back-end) │
│  Front-end  │   2. Resposta            │             │
│             │ ◄──────────────────────   │             │
│  Chrome     │   (HTML, CSS, JS, imgs)  │  Computador │
│  Firefox    │                          │  remoto     │
│  Safari     │   ou 404 Not Found       │             │
└─────────────┘                          └─────────────┘
   "Farmacêutico"                        "Fundos da farmácia"
```