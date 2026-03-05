# Code Examples: Logging de Seguranca

## Setup basico de logger com separacao de seguranca

```typescript
import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  defaultMeta: {
    app: 'minha-aplicacao',
    appVersion: process.env.COMMIT_SHA || '1.0.0',
    host: os.hostname()
  },
  transports: [
    // Log geral
    new transports.File({ filename: '/var/log/app/combined.log' }),
    // Log de seguranca separado para facilitar monitoramento
    new transports.File({
      filename: '/var/log/app/security.log',
      level: 'warn',
      format: format((info) => {
        return info.securityRelevant ? info : false
      })()
    })
  ]
})
```

## Eventos de autenticacao completos

```typescript
// Login com sucesso
function logAuthSuccess(user: User, req: Request) {
  logger.info({
    eventType: 'AUTH_SUCCESS',
    userId: user.id,
    sourceIp: req.ip,
    userAgent: req.headers['user-agent'],
    codeLocation: 'auth.service:login',
    securityRelevant: true,
    description: 'User authenticated successfully'
  })
}

// Login falho — NUNCA logue a senha
function logAuthFailure(username: string, req: Request) {
  logger.warn({
    eventType: 'AUTH_FAILURE',
    userId: username, // username tentado, nao senha
    sourceIp: req.ip,
    userAgent: req.headers['user-agent'],
    codeLocation: 'auth.service:login',
    securityRelevant: true,
    description: 'Failed login attempt'
  })
}

// Logout
function logLogout(userId: string, req: Request) {
  logger.info({
    eventType: 'AUTH_LOGOUT',
    userId,
    sourceIp: req.ip,
    codeLocation: 'auth.service:logout',
    securityRelevant: true,
    description: 'User logged out'
  })
}

// Troca de senha
function logPasswordChange(userId: string, req: Request) {
  logger.info({
    eventType: 'AUTH_PASSWORD_CHANGE',
    userId,
    sourceIp: req.ip,
    codeLocation: 'auth.service:changePassword',
    securityRelevant: true,
    description: 'User changed password'
  })
}
```

## Validacao de entrada — valor fora de conjunto discreto

```typescript
// O insight do instrutor: se voce tem 8 paises no select
// e recebe um 9o, isso e um hacker
function validateCountry(received: string, req: Request, userId: string) {
  const validCountries = ['BR', 'AR', 'CL', 'CO', 'MX', 'PE', 'UY', 'PY']

  if (!validCountries.includes(received)) {
    logger.warn({
      eventType: 'INVALID_DISCRETE_VALUE',
      userId,
      sourceIp: req.ip,
      codeLocation: 'order.controller:setCountry',
      securityRelevant: true,
      description: `Received country "${received}" not in valid set [${validCountries.join(',')}] — likely tampering`
    })
    throw new BadRequestError('Invalid country')
  }
}
```

## Violacao de logica de negocio

```typescript
// Passos fora de ordem
function logOutOfOrderStep(userId: string, expected: number, received: number, req: Request) {
  logger.warn({
    eventType: 'BUSINESS_LOGIC_VIOLATION',
    userId,
    sourceIp: req.ip,
    codeLocation: 'wizard.controller:processStep',
    securityRelevant: true,
    description: `User attempted step ${received} but expected step ${expected} — out of order execution`
  })
}

// Tentativa de exceder limite/alcada
function logLimitExceeded(userId: string, limit: number, attempted: number, req: Request) {
  logger.warn({
    eventType: 'LIMIT_EXCEEDED',
    userId,
    sourceIp: req.ip,
    codeLocation: 'credit.controller:requestCredit',
    securityRelevant: true,
    description: `User attempted ${attempted} but limit is ${limit}`
  })
}

// Acao sem sentido no contexto
function logIllogicalAction(userId: string, action: string, reason: string, req: Request) {
  logger.warn({
    eventType: 'ILLOGICAL_ACTION',
    userId,
    sourceIp: req.ip,
    codeLocation: 'order.controller:cancelOrder',
    securityRelevant: true,
    description: `User attempted "${action}" — ${reason}`
  })
}
```

## Acoes administrativas (uso legitimo, mas logado)

```typescript
// Toda acao de admin e logada
function logAdminAction(adminId: string, action: string, targetId: string, req: Request) {
  logger.info({
    eventType: 'ADMIN_ACTION',
    userId: adminId,
    sourceIp: req.ip,
    codeLocation: 'admin.controller:executeAction',
    securityRelevant: true,
    description: `Admin performed "${action}" on target ${targetId}`
  })
}

// Super admin — loga TUDO que ele faz
function logSuperAdminAction(adminId: string, action: string, details: string, req: Request) {
  logger.info({
    eventType: 'SUPER_ADMIN_ACTION',
    userId: adminId,
    sourceIp: req.ip,
    codeLocation: 'admin.controller:superAction',
    securityRelevant: true,
    description: `Super admin: ${action} — ${details}`
  })
}
```

## Acesso a dados sensiveis (sem logar os dados em si)

```typescript
// Acesso a dados de pagamento — loga O ACESSO, nao os dados
function logPaymentDataAccess(userId: string, customerId: string, req: Request) {
  logger.info({
    eventType: 'SENSITIVE_DATA_ACCESS',
    userId,
    sourceIp: req.ip,
    codeLocation: 'payment.controller:getCardDetails',
    securityRelevant: true,
    description: `User accessed payment data for customer ${customerId}`
    // NUNCA: cardNumber, cvv, etc.
  })
}
```

## Opt-in legal (nao-repudio)

```typescript
function logLegalOptIn(userId: string, optInType: string, req: Request) {
  logger.info({
    eventType: 'LEGAL_OPT_IN',
    userId,
    sourceIp: req.ip,
    userAgent: req.headers['user-agent'],
    codeLocation: 'consent.controller:acceptTerms',
    securityRelevant: true,
    description: `User accepted: ${optInType}`
    // Tipos: 'cookies', 'terms_of_use', 'data_processing', 'email_marketing', 'location_sharing'
  })
}
```

## Session ID — hash em vez do valor real

```typescript
import { createHash } from 'crypto'

// Se precisar correlacionar sessao no log, use hash
function hashSessionId(sessionId: string): string {
  return createHash('sha256').update(sessionId).digest('hex').substring(0, 16)
}

// No log:
logger.info({
  eventType: 'USER_ACTION',
  sessionHash: hashSessionId(req.sessionID), // hash, nunca o ID real
  // ...
})
```

## Eventos de sistema

```typescript
// Falha de TLS em chamada backend
function logTlsFailure(targetUrl: string, error: string) {
  logger.error({
    eventType: 'TLS_FAILURE',
    codeLocation: 'http.client:request',
    securityRelevant: true,
    description: `TLS validation failed for ${targetUrl}: ${error}`
  })
}

// Verbo HTTP inesperado
function logUnexpectedVerb(verb: string, path: string, req: Request) {
  logger.warn({
    eventType: 'UNEXPECTED_HTTP_VERB',
    sourceIp: req.ip,
    codeLocation: 'router:handleRequest',
    securityRelevant: true,
    description: `Received unexpected ${verb} on ${path}`
  })
}

// Upload com virus detectado
function logVirusDetected(userId: string, filename: string, req: Request) {
  logger.error({
    eventType: 'VIRUS_DETECTED',
    userId,
    sourceIp: req.ip,
    codeLocation: 'upload.service:scan',
    securityRelevant: true,
    description: `Virus detected in uploaded file "${filename}"`
    // NUNCA logue o conteudo do arquivo
  })
}
```

## Eventos assincronos com duas timestamps

```typescript
// Para sistemas com filas — logue quando aconteceu E quando processou
function logQueueEvent(event: QueueEvent) {
  logger.info({
    timestamp: new Date().toISOString(),        // quando foi processado
    eventTimestamp: event.createdAt.toISOString(), // quando aconteceu
    eventType: 'QUEUE_PROCESSED',
    correlationId: event.id,
    codeLocation: 'queue.worker:process',
    securityRelevant: false,
    description: `Processed event ${event.type} — delay: ${Date.now() - event.createdAt.getTime()}ms`
  })
}
```