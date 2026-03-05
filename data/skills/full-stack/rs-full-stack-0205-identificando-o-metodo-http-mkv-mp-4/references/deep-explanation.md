# Deep Explanation: Identificando o Método HTTP

## Por que identificar o método é fundamental

No Node.js nativo (sem frameworks), o servidor HTTP recebe TODAS as requisições em um único callback. Diferente do Express onde você faz `app.get()`, `app.post()`, aqui você precisa manualmente inspecionar `req.method` para saber o que o cliente quer fazer.

## Os 5 métodos HTTP principais

O instrutor demonstra cada um usando o Insomnia:

1. **GET** — Obter recursos. É o padrão quando você acessa uma URL no navegador.
2. **POST** — Criar um novo recurso. Envia dados no body.
3. **PUT** — Substituir completamente um recurso existente.
4. **PATCH** — Atualizar parcialmente um recurso existente.
5. **DELETE** — Remover um recurso.

## O objeto Request

O primeiro parâmetro do callback de `http.createServer` é o objeto `IncomingMessage` (request). Ele contém:

- `method` — string uppercase: `'GET'`, `'POST'`, `'PUT'`, `'PATCH'`, `'DELETE'`
- `url` — o path da requisição
- `headers` — os headers HTTP

## Destructuring do Request

O instrutor mostra a evolução:

**Passo 1 — Acesso direto:**
```javascript
res.write(`Método: ${req.method}`)
```

**Passo 2 — Destructuring:**
```javascript
const { method } = req
res.write(`Método: ${method}`)
```

A vantagem do destructuring: quando você precisa acessar múltiplas propriedades (method, url, headers), fica muito mais limpo do que repetir `req.` em todo lugar.

## Importância para roteamento

Identificar o método é o primeiro passo para construir um roteador. A combinação `method + url` define unicamente uma rota:

- `GET /users` → listar
- `POST /users` → criar
- `PUT /users/:id` → substituir
- `DELETE /users/:id` → remover

Sem identificar o método, o servidor trataria todas as requisições da mesma forma, independente da intenção do cliente.

## Valores de `req.method`

O Node.js sempre retorna o método em **UPPERCASE**. Isso é importante para comparações — nunca compare com lowercase (`'get'`), sempre use `'GET'`.