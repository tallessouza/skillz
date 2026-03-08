# Code Examples: Deploy Frontend na Vercel via GitHub

## Configuração típica de projeto Vite para Vercel

### package.json com scripts padrão

```json
{
  "name": "brandman",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

A Vercel detecta este `package.json` e identifica Vite como framework automaticamente.

## Variáveis de ambiente

### No desenvolvimento local (.env)

```env
VITE_API_URL=http://localhost:3333
VITE_APP_NAME=BrandMan
```

### Na Vercel (Environment Variables)

Configure as mesmas variáveis no dashboard da Vercel, com valores de produção:

```
VITE_API_URL = https://api.brandman.com.br
VITE_APP_NAME = BrandMan
```

### Uso no código

```typescript
// As variáveis são acessadas via import.meta.env
const apiUrl = import.meta.env.VITE_API_URL

async function fetchUsers() {
  const response = await fetch(`${apiUrl}/users`)
  const users = await response.json()
  return users
}
```

## Configuração para monorepo

### Estrutura do repositório

```
meu-projeto/
├── apps/
│   ├── web/          ← Root Directory na Vercel: apps/web
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/
│       └── ...
├── packages/
│   └── shared/
└── package.json
```

Na Vercel, configure **Root Directory** como `apps/web`.

## Configurações de build na Vercel

### Projeto simples (auto-detectado)

```
Framework Preset:  Vite
Build Command:     (auto) → vite build
Output Directory:  (auto) → dist
Install Command:   (auto) → npm install
```

### Projeto com build customizado

```
Framework Preset:  Vite
Build Command:     npm run build:production
Output Directory:  dist
Install Command:   npm ci --legacy-peer-deps
```

### vite.config.ts padrão

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Nenhuma configuração especial é necessária para deploy na Vercel — o padrão funciona.

## Verificação pós-deploy

### Checklist manual

```
1. Acesse a URL gerada: https://nome-do-projeto.vercel.app
2. Verifique se a página carrega sem erros no console
3. Teste funcionalidades que dependem de variáveis de ambiente
4. Confirme que a API está acessível (CORS configurado)
5. Teste em dispositivo móvel (responsividade)
```

### Verificação via terminal

```bash
# Verificar se o site está respondendo
curl -I https://nome-do-projeto.vercel.app

# Resposta esperada:
# HTTP/2 200
# content-type: text/html
# cache-control: public, max-age=0, must-revalidate
```

## Configuração de autorização GitHub

### Passo a passo para conceder acesso

1. Na Vercel, ao criar novo projeto, clique em **"Adjust GitHub App Permissions"**
2. No GitHub, vá em Settings → Applications → Vercel
3. Escolha:
   - **All repositories** — acesso total
   - **Only select repositories** — selecione os específicos
4. Clique em **Save**
5. Retorne à Vercel e recarregue a página de importação

### Para repositórios de organização

```
GitHub → Organization Settings → Third-party access → Vercel → Grant
```