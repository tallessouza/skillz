# Code Examples: Implementando OTP

## Exemplo completo da aula (Python)

### Setup inicial

```bash
# requirements.txt
pyotp
segno
```

```bash
pip install pyotp segno
```

### Gerando segredo

```python
import pyotp

# Gerar segredo criptograficamente seguro (base32)
secret = pyotp.random_base32()
print(secret)  # Ex: JBSWY3DPEHPK3PXP
# Salvar esse segredo no banco de dados, coluna otp_secret da tabela users
```

### Gerando QR Code

```python
import pyotp
import segno

secret = "JBSWY3DPEHPK3PXP"  # Viria do banco de dados

totp = pyotp.TOTP(secret)

# Gerar URI de provisionamento
uri = totp.provisioning_uri(
    name="elcio@avise.com.br",
    issuer_name="DevSeguro"
)
print(uri)
# otpauth://totp/DevSeguro:elcio%40avise.com.br?secret=JBSWY3DPEHPK3PXP&issuer=DevSeguro

# Gerar QR Code
qr = segno.make_qr(uri)

# Opcao 1: Mostrar no terminal (para debug)
qr.terminal()

# Opcao 2: Salvar como PNG
qr.save("qrcode.png", scale=5)

# Opcao 3: Gerar SVG para HTML
qr.save("qrcode.svg")

# Opcao 4: Gerar data URI para embed direto no HTML
# from io import BytesIO
# buffer = BytesIO()
# qr.save(buffer, kind="png", scale=5)
# import base64
# data_uri = "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()
```

### Validando codigo

```python
import pyotp

secret = "JBSWY3DPEHPK3PXP"  # Do banco de dados
totp = pyotp.TOTP(secret)

# Gerar codigo atual (no servidor)
current_code = totp.now()
print(current_code)  # Ex: 020668

# Validar codigo digitado pelo usuario
user_code = "020668"
is_valid = totp.verify(user_code)
print(is_valid)  # True ou False

# Com janela de tolerancia (aceita +-30s)
is_valid = totp.verify(user_code, valid_window=1)
```

## Fluxo completo em aplicacao web (exemplo expandido)

### Modelo de usuario (pseudo-codigo)

```python
class User:
    id: int
    email: str
    password_hash: str
    otp_secret: str | None      # Segredo OTP (criptografado)
    has_2fa_enabled: bool        # Flag de ativacao
```

### Endpoint: iniciar ativacao de 2FA

```python
@app.post("/2fa/setup")
def setup_2fa(current_user: User):
    # Gerar segredo
    secret = pyotp.random_base32()

    # Salvar segredo (mas NAO ativar 2FA ainda)
    current_user.otp_secret = encrypt_aes(secret)
    current_user.has_2fa_enabled = False
    db.save(current_user)

    # Gerar QR Code
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(
        name=current_user.email,
        issuer_name="MeuApp"
    )

    return {
        "qr_code_uri": uri,
        "manual_secret": secret  # Para digitacao manual
    }
```

### Endpoint: confirmar ativacao de 2FA

```python
@app.post("/2fa/confirm")
def confirm_2fa(current_user: User, code: str):
    secret = decrypt_aes(current_user.otp_secret)
    totp = pyotp.TOTP(secret)

    if totp.verify(code, valid_window=1):
        current_user.has_2fa_enabled = True
        db.save(current_user)
        return {"message": "2FA ativado com sucesso"}
    else:
        return {"error": "Codigo invalido. Verifique o QR Code e tente novamente."}, 400
```

### Endpoint: login com 2FA

```python
@app.post("/login")
def login(email: str, password: str, otp_code: str | None = None):
    user = db.get_user_by_email(email)

    if not verify_password(password, user.password_hash):
        return {"error": "Credenciais invalidas"}, 401

    if user.has_2fa_enabled:
        if not otp_code:
            return {"requires_2fa": True}, 200

        secret = decrypt_aes(user.otp_secret)
        totp = pyotp.TOTP(secret)

        if not totp.verify(otp_code, valid_window=1):
            return {"error": "Codigo 2FA invalido"}, 401

    return {"token": generate_session_token(user)}
```

## Equivalentes em outras linguagens

### Node.js (otpauth + qrcode)

```javascript
import { TOTP } from 'otpauth'
import QRCode from 'qrcode'

// Gerar segredo
const totp = new TOTP({
  issuer: 'MeuApp',
  label: 'usuario@email.com',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: new OTPAuth.Secret()
})

// URI para QR Code
const uri = totp.toString()

// Gerar QR Code como data URL
const qrDataUrl = await QRCode.toDataURL(uri)

// Validar codigo
const isValid = totp.validate({ token: userCode, window: 1 }) !== null
```

### Go (pquerna/otp)

```go
import (
    "github.com/pquerna/otp/totp"
)

// Gerar segredo
key, _ := totp.Generate(totp.GenerateOpts{
    Issuer:      "MeuApp",
    AccountName: "usuario@email.com",
})

secret := key.Secret()
qrUri := key.URL()

// Validar codigo
valid := totp.Validate(userCode, secret)
```