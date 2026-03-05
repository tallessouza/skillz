# Deep Explanation: Middleware de Autenticação

## Por que `sub` e não um claim customizado?

O claim `sub` (subject) é parte da especificação RFC 7519 do JWT. Ele identifica o "sujeito" do token — no caso, o usuário. Quando o instrutor cria a sessão no controller, ele passa o ID do usuário como `sub`:

```typescript
const token = sign({}, secret, { subject: String(user.id) })
```

Isso é importante porque:
1. É o padrão da indústria — qualquer lib JWT entende `sub`
2. Ferramentas de debug (jwt.io) mostram `sub` de forma destacada
3. Outros serviços que consumam o token sabem onde encontrar o ID

## O padrão de "enriquecer a requisição"

O middleware intercepta a requisição ANTES de chegar na rota. O fluxo é:

```
Request → [ensureAuthenticated] → request.user = { id } → [rota] → Response
```

A rota não precisa saber nada sobre JWT. Ela só acessa `request.user.id`. Isso desacopla a lógica de autenticação da lógica de negócio.

## Interface merging no TypeScript

O TypeScript tem um recurso chamado **declaration merging**. Quando você declara uma interface com o mesmo nome de uma já existente, o TypeScript **soma** as propriedades em vez de substituir:

```typescript
// Original do Express (simplificado)
interface Request {
  headers: IncomingHttpHeaders
  body: any
  // ...
}

// Seu arquivo express.d.ts
interface Request {
  user?: { id: string }  // SOMA com o original
}

// Resultado final que o TypeScript enxerga
interface Request {
  headers: IncomingHttpHeaders
  body: any
  user?: { id: string }  // Adicionado via merge
}
```

É por isso que funciona criar `src/types/express.d.ts` — o `declare namespace Express` encontra o namespace existente e a `interface Request` faz merge com a interface original.

## Por que `user?` é opcional

Nem toda requisição passa pelo middleware de autenticação. Rotas públicas (login, registro) não têm token. Se `user` não fosse opcional, o TypeScript exigiria que ele existisse em TODA requisição, o que seria incorreto.

O `?` no acesso (`request.user?.id`) é o optional chaining — se `user` for `undefined`, retorna `undefined` em vez de lançar erro.

## verify vs decode

- `jwt.decode(token)` — apenas decodifica o payload, **sem validar a assinatura**. Um atacante pode criar um token com qualquer payload e `decode` aceitaria.
- `jwt.verify(token, secret)` — decodifica E valida a assinatura. Se o token foi alterado (ex: adicionando um "x" no final, como o instrutor demonstrou), lança uma exceção `JsonWebTokenError: invalid signature`.

Nunca use `decode` para autenticação. Ele serve apenas para inspecionar tokens em cenários de debug.

## O fluxo completo demonstrado na aula

1. Instrutor remove console.log de exemplo
2. Importa `verify` do jsonwebtoken e `appConfig`
3. Usa `verify(token, appConfig.jwt.secret)` para validar
4. Testa com token válido → funciona
5. Testa com token inválido (adiciona "x") → erro de assinatura
6. Desestrutura `{ sub }` do resultado do verify
7. Faz console.log para mostrar que `sub` contém o ID do usuário
8. Renomeia para `userId` e injeta em `request.user = { id: String(userId) }`
9. TypeScript reclama porque `user` não existe em Request
10. Cria `src/types/express.d.ts` com declaration merging
11. Acessa `request.user?.id` em uma rota de produtos para demonstrar