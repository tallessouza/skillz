# Code Examples: Encerramento — API do APP Refund

## Estrutura tipica do projeto

```
src/
├── routes/
│   ├── auth.routes.js        # Login, registro
│   ├── refunds.routes.js     # CRUD de reembolsos
│   └── uploads.routes.js     # Upload de comprovantes
├── controllers/
│   ├── AuthController.js
│   ├── RefundsController.js
│   └── UploadsController.js
├── middlewares/
│   ├── ensureAuthenticated.js # Verifica token JWT
│   ├── ensureAuthorized.js    # Verifica role/permissao
│   └── uploadConfig.js        # Configuracao multer
├── services/
│   └── RefundService.js
├── repositories/
│   └── RefundRepository.js
└── server.js
```

## Padrao de rota protegida com auth + autorizacao

```javascript
const { Router } = require('express')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const ensureAuthorized = require('../middlewares/ensureAuthorized')
const RefundsController = require('../controllers/RefundsController')

const refundsRoutes = Router()
const refundsController = new RefundsController()

// Todas as rotas exigem autenticacao
refundsRoutes.use(ensureAuthenticated)

// Criar solicitacao de reembolso (qualquer usuario autenticado)
refundsRoutes.post('/', refundsController.create)

// Listar reembolsos (qualquer usuario autenticado)
refundsRoutes.get('/', refundsController.index)

// Aprovar/rejeitar reembolso (apenas admin)
refundsRoutes.patch('/:id/status', ensureAuthorized(['admin']), refundsController.updateStatus)

module.exports = refundsRoutes
```

## Padrao de middleware de autenticacao

```javascript
const { verify } = require('jsonwebtoken')
const authConfig = require('../configs/auth')

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ message: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, authConfig.jwt.secret)
    request.user = { id: decoded.sub }
    return next()
  } catch {
    return response.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = ensureAuthenticated
```

## Padrao de upload de arquivo com multer

```javascript
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads')

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename(request, file, callback) {
    const fileHash = crypto.randomBytes(10).toString('hex')
    const fileName = `${fileHash}-${file.originalname}`
    callback(null, fileName)
  }
})

module.exports = {
  storage,
  uploadFolder
}
```

## Funcionalidades-chave implementadas no modulo

| Funcionalidade | Tecnologia/Padrao |
|----------------|-------------------|
| Autenticacao | JWT (jsonwebtoken) |
| Autorizacao | Middleware com roles |
| Upload de arquivos | Multer (diskStorage) |
| Validacao de dados | Verificacao manual ou Zod |
| Rotas REST | Express Router |
| Tratamento de erros | Middleware de erro global |