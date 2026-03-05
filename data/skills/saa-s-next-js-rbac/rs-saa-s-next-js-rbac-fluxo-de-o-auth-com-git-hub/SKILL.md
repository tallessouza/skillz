---
name: rs-saas-nextjs-rbac-oauth-github
description: "Applies GitHub OAuth authentication flow when building login with GitHub in Node.js/Next.js applications. Use when user asks to 'implement GitHub login', 'add OAuth', 'authenticate with GitHub', 'social login', or 'sign in with GitHub'. Guides the full flow: GitHub App creation, code-for-token exchange, user data fetching, and front-end/back-end responsibility split. Make sure to use this skill whenever implementing GitHub OAuth in any web application. Not for other OAuth providers (Google, Discord), JWT-only auth, or session-based auth without OAuth."
---

# Fluxo de OAuth com GitHub

> Implementar autenticacao com GitHub seguindo o Web Application Flow oficial, separando responsabilidades entre front-end e back-end.

## Prerequisites

- Conta no GitHub com acesso a Developer Settings
- Aplicacao Node.js (back-end) com acesso a banco de dados
- Aplicacao front-end (Next.js ou similar)
- Variáveis de ambiente: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI`

## Steps

### Step 1: Criar GitHub OAuth App

1. GitHub → Settings → Developer Settings → OAuth Apps → New OAuth Application
2. Preencher:
   - **Application name:** Nome do projeto
   - **Homepage URL:** `http://localhost:3000` (dev)
   - **Authorization callback URL:** URL do **front-end**, nao do back-end

```
http://localhost:3000/api/auth/callback
```

3. Anotar `Client ID` (publico) e gerar `Client Secret` (privado)

### Step 2: Redirecionar usuario para GitHub

No front-end, redirecionar para:

```
https://github.com/login/oauth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&scope=user
```

- `client_id` — ID publico da aplicacao (pode ficar no front-end)
- `redirect_uri` — URL de callback configurada na OAuth App
- `scope` — `user` para acessar dados do perfil

### Step 3: Receber o code no front-end

Apos login, GitHub redireciona para o callback com `?code=XXXXX`. O front-end:

1. Extrai o `code` dos search params
2. Exibe loading ("Criando sua conta...")
3. Envia o `code` para o back-end via API

### Step 4: Trocar code por access token (back-end)

```typescript
const tokenResponse = await fetch(
  'https://github.com/login/oauth/access_token',
  {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: env.GITHUB_REDIRECT_URI,
    }),
  }
)

const { access_token } = await tokenResponse.json()
```

### Step 5: Obter dados do usuario

```typescript
const userResponse = await fetch('https://api.github.com/user', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
})

const githubUser = await userResponse.json()
// githubUser.email, githubUser.name, githubUser.avatar_url, etc.
```

### Step 6: Criar/atualizar usuario no banco e gerar token da aplicacao

Com os dados do `githubUser`, criar ou atualizar o usuario no banco de dados e retornar um token (JWT) da propria aplicacao.

## Decision: Callback para front-end ou back-end?

| Estrategia | Quando usar |
|------------|-------------|
| **Callback → Front-end** | Quando o fluxo OAuth e especifico para web. Front-end controla a UX (loading, redirecionamento). Back-end fica generico. |
| **Callback → Back-end** | Quando ha um unico cliente. Back-end faz tudo e redireciona o usuario de volta. |

**Recomendado:** Callback para o front-end, porque o back-end nao precisa conhecer ou ter responsabilidade sobre um fluxo especifico de um cliente especifico.

## Heuristics

| Situacao | Acao |
|----------|------|
| `client_id` | Pode ficar no front-end (e publico) |
| `client_secret` | Somente no back-end (nunca expor) |
| Troca code → token | Sempre pelo back-end (protege o secret) |
| Precisa de mais dados do usuario | Adicionar escopos na URL de redirect |
| Escopo padrao | `user` — acessa dados do perfil |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| Trocar code por token no front-end | Enviar code para o back-end, trocar la |
| Expor `client_secret` no front-end | Manter apenas em variavel de ambiente do back-end |
| Salvar o `code` do GitHub como autenticacao | Trocar por access_token, depois gerar JWT proprio |
| Hardcodar client_id no codigo | Usar variavel de ambiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
