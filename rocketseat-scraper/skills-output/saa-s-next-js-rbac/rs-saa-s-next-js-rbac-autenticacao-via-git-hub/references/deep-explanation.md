# Deep Explanation: Autenticacao via GitHub no Next.js

## Por que a server action fica na raiz do grupo auth?

O instrutor (Diego) observa que tanto o formulario de sign-in quanto o de sign-up possuem o botao "Sign in with GitHub". Se a action ficasse dentro de `app/auth/sign-in/actions.ts`, seria necessario duplica-la ou importa-la de um local nao intuitivo. Colocando em `app/auth/actions.ts`, ambas as paginas importam do mesmo lugar.

## O fluxo OAuth completo explicado

1. **Usuario clica no botao** → server action executa no servidor
2. **Server action monta URL do GitHub** → `https://github.com/login/oauth/authorize?client_id=X&redirect_uri=Y&scope=user`
3. **`redirect()` envia o usuario para o GitHub** → GitHub mostra tela de autorizacao (apenas na primeira vez)
4. **GitHub redireciona para `redirect_uri`** → `http://localhost:3000/api/auth/callback?code=ABC123`
5. **Route handler captura o `code`** → envia para o backend via HTTP
6. **Backend troca `code` por access token do GitHub** → cria/encontra usuario no banco → retorna JWT
7. **Route handler salva JWT nos cookies** → redireciona usuario para `/`

## Por que usar `new URL()` em vez de template string?

O construtor `new URL()` garante encoding correto dos parametros. Se o `redirect_uri` contiver caracteres especiais, a URL ficaria malformada com concatenacao manual. Alem disso, `searchParams.set()` e mais legivel e menos propenso a erros que `?client_id=${id}&redirect_uri=${uri}`.

## O problema do botao dentro do form

Diego encontrou um bug ao vivo: o botao de GitHub estava dentro do `<form>` principal do login por e-mail/senha. Como tinha `type="submit"`, clicar nele disparava o submit do formulario de login em vez de chamar a action do GitHub.

Solucoes tentadas:
1. `formAction` no botao → nao funcionou confiavelmente
2. Tirar o botao do form → funciona mas perde semantica
3. **Solucao final:** envolver o botao em seu proprio `<form action={signInWithGitHub}>` → limpo e funcional

## Por que clonar `request.nextUrl`?

O Next.js exige URL absoluta no `NextResponse.redirect()`. Em vez de hardcodar `http://localhost:3000/`, clonar `request.nextUrl` preserva:
- O protocolo correto (http em dev, https em prod)
- O host correto (localhost:3000 em dev, dominio em prod)
- O port correto

Depois de clonar, altera-se apenas `pathname` e `search`.

## Por que limpar search params?

Apos o redirect do GitHub, a URL contem `?code=ABC123`. Se o usuario for redirecionado para `/` com esse parametro, alem de ser visualmente confuso, poderia causar problemas se a pagina tentasse interpretar query params inesperados.

## Reutilizando padrao da funcao HTTP

Diego copiou `signInWithPassword.ts` e usou find-and-replace com preservacao de casing (Ctrl+Shift+P no VS Code). A funcao HTTP segue o mesmo padrao: recebe input tipado, chama endpoint, retorna response tipada. A unica diferenca e que recebe `code` em vez de `email` e `password`, e chama `sessions/github` em vez de `sessions/password`.