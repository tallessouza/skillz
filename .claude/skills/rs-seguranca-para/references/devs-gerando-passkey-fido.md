---
name: rs-seguranca-devs-passkey-fido
description: "Generates WebAuthn FIDO passkey registration flows when implementing passwordless authentication. Use when user asks to 'add passkey', 'implement passwordless login', 'register FIDO key', 'WebAuthn registration', or 'authenticate without password'. Applies the two-fetch pattern: generate challenge then create credential. Make sure to use this skill whenever building authentication flows that mention passkeys or FIDO. Not for traditional password auth, OAuth, JWT tokens, or session management."
---

# Registro de Passkeys FIDO (WebAuthn)

> Implemente autenticacao sem senha usando o padrao WebAuthn com o fluxo de dois fetches: buscar challenge do servidor, gerar chave no cliente, devolver para validacao.

## Rules

1. **Use bibliotecas da comunidade, nunca implemente do zero** — `py_webauthn` (Python), `SimpleWebAuthn` (JS), porque a API WebAuthn crua exige dezenas de interfaces e objetos complexos
2. **RPID deve ser dominio, nunca IP** — `localhost` funciona, `127.0.0.1` nao, porque a spec WebAuthn exige dominio valido
3. **RPID nao inclui porta** — `localhost` nao `localhost:5000`, porque a spec separa dominio de porta
4. **Challenge deve ser bytes aleatorios criptograficos** — nunca use valores fixos, porque o challenge prova que a resposta veio do mesmo usuario que recebeu o desafio
5. **UserID deve ser bytes** — converta IDs numericos/string para bytes antes de passar ao generateRegistrationOptions
6. **Fluxo de registro exige dois fetches** — primeiro busca options com challenge, segundo envia a chave gerada para validacao no servidor

## How to write

### Servidor (Python com py_webauthn)

```python
from webauthn import generate_registration_options, options_to_json

@app.route("/generate-registration-options")
def registration_options():
    options = generate_registration_options(
        rp_id="localhost",  # Dominio, nunca IP, sem porta
        rp_name="Minha App",
        user_id=str(user.id).encode(),  # Deve ser bytes
        user_name=user.email,
        challenge=os.urandom(32),  # Aleatorio criptografico, salvar na session
    )
    session["challenge"] = options.challenge
    return options_to_json(options)
```

### Cliente (JS com SimpleWebAuthn)

```javascript
import {
  browserSupportsWebAuthn,
  startRegistration,
} from "@simplewebauthn/browser";

// 1. Verificar suporte antes de mostrar botao
if (browserSupportsWebAuthn()) {
  registerButton.style.display = "block";
}

// 2. Fetch 1: buscar challenge do servidor
async function registerPasskey() {
  const resp = await fetch("/generate-registration-options");
  const options = await resp.json();

  // 3. Gerar chave criptografica (abre dialog nativo do browser)
  const attestationResponse = await startRegistration(options);

  // 4. Fetch 2: enviar chave para validacao no servidor
  await fetch("/verify-registration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attestationResponse),
  });
}
```

## Example

**Before (sem passkey, senha tradicional):**
```python
@app.route("/register", methods=["POST"])
def register():
    password_hash = bcrypt.hash(request.form["password"])
    db.save_user(email, password_hash)
```

**After (com passkey FIDO):**
```python
@app.route("/generate-registration-options")
def registration_options():
    options = generate_registration_options(
        rp_id="meudominio.com",
        rp_name="Minha App",
        user_id=str(user.id).encode(),
        user_name=user.email,
        challenge=os.urandom(32),
    )
    session["challenge"] = options.challenge
    return options_to_json(options)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario ja logado quer adicionar passkey | Mostrar botao no perfil/painel |
| Novo cadastro | Gerar passkey apos validar email |
| Browser nao suporta WebAuthn | Esconder botao, manter fallback de senha |
| Ambiente de dev com IP | Usar `localhost` no RPID, nunca `127.0.0.1` |
| Escolha de onde salvar chave | O browser cuida disso (gerenciador, celular via QR) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Challenge fixo/hardcoded | `os.urandom(32)` ou equivalente |
| RPID como IP `127.0.0.1` | RPID como dominio `localhost` |
| RPID com porta `localhost:5000` | RPID sem porta `localhost` |
| Implementar WebAuthn API crua | Usar `py_webauthn` / `SimpleWebAuthn` |
| Mostrar botao sem checar suporte | `browserSupportsWebAuthn()` primeiro |
| Um unico fetch no registro | Dois fetches: options + verificacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-gerando-passkey-fido/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-gerando-passkey-fido/references/code-examples.md)
