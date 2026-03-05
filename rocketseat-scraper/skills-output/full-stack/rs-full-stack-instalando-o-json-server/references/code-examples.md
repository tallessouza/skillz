# Code Examples: JSON Server — Setup de API Local

## Instalação

```bash
npm install json-server
```

Resultado esperado no diretório:
```
projeto/
├── node_modules/
├── index.html
├── main.js
├── package.json
├── package-lock.json
└── server.json
```

## server.json — Vazio (inicial)

```json
{}
```

## server.json — Com um recurso de teste

```json
{
  "teste": [
    { "name": "Rodrigo Gonçalves" }
  ]
}
```

Acessando `http://localhost:3333/teste`:
```json
[
  { "name": "Rodrigo Gonçalves" }
]
```

## server.json — Múltiplos recursos

```json
{
  "users": [
    { "id": 1, "name": "Rodrigo Gonçalves" },
    { "id": 2, "name": "Maria Silva" }
  ],
  "products": [
    { "id": 1, "title": "Notebook", "price": 3500 }
  ],
  "orders": []
}
```

Endpoints gerados:
- `GET http://localhost:3333/users`
- `GET http://localhost:3333/products`
- `GET http://localhost:3333/orders`

## package.json — Script com porta padrão (3000)

```json
{
  "scripts": {
    "server": "json-server server.json"
  }
}
```

## package.json — Script com porta customizada

```json
{
  "scripts": {
    "server": "json-server server.json --port 3333"
  }
}
```

## Execução e interrupção

```bash
# Iniciar
npm run server

# Saída esperada:
#   JSON Server started on PORT 3333
#   Resources:
#     http://localhost:3333/users
#     http://localhost:3333/products

# Interromper
# Ctrl+C no terminal
```

## Estrutura HTML base do curso (contexto)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Consumindo API</title>
</head>
<body>
  <script src="main.js"></script>
</body>
</html>
```

## Variações de nome do arquivo de dados

```json
// Qualquer nome funciona, basta referenciar no script:
"server": "json-server db.json --port 3333"
"server": "json-server api.json --port 3333"
"server": "json-server data.json --port 3333"
```