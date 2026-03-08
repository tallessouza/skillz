# Code Examples: Compreendendo Deploy

## Cenarios praticos de ambientes

### Exemplo 1: Diferenca de configuracao entre ambientes

```bash
# Ambiente de desenvolvimento
# Roda no localhost, banco local, modo debug
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/myapp_dev
PORT=3000
DEBUG=true

# Ambiente de producao
# Servidor cloud, banco gerenciado, sem debug
NODE_ENV=production
DATABASE_URL=postgresql://prod-server:5432/myapp_prod
PORT=80
DEBUG=false
```

### Exemplo 2: Scripts de package.json para cada ambiente

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "build": "tsc --build"
  }
}
```

- `dev` — usado no ambiente de desenvolvimento (hot reload com nodemon)
- `start` — usado no ambiente de producao (execucao direta, sem hot reload)
- `build` — prepara o codigo para producao (compilacao TypeScript, minificacao, etc.)

### Exemplo 3: Fluxo basico de deploy

```bash
# 1. Desenvolvimento local (ambiente de desenvolvimento)
npm run dev
# Testar, desenvolver, iterar...

# 2. Preparar para producao
npm run build

# 3. Deploy (transferir para ambiente de producao)
# Pode ser via git push, upload, CLI de plataforma, etc.
git push origin main
# ou
railway deploy
# ou
vercel --prod
```

### Exemplo 4: Verificando em qual ambiente a aplicacao esta rodando

```javascript
// Codigo que se comporta diferente por ambiente
if (process.env.NODE_ENV === 'production') {
  // Configuracoes de producao
  // Logs estruturados, cache agressivo, HTTPS obrigatorio
  app.use(helmet())
  app.use(compression())
} else {
  // Configuracoes de desenvolvimento
  // Logs detalhados, CORS permissivo, hot reload
  app.use(cors({ origin: '*' }))
  app.use(morgan('dev'))
}
```

### Exemplo 5: Consumidores do ambiente de producao

O instrutor menciona que multiplos clientes consomem a aplicacao em producao:

```
┌─────────────────────────────────────────┐
│         Ambiente de Producao            │
│         (Servidor Cloud 24/7)           │
│                                         │
│         ┌─────────────────┐             │
│         │   API Backend   │             │
│         └────────┬────────┘             │
│                  │                      │
└──────────────────┼──────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼───┐ ┌───▼────┐ ┌──▼───────┐
   │  Web   │ │ Mobile │ │  Outros  │
   │Frontend│ │  App   │ │ Servicos │
   └────────┘ └────────┘ └──────────┘
```

Todos esses clientes dependem da disponibilidade 24/7 do ambiente de producao. O deploy garante que a versao mais recente do codigo esteja acessivel para todos eles simultaneamente.