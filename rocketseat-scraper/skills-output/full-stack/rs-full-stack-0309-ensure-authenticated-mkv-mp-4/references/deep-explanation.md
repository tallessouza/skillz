# Deep Explanation: Middleware ensureAuthenticated com JWT

## Por que um middleware dedicado para autenticacao?

O instrutor explica que a autenticacao nao deve ser responsabilidade de cada controller individual. Em vez disso, cria-se um middleware que intercepta a requisicao ANTES de chegar ao controller. Se o usuario nao estiver autenticado, a requisicao e barrada ali mesmo. Se estiver, o middleware injeta as informacoes do usuario no request e chama `next()` para seguir o fluxo.

A analogia e: o middleware e um porteiro. Ele verifica o cracha (token) antes de deixar a pessoa entrar no predio (controller). Se o cracha for invalido, a pessoa nao entra. Se for valido, o porteiro anota quem entrou (injeta no request) e libera passagem.

## Anatomia do Bearer Token

O token chega no header Authorization no formato:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O instrutor mostra que ao fazer `split(" ")`, o resultado e um array:

```javascript
["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."]
```

Por isso usa destructuring `const [, token]` — a virgula sozinha ignora a primeira posicao ("Bearer"), e `token` captura a segunda posicao (o JWT real). Isso e mais limpo que `authHeader.split(" ")[1]`.

## Declaration Merging no Express

O TypeScript nao sabe que `request.user` existe porque a interface Request do Express nao tem essa propriedade. O instrutor resolve isso criando `src/types/express.d.ts`:

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

O sufixo `.d.ts` faz essa tipagem ser global automaticamente — nao precisa importar em nenhum lugar. Isso e um recurso especifico de **interfaces** no TypeScript: voce pode declarar a mesma interface em multiplos lugares e elas sao mescladas (merged). Isso NAO funciona com `type` — apenas `interface` permite declaration merging.

## Estrategia de posicionamento do app.use

O Express executa middlewares na ordem em que sao declarados. O instrutor usa isso estrategicamente:

```typescript
// Estas rotas NAO passam pelo ensureAuthenticated
routes.post("/users", createUser)
routes.post("/sessions", createSession)

// A partir daqui, TODAS passam
routes.use(ensureAuthenticated)

routes.post("/refunds", createRefund)
routes.get("/refunds", listRefunds)
```

Isso evita ter que adicionar `ensureAuthenticated` como segundo argumento em cada rota individual. E uma abordagem mais limpa quando a maioria das rotas e privada.

Para casos onde apenas UMA rota precisa de protecao, o padrao e:

```typescript
routes.get("/profile", ensureAuthenticated, showProfile)
```

## Dois niveis de erro

O instrutor diferencia dois cenarios de erro:

1. **Token ausente** — `JWT token not found`: o cliente nem enviou o header Authorization. Erro mais especifico, ajuda o frontend a mostrar "faca login primeiro".

2. **Token invalido** — `Invalid JWT token`: o token existe mas e invalido (expirado, adulterado, secret errado). Cai no catch generico do try/catch.

Ambos lancam `AppError` em vez de retornar `response.status(401)` diretamente, porque o error handler global (outro middleware) e responsavel por formatar a resposta. Isso mantem o middleware focado em UMA responsabilidade.

## TokenPayload e o campo sub

No JWT, `sub` (subject) e o campo padrao que identifica o dono do token. O instrutor mostra que ao criar o token no login, o user ID foi colocado no `sub`. Agora no middleware, ele recupera com:

```typescript
const { role, sub: user_id } = verify(token, secret) as TokenPayload
```

O `as TokenPayload` e um type assertion necessario porque `verify()` retorna `string | JwtPayload`, e o TypeScript nao sabe a estrutura exata do payload sem tipagem explicita.

## Testando no Insomnia — configuracao dinamica de token

O instrutor mostra como evitar copiar/colar tokens manualmente no Insomnia:

1. No campo Auth > Bearer Token, use CTRL+Space
2. Selecione "Response > Body Attribute"
3. Aponte para a requisicao de Session (login)
4. Use o filtro `$.token` para extrair so o token da resposta
5. Configure o trigger como "Always" para buscar token atualizado automaticamente

Isso simula o comportamento real do frontend, onde o token e armazenado apos login e enviado automaticamente nas requisicoes subsequentes.