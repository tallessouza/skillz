---
name: rs-seguranca-devs-login-fido
description: "Applies FIDO/WebAuthn passwordless login patterns when implementing authentication flows. Use when user asks to 'implement login', 'add passwordless auth', 'use FIDO', 'WebAuthn login', 'passkey authentication', or 'remove password from login'. Enforces correct challenge flow, credential verification, and security-level decisions for sensitive operations. Make sure to use this skill whenever building authentication that involves WebAuthn or passkeys. Not for password-based auth, OAuth/OIDC flows, or JWT token management."
---

# Login Sem Senha com FIDO/WebAuthn

> Implementar login FIDO requer dois fetches: obter challenge do servidor, assinar com a chave local, enviar de volta para verificacao.

## Rules

1. **Dois fetches obrigatorios** — primeiro busca o challenge (generateAuthenticationOptions), depois envia a resposta assinada (verifyAuthenticationResponse), porque o servidor precisa validar que o cliente possui a chave privada correspondente
2. **Challenge deve ser unico por tentativa** — nunca reutilize o challenge do registro, sorteie um novo, guarde na sessao, valide no retorno, porque replay attacks usam challenges fixos
3. **Busque a public key pelo credential ID** — o response do cliente traz o ID da credential em Base64, use-o para buscar a public key salva no banco, porque sem a public key correta a verificacao falha
4. **signCount e opcional mas recomendado** — passe 0 se nao estiver contando, mas em producao persista e valide no banco, porque detecta clonagem de chaves
5. **Nao peca 2FA imediatamente apos login FIDO** — a chave FIDO ja e segura por si so, reserve o segundo fator para operacoes sensiveis (transacoes, dados criticos), porque adicionar 2FA no login anula a experiencia passwordless
6. **Exija userVerification para apps sensiveis** — bancos, fintechs, governo devem requerer PIN/biometria tanto no registro quanto no login, porque evita que alguem use o computador desbloqueado do usuario

## How to write

### Frontend — Fluxo de login

```typescript
async function login() {
  // 1. Buscar challenge do servidor
  const optionsResponse = await fetch("/auth/generate-authentication-options");
  const options = await optionsResponse.json();

  // 2. Assinar challenge com a chave local
  const authResponse = await SimpleWebAuthnBrowser.startAuthentication(options);

  // 3. Enviar resposta assinada para verificacao
  const verifyResponse = await fetch("/auth/verify-authentication", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authResponse),
  });
  const result = await verifyResponse.json();
}
```

### Backend — Gerar opcoes de autenticacao

```typescript
app.get("/auth/generate-authentication-options", async (req, res) => {
  const challenge = generateRandomChallenge();
  req.session.currentChallenge = challenge;

  const options = await generateAuthenticationOptions({
    rpID: "seudominio.com",
    challenge,
  });

  res.json(options);
});
```

### Backend — Verificar autenticacao

```typescript
app.post("/auth/verify-authentication", async (req, res) => {
  const data = req.body;
  // O credential ID vem em Base64 no data.id
  const savedCredential = await db.findCredentialById(data.id);

  const verification = await verifyAuthenticationResponse({
    response: data,
    expectedChallenge: req.session.currentChallenge,
    expectedOrigin: "https://seudominio.com",
    expectedRPID: "seudominio.com",
    credential: {
      publicKey: savedCredential.publicKey,
      id: savedCredential.id,
      counter: savedCredential.signCount || 0,
    },
  });

  if (verification.verified) {
    req.session.userId = savedCredential.userId;
    res.json({ status: "ok" });
  } else {
    res.status(401).json({ status: "fail" });
  }
});
```

## Example

**Before (inseguro — challenge fixo, sem busca de credential):**
```typescript
const options = await generateAuthenticationOptions({
  rpID: "site.com",
  challenge: "fixed-challenge-123", // Reutilizado sempre
});
// Verifica com public key hardcoded
```

**After (com esta skill aplicada):**
```typescript
const challenge = crypto.randomBytes(32).toString("base64url");
req.session.currentChallenge = challenge;

const options = await generateAuthenticationOptions({
  rpID: "site.com",
  challenge,
});
// Na verificacao: busca credential pelo ID, valida challenge da sessao
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App comum (rede social, blog) | Login FIDO sem userVerification, sem 2FA no login |
| App financeiro (banco, fintech) | Login FIDO COM userVerification (PIN/biometria) |
| Operacao sensivel (transferencia, delete) | Peca segundo fator nesse momento, nao no login |
| Usuario tera multiplos dispositivos | Permita registrar multiplas credentials por usuario |
| signCount disponivel no banco | Valide e atualize a cada login para detectar clonagem |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Challenge fixo/reutilizado | Sortear challenge unico, guardar na sessao |
| 2FA imediato apos login FIDO | Reservar 2FA para operacoes sensiveis |
| Hardcode da public key | Buscar pelo credential ID no banco |
| Ignorar signCount em producao | Persistir e validar counter no banco |
| Mesmo challenge do registro no login | Challenge novo e independente por fluxo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
