# Deep Explanation: Autenticacao com GitHub OAuth

## Fluxo OAuth Completo

O fluxo OAuth com GitHub tem dois momentos distintos:

1. **Frontend inicia**: Redireciona o usuario para `https://github.com/login/oauth/authorize` com `client_id`, `redirect_uri` e `scope`. O GitHub pergunta se o usuario autoriza. Apos autorizar, redireciona de volta para o frontend com um `code` na URL.

2. **Backend completa**: Recebe o `code` do frontend, troca pelo `access_token` via POST para `https://github.com/login/oauth/access_token`, e usa esse token para buscar dados do usuario em `https://api.github.com/user`.

## Por que usar `new URL()` em vez de template literals

O instrutor destaca que concatenar parametros manualmente fica "muito desorganizado, principalmente quando a gente tem muitos parametros". O construtor `new URL()` do JavaScript oferece `.searchParams` que funciona como um Map — voce usa `.set()` para cada parametro e ele cuida do encoding automaticamente.

## Scopes do GitHub

Se nenhum scope for enviado, o GitHub retorna apenas informacoes publicas do perfil. O scope `user:email` e necessario para acessar emails privados. Multiplos scopes sao separados por virgula na URL de autorizacao.

O instrutor observa: "se o email do usuario estiver como privado, eu nao vou conseguir acessar esse email" — mesmo com o scope correto, algumas contas podem retornar email nulo.

## Validacao com Zod e transform

O instrutor usa um padrao interessante: Zod nao apenas valida, mas tambem transforma os dados. A resposta da API GitHub vem em `snake_case` (`access_token`, `avatar_url`), e o `.transform()` converte para `camelCase` no mesmo passo da validacao. Isso evita a necessidade de uma etapa separada de mapeamento.

Para o `id` do GitHub (que e um numero inteiro), o instrutor usa `.transform(String)` porque o campo `providerAccountId` no schema Prisma e uma string — provedores diferentes podem ter IDs em formatos diferentes.

## Token type literal

O Zod schema usa `z.literal('bearer')` para o `token_type` — nao e qualquer string, tem que ser exatamente "bearer". Isso e uma validacao mais restrita que garante que a resposta esta no formato esperado.

## Estrategia de vinculacao de contas

O fluxo trata tres cenarios:

1. **Usuario novo**: Cria usuario + cria account GitHub
2. **Usuario existente (login por senha)**: Encontra pelo email, cria account GitHub vinculada
3. **Usuario ja logou com GitHub antes**: Encontra usuario e account existentes, apenas gera token

A busca de account usa o indice composto `{ provider, userId }` definido no schema Prisma. O instrutor destaca: "quando eu crio um indice, sempre e legal eu usar, fazer o where com esse indice, porque assim eu vou tornar essa busca muito mais performatica."

## Code expira rapido

O `code` retornado pelo GitHub expira em aproximadamente 1 minuto. O instrutor alerta: "este codigo aqui vence muito rapido, se eu tentar usar ele daqui a pouco de novo, ja nao vai funcionar, eu tenho que fazer todo o processo de login de novo."

## Usuario sem senha

Quando o usuario faz login via GitHub, ele e criado sem senha no banco. Isso e esperado — o campo `password` e nullable no schema. A autenticacao desse usuario sera sempre via GitHub (ou outro provider vinculado).

## Primeira autorizacao vs subsequentes

Na primeira vez que o usuario autoriza a aplicacao, o GitHub mostra a tela de permissao. Nas vezes seguintes, "ele vai direto, ja foi direto, porque como eu ja permiti esta aplicacao uma vez na minha conta, ele nao pergunta mais."