# Code Examples: Registro de Passkeys FIDO (WebAuthn)

## Setup do projeto Flask

```python
from flask import Flask, render_template, session
import os

app = Flask(__name__)
app.secret_key = os.urandom(32)

@app.route("/")
def index():
    return render_template("index.html")
    # Template com dois links: /register e /login

@app.route("/register")
def register():
    return render_template("register.html")
```

## Template register.html com verificacao de suporte

```html
<button id="btn-register" style="display: none" onclick="registerPasskey()">
  Cadastrar Chave
</button>

<script type="module">
  import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

  const btn = document.getElementById("btn-register");

  if (browserSupportsWebAuthn()) {
    btn.style.display = "block";
  }
</script>
```

## Rota de geracao de opcoes (servidor Python)

```python
from webauthn import generate_registration_options, options_to_json

@app.route("/generate-registration-options")
def registration_options():
    options = generate_registration_options(
        rp_id="localhost",          # Dominio, sem porta
        rp_name="Dev Seguro",       # Nome da sua aplicacao
        user_id=b"user-id-123",     # Deve ser bytes
        user_name="user@email.com", # Username/email do usuario
        challenge=b"someRandomChallenge",  # EM PRODUCAO: os.urandom(32)
    )
    # EM PRODUCAO: session["challenge"] = options.challenge
    return options_to_json(options)
```

## Fluxo completo no cliente (JavaScript)

```javascript
import {
  browserSupportsWebAuthn,
  startRegistration,
} from "@simplewebauthn/browser";

// Verificar suporte
if (browserSupportsWebAuthn()) {
  document.getElementById("btn-register").style.display = "block";
}

async function registerPasskey() {
  // Fetch 1: buscar options com challenge
  const resp = await fetch("/generate-registration-options");
  const options = await resp.json();
  // options contem: challenge (base64), algoritmos, rpId, etc.

  // Gerar chave (abre dialog nativo do browser)
  // Usuario escolhe: gerenciador local, celular via QR, ou hardware key
  try {
    const attestationResponse = await startRegistration(options);
    console.log("Chave gerada:", attestationResponse);

    // Fetch 2: enviar chave para validacao no servidor
    // (implementado na proxima aula)
    await fetch("/verify-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attestationResponse),
    });
  } catch (error) {
    // Mostrar mensagem amigavel ao usuario
    console.error("Erro ao registrar chave:", error);
  }
}
```

## Objeto retornado por generate_registration_options

```json
{
  "challenge": "c29tZVJhbmRvbUNoYWxsZW5nZQ==",
  "rp": {
    "name": "Dev Seguro",
    "id": "localhost"
  },
  "user": {
    "id": "dXNlci1pZC0xMjM=",
    "name": "user@email.com",
    "displayName": ""
  },
  "pubKeyCredParams": [
    { "type": "public-key", "alg": -7 },
    { "type": "public-key", "alg": -257 }
  ],
  "timeout": 60000,
  "attestation": "none"
}
```

## Bibliotecas por linguagem (referencia rapida)

| Linguagem | Biblioteca servidor | Onde encontrar |
|-----------|-------------------|----------------|
| Python | `py_webauthn` | PyPI |
| JavaScript/Node | `@simplewebauthn/server` | npm |
| JavaScript client | `@simplewebauthn/browser` | npm |
| PHP | Varias opcoes | awesome-webauthn |
| Go | 6+ bibliotecas | awesome-webauthn |
| Java | Varias opcoes | awesome-webauthn |
| Ruby | Varias opcoes | awesome-webauthn |
| Rust | Varias opcoes | awesome-webauthn |

## Versao producao do challenge

```python
import os

# CORRETO: challenge criptograficamente seguro
challenge = os.urandom(32)

# Salvar na sessao para verificar depois
session["current_challenge"] = challenge

options = generate_registration_options(
    rp_id="meudominio.com.br",
    rp_name="Minha App",
    user_id=str(user.id).encode("utf-8"),
    user_name=user.email,
    challenge=challenge,
)
```