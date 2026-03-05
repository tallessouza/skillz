# Code Examples: Seguranca no Armazenamento de Senhas

## Exemplo 1: Hash puro com SHA-256 (INSEGURO — apenas didatico)

```python
import hashlib

def hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify(password, hashed):
    return hash(password) == hashed

hashed = hash("myPassword")
print(hashed)
# Output: hash deterministico — sempre o mesmo para "myPassword"

# Problema demonstrado:
hashed_banana = hash("banana")
# Esse hash pode ser encontrado no Google → ataque de dicionario trivial
```

## Exemplo 2: Hash com Salt (melhoria parcial)

```python
import hashlib

SALT = "xy_string_secreta_aqui"

def hash(password):
    return hashlib.sha256((SALT + password).encode()).hexdigest()

def verify(password, hashed):
    return hash(password) == hashed

hashed = hash("banana")
print(hashed)
# Output: hash unico que NAO aparece em rainbow tables
# Problema: salt e global — um dicionario com esse salt quebra todos os usuarios
```

## Exemplo 3: Hash com Salt + Pepper (seguro manualmente)

```python
import hashlib
import secrets  # NAO use random — use secrets para criptografia

SALT = "xy_string_secreta_aqui"

def hash(password, pepper=""):
    if not pepper:
        pepper = secrets.token_hex(16)
    hashed = hashlib.sha256((pepper + SALT + password).encode()).hexdigest()
    return pepper + "," + hashed

def verify(password, hashed):
    pepper, hash_value = hashed.split(",")
    return hash(password, pepper).split(",")[1] == hash_value

hashed = hash("myPassword")
print(hashed)
# Output: "pepper_hex,hash_hex"
# O pepper e armazenado junto ao hash, separado por virgula

print(verify("myPassword", hashed))  # True
print(verify("wrongPassword", hashed))  # False
```

### Por que separar com virgula?
O instrutor explica: "Esse formato com virgula eu que inventei. Podia ser qualquer outro jeito." O importante e que o pepper precisa ser recuperavel para verificacao. Argon2 faz isso automaticamente no formato do hash.

## Exemplo 4: Argon2 (RECOMENDADO para producao)

```bash
pip install argon2-cffi
```

```python
from argon2 import PasswordHasher
import os

SALT = os.environ.get("PASSWORD_SALT", "fallback_salt")
ph = PasswordHasher()  # defaults: parallelism=4, memory_cost=65536, time_cost=3

def hash(password):
    return ph.hash(password + SALT)

def verify(hashed, password):
    try:
        return ph.verify(hashed, password + SALT)
    except Exception:
        return False

hashed = hash("myPassword")
print(hashed)
# Output: $argon2id$v=19$m=65536,t=3,p=4$...
# Inclui: algoritmo, versao, parametros, salt automatico, hash

print(verify(hashed, "myPassword"))  # True
```

### Anatomia do output do Argon2:
```
$argon2id$v=19$m=65536,t=3,p=4$salt_base64$hash_base64
  │        │     │              │            │
  │        │     │              │            └─ hash final
  │        │     │              └─ salt gerado automaticamente
  │        │     └─ m=memoria(KB), t=iteracoes, p=paralelismo
  │        └─ versao do Argon2
  └─ variante (argon2id = hibrida, recomendada)
```

## Funcoes random: seguro vs inseguro

### Python
```python
# INSEGURO para criptografia
import random
token = random.randint(0, 999999)  # previsivel se atacante sabe o contexto

# SEGURO para criptografia
import secrets
token = secrets.token_hex(16)  # 16 bytes = 32 caracteres hex
```

### JavaScript/Node.js
```javascript
// INSEGURO para criptografia
const token = Math.random().toString(36);

// SEGURO para criptografia
const crypto = require("crypto");
const token = crypto.randomBytes(16).toString("hex");
```

### Java
```java
// INSEGURO para criptografia
double token = Math.random();

// SEGURO para criptografia
import java.security.SecureRandom;
SecureRandom sr = new SecureRandom();
byte[] token = new byte[16];
sr.nextBytes(token);
```

### PHP
```php
// INSEGURO para criptografia
$token = rand();

// SEGURO para criptografia
$token = bin2hex(random_bytes(16));
```

## Configuracao do Argon2 via site gerador

O instrutor demonstrou o uso de um Hash Generator online para configurar Argon2:
- Senha de teste: "banana"
- Memory cost minimo recomendado: 19 MB
- Iteracoes minimas: 2
- Paralelismo: 1 (minimo)
- Com salt customizado: memory cost minimo sobe para 24 MB