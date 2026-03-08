# Code Examples: Middleware de Autorização por Perfil

## Exemplo 1: Middleware completo (como implementado na aula)

### Arquivo: middleware/verify-user-authorization.js

```javascript
const { AppError } = require("../utils/AppError")

function verifyUserAuthorization(role) {
  return (request, response, next) => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("unauthorized", 401)
    }

    return next()
  }
}

module.exports = verifyUserAuthorization
```

### Arquivo: routes/refund-routes.js (uso nas rotas)

```javascript
const { Router } = require("express")
const ensureAuthenticated = require("../middleware/ensure-authenticated")
const verifyUserAuthorization = require("../middleware/verify-user-authorization")
const RefundCreateController = require("../controllers/RefundCreateController")

const refundRoutes = Router()
const refundCreateController = new RefundCreateController()

refundRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["employee"]),
  refundCreateController.create
)

module.exports = refundRoutes
```

## Exemplo 2: Múltiplos perfis por rota

```javascript
// Apenas manager pode aprovar
router.patch(
  "/refunds/:id/approve",
  ensureAuthenticated,
  verifyUserAuthorization(["manager"]),
  approveRefundController
)

// Tanto employee quanto manager podem listar
router.get(
  "/refunds",
  ensureAuthenticated,
  verifyUserAuthorization(["employee", "manager"]),
  listRefundsController
)
```

## Exemplo 3: Rotas com diferentes níveis de acesso

```javascript
const ensureAuthenticated = require("../middleware/ensure-authenticated")
const verifyUserAuthorization = require("../middleware/verify-user-authorization")

// Rota pública (sem middleware de auth)
router.get("/health", healthCheckController)

// Rota autenticada (qualquer usuário logado)
router.get("/profile", ensureAuthenticated, profileController)

// Rota autorizada (perfil específico)
router.post(
  "/refunds",
  ensureAuthenticated,
  verifyUserAuthorization(["employee"]),
  createRefundController
)

// Rota admin (apenas manager)
router.delete(
  "/users/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["manager"]),
  deleteUserController
)
```

## Exemplo 4: AppError utilizado pelo middleware

```javascript
// utils/AppError.js
class AppError {
  constructor(message, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

module.exports = { AppError }
```

## Exemplo 5: Middleware de tratamento de exceção (que captura o throw)

```javascript
// middleware/error-handler.js
function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
}

module.exports = errorHandler
```

## Exemplo 6: Fluxo completo de request autorizado vs não autorizado

### Request autorizado (employee acessando rota de employee):
```
POST /refunds
Headers: { Authorization: "Bearer <token_employee>" }
Body: { description: "Reembolso de viagem", amount: 150 }

→ ensureAuthenticated: OK (token válido, request.user = { id: 1, role: "employee" })
→ verifyUserAuthorization(["employee"]): OK ("employee" está no array)
→ createRefundController: executa normalmente
→ Response: 201 Created
```

### Request não autorizado (manager acessando rota só de employee):
```
POST /refunds
Headers: { Authorization: "Bearer <token_manager>" }
Body: { description: "Reembolso de viagem", amount: 150 }

→ ensureAuthenticated: OK (token válido, request.user = { id: 2, role: "manager" })
→ verifyUserAuthorization(["employee"]): FALHA ("manager" NÃO está no array)
→ throw new AppError("unauthorized", 401)
→ errorHandler captura
→ Response: 401 { status: "error", message: "unauthorized" }
```

### Request sem autenticação:
```
POST /refunds
Headers: {} (sem token)

→ ensureAuthenticated: FALHA (sem token)
→ Barrado antes mesmo de chegar no verifyUserAuthorization
→ Response: 401 { status: "error", message: "JWT token not provided" }
```