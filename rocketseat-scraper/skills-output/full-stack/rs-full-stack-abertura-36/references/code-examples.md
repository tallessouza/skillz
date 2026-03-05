# Code Examples: Abertura — API de Restaurante

## Estrutura base esperada do projeto

```
restaurant-api/
├── src/
│   ├── server.js          # Entry point, Express setup
│   ├── routes/            # Definicao de rotas
│   ├── controllers/       # Logica dos endpoints
│   ├── database/
│   │   ├── connection.js  # Configuracao do Knex
│   │   └── migrations/    # Migrations do banco
│   └── knexfile.js        # Configuracao do Query Builder
├── package.json
└── .gitignore
```

## Setup inicial tipico

### package.json
```json
{
  "name": "restaurant-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "node --watch src/server.js",
    "knex": "knex --knexfile src/knexfile.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "knex": "^3.0.0",
    "sqlite3": "^5.1.0"
  }
}
```

### src/server.js
```javascript
const express = require("express")
const app = express()

app.use(express.json())

// Routes will be added as the project evolves

const PORT = 3333
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### src/database/connection.js
```javascript
const knex = require("knex")
const config = require("../knexfile")

const connection = knex(config)

module.exports = connection
```

### src/knexfile.js
```javascript
const path = require("path")

module.exports = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database", "database.db"),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, "database", "migrations"),
  },
}
```

## Nota

Esta aula e apenas a abertura. Os exemplos acima representam o setup tipico que sera construido nas proximas aulas. O codigo real sera desenvolvido incrementalmente conforme os detalhes do projeto forem revelados.