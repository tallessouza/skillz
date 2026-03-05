# Deep Explanation: API Busca de Produtos

## Por que NextRequest e nao Request?

O Next.js estende a Native Web Fetch API. Dentro dessa API existem globais como `Headers`, `Request` e `Response`. O Next tambem estende `Request` e `Response`, porem criou novas tipagens (`NextRequest`, `NextResponse`) ao inves de estender as nativas.

Quando voce usa `Request` como tipo, esta usando a tipagem **antes** do Next estender. Isso significa que propriedades como `nextUrl` nao existem. Ao trocar para `NextRequest` (importado de `next/server`), voce ganha acesso a:

- `nextUrl` — objeto URL estendido com `searchParams` acessivel diretamente
- `nextUrl.searchParams` — os query parameters da URL
- Outras propriedades estendidas do Next.js

## Diferenca entre params e searchParams

O instrutor enfatiza a distincao:

- **Path params** (`/products/[slug]`): informacoes que vem na URL como segmentos. Ex: `/products/moletom-ia`. Sao recebidos via segundo argumento da funcao (`{ params }`).
- **Search params** (`/search?q=moletom`): parametros nomeados apos o `?`. Tambem chamados de "search params", "query parameters", "search query". Sao acessados via `request.nextUrl.searchParams`.

A rota de busca usa search params porque a busca e um **filtro**, nao um **identificador de recurso**.

## toLocaleLowerCase vs toLowerCase

O instrutor usa `toLocaleLowerCase()` ao inves de `toLowerCase()` porque:

- `toLocaleLowerCase()` respeita regras de locale (idioma/regiao)
- Lida melhor com acentuacao e caracteres especiais do portugues
- Em idiomas como turco, `toLowerCase()` produz resultados incorretos para certos caracteres

Para uma aplicacao brasileira, isso e particularmente relevante.

## Validacao com Zod

O `z.string().parse(searchParams.get('q'))` faz duas coisas:
1. Garante que o valor existe (nao e null)
2. Garante que e uma string valida

Se o parametro `q` nao existir na URL, o Zod lanca um erro automaticamente, evitando que o codigo continue com um valor null.

## Contexto real vs exemplo didatico

O instrutor deixa claro: "Existem varias formas de fazer a busca. Estou fazendo de uma maneira super simples aqui, que provavelmente nao e a maneira que voce vai utilizar. Isso aqui seria uma query no banco de dados."

Em producao, a filtragem aconteceria:
- No banco de dados (SQL LIKE, full-text search)
- Em um servico de busca (Elasticsearch, Algolia, Meilisearch)
- Nunca filtrando um array em memoria com todos os produtos