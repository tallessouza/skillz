# Code Examples: Criando Rota de Listar com Autorização

## Controller completo com index

```javascript
class RefundController {
  // Método create (já existente) - recolhido para clareza
  async create(request, response) {
    // ... lógica de criação
  }

  // Novo método index para listagem
  async index(request, response) {
    // Por enquanto, retorno simples para testar a rota
    return response.json({ message: "ok" })
  }
}
```

## Registro da rota com middleware por rota

```javascript
// refund-routes.js
const { Router } = require("express")
const RefundController = require("../controllers/RefundController")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const refundRoutes = Router()
const refundController = new RefundController()

// POST - qualquer usuário autenticado pode criar
refundRoutes.post("/", refundController.create)

// GET - apenas Manager pode listar todas
refundRoutes.get(
  "/",
  verifyUserAuthorization("manager"),
  refundController.index
)

module.exports = refundRoutes
```

## Comparação: middleware por rota vs por grupo

### Por rota (usado nesta aula para autorização)

```javascript
// O middleware é o segundo argumento, antes do controller
refundRoutes.get(
  "/",
  verifyUserAuthorization("manager"),
  refundController.index
)
```

### Por grupo (usado anteriormente para autenticação)

```javascript
// index-routes.js ou similar
const { Router } = require("express")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const routes = Router()

// Middleware aplicado para TODAS as rotas abaixo
routes.use(ensureAuthenticated)

// Todas estas rotas exigem autenticação
routes.use("/refunds", refundRoutes)
routes.use("/users", userRoutes)
```

## Teste no Insomnia — Configuração do token dinâmico

```
1. Criar nova HTTP Request na pasta refunds
2. Método: GET
3. URL: {{ base_url }}/refunds
4. Aba Auth → Bearer Token
5. Token value: Response → Body Attribute
   - Request: Session POST Create
   - Filter: $.token
   - Trigger: Always
6. Clicar Done
```

## Criando usuário Manager para teste

```http
POST {{ base_url }}/users
Content-Type: application/json

{
  "name": "Manager",
  "email": "manager@email.com",
  "password": "123",
  "role": "manager"
}
```

## Fluxo de teste completo

```
# 1. Logar como Employee
POST /sessions
{ "email": "rodrigo@email.com", "password": "123" }
# Resposta: { token: "eyJ..." }

# 2. Tentar listar refunds como Employee
GET /refunds
Authorization: Bearer <token_employee>
# Resposta: 401 Unauthorized (não autorizado por perfil)

# 3. Logar como Manager
POST /sessions
{ "email": "manager@email.com", "password": "123" }
# Resposta: { token: "eyJ..." }

# 4. Listar refunds como Manager
GET /refunds
Authorization: Bearer <token_manager>
# Resposta: 200 { message: "ok" }
```

## Variação: middleware de autorização que aceita múltiplos roles

```javascript
// Caso precise permitir mais de um perfil
refundRoutes.get(
  "/",
  verifyUserAuthorization(["manager", "admin"]),
  refundController.index
)

// O middleware verifyUserAuthorization precisaria ser ajustado:
function verifyUserAuthorization(roles) {
  // Se recebeu string, converte para array
  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  return (request, response, next) => {
    const { role } = request.user

    if (!allowedRoles.includes(role)) {
      return response.status(401).json({ message: "Unauthorized" })
    }

    return next()
  }
}
```

## Variação: index com listagem real do banco

```javascript
async index(request, response) {
  // Versão futura com consulta real ao banco
  const refunds = await knex("refunds")
    .select("*")
    .orderBy("created_at", "desc")

  return response.json(refunds)
}
```