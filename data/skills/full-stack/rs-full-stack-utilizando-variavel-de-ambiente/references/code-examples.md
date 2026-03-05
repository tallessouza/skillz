# Code Examples: Variáveis de Ambiente em Node.js

## Exemplo 1: Arquivo .env básico

```bash
# .env
USER_NAME="Rodrigo Gonçalves"
USER_CODE=abc123def456
USER_ID=7
```

Regras demonstradas:
- `USER_NAME` usa aspas porque tem espaço ("Rodrigo Gonçalves")
- `USER_CODE` mistura letras e números, sem espaço = sem aspas
- `USER_ID` é numérico, sem aspas

## Exemplo 2: Configuração do package.json

```json
{
  "scripts": {
    "dev": "tsx watch --env-file .env src/server.ts"
  }
}
```

A flag `--env-file .env` vem depois do `watch` e antes do arquivo de entrada. Sem esta flag, `process.env` não terá as variáveis do `.env`.

## Exemplo 3: Acessando variáveis no controller

```typescript
// src/controllers/session-controller.ts
import { Request, Response } from "express"

class SessionController {
  async create(request: Request, response: Response) {
    // Acessando variáveis de ambiente via process.env
    const userName = process.env.USER_NAME   // "Rodrigo Gonçalves"
    const userCode = process.env.USER_CODE   // "abc123def456"
    const userId = process.env.USER_ID       // "7" (sempre string!)

    return response.json({ message: userName })
  }
}
```

Nota: `process.env` sempre retorna `string | undefined`. Se precisar de número, faça `Number(process.env.USER_ID)`.

## Exemplo 4: Sem a flag (demonstração de falha)

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

Resultado: `process.env.USER_ID` retorna `undefined`. A API retorna corpo vazio.

## Exemplo 5: .env para JWT (caso real do curso)

```bash
# .env — arquivo real com segredo
AUTH_SECRET=rodrigo
```

```bash
# .env.example — arquivo de exemplo commitado no Git
AUTH_SECRET=
```

Para produção, usar hash gerado:
```bash
AUTH_SECRET=5d41402abc4b2a76b9719d911017c592
```

## Exemplo 6: .gitignore

```gitignore
node_modules
.env
```

O `.env` fica "apagadinho" (acinzentado) no VS Code quando está no `.gitignore`, indicando visualmente que não será commitado.

## Exemplo 7: Variações por ambiente

```bash
# .env.development
AUTH_SECRET=segredo_dev_simples
DATABASE_URL=postgresql://localhost:5432/myapp_dev

# .env.production
AUTH_SECRET=5d41402abc4b2a76b9719d911017c592
DATABASE_URL=postgresql://prod-server:5432/myapp_prod
```

```json
{
  "scripts": {
    "dev": "tsx watch --env-file .env.development src/server.ts",
    "start": "node --env-file .env.production dist/server.js"
  }
}
```

## Exemplo 8: Demonstração de hot reload inexistente

```bash
# Aplicação rodando, .env tem USER_ID=7
# Altero para USER_ID=14 e salvo

# Request retorna: 7 (valor antigo!)
# Preciso: Ctrl+C → npm run dev → agora retorna 14
```

Isso acontece porque o arquivo é lido uma vez só, no boot do processo.