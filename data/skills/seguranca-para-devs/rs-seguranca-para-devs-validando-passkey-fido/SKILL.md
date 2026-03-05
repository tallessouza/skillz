---
name: rs-seguranca-devs-validando-passkey-fido
description: "Applies FIDO passkey server-side validation patterns when implementing WebAuthn registration flows. Use when user asks to 'validate passkey', 'verify FIDO registration', 'implement WebAuthn', 'register security key', or 'store credential public key'. Covers challenge verification, credential storage schema, user verification control, and origin validation. Make sure to use this skill whenever building passwordless authentication with FIDO2/WebAuthn. Not for login/authentication flow (separate step), OAuth, JWT tokens, or session management."
---

# Validando Passkey FIDO — Registro no Servidor

> Ao receber uma chave FIDO do navegador, verifique o challenge, valide a origem, e armazene Credential ID + Public Key vinculados ao usuario.

## Rules

1. **Sempre verifique o challenge no servidor** — compare com o challenge armazenado na session do usuario, porque sem isso qualquer atacante pode enviar um registro forjado
2. **Valide a origem (origin)** — passe o origin esperado (ex: `http://localhost:5000`) para evitar CSRF e cross-site scripting
3. **Armazene apenas Credential ID e Public Key** — sao as duas informacoes essenciais do `registrationVerification` para o login posterior
4. **Crie tabela separada de chaves com FK para usuarios** — um usuario pode ter multiplas chaves (casa, escritorio, celular), porque 1:N e o modelo correto
5. **Use `verifyRegistrationResponse`, nao `validateRegistrationResponse`** — o nome correto da funcao na lib SimpleWebAuthn, porque o nome errado causa import error silencioso
6. **Controle User Verification conforme o nivel de seguranca** — `required` exige PIN/biometria, `preferred` e o default e nao exige nada extra

## How to write

### Endpoint de verificacao do registro

```typescript
import { verifyRegistrationResponse } from '@simplewebauthn/server';

app.post('/verify-registration', async (req, res) => {
  const verification = await verifyRegistrationResponse({
    response: req.body,
    expectedChallenge: req.session.currentChallenge,
    expectedRPID: 'localhost',
    expectedOrigin: 'http://localhost:5000',
    requireUserVerification: false, // true se exigir PIN/biometria
  });

  if (verification.verified) {
    const { credentialID, credentialPublicKey } = verification.registrationInfo;
    // Salvar no banco: userId, credentialID, credentialPublicKey
    await saveCredential(req.session.userId, credentialID, credentialPublicKey);
    return res.json({ status: 'ok', message: 'Registration successful' });
  }

  return res.status(400).json({ status: 'failed', message: 'Verification failed' });
});
```

### Schema da tabela de chaves

```sql
CREATE TABLE user_credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  credential_id TEXT NOT NULL,
  public_key BYTEA NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Exigindo verificacao do usuario no registro

```typescript
import {
  generateRegistrationOptions,
} from '@simplewebauthn/server';

const options = await generateRegistrationOptions({
  rpName: 'My App',
  rpID: 'localhost',
  userID: user.id,
  userName: user.email,
  authenticatorSelection: {
    userVerification: 'required', // exige PIN ou biometria
  },
});
```

## Example

**Before (registro sem validacao no servidor):**
```typescript
// Chave gerada no navegador mas nunca enviada/validada
const credential = await startRegistration(options);
console.log(credential); // fica so no console
```

**After (com validacao e persistencia):**
```typescript
const credential = await startRegistration(options);
const verificationResp = await fetch('/verify-registration', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credential),
});
// Servidor valida challenge + origin, salva credentialID + publicKey
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App com dados sensiveis (financeiro, saude) | `userVerification: 'required'` |
| App de uso geral | `userVerification: 'preferred'` (default) |
| Usuario pode ter multiplos dispositivos | Tabela de chaves com FK para usuario (1:N) |
| Precisa validar que chave veio do dispositivo local | Controle via `authenticatorAttachment` nas options |
| `requireUserVerification: true` no servidor | Obrigatorio tambem enviar `userVerification: 'required'` no challenge |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `validateRegistrationResponse(...)` | `verifyRegistrationResponse(...)` |
| Salvar a chave sem verificar o challenge | Sempre verificar challenge da session antes de salvar |
| Tabela unica usuario+chave (1:1) | Tabela separada de chaves com FK (1:N) |
| Ignorar origin na verificacao | Passar `expectedOrigin` para prevenir CSRF |
| Exigir `requireUserVerification: true` sem enviar `userVerification: 'required'` no challenge | Ambos devem estar alinhados, senao o registro falha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
