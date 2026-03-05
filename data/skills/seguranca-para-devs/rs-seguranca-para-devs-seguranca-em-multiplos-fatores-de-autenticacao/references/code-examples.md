# Code Examples: Multiplos Fatores de Autenticacao

## Exemplo 1: Setup completo de TOTP com fallback

```typescript
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

// Setup: gerar segredo e QR Code para o usuario
async function setupTotp(userId: string, userEmail: string) {
  const secret = authenticator.generateSecret()
  
  // Salvar segredo no banco (criptografado)
  await saveUserTotpSecret(userId, encrypt(secret))
  
  // Gerar QR Code para o usuario escanear com Google Authenticator
  const otpAuthUrl = authenticator.keyuri(userEmail, 'MinhaApp', secret)
  const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl)
  
  // Gerar codigos de recuperacao (backup)
  const recoveryCodes = generateRecoveryCodes(10)
  await saveRecoveryCodes(userId, recoveryCodes)
  
  return { qrCodeDataUrl, recoveryCodes }
}

// Verificacao: validar codigo OTP
function verifyTotp(encryptedSecret: string, userCode: string): boolean {
  const secret = decrypt(encryptedSecret)
  return authenticator.verify({ token: userCode, secret })
}
```

## Exemplo 2: Fluxo completo de login com MFA

```typescript
async function loginWithMfa(email: string, password: string, context: RequestContext) {
  // === FATOR 1: Algo que voce sabe ===
  const user = await findUserByEmail(email)
  if (!user) throw new AuthError('invalid_credentials')
  
  const passwordValid = await bcrypt.compare(password, user.passwordHash)
  if (!passwordValid) throw new AuthError('invalid_credentials')
  
  // === Verificar se MFA esta habilitado ===
  if (!user.mfaEnabled) {
    return createSession(user.id)
  }
  
  // === FATOR SILENCIOSO: Onde voce esta ===
  const isKnownIp = await checkKnownIp(user.id, context.ip)
  const isKnownGeo = await checkGeofence(user.id, context.geolocation)
  
  if (isKnownIp && isKnownGeo) {
    // Local conhecido — nao precisa de segundo fator explicito
    return createSession(user.id)
  }
  
  // === FATOR 2 EXPLICITO: Algo que voce tem ===
  // Retornar challenge para o frontend pedir o codigo
  const challengeToken = await createMfaChallenge(user.id, {
    method: user.preferredMfaMethod, // 'totp' | 'sms' | 'fido2'
    ip: context.ip,
    geo: context.geolocation,
  })
  
  return { requiresMfa: true, challengeToken, method: user.preferredMfaMethod }
}

// Segundo passo: verificar o codigo MFA
async function verifyMfaChallenge(challengeToken: string, code: string, context: RequestContext) {
  const challenge = await getMfaChallenge(challengeToken)
  if (!challenge || challenge.expired) throw new AuthError('challenge_expired')
  
  let verified = false
  
  switch (challenge.method) {
    case 'totp':
      verified = verifyTotp(challenge.user.totpSecret, code)
      break
    case 'sms':
      verified = await verifySmsCode(challenge.userId, code)
      break
    case 'fido2':
      verified = await verifyFido2Assertion(challenge.userId, code)
      break
  }
  
  if (!verified) throw new AuthError('invalid_mfa_code')
  
  // Registrar IP/geo como conhecidos para futuras autenticacoes
  await registerKnownLocation(challenge.userId, context.ip, context.geolocation)
  
  return createSession(challenge.userId)
}
```

## Exemplo 3: Geofencing como fator silencioso

```typescript
interface GeoFence {
  userId: string
  label: string // 'casa', 'escritorio', 'coworking'
  latitude: number
  longitude: number
  radiusInMeters: number
}

async function checkGeofence(userId: string, currentGeo: GeoLocation): Promise<boolean> {
  const fences = await getUserGeofences(userId)
  
  return fences.some(fence => {
    const distanceInMeters = haversineDistance(
      fence.latitude, fence.longitude,
      currentGeo.latitude, currentGeo.longitude
    )
    return distanceInMeters <= fence.radiusInMeters
  })
}

// Registrar novo local apos verificacao de segundo fator
async function registerKnownLocation(userId: string, ip: string, geo: GeoLocation) {
  await saveKnownIp(userId, ip, { expiresInDays: 90 })
  
  if (geo) {
    await saveGeofence({
      userId,
      label: 'auto-registered',
      latitude: geo.latitude,
      longitude: geo.longitude,
      radiusInMeters: 500, // raio de 500m
    })
  }
}
```

## Exemplo 4: Re-autenticacao para operacoes sensiveis

```typescript
// Mesmo com sessao ativa, exigir re-autenticacao para acoes criticas
async function requireReauthForSensitiveAction(
  sessionUser: User,
  action: 'transfer' | 'delete_account' | 'change_password'
) {
  const riskLevel = getActionRiskLevel(action)
  
  switch (riskLevel) {
    case 'low':
      return // sessao ativa e suficiente
    case 'medium':
      // Pedir senha novamente
      await promptPasswordReauth(sessionUser.id)
      break
    case 'high':
      // Pedir senha + segundo fator
      await promptPasswordReauth(sessionUser.id)
      await promptMfaReauth(sessionUser.id)
      break
    case 'critical':
      // Pedir senha + segundo fator + confirmacao por email
      await promptPasswordReauth(sessionUser.id)
      await promptMfaReauth(sessionUser.id)
      await sendConfirmationEmail(sessionUser.email, action)
      break
  }
}
```

## Exemplo 5: Tabela de decisao de fatores por contexto

```typescript
// Configuracao de quais fatores exigir por tipo de sistema
const MFA_POLICIES = {
  // App de conteudo/blog — baixo risco
  content_platform: {
    firstFactor: 'password',
    secondFactor: 'none',
    silentFactor: 'ip_tracking', // detectar login de novo IP
  },
  
  // SaaS com dados de usuario — medio risco
  saas_application: {
    firstFactor: 'password',
    secondFactor: 'totp_optional', // incentivado mas opcional
    silentFactor: 'geofencing',
  },
  
  // App financeiro — alto risco
  financial_app: {
    firstFactor: 'password',
    secondFactor: 'totp_required',
    silentFactor: 'geofencing',
    transactionFactor: 'reauth_with_mfa', // re-auth por transacao
  },
  
  // Infraestrutura critica — risco maximo
  critical_infrastructure: {
    firstFactor: 'password',
    secondFactor: 'fido2_required',
    thirdFactor: 'biometric',
    silentFactor: 'geofencing_strict',
    sessionTimeout: '15_minutes',
  },
} as const
```