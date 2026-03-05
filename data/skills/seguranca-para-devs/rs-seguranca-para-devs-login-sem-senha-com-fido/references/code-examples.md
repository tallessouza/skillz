# Code Examples: Login Sem Senha com FIDO

## Setup — Imports necessarios

```typescript
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { startAuthentication } from "@simplewebauthn/browser";
```

## Frontend completo — Template de login

```html
<script type="module">
  import { startAuthentication, browserSupportsWebAuthn } from "@simplewebauthn/browser";

  if (browserSupportsWebAuthn()) {
    login();
  }

  async function login() {
    // Fetch 1: obter challenge
    const optionsResp = await fetch("/generate-authentication-options");
    const options = await optionsResp.json();

    // Assinar com a chave local
    const authResp = await startAuthentication(options);

    // Fetch 2: enviar para verificacao
    const verifyResp = await fetch("/verify-authentication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authResp),
    });
    const result = await verifyResp.json();
    // result.status === "ok" ou "fail"
  }
</script>
```

Nota: o instrutor nao usa botao — o login inicia automaticamente ao carregar a pagina se o navegador suporta WebAuthn.

## Backend — Gerar opcoes de autenticacao (minimo)

```typescript
app.get("/generate-authentication-options", async (req, res) => {
  const options = await generateAuthenticationOptions({
    rpID: "localhost",
    challenge: "some-random-challenge", // Em producao: crypto.randomBytes(32)
  });
  res.json(options);
});
```

O exemplo minimo do WebAuthn requer apenas `rpID` e `challenge`. Nao e necessario passar `allowCredentials` — o navegador mostrara todas as chaves disponiveis para o dominio.

## Backend — Verificar autenticacao

```typescript
app.post("/verify-authentication", async (req, res) => {
  const data = req.body;

  try {
    // data.id contem o credential ID em Base64
    // Use para buscar a credential salva no banco
    const savedCredential = findCredentialById(data.id);

    const verification = await verifyAuthenticationResponse({
      response: data,
      expectedChallenge: "some-random-challenge", // Mesmo challenge enviado
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
      credential: {
        publicKey: savedCredential.publicKey,
        id: savedCredential.credentialID,
        counter: 0, // Ideal: savedCredential.signCount
      },
    });

    if (verification.verified) {
      res.json({ status: "ok" });
    } else {
      res.json({ status: "fail" });
    }
  } catch (error) {
    // "Nao foi possivel verificar a assinatura da autenticacao"
    // Chave invalida, challenge incorreto, ou credential nao encontrada
    res.status(400).json({ status: "fail", error: error.message });
  }
});
```

## Estrutura do response do cliente

O `startAuthentication` retorna um objeto como:

```json
{
  "id": "base64url-encoded-credential-id",
  "rawId": "binary-credential-id",
  "response": {
    "authenticatorData": "...",
    "clientDataJSON": "...",
    "signature": "..."
  },
  "type": "public-key"
}
```

O `id` e o mesmo `credentialID` salvo no registro, em Base64URL. Use-o para buscar a public key no banco.

## Versao producao — Com challenge aleatorio e sessao

```typescript
import crypto from "crypto";

app.get("/generate-authentication-options", async (req, res) => {
  const challenge = crypto.randomBytes(32).toString("base64url");
  req.session.currentChallenge = challenge;

  const options = await generateAuthenticationOptions({
    rpID: "seudominio.com",
    challenge,
  });
  res.json(options);
});

app.post("/verify-authentication", async (req, res) => {
  const data = req.body;
  const savedCredential = await db.credentials.findUnique({
    where: { credentialId: data.id },
    include: { user: true },
  });

  if (!savedCredential) {
    return res.status(401).json({ status: "fail" });
  }

  const verification = await verifyAuthenticationResponse({
    response: data,
    expectedChallenge: req.session.currentChallenge,
    expectedOrigin: "https://seudominio.com",
    expectedRPID: "seudominio.com",
    credential: {
      publicKey: savedCredential.publicKey,
      id: savedCredential.credentialId,
      counter: savedCredential.signCount,
    },
  });

  if (verification.verified) {
    // Atualizar signCount no banco
    await db.credentials.update({
      where: { credentialId: data.id },
      data: { signCount: verification.authenticationInfo.newCounter },
    });

    // Setar sessao do usuario
    req.session.userId = savedCredential.user.id;
    res.json({ status: "ok" });
  } else {
    res.status(401).json({ status: "fail" });
  }
});
```

## Com userVerification para apps sensiveis

```typescript
const options = await generateAuthenticationOptions({
  rpID: "banco.com.br",
  challenge,
  userVerification: "required", // Forca PIN/biometria
});
```

## Segundo fator em operacao sensivel (nao no login)

```typescript
// Rota de transferencia — pede verificacao extra
app.post("/transfer", async (req, res) => {
  // Usuario ja esta logado via FIDO (sem friccao)
  // Agora pede segundo fator apenas para esta operacao
  const authOptions = await generateAuthenticationOptions({
    rpID: "banco.com.br",
    challenge: crypto.randomBytes(32).toString("base64url"),
    userVerification: "required", // Aqui sim, biometria/PIN
  });
  // ... verificar e so entao executar transferencia
});
```