---
name: rs-seguranca-devs-implementando-otp
description: "Enforces correct OTP/TOTP implementation patterns when building two-factor authentication. Use when user asks to 'add 2FA', 'implement OTP', 'add two-factor authentication', 'generate TOTP', 'create QR code for auth', or any MFA-related task. Applies rules: per-user secret storage, QR code provisioning, validation before activation, TOTP over HOTP. Make sure to use this skill whenever implementing authentication flows that mention OTP or 2FA. Not for OAuth, JWT tokens, session management, or password hashing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: autenticacao
  tags: [security, otp, totp, 2fa, mfa]
---

# Implementando OTP (Two-Factor Authentication)

> Gere um segredo unico por usuario, provisione via QR Code, e so ative 2FA apos o usuario provar que leu o QR Code corretamente.

## Rules

1. **Um segredo por usuario** — cada usuario tem seu proprio segredo OTP armazenado no banco de dados, porque compartilhar segredos entre usuarios compromete toda a cadeia de autenticacao
2. **Use TOTP, nao HOTP** — 99% dos casos usam TOTP (baseado em tempo), porque e o padrao dos authenticators (Google, Microsoft, Authy, Ente)
3. **Valide antes de ativar** — nunca ative 2FA sem que o usuario prove que leu o QR Code digitando um codigo valido, porque relogio errado ou falha na leitura tranca o usuario fora da conta
4. **Segredo criptografado no banco** — o segredo OTP pode ser criptografado com criptografia de duas vias (AES), porque se o banco vazar, os segredos ficam protegidos
5. **Mantenha 30 segundos de intervalo** — nao altere o intervalo padrao do TOTP, porque todos os authenticators esperam 30s e alterar causa incompatibilidade
6. **Use geradores criptograficamente seguros** — gere segredos com funcoes criptograficas da biblioteca OTP ou do modulo secrets, nunca com random comum

## How to write

### Gerar segredo e provisionar QR Code

```python
import pyotp
import segno

# Gerar segredo unico para o usuario (salvar no banco)
secret = pyotp.random_base32()

# Criar objeto TOTP
totp = pyotp.TOTP(secret)

# Gerar URI de provisionamento para QR Code
uri = totp.provisioning_uri(
    name="usuario@email.com",
    issuer_name="MeuApp"
)
# Formato: otpauth://totp/MeuApp:usuario@email.com?secret=XXX&issuer=MeuApp

# Gerar QR Code (imagem, SVG, ou data URI para HTML)
qr = segno.make_qr(uri)
qr.save("qrcode.png", scale=5)
```

### Validar codigo do usuario

```python
# No servidor, com o segredo do usuario vindo do banco
totp = pyotp.TOTP(user.otp_secret)
current_code = totp.now()

# Comparar com o codigo que o usuario digitou
is_valid = totp.verify(user_input_code)
```

### Fluxo de ativacao de 2FA

```python
# 1. Usuario pede para ativar 2FA
secret = pyotp.random_base32()
save_secret_to_user(user_id, secret)  # salva mas NAO ativa 2FA ainda

# 2. Mostra QR Code + campo para digitar codigo
totp = pyotp.TOTP(secret)
uri = totp.provisioning_uri(name=user.email, issuer_name="MeuApp")
show_qr_code(uri)

# 3. Usuario digita codigo gerado pelo authenticator
if totp.verify(user_submitted_code):
    activate_2fa(user_id)  # AGORA sim ativa a flag no banco
else:
    show_error("Codigo invalido. Tente escanear novamente.")
```

## Example

**Before (ativacao insegura):**
```python
# ERRADO: ativa 2FA sem validar que o usuario leu o QR Code
secret = pyotp.random_base32()
user.otp_secret = secret
user.has_2fa = True  # Ativou direto!
user.save()
show_qr_code(secret)  # E se o usuario nao conseguir ler?
```

**After (com validacao):**
```python
# CORRETO: gera segredo, mostra QR, valida, depois ativa
secret = pyotp.random_base32()
user.otp_secret = secret
user.has_2fa = False  # Ainda nao ativado
user.save()

uri = pyotp.TOTP(secret).provisioning_uri(
    name=user.email, issuer_name="MeuApp"
)
show_qr_code_with_validation_field(uri)

# Endpoint de validacao
def confirm_2fa(user, code):
    totp = pyotp.TOTP(user.otp_secret)
    if totp.verify(code):
        user.has_2fa = True
        user.save()
        return {"status": "2FA ativado com sucesso"}
    return {"error": "Codigo invalido, tente novamente"}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario quer ativar 2FA | Gere segredo, mostre QR, valide codigo, depois ative flag |
| Falha na leitura do QR Code | Ofereça opcao de digitar o segredo manualmente |
| Login com 2FA ativo | Apos senha correta, peca codigo TOTP antes de liberar sessao |
| Relogio do dispositivo errado | TOTP nao vai bater — use `valid_window=1` para tolerar +-30s |
| Segredo no banco de dados | Criptografe com AES (criptografia de duas vias) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Segredo OTP unico global para todos | Segredo unico por usuario |
| `random.choice()` para gerar segredo | `pyotp.random_base32()` ou `secrets` |
| Ativar 2FA sem validar codigo | Validar primeiro codigo antes de ativar flag |
| Usar HOTP sem motivo especifico | Usar TOTP (baseado em tempo) |
| Guardar segredo em plain text | Criptografar segredo no banco (AES) |
| Alterar intervalo padrao de 30s | Manter 30s para compatibilidade |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-implementando-otp/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-implementando-otp/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
