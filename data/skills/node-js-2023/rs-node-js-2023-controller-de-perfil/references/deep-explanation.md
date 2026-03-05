# Deep Explanation: Controller de Perfil com JWT Middleware

## Por que extrair o middleware?

O instrutor destaca um insight crucial: conforme a aplicacao cresce, praticamente **todas as rotas** (exceto cadastro e login) precisam de autenticacao. Chamar `request.jwtVerify()` manualmente em cada controller e:

1. **Repetitivo** — mesma logica copiada dezenas de vezes
2. **Fragil** — se voce esquece em uma rota, ela fica aberta
3. **Inconsistente** — cada controller pode tratar o erro de forma diferente (500 vs 401)

A solucao e o padrao de **middleware/hook**: uma funcao que executa **antes** do controller via `onRequest`.

## O problema do password_hash

O instrutor encontra um problema ao vivo: tentar `delete user.password_hash` nao funciona quando o campo nao e opcional no tipo TypeScript. O compilador bloqueia porque apos o delete, o objeto nao satisfaz mais o tipo.

A solucao e usar spread com override:
```typescript
{ ...user, password_hash: undefined }
```

Isso cria um novo objeto onde `password_hash` existe mas e `undefined`, o que:
- Satisfaz o sistema de tipos
- Nao aparece na resposta JSON (JSON.stringify ignora `undefined`)
- Nao muta o objeto original

O instrutor menciona que "mais pra frente vamos ver outras formas melhores de fazer isso" — referindo-se provavelmente a serialization/presentation layers ou DTOs.

## O fluxo do onRequest

```
Cliente envia request
       |
       v
onRequest: [verifyJWT]
       |
  JWT valido? --NO--> 401 Unauthorized (controller NUNCA executa)
       |
      YES
       |
       v
  Controller executa com request.user populado
       |
       v
  Resposta enviada
```

O `onRequest` do Fastify e um hook de lifecycle. Ele recebe `request` e `reply` — exatamente como um controller. Se o middleware retorna uma resposta (como o 401), o Fastify **nao chama** o handler seguinte.

## Por que 401 e nao 500?

Sem o try/catch no middleware, quando `jwtVerify()` falha (token ausente ou invalido), o Fastify captura a excecao e retorna 500 Internal Server Error. Isso e semanticamente errado:

- **500** = "algo quebrou no servidor" — o cliente nao pode fazer nada
- **401** = "voce nao esta autenticado" — o cliente sabe que precisa fazer login

O middleware corrige isso capturando o erro e retornando o status correto.

## Organizacao de pastas

O instrutor sugere que a pasta pode ser chamada `middlewares`, `hooks`, ou o que preferir. O importante e que fique dentro de `http/` porque e codigo de camada HTTP, nao de dominio:

```
src/
  http/
    controllers/
      profile.ts
    middlewares/          # ou hooks/
      verify-jwt.ts
    routes.ts
```