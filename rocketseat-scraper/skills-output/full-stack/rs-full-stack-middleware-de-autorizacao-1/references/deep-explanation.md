# Deep Explanation: Middleware de Autorização

## Por que separar autenticação de autorização?

O instrutor enfatiza que são dois processos distintos executados em sequência:

1. **Autenticação** (já implementada): Verifica QUEM é o usuário — valida o token JWT e injeta os dados do usuário (incluindo `rule`) no objeto `request`
2. **Autorização** (este middleware): Verifica O QUE o usuário pode fazer — compara o papel (`rule`) do usuário com os papéis permitidos para aquela rota

Essa separação permite combinações flexíveis:
- Rota que precisa só de autenticação (qualquer usuário logado pode acessar)
- Rota que precisa de autenticação + autorização específica
- Diferentes rotas do mesmo recurso com diferentes níveis de autorização

## O padrão higher-order function

O middleware não recebe diretamente `(req, res, next)`. Em vez disso:

```
VerifyUserAuthorization(["sale", "admin"])  // retorna uma função
  → (request, response, next) => { ... }    // essa é a função middleware real
```

Isso é necessário porque middlewares Express têm assinatura fixa `(req, res, next)`, mas a gente precisa passar dados adicionais (as roles permitidas). A higher-order function resolve isso: recebe os parâmetros customizados e retorna o middleware com a assinatura correta, com acesso às roles via closure.

## Por que roles como array?

O instrutor explica com exemplo concreto: "uma rota para cadastrar um novo produto pode ser acessada pelo time de vendas, pelos vendedores e também pelo admin". No mundo real, raramente uma rota é acessível por apenas um perfil. O array permite:

```typescript
VerifyUserAuthorization(["sale", "admin", "manager"])
```

## Lógica de negação (barrar, não permitir)

O instrutor escolhe verificar a NEGAÇÃO — "verificar se o usuário NÃO tem permissão, porque se ele não tem, eu barro ele":

```typescript
if (!request.user || !roles.includes(request.user.rule)) {
  throw new AppError("Unauthorized", 401)
}
```

A lógica é:
1. Se não existe usuário no request → barra (middleware de auth pode não ter rodado)
2. Se o role do usuário não está na lista de roles permitidas → barra
3. Se passou pelas duas verificações → chama `next()` para prosseguir

O operador OR (`||`) faz curto-circuito: se `!request.user` é true, nem avalia o segundo lado (evitando erro de acessar `.rule` de undefined).

## Granularidade de aplicação

O instrutor demonstra dois padrões e recomenda o primeiro:

### Por rota específica (recomendado)
```typescript
productsRoutes.post("/", EnsureAuthenticated, VerifyUserAuthorization(["sale", "admin"]), controller.create)
productsRoutes.get("/", EnsureAuthenticated, controller.index) // sem autorização
```

Vantagem: listar produtos é aberto para qualquer autenticado, criar é restrito. Isso é o cenário mais comum no mundo real.

### Por grupo (router.use)
```typescript
productsRoutes.use(VerifyUserAuthorization(["sale", "admin"]))
productsRoutes.post("/", controller.create)
productsRoutes.get("/", controller.index) // também restrito!
```

O instrutor diz "para o nosso cenário, desse jeito não faz sentido" — porque bloquear listagem para clientes geralmente não é desejado. Use `router.use` apenas quando TODAS as rotas de um recurso realmente precisam da mesma restrição.

## Ordem dos middlewares é crítica

O instrutor enfatiza: "primeiro eu garanto que o usuário está autenticado, depois eu verifico a permissão dele". A ordem no array de middlewares:

```typescript
[EnsureAuthenticated, VerifyUserAuthorization(["sale"])]
```

Se invertesse, o middleware de autorização tentaria acessar `request.user.rule` antes de `request.user` existir — causando erro.

## Status code 401 vs 403

O instrutor usa 401 (Unauthorized). Tecnicamente, o HTTP spec define:
- **401 Unauthorized**: Credenciais ausentes ou inválidas (mais sobre autenticação)
- **403 Forbidden**: Credenciais válidas mas sem permissão (mais sobre autorização)

O instrutor escolhe 401 para ambos os casos. Em muitas APIs reais, esta convenção é seguida para não revelar ao atacante se o recurso existe ou não.

## Testando o fluxo completo

O instrutor demonstra o fluxo de teste:
1. Alterar o role do usuário de seed/controller (ex: `customer` → `sale`)
2. Re-autenticar (criar nova sessão para obter novo token com o role atualizado)
3. Tentar acessar a rota protegida
4. Verificar que `customer` é barrado e `sale` passa