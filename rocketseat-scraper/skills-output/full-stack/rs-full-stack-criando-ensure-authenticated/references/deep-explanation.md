# Deep Explanation: Criando ensureAuthenticated

## Por que um middleware dedicado para autenticacao

O instrutor começa explicando que autenticacao e autorizacao sao responsabilidades transversais — toda rota protegida precisa do mesmo fluxo: extrair token, validar, identificar usuario. Sem middleware, esse codigo seria duplicado em cada controller.

O middleware `ensureAuthenticated` intercepta a requisicao **antes** de chegar no controller. Se o token for valido, injeta os dados do usuario em `request.user` e chama `next()`. Se nao, lanca excecao com 401.

## O fluxo do Bearer Token

O header Authorization segue o formato: `Bearer eyJhbGciOiJIUzI1...`

Quando o instrutor faz `authHeader.split(" ")`, o resultado e um array com duas posicoes:
- Posicao 0: `"Bearer"` — ignorada com destructuring `[, token]`
- Posicao 1: o token JWT propriamente dito

O uso de `[, token]` e um pattern de destructuring que pula o primeiro elemento. O instrutor destaca isso explicitamente: "na primeira posicao como vai ter essa frase eu vou literalmente ignorar ela".

## verify vs decode

O instrutor usa `verify()` do jsonwebtoken, que faz duas coisas:
1. Valida a assinatura usando o secret — garante que o token nao foi adulterado
2. Verifica expiracao (`exp` claim) — garante que o token ainda e valido

`decode()` apenas le o payload sem validar nada. Usar decode para autenticacao e equivalente a confiar cegamente no que o cliente envia.

## TokenPayload — tipagem explicita

O retorno de `verify()` e `string | Jwt | JwtPayload`, que e generico demais. O instrutor cria uma interface `TokenPayload` com:
- `role: string` — perfil do usuario (admin, customer, etc.)
- `sub: string` — ID do usuario (claim padrao JWT para "subject")

E usa `as TokenPayload` para tipar o retorno. Isso permite destructuring tipado: `const { role, sub: userId } = verify(...) as TokenPayload`

O rename `sub: userId` e intencional — `sub` e o nome padrao JWT, mas `userId` e mais descritivo no contexto da aplicacao.

## Declaration merging com namespace Express

O TypeScript nao sabe que `request.user` existe — o tipo `Request` do Express nao inclui essa propriedade. O instrutor resolve com declaration merging:

```typescript
declare namespace Express {
  export interface Request {
    user?: {
      id: string
      role: string
    }
  }
}
```

O instrutor explica: "o que a gente esta fazendo aqui e criando e exportando uma interface com o mesmo nome da que ja existe, entao ele vai mesclar elas". Isso e um recurso do TypeScript chamado **declaration merging** — quando duas interfaces tem o mesmo nome no mesmo namespace, suas propriedades sao combinadas.

O `user?` e opcional (`?`) porque nem toda requisicao passa pelo middleware de autenticacao — rotas publicas nao terao `request.user`.

O arquivo e nomeado `express.d.ts` e colocado em `src/types/` — o `.d.ts` indica que e um arquivo de declaracao de tipos, nao codigo executavel.

## Estrategia de tratamento de erros

O instrutor usa dois niveis de erro:
1. **Token ausente** — verificacao explicita antes do `verify()`, com mensagem "JWT token not found"
2. **Token invalido** — catch generico que captura qualquer erro do `verify()` (assinatura invalida, expirado, malformado), com mensagem "Invalid JWT token"

Ambos retornam status 401 (Unauthorized) via `AppError`, que e o middleware de tratamento de excecoes ja existente na aplicacao.

O catch generico e intencional — nao importa o motivo especifico da falha do `verify()`, para o cliente a resposta e sempre "token invalido, autentique-se novamente".

## Fluxo completo da requisicao

```
Cliente envia request com header Authorization: Bearer <token>
  → ensureAuthenticated intercepta
    → Verifica se header existe (senao: 401 "not found")
    → Extrai token com split(" ")[1]
    → verify(token, secret) valida assinatura e expiracao
    → Destructura role e sub do payload
    → Injeta request.user = { id, role }
    → Chama next()
  → Controller recebe request com user ja disponivel
```