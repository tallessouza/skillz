# Deep Explanation: Obtendo Usuario Autenticado

## Por que o redirect nao pode ficar dentro do try/catch

O `redirect()` do Next.js funciona lancando uma excecao especial internamente. Se voce colocar o redirect dentro de um try/catch, o catch vai capturar essa excecao e o redirecionamento nunca acontece. A solucao eh colocar o redirect **depois** do bloco try/catch. O `return` dentro do try garante que, se tudo der certo, o codigo nao chega no redirect abaixo.

```typescript
try {
  const { user } = await getProfile()
  return { user } // se chegar aqui, nao executa o redirect abaixo
} catch {
  // erro na requisicao — token provavelmente invalido
}

// so chega aqui se deu erro no try
redirect('/api/auth/sign-out')
```

## Por que nao deletar cookies diretamente na funcao auth

O Next.js tem uma restricao: cookies so podem ser modificados (set/delete) em **server actions** ou **route handlers**. A funcao `auth` eh uma funcao utilitaria chamada em server components, nao eh uma server action. Tentar fazer `cookies().delete('token')` ali gera o erro:

> "cookies can only be modified in a Server Action or Route Handler"

A solucao eh criar um route handler (`/api/auth/sign-out`) que faz o delete do cookie e redireciona. Assim, quando a funcao auth detecta erro, ela redireciona para esse endpoint que cuida da limpeza.

## O problema do dual-side cookies no Next.js

No Next.js, o mesmo arquivo pode ser importado por server components e client components. O pacote `next/headers` so funciona no servidor — se importado estaticamente em um arquivo que tambem roda no cliente, o Next.js da erro de compilacao.

A solucao eh usar **dynamic import** (`await import('next/headers')`) condicionado a `typeof window === 'undefined'`. Assim:
- No servidor: importa `next/headers` dinamicamente, pega cookies do request
- No cliente: usa a API de cookies do browser (via `cookies-next` sem o parametro `cookies`)

O pacote `cookies-next` abstrai essa diferenca — ele aceita um parametro opcional `cookies` que, quando presente (server-side), usa os cookies do servidor; quando `undefined` (client-side), usa `document.cookie`.

## O tipo CookiesFn

O tipo `CookiesFn` importado de `cookies-next/lib/types` eh o tipo da funcao `cookies` do `next/headers`. Isso permite tipar a variavel `cookieStore` como `CookiesFn | undefined`, cobrindo ambos os cenarios (server com valor, client com undefined).

## Fluxo completo de autenticacao

1. Usuario faz login (GitHub OAuth ou credenciais)
2. Callback salva token nos cookies
3. Qualquer pagina que precisa do usuario chama `auth()`
4. `auth()` verifica se tem token nos cookies
5. Se nao tem token → redirect para sign-in
6. Se tem token → faz GET /profile com token no header (via interceptor)
7. Se a requisicao falha → redirect para `/api/auth/sign-out` (limpa cookie + redirect sign-in)
8. Se sucesso → retorna dados do usuario

## Debug: problemas comuns encontrados na aula

- **Loop infinito de redirects**: acontece quando o interceptor nao injeta o token, a requisicao falha, redireciona para sign-out, que redireciona para sign-in, que redireciona para home, que falha novamente
- **404 no get-profile**: URL errada na funcao HTTP — verificar se o path bate com o backend
- **Package nao instalado**: `cookies-next` precisa ser instalado (`npm i cookies-next`) — erro `can't resolve` indica pacote faltando