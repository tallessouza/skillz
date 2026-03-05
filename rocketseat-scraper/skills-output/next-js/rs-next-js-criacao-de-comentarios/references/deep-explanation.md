# Deep Explanation: Criacao de Comentarios no Next.js

## Por que headers nao sao enviados automaticamente no server-side?

Quando o browser faz uma requisicao (client-side), ele automaticamente inclui cookies, authorization headers, etc. Mas quando o Next.js server faz uma requisicao para o backend, e uma comunicacao server-to-server — nao ha browser envolvido. Por isso, os headers de autenticacao precisam ser extraidos do request original do usuario e repassados manualmente.

## O problema do content-length mismatch

O instrutor encontrou um erro `Request body length does not match content length header` ao repassar todos os headers. Isso acontece porque o header `content-length` do request original refere-se ao tamanho do body do request do browser, nao do body do novo fetch que o server esta fazendo. A solucao e **nunca repassar todos os headers** — extrair apenas o que precisa (cookies).

## Por que `server-only`?

O pacote `server-only` e um mecanismo de protecao em build time. Ao importar `import "server-only"` no topo de um arquivo, o bundler do Next.js vai gerar erro se esse arquivo for importado em qualquer client component. Isso previne bugs silenciosos onde funcoes que dependem de APIs server-side (como `headers()`) sao acidentalmente executadas no browser.

## O padrão server action como ponte

O problema central: um client component (com React Hook Form) precisa executar logica que depende de headers server-side. A solucao elegante do Next.js:

1. No **server component** (page.tsx), crie uma funcao `async` com `"use server"` — isso transforma a funcao em uma **server action**, que o Next trata como uma rota HTTP automatica
2. Passe essa funcao como **prop** para o client component
3. O client component chama a funcao normalmente — o Next intercepta e faz a chamada via HTTP automaticamente

Isso significa que a funcao `handleCreateComment` nunca executa no browser. O Next gera internamente um endpoint e o client faz um POST para esse endpoint.

## Hydration mismatch com useSession

O `useSession` e um hook client-side que faz uma requisicao assincrona para verificar autenticacao. No primeiro render (server-side), `session` e `null` e `isPending` e `true`. Quando o client hydrata, a sessao carrega e muda para o valor real.

Se voce usar `session` diretamente para condicionar o que renderiza (ex: placeholder do input), o server renderiza "Sign in to comment" mas o client quer renderizar "Leave a comment" — gerando hydration mismatch.

**Solucao do instrutor:** mover a verificacao de autenticacao para o server component usando `authClient.getSession()` com os headers do request, e passar `isAuthenticated` como prop booleana. Assim, o valor e consistente entre server e client render.

## Por que Fetch API nao envia content-type?

Diferente do Axios que automaticamente serializa objetos como JSON e adiciona o header `content-type: application/json`, a Fetch API nativa nao faz isso. Mesmo usando `JSON.stringify()` no body, o server receptor nao sabe que o body e JSON sem o header. Isso causa erros como "No value" ou falha no parse do body.