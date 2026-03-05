---
name: rs-saas-nextjs-dominio-github-app
description: "Guides domain configuration and GitHub OAuth app setup for Next.js SaaS deployments on Render. Use when user asks to 'configure custom domain', 'setup GitHub OAuth', 'deploy SaaS app', 'connect domain to Render', or 'create GitHub OAuth application'. Covers CNAME records, SSL certificates, OAuth client credentials, and environment variables. Make sure to use this skill whenever deploying a Next.js app that needs custom domain or GitHub authentication. Not for local development setup, CI/CD pipelines, or non-Render hosting platforms."
---

# Dominio e App GitHub para Deploy

> Ao fazer deploy de uma aplicacao SaaS Next.js, configure o dominio customizado e a aplicacao GitHub OAuth com todas as URLs e variaveis de ambiente corretas antes de considerar o backend finalizado.

## Prerequisites

- Conta no Render com aplicacao backend ja deployada
- Dominio proprio registrado (ou usar o dominio gerado pelo Render)
- Acesso ao painel DNS do dominio (ex: AWS Route 53)
- Conta GitHub com acesso a Developer Settings

## Steps

### Step 1: Configurar dominio customizado no Render

1. Acessar Settings > Custom Domains > Add Custom Domain
2. Inserir o dominio sem `https://` e sem barra final
3. Salvar e copiar o valor CNAME fornecido pelo Render

```
# Exemplo de dominio
next-saas-api.seudominio.dev
```

### Step 2: Criar registro CNAME no DNS

1. No painel DNS (ex: AWS Route 53), criar um record tipo CNAME
2. Name: o subdominio desejado (ex: `next-saas-api`)
3. Value: o valor CNAME fornecido pelo Render
4. TTL: 60 segundos (1 minuto)

### Step 3: Aguardar certificado SSL

- Apos verificacao do CNAME, o Render gera automaticamente o certificado SSL
- Pode levar alguns minutos (antigamente ate 24h, hoje e rapido)
- A API so sera acessivel via HTTPS apos o certificado ser gerado
- Continue com outras configuracoes enquanto aguarda

### Step 4: Criar aplicacao GitHub OAuth

1. GitHub > Settings > Developer Settings > OAuth Apps > New OAuth App
2. Preencher:

| Campo | Valor |
|-------|-------|
| Application name | Nome do projeto |
| Homepage URL | `https://seudominio.dev` (URL do frontend, sem `/api`) |
| Authorization callback URL | `https://seudominio.dev/api/auth/callback` |

3. Registrar e copiar o **Client ID**
4. Gerar um **Client Secret** e copiar

### Step 5: Atualizar variaveis de ambiente no Render

1. Render > Environment > Edit
2. Atualizar:

| Variavel | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | URL do dominio customizado da API |
| `GITHUB_AUTH_CLIENT_ID` | Client ID gerado |
| `GITHUB_AUTH_CLIENT_SECRET` | Client Secret gerado |
| `GITHUB_AUTH_CLIENT_REDIRECT_URI` | URL do frontend + `/api/auth/callback` |

3. Save & Deploy — um novo deploy sera disparado automaticamente

### Step 6: Verificar

- Acessar o dominio customizado via HTTPS
- Verificar que a API responde (mesmo que "rota nao encontrada" enquanto deploy roda)
- Acompanhar metricas em Metrics (limitado no plano gratuito)

## Heuristics

| Situacao | Acao |
|----------|------|
| Nao tem dominio proprio | Usar dominio gerado pelo Render e ajustar todas as variaveis |
| `GITHUB_AUTH_CLIENT_REDIRECT_URI` | Sempre aponta para o dominio do FRONTEND, nao do backend |
| `NEXT_PUBLIC_API_URL` | Sempre aponta para o dominio do BACKEND |
| Certificado SSL demora | Continue outras configuracoes, volte depois para verificar |
| Plano gratuito do Render | Apenas para testes, nao para producao comercial |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Usar HTTP em producao | Sempre aguardar o certificado SSL e usar HTTPS |
| Confundir URL do backend com frontend nas variaveis | `API_URL` = backend, `REDIRECT_URI` = frontend |
| Colocar `https://` ao adicionar dominio no Render | Inserir apenas o dominio limpo sem protocolo |
| Deixar barra final no dominio | Remover trailing slash |
| Usar plano gratuito para producao comercial | Migrar para plano pago antes de ir ao ar |
| Esquecer de fazer Save & Deploy apos alterar variaveis | Sempre salvar e deployar para aplicar mudancas |

## Error handling

- Se CNAME nao verificar: checar se o registro DNS esta correto e aguardar propagacao
- Se SSL nao gerar: dar F5 na pagina de settings do Render e aguardar
- Se OAuth falhar: verificar que o callback URL no GitHub bate exatamente com o configurado nas variaveis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-dominio-e-app-github/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-dominio-e-app-github/references/code-examples.md)
