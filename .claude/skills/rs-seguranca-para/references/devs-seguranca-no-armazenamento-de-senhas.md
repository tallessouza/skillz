---
name: rs-seguranca-devs-armazenamento-senhas
description: "Enforces secure password storage practices when implementing authentication, user registration, or login systems. Use when user asks to 'store passwords', 'hash passwords', 'implement login', 'create user registration', 'build auth system', or any task involving password persistence. Applies rules: never store plaintext, use Argon2/scrypt/bcrypt hierarchy, always use salt+pepper, use cryptographically secure random generators. Make sure to use this skill whenever writing code that touches password storage or verification, even if the user doesn't mention security. Not for JWT tokens, session management, API key generation, or OAuth flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: autenticacao
  tags: [security, password, hashing, bcrypt, argon2]
---

# Seguranca no Armazenamento de Senhas

> Nunca armazene senhas em texto puro; use Argon2 com salt e pepper, porque o acesso ao banco de dados pode ser comprometido a qualquer momento.

## Rules

1. **Nunca armazene senhas em texto puro** — porque qualquer pessoa com acesso ao banco (funcionario, hacker, vazamento) teria todas as senhas
2. **Use Argon2 como primeira opcao** — vencedor da Password Hashing Competition (2015), suporta paralelismo, custo de memoria configuravel e pepper automatico
3. **Hierarquia de algoritmos: Argon2 > scrypt > bcrypt** — so use o proximo se o anterior nao estiver disponivel na sua linguagem/sistema legado
4. **Nunca use SHA-256/SHA-512 sozinho para senhas** — sao funcoes de hash seguras para integridade, mas nao foram feitas para senhas (sem custo computacional, vulneraveis a rainbow tables)
5. **Sempre use salt (global) + pepper (por usuario)** — salt impede rainbow tables genericas; pepper impede ataque de dicionario mesmo que o salt vaze, porque o atacante precisaria gerar um dicionario por usuario
6. **Use funcoes random criptograficamente seguras** — nunca `Math.random()` ou `random.random()`; use `crypto.randomBytes` (Node), `secrets` (Python), `SecureRandom` (Java), porque funcoes comuns tem baixa entropia e sao previsíveis

## How to write

### Argon2 (preferido)

```python
from argon2 import PasswordHasher

SALT = os.environ["PASSWORD_SALT"]  # variavel de ambiente, nunca no codigo
ph = PasswordHasher()  # defaults: parallelism=4, memory=16MB, iterations=2

def hash_password(password: str) -> str:
    return ph.hash(password + SALT)

def verify_password(hashed: str, password: str) -> bool:
    try:
        return ph.verify(hashed, password + SALT)
    except Exception:
        return False
```

### Node.js com argon2

```typescript
import argon2 from "argon2";

const SALT = process.env.PASSWORD_SALT!;

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password + SALT);
}

async function verifyPassword(hashed: string, password: string): Promise<boolean> {
  return argon2.verify(hashed, password + SALT);
}
```

## Example

**Before (inseguro — hash puro sem salt/pepper):**
```python
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()
# "banana" → hash encontravel no Google via rainbow table
```

**After (seguro — Argon2 com salt):**
```python
from argon2 import PasswordHasher
import os

SALT = os.environ["PASSWORD_SALT"]
ph = PasswordHasher()

def hash_password(password):
    return ph.hash(password + SALT)  # Argon2 gera pepper automaticamente
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo, qualquer linguagem | Argon2 com configuracao minima: memory_cost=19MB, iterations=2, parallelism=1 |
| Sistema legado sem Argon2/scrypt | bcrypt (1999, mas ainda seguro o suficiente) |
| Precisa gerar valor aleatorio para seguranca | Use funcao criptografica: `secrets` (Python), `crypto.randomBytes` (Node), `SecureRandom` (Java) |
| Salt e pepper | Salt em variavel de ambiente; pepper gerado por usuario e armazenado junto ao hash |
| Configurando Argon2 manualmente | memory_cost >= 19MB, iterations >= 2, parallelism >= 1 |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `hashlib.sha256(password)` direto | `argon2.hash(password + SALT)` |
| `Math.random()` para gerar salt/pepper | `crypto.randomBytes(16)` ou `secrets.token_hex(16)` |
| Salt hardcoded no codigo-fonte | Salt em variavel de ambiente |
| Mesmo hash para todos os usuarios (sem pepper) | Pepper unico por usuario (Argon2 faz automaticamente) |
| Criar seu proprio algoritmo de hash | Usar Argon2, scrypt ou bcrypt |
| `random.random()` para valores criptograficos | `secrets.token_hex()` (Python) |

## Funcoes random seguras por linguagem

| Linguagem | Inseguro | Criptograficamente seguro |
|-----------|----------|--------------------------|
| Python | `random` | `secrets` |
| JavaScript/Node | `Math.random()` | `crypto.randomBytes()` |
| Java | `Math.random()` | `java.security.SecureRandom` |
| PHP | `rand()`, `array_rand()` | `random_bytes()` |
| C# | `System.Random` | `System.Security.Cryptography.RandomNumberGenerator` |
| Ruby | `rand()` | `SecureRandom` |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-seguranca-no-armazenamento-de-senhas/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-seguranca-no-armazenamento-de-senhas/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
