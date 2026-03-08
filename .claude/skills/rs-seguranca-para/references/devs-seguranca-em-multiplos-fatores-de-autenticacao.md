---
name: rs-seguranca-devs-mfa
description: "Applies multi-factor authentication design patterns when implementing auth systems. Use when user asks to 'add authentication', 'implement MFA', 'add 2FA', 'secure login', 'add OTP', or 'implement WebAuthn'. Guides factor selection (knowledge, possession, inherence, location, behavior), combines factors for exponential security gain, and matches security level to risk context. Make sure to use this skill whenever designing or reviewing authentication flows. Not for password hashing, session management, or authorization/RBAC."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: autenticacao
  tags: [security]
---

# Multiplos Fatores de Autenticacao

> Combine fatores de categorias diferentes para aumentar exponencialmente a seguranca — dois mecanismos do mesmo fator nao sao MFA.

## Rules

1. **Distinga fator de mecanismo** — senha + PIN = um fator usado duas vezes (algo que voce sabe), nao MFA, porque um atacante que compromete um canal de "conhecimento" pode comprometer ambos
2. **Combine fatores de categorias diferentes** — senha (sabe) + OTP (tem) = 2FA real, porque o atacante precisa de dois vetores de ataque independentes
3. **Escale seguranca proporcional ao risco** — bingo do clube de senhoras != controle de usina nuclear, porque over-engineering de seguranca afasta usuarios sem necessidade
4. **Prefira OTP baseado em app sobre SMS** — Google Authenticator/TOTP e mais seguro que SMS, porque SMS pode ser interceptado via SIM swap ou conluio com operadoras
5. **Use geolocalização como fator silencioso** — IP/geofencing reduz fricção ao dispensar segundo fator em locais conhecidos, porque combina seguranca com usabilidade
6. **Considere FIDO2/WebAuthn para posse** — tokens fisicos ou passkeys sao mais resistentes a phishing que OTP, porque a chave criptografica esta vinculada ao dominio

## Categorias de fatores

| Fator | Descricao | Exemplos |
|-------|-----------|----------|
| Algo que voce **sabe** | Conhecimento | Senha, PIN, pergunta de seguranca |
| Algo que voce **tem** | Posse | OTP (TOTP/HOTP), token FIDO, smart card, SMS, email |
| Algo que voce **e** | Inerencia | Impressao digital, reconhecimento facial, iris |
| Onde voce **esta** | Localizacao | IP, geolocalizacao, geofencing |
| Algo que voce **faz** | Comportamento | Ritmo de digitacao, padrao de uso, analise de marcha |

## How to design

### Escolha de fatores por contexto

```typescript
// Baixo risco: senha + geolocalizacao silenciosa
// Medio risco: senha + TOTP (Google Authenticator)
// Alto risco: senha + FIDO2/WebAuthn + reconhecimento facial
// Critico: senha + token fisico + biometria + geofencing
```

### Padrao: Fator silencioso + fallback explicito

```typescript
async function authenticateUser(credentials: Credentials, context: AuthContext) {
  // Fator 1: algo que sabe
  const passwordValid = await verifyPassword(credentials.email, credentials.password)
  if (!passwordValid) throw new AuthError('invalid_credentials')

  // Fator 2: onde esta (silencioso)
  const knownLocation = await isKnownLocation(context.ip, credentials.userId)
  if (knownLocation) return grantAccess(credentials.userId)

  // Fallback: algo que tem (explicito)
  const otpChallenge = await sendOtpChallenge(credentials.userId)
  return requireSecondFactor(otpChallenge)
}
```

## Example

**Before (falso MFA — dois mecanismos do mesmo fator):**
```typescript
// Banco pede senha de acesso + senha de transacao
// Parece seguro, mas ambos sao "algo que voce sabe"
const loginPassword = await prompt('Senha de acesso:')
const transactionPassword = await prompt('Senha de transacao:')
// Um keylogger captura ambas simultaneamente
```

**After (MFA real — fatores de categorias diferentes):**
```typescript
// Fator 1: algo que sabe
const password = await prompt('Senha:')
await verifyPassword(user, password)

// Fator 2: algo que tem (TOTP)
const totpCode = await prompt('Codigo do Authenticator:')
await verifyTotp(user.totpSecret, totpCode)
// Atacante precisa da senha E do celular fisico
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App web padrao | Senha + TOTP como segundo fator opcional |
| App financeiro | Senha + TOTP obrigatorio + geofencing |
| Sistema corporativo interno | Senha + FIDO2 + restricao por IP/VPN |
| Primeiro acesso em novo dispositivo | Exigir segundo fator, depois confiar no dispositivo |
| Transacao de alto valor | Re-autenticar com fator adicional mesmo em sessao ativa |
| Usuario reclama de friccao | Adicionar fator silencioso (geo/IP) para reduzir pedidos explicitos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| SMS como fator unico de recuperacao | SMS + email + pergunta, ou TOTP |
| Duas senhas chamando de "2FA" | Senha + fator de categoria diferente |
| Biometria como fator unico | Biometria + senha (biometria pode ser burlada) |
| Mesmo nivel de MFA para tudo | Escale conforme o risco do recurso |
| Bloquear usuario sem fallback | Oferecer codigos de recuperacao no setup do MFA |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-seguranca-em-multiplos-fatores-de-autenticacao/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-seguranca-em-multiplos-fatores-de-autenticacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
