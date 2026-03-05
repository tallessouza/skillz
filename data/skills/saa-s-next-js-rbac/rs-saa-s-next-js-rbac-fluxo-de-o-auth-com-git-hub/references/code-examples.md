# Code Examples: Fluxo de OAuth com GitHub

## URLs do fluxo

### URL de autorizacao (front-end redireciona para ca)

```
https://github.com/login/oauth/authorize?client_id=SEU_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/callback&scope=user
```

### URL de troca code → token (back-end faz POST)

```
https://github.com/login/oauth/access_token
```

### URL de dados do usuario (back-end faz GET)

```
https://api.github.com/user
```

## Configuracao da OAuth App no GitHub

```
Application name:           next-rbac-saas
Homepage URL:               http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback
```

## Variaveis de ambiente

```env
GITHUB_CLIENT_ID=seu_client_id_aqui
GITHUB_CLIENT_SECRET=seu_client_secret_aqui
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Implementacao completa do endpoint (back-end Node.js)

```typescript
// Route: POST /sessions/github
import { z } from 'zod'

const githubOAuthSchema = z.object({
  code: z.string(),
})

async function authenticateWithGitHub(request, reply) {
  const { code } = githubOAuthSchema.parse(request.body)

  // Step 1: Trocar code por access_token
  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: env.GITHUB_REDIRECT_URI,
      }),
    }
  )

  const { access_token } = await tokenResponse.json()

  // Step 2: Obter dados do usuario
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  const githubUser = await userResponse.json()

  // Step 3: Criar ou atualizar usuario no banco
  // githubUser.id, githubUser.email, githubUser.name, githubUser.avatar_url

  // Step 4: Gerar e retornar token JWT da aplicacao
}
```

## Callback no front-end (Next.js App Router)

```typescript
// app/api/auth/callback/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return Response.redirect('/sign-in?error=no-code')
  }

  // Chamar o back-end enviando o code
  const response = await fetch('http://localhost:3333/sessions/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })

  const { token } = await response.json()

  // Salvar token (cookie, etc.) e redirecionar
  return Response.redirect('/')
}
```

## Botao de login no front-end

```tsx
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=user`

function SignInPage() {
  return (
    <a href={GITHUB_AUTH_URL}>
      Entrar com GitHub
    </a>
  )
}
```