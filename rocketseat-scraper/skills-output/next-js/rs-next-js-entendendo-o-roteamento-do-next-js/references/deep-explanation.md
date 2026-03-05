# Deep Explanation: Roteamento do Next.js (Pages Router)

## Por que Pages Router primeiro?

O instrutor enfatiza que entender o Pages Router e fundamental antes de migrar para o App Router. A estrategia do curso e: construir com Pages Router → migrar para App Router. Isso porque os conceitos de roteamento baseado em filesystem sao a base de ambos, e o Pages Router e mais simples de entender inicialmente.

## Filesystem como fonte de verdade

A grande sacada do Next.js em relacao ao React Router DOM e que **a estrutura de pastas E a API de rotas**. Nao existe um arquivo de configuracao central de rotas. Isso elimina uma categoria inteira de bugs: rotas configuradas errado, imports esquecidos, typos em paths.

O instrutor destaca a facilidade: "basta a gente criar os arquivos dentro da pasta pages e ja automaticamente viram rotas no browser. Isso aqui e sensacional."

## Pagina = Componente React

O instrutor reforça que uma pagina no Next nada mais e do que um componente React com `export default`. Nao ha magia — e um componente que o Next decide renderizar baseado na URL.

## Rotas dinamicas com colchetes

A convencao de colchetes (`[slug].tsx`) e o mecanismo do Next para rotas dinamicas. O parametro fica acessivel via `useRouter().query`. O instrutor mostra que ao mudar a URL de `/posts/1` para `/posts/10`, o valor de `query.slug` muda automaticamente.

**Importante:** O nome dentro dos colchetes (`slug`, `id`, etc.) define a chave em `router.query`. Se o arquivo e `[postId].tsx`, acessa via `router.query.postId`.

## Catch-All: reticencias nos colchetes

O `[...slug].tsx` captura **todos** os segmentos apos aquele ponto da URL como um **array de strings**. O instrutor demonstra:

- `/blog/posts/20` → `slug = ["20"]`
- `/blog/posts/20/10/30/40` → `slug = ["20", "10", "30", "40"]`

O instrutor confessa que "o caso de uso dele e bem menor" que rotas dinamicas simples, mas que "tem muita gente que trabalha com o Next e nao conhece". Casos de uso tipicos: documentacao com paths variaveis, breadcrumbs dinamicos, redirecionamentos flexiveis.

## Diferenca chave: string vs array

- `[slug].tsx` → `router.query.slug` retorna **string**
- `[...slug].tsx` → `router.query.slug` retorna **string[]**

O instrutor nota essa mudanca explicitamente: "ele nao ta vindo mais um string sozinho. Ele ta vindo um array de strings."

## useRouter: muito mais que query

O instrutor menciona que "a gente ta usando so 0,1%" do useRouter nessa aula, sinalizando que o hook tem muitas outras capacidades (push, replace, events, etc.) que serao exploradas depois.