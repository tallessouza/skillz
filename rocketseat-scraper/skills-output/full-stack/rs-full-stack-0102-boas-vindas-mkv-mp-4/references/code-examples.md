# Code Examples: API de Reembolso — Arquitetura do Projeto

## Estrutura de pastas esperada

```
refund-api/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts        # sign-up, sign-in
│   │   ├── refund.routes.ts      # CRUD de reembolsos
│   │   └── index.ts              # agregador de rotas
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # verifica token (autenticação)
│   │   └── role.middleware.ts     # verifica perfil (autorização)
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── refund.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── refund.service.ts
│   ├── uploads/                   # pasta para arquivos enviados
│   └── server.ts
├── package.json
└── tsconfig.json
```

## Rotas de autenticação

```typescript
// POST /sign-up — Criar conta
// Body: { name, email, password, passwordConfirmation }
router.post("/sign-up", async (request, response) => {
  const { name, email, password } = request.body

  // Validar dados
  // Verificar se email já existe
  // Hash da senha
  // Criar usuário no banco com role padrão "employee"

  return response.status(201).json({ message: "Account created" })
})

// POST /sign-in — Login
// Body: { email, password }
router.post("/sign-in", async (request, response) => {
  const { email, password } = request.body

  // Buscar usuário por email
  // Comparar senha com hash
  // Gerar token JWT com { userId, role }

  return response.json({ token })
})
```

## Middleware de autorização por role

```typescript
// Garante que somente o perfil correto acessa a rota
function authorizeRole(allowedRoles: string[]) {
  return (request, response, next) => {
    const userRole = request.user.role

    if (!allowedRoles.includes(userRole)) {
      return response.status(403).json({
        message: "Access denied for your role"
      })
    }

    return next()
  }
}

// Uso nas rotas:
// Employee cria solicitação
router.post("/refunds", authorizeRole(["employee"]), createRefund)

// Manager lista todas as solicitações
router.get("/refunds", authorizeRole(["manager"]), listRefunds)
```

## Paginação server-side

```typescript
// GET /refunds?page=1&perPage=10&search=João
router.get("/refunds", authorizeRole(["manager"]), async (request, response) => {
  const page = Number(request.query.page) || 1
  const perPage = Number(request.query.perPage) || 10
  const search = request.query.search || ""

  const offset = (page - 1) * perPage

  // Query com paginação
  const refunds = await db("refunds")
    .where("employee_name", "like", `%${search}%`)
    .limit(perPage)
    .offset(offset)

  // Total para calcular páginas
  const [{ count: totalItems }] = await db("refunds")
    .where("employee_name", "like", `%${search}%`)
    .count("id as count")

  const totalPages = Math.ceil(totalItems / perPage)

  return response.json({
    refunds,
    pagination: {
      page,
      perPage,
      totalItems,
      totalPages,
    }
  })
})
```

## Upload de arquivo

```typescript
import multer from "multer"
import path from "path"
import crypto from "crypto"

const uploadFolder = path.resolve(__dirname, "..", "uploads")

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (request, file, callback) => {
    const uniqueName = `${crypto.randomUUID()}-${file.originalname}`
    callback(null, uniqueName)
  }
})

const upload = multer({ storage })

// POST /refunds — com upload de comprovante
router.post(
  "/refunds",
  authorizeRole(["employee"]),
  upload.single("receipt"),
  async (request, response) => {
    const { description, amount } = request.body
    const receiptFilename = request.file?.filename

    const refund = await db("refunds").insert({
      employee_id: request.user.id,
      description,
      amount,
      receipt_filename: receiptFilename,
      status: "pending",
    })

    return response.status(201).json(refund)
  }
)
```

## Detalhes de uma solicitação

```typescript
// GET /refunds/:id
router.get("/refunds/:id", async (request, response) => {
  const { id } = request.params
  const userRole = request.user.role
  const userId = request.user.id

  const refund = await db("refunds").where({ id }).first()

  if (!refund) {
    return response.status(404).json({ message: "Refund not found" })
  }

  // Employee só vê próprias solicitações
  if (userRole === "employee" && refund.employee_id !== userId) {
    return response.status(403).json({
      message: "You can only view your own refund requests"
    })
  }

  return response.json(refund)
})
```