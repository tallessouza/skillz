# Code Examples: Autenticacao e Autorizacao

## Fluxo de autenticacao — Controller

```typescript
// Rota de login: autentica o usuario e retorna token
async function authenticate(request: Request, response: Response) {
  const { email, password } = request.body

  // Busca usuario pelo email no banco
  const user = await usersRepository.findByEmail(email)

  if (!user) {
    // Mensagem generica: nao revelar se email ou senha esta errado
    return response.status(401).json({ message: "Email ou senha invalido" })
  }

  // Compara senha fornecida com a senha armazenada (hash)
  const passwordMatches = await compare(password, user.password)

  if (!passwordMatches) {
    return response.status(401).json({ message: "Email ou senha invalido" })
  }

  // Usuario autenticado: gera token (o "cracha")
  const token = sign({ sub: user.id, role: user.role }, SECRET, {
    expiresIn: "1d",
  })

  return response.json({ token })
}
```

## Middleware de autenticacao — Verifica identidade

```typescript
// Middleware que extrai o usuario do token
function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ message: "Token nao fornecido" })
  }

  const [, token] = authHeader.split(" ") // "Bearer <token>"

  try {
    const decoded = verify(token, SECRET) as TokenPayload
    request.userId = decoded.sub
    request.userRole = decoded.role
    return next()
  } catch {
    return response.status(401).json({ message: "Token invalido" })
  }
}
```

## Middleware de autorizacao — Verifica permissao

```typescript
// Middleware que verifica se o usuario tem o role necessario
function ensureAuthorized(allowedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const userRole = request.userRole

    if (!allowedRoles.includes(userRole)) {
      return response.status(403).json({ message: "Nao autorizado" })
    }

    return next()
  }
}
```

## Uso nas rotas — Composicao de middlewares

```typescript
// Qualquer usuario autenticado pode listar produtos
router.get("/products", ensureAuthenticated, listProducts)

// Apenas vendedores e admins podem cadastrar produtos
router.post(
  "/products",
  ensureAuthenticated,
  ensureAuthorized(["seller", "admin"]),
  createProduct
)

// Apenas admins podem deletar usuarios
router.delete(
  "/users/:id",
  ensureAuthenticated,
  ensureAuthorized(["admin"]),
  deleteUser
)
```

## Variacoes

### Autorizacao por permission granular (em vez de role)

```typescript
function ensurePermission(requiredPermission: string) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userPermissions = await permissionsRepository.findByUserId(request.userId)

    const hasPermission = userPermissions.some(
      (permission) => permission.name === requiredPermission
    )

    if (!hasPermission) {
      return response.status(403).json({ message: "Permissao insuficiente" })
    }

    return next()
  }
}

// Uso:
router.post("/products", ensureAuthenticated, ensurePermission("create_product"), createProduct)
```

### Resposta de erro padronizada

```typescript
// Autenticacao falhou (quem e voce?)
return response.status(401).json({
  message: "Email ou senha invalido"  // Generico por seguranca
})

// Autorizacao falhou (o que voce pode fazer?)
return response.status(403).json({
  message: "Voce nao tem permissao para realizar esta acao"
})
```