# Deep Explanation: _app vs _document no Next.js Pages Router

## Por que existem dois arquivos?

O Next.js Pages Router separa responsabilidades em dois niveis:

1. **_app** — o "wrapper" da aplicacao. Toda pagina que existe na pasta pages/ e injetada dentro do _app como o `Component`. Isso significa que o _app envolve toda a aplicacao e e re-executado a cada navegacao entre paginas.

2. **_document** — a "casca" HTML. Ele define a estrutura inicial do HTML que o servidor envia ao browser. Ele so roda uma vez, no servidor, e nunca mais e tocado no client.

## A diferenca fundamental: onde executa

O instrutor demonstrou isso com `console.log`:

- No **_app**: o console.log aparece tanto no terminal do servidor quanto no console do browser. Isso prova que o _app executa nos dois ambientes.
- No **_document**: o console.log aparece APENAS no terminal do servidor. No browser, nada. Isso prova que o _document e server-only.

Essa diferenca e a chave para decidir onde colocar cada coisa.

## Analogia pratica

Pense no _document como o "esqueleto" — a estrutura ossea do HTML (html, head, body). Ele e montado uma vez no servidor.

Pense no _app como a "pele" — tudo que o usuario ve e interage. Ele muda, reage, e re-renderiza.

## Por que estilos globais vao no _app e nao no _document?

O instrutor destacou que ate o Tailwind CSS tem seu import global no _app.tsx. Isso porque:
- Estilos globais precisam ser processados pelo bundler (Webpack/Turbopack)
- O _document nao participa do pipeline de CSS modules/PostCSS
- Colocar no _document simplesmente nao funciona para imports de CSS

## Por que providers vao no _app?

Providers (Redux, Context API, Zustand, Material UI) precisam:
- Envolver o componente da pagina atual
- Manter estado entre navegacoes
- Reagir a mudancas

Como o _document so roda no servidor e nao tem re-render, ele nao pode hospedar providers.

## Quando o _app re-executa?

Toda vez que ha uma transicao de pagina (via Next Link ou router.push), o _app e re-executado. Isso e o que permite:
- Manter estado global consistente
- Aplicar transicoes de pagina
- Manter layouts persistentes

## _document e opcional, _app e obrigatorio

O instrutor corrigiu a si mesmo durante a aula: o _document pode ser deletado (o Next usa um default interno). Mas o _app e obrigatorio — sem ele, nao ha como renderizar paginas.

## Relacao com Server-Side Rendering

O Next.js, mesmo para paginas que usam SSR ou SSG, ainda envia JavaScript ao client para interatividade (hydration). O _document define o HTML inicial que sera hidratado. O _app participa tanto da renderizacao server quanto da hidratacao client.