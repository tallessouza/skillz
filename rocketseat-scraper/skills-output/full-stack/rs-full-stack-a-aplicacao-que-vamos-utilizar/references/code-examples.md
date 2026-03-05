# Code Examples: Setup do Projeto Base — Query Builder

## server.ts completo (estado inicial)

```typescript
import express from "express"

const app = express()

// Middleware para parsear JSON no body das requisicoes
// Necessario para POST/PUT que virao nas proximas aulas
app.use(express.json())

// Rota raiz — apenas para verificar que o servidor esta rodando
app.get("/", (req, res) => {
  res.json("hello world")
})

// Porta 3333 — padrao usado no curso
app.listen(3333)
```

## Verificacao via terminal

```bash
# Instalar dependencias (obrigatorio antes de rodar)
npm install

# Iniciar servidor com hot reload
npm run dev

# Testar em outro terminal
curl http://localhost:3333
# Output: "hello world"
```

## Configuracao do Insomnia — passo a passo

```
1. Abrir Insomnia
2. Create → Request Collection → nome: "query builder"
3. Dentro da colecao: New HTTP Request
4. Nome: "index"
5. Metodo: GET
6. URL: http://localhost:3333
7. Click "Send"
8. Response esperado: "hello world" (status 200)
```

## Teste de hot reload

Alterar o retorno no `server.ts`:

```typescript
// De:
app.get("/", (req, res) => {
  res.json("hello world")
})

// Para:
app.get("/", (req, res) => {
  res.json("hello")
})
```

Recarregar no Insomnia (Send novamente) — o resultado muda sem reiniciar o servidor manualmente.

## package.json (dependencias esperadas)

```json
{
  "name": "query-builder",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "express": "^4.x"
  },
  "devDependencies": {
    "@types/express": "^4.x",
    "tsx": "^4.x",
    "typescript": "^5.x"
  }
}
```

> Nota: as versoes exatas podem variar. O importante e ter Express, TypeScript e tsx (ou ts-node-dev) para hot reload.