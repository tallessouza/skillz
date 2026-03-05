# Deep Explanation: Exibindo Organizacao Ativa com Middleware

## Por que server components nao acessam a URL?

No Next.js App Router, server components sao renderizados no servidor via streaming. Eles nao tem acesso ao objeto `window` nem ao `URL` do navegador. Isso e uma limitacao arquitetural intencional — server components sao executados antes do browser, entao nao existe URL de browser nesse ponto.

A unica forma de compartilhar informacao entre client-side e server-side no Next.js e via **cookies**. Cookies trafegam em ambas as direcoes (request e response), tornando-os o mecanismo perfeito para sincronizar estado derivado da URL.

## Por que nao usar server action no click?

O instrutor explica um problema sutil: se voce usar uma server action vinculada ao click do botao de trocar organizacao, o cookie so sera atualizado quando o usuario clicar. Mas e se ele digitar a URL diretamente no navegador? Nesse caso, a server action nunca e chamada, e o cookie fica dessincronizado.

O middleware resolve isso porque ele intercepta **qualquer** navegacao — seja por click, seja por digitacao direta na URL, seja por link externo.

## Como o middleware funciona

O middleware no Next.js e um arquivo `middleware.ts` na raiz do `src/`. Ele e executado **antes** de qualquer rota ser acessada. O fluxo e:

1. Usuario navega para `/org/acme-admin`
2. Middleware intercepta a requisicao
3. Middleware extrai `acme-admin` do pathname via `split('/')`
4. Middleware salva `org=acme-admin` nos cookies da response
5. Middleware chama `NextResponse.next()` permitindo o acesso a rota
6. Server component le `cookies().get('org')` e obtem `acme-admin`

## Desestruturacao com skip de posicoes

O instrutor usa um pattern elegante para extrair o slug:

```typescript
const [, , slug] = pathname.split('/')
```

Quando `pathname` e `/org/acme-admin`, o split por `/` retorna `['', 'org', 'acme-admin']`. As duas virgulas iniciais ignoram os dois primeiros elementos (string vazia e `org`), capturando diretamente o slug.

## Config matcher — por que excluir rotas

O `config.matcher` garante que o middleware so execute em rotas de pagina, nao em:
- `/api/*` — rotas de API
- `/_next/static/*` — arquivos estaticos do build
- `/_next/image/*` — otimizacao de imagens
- `/favicon.ico` — favicon

Sem isso, o middleware executaria desnecessariamente em cada asset carregado pela pagina.

## Limpeza do cookie

Quando o usuario navega para fora de `/org` (por exemplo, volta para a home `/`), o middleware deleta o cookie. Isso evita que o header mostre uma organizacao ativa quando o usuario nao esta em nenhuma pagina de organizacao.

## Truncate vs line-clamp

O instrutor testou `line-clamp-1` e percebeu que `truncate` funciona melhor para textos inline. `truncate` do Tailwind aplica:
- `overflow: hidden`
- `text-overflow: ellipsis`
- `white-space: nowrap`

Isso garante que nomes longos de organizacao nunca quebrem o layout do header.