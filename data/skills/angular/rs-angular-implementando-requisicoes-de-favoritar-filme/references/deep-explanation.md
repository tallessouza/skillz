# Deep Explanation: Requisicoes de Favoritar Filme

## Por que o POST exige body vazio?

O `HttpClient.post()` do Angular tem a assinatura `post<T>(url, body, options?)`. O segundo argumento (body) e **obrigatorio**. Mesmo quando a API so precisa do ID na URL e nao espera payload no body, voce precisa passar `{}` explicitamente. O TypeScript vai reclamar se voce omitir — nao e um erro de runtime, e um erro de compilacao.

O instrutor destaca isso no video: "Ele está reclamando que eu não estou passando o segundo argumento. No caso, eu vou estar passando um objeto vazio mesmo no body dessa requisição."

## Por que tipar DELETE como void?

Quando uma API retorna `204 No Content`, nao ha JSON no response body. O instrutor verificou isso no Insomnia: "ele tem aqui um 204 no content então ele não vai retornar para gente um response ali que tem um json no body desse response."

Tipar como `void` comunica para qualquer dev que consuma esse Observable que nao deve esperar dados no `.subscribe()` ou `.pipe()`. E documentacao viva no codigo.

## Organizacao de interfaces em shared/models/

O padrao da Skillz e criar um arquivo por interface de response na pasta `shared/models/`. O nome do arquivo segue o padrao kebab-case que descreve o contrato: `move-to-favorite-success-response.ts`.

Isso evita:
- Interfaces inline que nao podem ser reutilizadas
- Arquivos gigantes com dezenas de interfaces
- Imports circulares entre services

## Nomenclatura do instrutor

O instrutor usa o prefixo `I` para interfaces (padrao comum em Angular/TypeScript corporativo): `IMovieToFavoriteSuccessResponse`. O nome e longo mas descritivo — "um response de sucesso de adicionar o filme aos favoritos". A escolha deliberada e priorizar clareza sobre brevidade.

## Padrao de service pareado

Favoritar/desfavoritar e um padrao recorrente em apps: like/unlike, follow/unfollow, bookmark/unbookmark. O padrao e sempre:
- **Adicionar:** POST com ID na URL, retorna confirmacao (message)
- **Remover:** DELETE com ID na URL, retorna 204 void

Ambos ficam no mesmo service porque pertencem ao mesmo dominio (`FavoritesApiService`).