# Code Examples: API de Sistema de Reembolso

## Estrutura base sugerida para o projeto

Esta aula é introdutória e não contém código. Os exemplos abaixo representam a estrutura típica que será construída ao longo do módulo, baseada nas funcionalidades descritas pelo instrutor.

### Estrutura de diretórios esperada

```
refund-api/
├── src/
│   ├── server.js          # Inicialização do servidor
│   ├── routes/
│   │   ├── users.js       # Rotas de usuário (auth)
│   │   ├── refunds.js     # Rotas de reembolso
│   │   └── files.js       # Rotas de upload/download
│   ├── controllers/
│   │   ├── usersController.js
│   │   ├── refundsController.js
│   │   └── filesController.js
│   ├── middlewares/
│   │   ├── auth.js         # Autenticação (JWT)
│   │   └── authorization.js # Autorização (roles)
│   ├── database/
│   │   ├── connection.js
│   │   └── migrations/
│   └── utils/
│       └── fileValidation.js
├── uploads/                # Diretório de arquivos enviados
├── package.json
└── .env
```

### Entidades do domínio

```javascript
// Colaborador/Usuário
const user = {
  id: "uuid",
  name: "João Silva",
  email: "joao@empresa.com",
  role: "collaborator", // "collaborator" | "manager" | "admin"
  companyId: "uuid"
}

// Solicitação de reembolso
const refund = {
  id: "uuid",
  userId: "uuid",
  description: "Visita ao cliente ABC",
  amount: 15000, // em centavos (priceInCents)
  status: "pending", // "pending" | "approved" | "rejected" | "reimbursed"
  receiptPath: "/uploads/receipt-uuid.pdf",
  createdAt: "2026-01-15T10:00:00Z"
}
```

### Fluxo típico de uma solicitação

```javascript
// 1. Colaborador faz upload do comprovante
// POST /files/upload
// Content-Type: multipart/form-data

// 2. Colaborador cria solicitação de reembolso
// POST /refunds
const createRefundRequest = {
  description: "Substituição de peça do equipamento X",
  amount: 25000,
  receiptFileId: "uuid-do-arquivo"
}

// 3. Gestor lista solicitações pendentes
// GET /refunds?status=pending

// 4. Gestor aprova ou rejeita
// PATCH /refunds/:id/status
const updateStatus = {
  status: "approved"
}
```

### Validação de arquivo (padrão esperado)

```javascript
// Validar antes de salvar — nunca confie no que o cliente envia
function validateUploadedFile(file) {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"]
  const maxSizeInBytes = 5 * 1024 * 1024 // 5MB

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Tipo de arquivo não permitido")
  }

  if (file.size > maxSizeInBytes) {
    throw new Error("Arquivo excede o tamanho máximo de 5MB")
  }

  return true
}
```

### Middleware de autorização (padrão esperado)

```javascript
// Autorização por role — separar de autenticação
function authorize(...allowedRoles) {
  return (request, response, next) => {
    const userRole = request.user.role

    if (!allowedRoles.includes(userRole)) {
      return response.status(403).json({
        error: "Acesso não autorizado para este recurso"
      })
    }

    next()
  }
}

// Uso nas rotas
// router.patch("/refunds/:id/status", authorize("manager", "admin"), updateRefundStatus)
```