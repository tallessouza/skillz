# Deep Explanation: Rota de Perfil do Usuario Logado

## Por que documentar respostas no Swagger?

O instrutor destaca que **toda rota** precisa ter suas respostas documentadas no schema. Quando voce adiciona o `response` com os status codes (201, 400), o Swagger automaticamente exibe os campos esperados para cada cenario. Isso e descrito como "uma maravilha" para o desenvolvimento frontend, porque o dev frontend sabe exatamente:
- Quais campos vem na resposta
- Quais podem ser nulos
- Qual o formato de erro

Sem essa documentacao, o Swagger mostra a rota mas sem detalhes de resposta, o que forca o frontend a adivinhar ou ler o codigo backend.

## O insight sobre nullable e tipagem

Quando o instrutor montou o schema de resposta, o TypeScript imediatamente apontou erros porque `avatarUrl` e `name` podem ser `null` no banco. O instrutor destaca: "Veja que a gente tem que fazer bem certinho. Isso e importante ate pro front-end saber que essas informações podem vir nulas."

Esse e um ponto critico: a tipagem Zod no response **nao e so documentacao**, ela e uma validacao em runtime. Se o campo retornado nao bater com o schema, o Fastify vai lancar erro. Entao o `.nullable()` nao e opcional — ele e obrigatorio para que a rota funcione.

## Select como pratica de seguranca

O instrutor enfatiza: "sempre que tu faz um dado que ele vai ser retornado pro front-end, e legal fazer um select pra pegar somente os dados que tu quer." Isso tem dois beneficios:
1. **Seguranca** — campos como `passwordHash`, `createdAt`, `updatedAt` nunca vazam
2. **Performance** — o banco retorna menos dados

## Fluxo de autenticacao via JWT

O padrao e simples:
1. `request.jwtVerify()` — valida o token do header Authorization (Bearer)
2. Extrai o `sub` (subject) que contem o ID do usuario
3. Busca o usuario no banco pelo ID
4. Valida que existe (token pode referenciar usuario deletado)
5. Retorna apenas os campos selecionados

O generic `<{ sub: string }>` no `jwtVerify` garante que ao desestruturar o payload, o TypeScript sabe que `sub` existe e e string.

## Registrando rotas no servidor

Apos criar a funcao da rota, ela precisa ser registrada no arquivo principal do servidor com `app.register(getProfile)`. O instrutor mostra isso rapidamente mas e um passo essencial — sem o register, a rota nao existe.

## Testando com o token

O instrutor demonstra o teste: primeiro gera um token via rota de autenticacao, depois faz GET em `/profile` passando o header `Authorization: Bearer <token>`. Os dados do usuario logado retornam conforme o select e o schema tipado.