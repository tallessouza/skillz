# Code Examples: Dominio e App GitHub para Deploy

## Registro CNAME no AWS Route 53

```
Record type: CNAME
Record name: next-saas-api
Value: <valor-fornecido-pelo-render>.onrender.com
TTL: 60
```

## Variaveis de ambiente no Render

```bash
# Backend API URL (dominio customizado do backend)
NEXT_PUBLIC_API_URL=https://next-saas-api.seudominio.dev

# GitHub OAuth (credenciais da OAuth App)
GITHUB_AUTH_CLIENT_ID=Iv1.abc123def456
GITHUB_AUTH_CLIENT_SECRET=ghsecret_abc123def456...

# Redirect URI (dominio do FRONTEND, nao do backend)
GITHUB_AUTH_CLIENT_REDIRECT_URI=https://next-saas.seudominio.dev/api/auth/callback
```

## Sem dominio proprio: usando dominio do Render

```bash
# Se nao tem dominio proprio, use o gerado pelo Render
# Backend
NEXT_PUBLIC_API_URL=https://meu-app-backend.onrender.com

# Frontend (sera configurado no deploy do frontend)
GITHUB_AUTH_CLIENT_REDIRECT_URI=https://meu-app-frontend.onrender.com/api/auth/callback
```

## GitHub OAuth App — Configuracao

```
Application name: NextSaaS
Homepage URL: https://next-saas.seudominio.dev
Description: (opcional)
Authorization callback URL: https://next-saas.seudominio.dev/api/auth/callback
```

## Verificacao pos-deploy

```bash
# Verificar se API esta respondendo no dominio customizado
curl -I https://next-saas-api.seudominio.dev

# Resposta esperada (mesmo sem rotas configuradas)
# HTTP/2 404 — "rota nao encontrada" indica que o servidor esta ativo

# Verificar certificado SSL
curl -vI https://next-saas-api.seudominio.dev 2>&1 | grep "SSL certificate"
```

## Checklist de variaveis antes do deploy

```bash
# Verificar que todas as URLs estao consistentes
echo "API URL: $NEXT_PUBLIC_API_URL"          # Deve ser backend
echo "Redirect: $GITHUB_AUTH_CLIENT_REDIRECT_URI"  # Deve ser frontend
echo "Client ID: $GITHUB_AUTH_CLIENT_ID"      # Da OAuth App
echo "Client Secret: $GITHUB_AUTH_CLIENT_SECRET"  # Da OAuth App

# Regra: API_URL nunca deve ser igual ao REDIRECT_URI (dominios diferentes)
```