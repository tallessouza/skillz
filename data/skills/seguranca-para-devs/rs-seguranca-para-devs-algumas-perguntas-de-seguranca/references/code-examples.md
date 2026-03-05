# Code Examples: Perguntas de Segurança — Alternativas Seguras

## O que NÃO implementar

```typescript
// NUNCA faça isso — perguntas de segurança são inseguras
interface SecurityQuestion {
  question: string
  answer: string // Armazenado em texto plano? Pior ainda.
}

// Anti-pattern: recuperação por pergunta de segurança
async function recoverBySecurityQuestion(
  userId: string,
  questionId: number,
  answer: string
): Promise<boolean> {
  const stored = await db.getSecurityAnswer(userId, questionId)
  return stored === answer // Comparação em texto plano, sem rate limiting, sem expiração
}
```

## Alternativa 1: Magic Link por Email

```typescript
import { randomBytes } from 'crypto'

async function requestPasswordReset(email: string): Promise<void> {
  const user = await db.findUserByEmail(email)
  if (!user) return // Não revele se o email existe

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

  await db.saveResetToken({
    userId: user.id,
    token: await hashToken(token), // Armazene o hash, não o token
    expiresAt,
  })

  await sendEmail({
    to: email,
    subject: 'Recuperação de senha',
    body: `Clique aqui para redefinir sua senha: ${BASE_URL}/reset?token=${token}`,
  })
}

async function resetPassword(token: string, newPassword: string): Promise<void> {
  const hashedToken = await hashToken(token)
  const resetRecord = await db.findValidResetToken(hashedToken)

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    throw new Error('Token inválido ou expirado')
  }

  await db.updatePassword(resetRecord.userId, await hashPassword(newPassword))
  await db.invalidateResetToken(hashedToken)
  await db.invalidateAllSessions(resetRecord.userId) // Força re-login
}
```

## Alternativa 2: Código OTP

```typescript
import { randomInt } from 'crypto'

async function sendOtpCode(email: string): Promise<void> {
  const user = await db.findUserByEmail(email)
  if (!user) return

  const code = randomInt(100000, 999999).toString() // 6 dígitos
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutos

  await db.saveOtp({
    userId: user.id,
    code: await hashToken(code),
    expiresAt,
    attempts: 0,
  })

  await sendEmail({
    to: email,
    subject: 'Seu código de verificação',
    body: `Seu código: ${code}. Expira em 5 minutos.`,
  })
}

async function verifyOtp(email: string, code: string): Promise<string> {
  const user = await db.findUserByEmail(email)
  if (!user) throw new Error('Código inválido')

  const otpRecord = await db.findOtp(user.id)

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new Error('Código expirado')
  }

  if (otpRecord.attempts >= 3) {
    await db.invalidateOtp(user.id)
    throw new Error('Muitas tentativas. Solicite um novo código.')
  }

  const isValid = await verifyHash(code, otpRecord.code)
  if (!isValid) {
    await db.incrementOtpAttempts(user.id)
    throw new Error('Código inválido')
  }

  await db.invalidateOtp(user.id)
  return generateTemporaryResetToken(user.id)
}
```

## Alternativa 3: TOTP (Google Authenticator)

```typescript
import { authenticator } from 'otplib'

// No momento do cadastro/ativação de MFA
async function enableTotp(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
  const secret = authenticator.generateSecret()

  await db.saveTotpSecret(userId, await encrypt(secret))

  const otpauthUrl = authenticator.keyuri(userId, 'MeuApp', secret)

  return {
    secret,
    qrCodeUrl: otpauthUrl, // Gerar QR code com esta URL
  }
}

// Na verificação
async function verifyTotp(userId: string, token: string): Promise<boolean> {
  const encryptedSecret = await db.getTotpSecret(userId)
  const secret = await decrypt(encryptedSecret)

  return authenticator.verify({ token, secret })
}
```

## Migração de sistema legado

```typescript
// Se seu sistema já usa perguntas de segurança, migre gradualmente
async function migrateFromSecurityQuestions(userId: string): Promise<void> {
  const user = await db.findUser(userId)

  // 1. Na próxima vez que o usuário fizer login com sucesso
  if (user.hasSecurityQuestions && !user.hasEmailRecovery) {
    // Solicite que configure email de recuperação
    await promptSetupEmailRecovery(userId)
  }

  // 2. Após configurar alternativa, remova perguntas de segurança
  if (user.hasEmailRecovery || user.hasMfa) {
    await db.removeSecurityQuestions(userId)
  }
}
```