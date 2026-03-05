# Deep Explanation: Outros Controllers da Academia

## Por que query params sao sempre strings

No Fastify (e Express), tudo que vem via `request.query` chega como string. Isso e uma caracteristica do protocolo HTTP — a URL `?page=2` transmite `"2"` como texto. Se voce fizer `page + 1`, o resultado sera `"21"` (concatenacao de string), nao `3`.

O instrutor destaca essa armadilha especificamente: "todos os parametros que vem atraves do request.query, eles sao strings". A solucao e usar `z.coerce.number()` do Zod, que automaticamente converte a string para numero antes de validar.

## O padrao de coerce do Zod

`z.coerce.number()` faz internamente `Number(value)` antes de aplicar as validacoes. Isso significa que:
- `"2"` → `2` → valida `.min(1)` → OK
- `"abc"` → `NaN` → falha na validacao → erro automatico
- `undefined` → sem coerce possivel → usa `.default(1)` se definido

Esse padrao elimina toda necessidade de `parseInt`, `parseFloat`, ou `Number()` manual nos controllers.

## Por que separar controllers em arquivos

O instrutor cria tres arquivos separados: `create.ts`, `search.ts`, `nearby.ts`. Isso segue o principio de Single Responsibility do SOLID — cada controller faz exatamente uma coisa. Beneficios:

1. **Testabilidade** — voce pode testar cada controller isoladamente (testes E2E por endpoint)
2. **Legibilidade** — abrir um arquivo e saber imediatamente o que ele faz
3. **Manutencao** — mudar a busca nao arrisca quebrar o create

## Padrao de rotas para um recurso

O instrutor organiza as rotas assim:
- `POST /gyms` — criar (body com dados)
- `GET /gyms/search` — buscar por texto (query: `q`, `page`)
- `GET /gyms/nearby` — buscar por proximidade (query: `latitude`, `longitude`)

Note que search e nearby sao sub-rotas de `/gyms`, nao query params de uma unica rota GET. Isso e intencional — cada operacao tem sua propria rota, seu proprio controller, seu proprio schema de validacao.

## Validacao de latitude/longitude

O instrutor reutiliza as validacoes do controller de create:
- Latitude: `Math.abs(value) <= 90`
- Longitude: `Math.abs(value) <= 180`

A diferenca e que no create vem do body (POST), e no nearby vem do query (GET). Por isso usa `z.coerce.number()` no nearby (string → number) mas pode usar `z.number()` direto no create (JSON ja converte).

## O papel do `q` como nome de parametro

O instrutor menciona: "muitas aplicacoes ate diminuem esse nome para apenas q". Isso e uma convencao amplamente adotada (Google usa `?q=`, GitHub usa `?q=`). Para query params de busca textual, `q` e universalmente entendido e economiza caracteres na URL.

## Factory pattern nos controllers

Cada controller chama `makeXxxUseCase()` ao inves de instanciar o use case diretamente. Isso:
1. Esconde a complexidade de instanciacao (repository, dependencias)
2. Permite trocar implementacoes (in-memory para testes, Prisma para producao)
3. Mantem o controller ignorante sobre detalhes de infraestrutura