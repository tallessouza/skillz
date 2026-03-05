# Code Examples: Aplicacao Web Tradicional vs Single Page Application

## Exemplo 1: Aplicacao Tradicional — Salvar Cliente

### Servidor (Express.js, server-rendered)

```javascript
// Tradicional: servidor devolve HTML completo a cada request
app.post('/salvar-cliente', (req, res) => {
  const { nome } = req.body
  
  // Salva no banco
  db.query('INSERT INTO clientes (nome) VALUES (?)', [nome])
  
  // Busca todos os clientes de novo
  const clientes = db.query('SELECT * FROM clientes')
  
  // Reconstroi a pagina HTML INTEIRA e devolve
  res.send(`
    <html>
      <head><link rel="stylesheet" href="/styles.css"></head>
      <body>
        <h1>Clientes</h1>
        <ul>
          ${clientes.map(c => `<li>${c.nome}</li>`).join('')}
        </ul>
        <form action="/salvar-cliente" method="POST">
          <input name="nome" />
          <button type="submit">Salvar</button>
        </form>
      </body>
    </html>
  `)
})
```

**O que acontece:** ao clicar "Salvar", o navegador faz um POST, a pagina inteira recarrega com o novo HTML.

---

## Exemplo 2: SPA — Salvar Cliente

### API (Express.js, devolve JSON)

```javascript
// SPA: servidor devolve APENAS dados
app.post('/api/clientes', (req, res) => {
  const { nome } = req.body
  
  const cliente = db.query('INSERT INTO clientes (nome) VALUES (?) RETURNING *', [nome])
  
  // Devolve apenas o JSON do cliente salvo
  res.json(cliente)
  // Resposta: { "id": 1, "nome": "João" }
})
```

### Frontend (React, atualiza so o trecho)

```jsx
function ClientesList() {
  const [clientes, setClientes] = useState([])

  async function salvarCliente(nome) {
    // Faz request especifico para a API
    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    })
    
    // Recebe apenas o JSON do cliente salvo
    const novoCliente = await response.json()
    
    // Atualiza APENAS a lista — sem recarregar a pagina
    setClientes(prev => [...prev, novoCliente])
  }

  return (
    <div>
      <h1>Clientes</h1>
      <ul>
        {clientes.map(c => <li key={c.id}>{c.nome}</li>)}
      </ul>
      <button onClick={() => salvarCliente('João')}>Salvar</button>
    </div>
  )
}
```

**O que acontece:** ao clicar "Salvar", JavaScript faz um fetch em background. A pagina NAO recarrega. So o item novo aparece na lista.

---

## Exemplo 3: Deletar Cliente — Comparacao lado a lado

### Tradicional
```javascript
// Clique no botao → navegador vai para /deletar/1
// Servidor deleta, reconstroi HTML inteiro, devolve
// Pagina inteira pisca e recarrega

app.get('/deletar/:id', (req, res) => {
  db.query('DELETE FROM clientes WHERE id = ?', [req.params.id])
  const clientes = db.query('SELECT * FROM clientes')
  res.send(renderFullPage(clientes)) // HTML completo
})
```

### SPA
```javascript
// API
app.delete('/api/clientes/:id', (req, res) => {
  db.query('DELETE FROM clientes WHERE id = ?', [req.params.id])
  res.json({ deleted: true })
})

// Frontend
async function deletarCliente(id) {
  await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
  // Remove da lista local — cliente "some" sem piscar a tela
  setClientes(prev => prev.filter(c => c.id !== id))
}
```

---

## Exemplo 4: Formato das respostas

### Resposta Tradicional (HTML)
```html
HTTP/1.1 200 OK
Content-Type: text/html

<html>
  <head>
    <link rel="stylesheet" href="/styles.css">
    <script src="/app.js"></script>
  </head>
  <body>
    <h1>Clientes</h1>
    <ul>
      <li>João</li>
      <li>Maria</li>
    </ul>
  </body>
</html>
```

### Resposta SPA (JSON)
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "clientes": [
    { "id": 1, "nome": "João" },
    { "id": 2, "nome": "Maria" }
  ]
}
```

A diferenca e clara: tradicional devolve a **apresentacao completa** (HTML+CSS+JS). SPA devolve apenas os **dados brutos** (JSON) e o frontend decide como apresentar.