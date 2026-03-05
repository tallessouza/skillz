# Code Examples: Validando Passkey FIDO

## Exemplo 1: Envio da chave do navegador para o servidor

O front-end faz um POST com a chave criptografica (public key) serializada como JSON:

```javascript
// Apos startRegistration() gerar a chave no navegador
const verificationResp = await fetch('/verify-registration', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credential), // chave publica + dados do challenge
});
const result = await verificationResp.json();
console.log(result); // { status: 'ok', message: 'Registration successful' }
```

## Exemplo 2: Endpoint completo de verificacao (servidor)

```typescript
import { verifyRegistrationResponse } from '@simplewebauthn/server';

app.post('/verify-registration', async (req, res) => {
  try {
    const data = req.body; // JSON com a chave publica

    const registrationVerification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge: req.session.currentChallenge, // challenge da session
      expectedRPID: 'localhost',
      expectedOrigin: 'http://localhost:5000',
    });

    if (registrationVerification.verified) {
      // registrationVerification.registrationInfo contem:
      // - credentialID
      // - credentialPublicKey
      // Salvar ambos no banco vinculados ao usuario

      return res.json({ status: 'ok', message: 'Registration successful' });
    }

    return res.status(400).json({ status: 'failed', message: 'Verification failed' });
  } catch (error) {
    return res.status(400).json({ status: 'failed', message: error.message });
  }
});
```

## Exemplo 3: Imports corretos

```typescript
// CORRETO
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

// ERRADO (nome sugerido pelo Copilot que causa erro)
// import { validateRegistrationResponse } from '@simplewebauthn/server'; // NAO EXISTE
```

## Exemplo 4: Authenticator Selection com User Verification

```typescript
import {
  generateRegistrationOptions,
} from '@simplewebauthn/server';

// Gerando options COM exigencia de verificacao do usuario
const options = await generateRegistrationOptions({
  rpName: 'My App',
  rpID: 'localhost',
  userID: user.id,
  userName: user.email,
  authenticatorSelection: {
    userVerification: 'required', // exige PIN ou biometria
  },
});

// Na verificacao, tambem exigir:
const verification = await verifyRegistrationResponse({
  response: req.body,
  expectedChallenge: req.session.currentChallenge,
  expectedRPID: 'localhost',
  expectedOrigin: 'http://localhost:5000',
  requireUserVerification: true, // DEVE estar alinhado com o authenticatorSelection
});
```

## Exemplo 5: O que NAO fazer (desalinhamento)

```typescript
// Gera options SEM exigir verificacao
const options = await generateRegistrationOptions({
  rpName: 'My App',
  rpID: 'localhost',
  userID: user.id,
  userName: user.email,
  // SEM authenticatorSelection.userVerification: 'required'
});

// Mas exige verificacao na hora de validar
const verification = await verifyRegistrationResponse({
  response: req.body,
  expectedChallenge: req.session.currentChallenge,
  expectedRPID: 'localhost',
  expectedOrigin: 'http://localhost:5000',
  requireUserVerification: true, // ERRO: usuario nao foi verificado!
});
// Resultado: "User verification is required, but user was not verified during attestation"
```

## Exemplo 6: Persistencia das credenciais

```typescript
// Apos verificacao bem-sucedida
if (registrationVerification.verified) {
  const { credentialID, credentialPublicKey } = registrationVerification.registrationInfo;

  // Salvar no banco (exemplo com query SQL)
  await db.query(
    'INSERT INTO user_credentials (user_id, credential_id, public_key) VALUES ($1, $2, $3)',
    [userId, credentialID, credentialPublicKey]
  );
}
```

## Schema recomendado

```sql
-- Tabela separada: usuario pode ter N chaves
CREATE TABLE user_credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  credential_id TEXT NOT NULL UNIQUE,
  public_key BYTEA NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index para busca rapida por credential_id no login
CREATE INDEX idx_credential_id ON user_credentials(credential_id);
```