# Deep Explanation: Extraindo o Token da Requisição

## Por que o token vem no header Authorization?

O padrão HTTP define o header `Authorization` como o local correto para enviar credenciais. Quando usamos Bearer tokens (como JWT), o formato é:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O prefixo "Bearer" é um **identificador de esquema** — indica ao servidor que tipo de autenticação está sendo usado. Ferramentas como Insomnia e Postman inserem esse prefixo automaticamente quando você seleciona "Bearer Token" na aba Auth.

## O problema do prefixo Bearer

Quando você lê `request.headers.authorization`, recebe a string completa incluindo "Bearer ". Se tentar passar isso direto para `jwt.verify()`, a verificação falha porque o prefixo não faz parte do token.

A solução elegante é usar `split(" ")` que separa pelo espaço entre "Bearer" e o token, resultando em um array:
- Posição 0: `"Bearer"` (não nos interessa)
- Posição 1: `"eyJhbGciOiJIUzI1..."` (o token limpo)

## Desestruturação com vírgula

O instrutor usa `const [, token] = authHeader.split(" ")` — a vírgula antes de `token` ignora o primeiro elemento do array. Isso é mais limpo que:

```typescript
const parts = authHeader.split(" ")
const token = parts[1]
```

## Por que middleware e não lógica no controller?

O middleware `EnsureAuthenticated` funciona como um **interceptador** — ele executa antes do controller. Vantagens:

1. **Reutilização**: aplique em qualquer rota sem duplicar código
2. **Separação de responsabilidades**: autenticação ≠ lógica de negócio
3. **Composição**: pode empilhar middlewares (`EnsureAuthenticated`, `EnsureAdmin`, etc.)

O middleware recebe `(request, response, next)`:
- Se tudo OK → chama `next()` para passar ao próximo middleware/controller
- Se falhou → lança erro (ou retorna resposta de erro)

## Estrutura de pastas

O instrutor cria `src/middlewares/EnsureAuthenticated.ts` — uma pasta dedicada para middlewares mantém o projeto organizado. Convenção:
- `src/middlewares/` — middlewares de aplicação
- `src/routes/` — definição de rotas
- `src/controllers/` — lógica dos endpoints

## Aplicação por rota vs global

Na aula, o middleware é aplicado apenas na rota de criar produto:

```typescript
productsRoutes.post("/", EnsureAuthenticated, controller.create)
```

Isso é intencional — nem toda rota precisa de autenticação (login, registro são públicas). O middleware é inserido como segundo argumento, entre o path e o controller, interceptando a requisição antes dela chegar ao controller.

## Fluxo completo demonstrado

1. Usuário faz login → recebe token JWT
2. Usuário faz requisição protegida → insere token no header Authorization
3. Middleware `EnsureAuthenticated` intercepta:
   - Lê `request.headers.authorization`
   - Verifica se existe (senão → 401)
   - Separa Bearer do token com split
   - Extrai apenas o token via desestruturação
4. Chama `next()` → requisição segue para o controller

## Status code 401

O instrutor usa 401 (Unauthorized) quando o token não é informado. Isso é semanticamente correto:
- **401**: "não sei quem você é" (falta autenticação)
- **403**: "sei quem você é, mas não tem permissão" (falta autorização)