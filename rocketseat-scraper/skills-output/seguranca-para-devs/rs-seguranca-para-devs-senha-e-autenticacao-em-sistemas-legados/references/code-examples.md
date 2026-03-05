# Code Examples: Senha e Autenticacao em Sistemas Legados

## Setup do banco de dados legado (SQLite)

```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
);

-- Inserindo usuarios com SHA-256 (cenario legado)
-- echo -n "123mudar" | sha256sum
INSERT INTO user (email, password) VALUES ('joaquim@fbi.gov', '<sha256_hash>');
INSERT INTO user (email, password) VALUES ('manuel@cia.gov', '<sha256_hash>');

-- Resultado: ambos tem o MESMO hash (problema do SHA-256 sem salt)
SELECT * FROM user;
```

## Funcao de migracao em batch

```python
import sqlite3
from argon2 import PasswordHasher

ph = PasswordHasher()

def migrate_passwords():
    conn = sqlite3.connect("app.db")
    cursor = conn.execute("SELECT id, password FROM user")
    for user_id, password in cursor:
        if not password.startswith("$argon2"):
            # Aplica Argon2 SOBRE o hash SHA-256 existente
            new_hash = ph.hash(password)
            conn.execute(
                "UPDATE user SET password = ? WHERE id = ?",
                (new_hash, user_id)
            )
            print(f"Updated user {user_id}")
    conn.commit()
    conn.close()

migrate_passwords()
```

**Resultado apos migracao:** Os hashes agora sao diferentes para cada usuario, mesmo que a senha original fosse a mesma, porque Argon2 usa salt aleatorio.

## Funcao de login com upgrade transparente

```python
import hashlib
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def login(email: str, password: str):
    row = conn.execute(
        "SELECT id, password FROM user WHERE email = ?", (email,)
    ).fetchone()

    if not row:
        return False

    user_id, stored_hash = row

    # Tentativa 1: senha pura com Argon2 (usuario ja migrado)
    try:
        ph.verify(stored_hash, password)
        return user_id
    except VerifyMismatchError:
        pass

    # Tentativa 2: double-hash (SHA-256 + Argon2) para usuarios legados
    sha256_password = hashlib.sha256(password.encode()).hexdigest()
    try:
        ph.verify(stored_hash, sha256_password)
        # Upgrade: recalcula hash usando apenas Argon2
        new_hash = ph.hash(password)
        conn.execute(
            "UPDATE user SET password = ? WHERE id = ?",
            (new_hash, user_id)
        )
        conn.commit()
        print("Upgrading password hash")
        return user_id
    except VerifyMismatchError:
        return False

# Teste
print(login("manuel@cia.gov", "123mudar"))  # Retorna ID, faz upgrade
print(login("manuel@cia.gov", "123mudar"))  # Retorna ID, sem upgrade (ja migrado)
print(login("manuel@cia.gov", "senhaerrada"))  # Retorna False
```

## Fluxo completo de verificacao

```
Usuario digita senha "123mudar"
         |
         v
    Argon2.verify(stored_hash, "123mudar")
         |
    Match? ----SIM----> return user_id (ja migrado)
         |
        NAO
         |
         v
    sha256("123mudar") = "a1b2c3..."
    Argon2.verify(stored_hash, "a1b2c3...")
         |
    Match? ----SIM----> upgrade hash + return user_id
         |
        NAO
         |
         v
    return False (senha incorreta)
```

## Reautenticacao em operacoes sensiveis

```python
def require_reauth(user_id: int, password: str) -> bool:
    """Middleware de reautenticacao para operacoes sensiveis."""
    stored_hash = db.get_password(user_id)
    try:
        ph.verify(stored_hash, password)
        return True
    except VerifyMismatchError:
        return False

def change_password(user_id: int, current_password: str, new_password: str):
    if not require_reauth(user_id, current_password):
        raise AuthError("Senha atual incorreta")
    db.update_password(user_id, ph.hash(new_password))

def change_email(user_id: int, password: str, new_email: str):
    if not require_reauth(user_id, password):
        raise AuthError("Reautenticacao necessaria")
    db.update_email(user_id, new_email)

def transfer_funds(user_id: int, password: str, amount: int, destination: str):
    if not require_reauth(user_id, password):
        raise AuthError("Reautenticacao necessaria para transferencias")
    bank.transfer(user_id, destination, amount)
```

## Operacoes que exigem reautenticacao

| Operacao | Por que |
|----------|---------|
| Trocar senha | Agressor com sessao aberta nao consegue tomar conta |
| Trocar e-mail | Impede recuperacao de senha para e-mail do agressor |
| Transferencia bancaria | Protege contra prejuizo financeiro |
| Compra com novo endereco | Impede envio para endereco do agressor |
| Visualizar dados sensiveis | Protege PII contra acesso oportunista |

## Lifecycle da migracao

```python
# Fase 1: Migracao em batch (executa uma vez)
migrate_passwords()

# Fase 2: Login com double-hash (meses rodando)
# O codigo de login acima fica ativo

# Fase 3: Monitoramento
migrated = db.execute(
    "SELECT COUNT(*) FROM user WHERE password LIKE '$argon2%'"
).fetchone()[0]
total = db.execute("SELECT COUNT(*) FROM user").fetchone()[0]
legacy = total - migrated
print(f"Migrados: {migrated}/{total} | Legado restante: {legacy}")

# Fase 4: Apos logs confirmarem 100% migrado, simplifique o login
def login_clean(email: str, password: str):
    """Versao final sem double-hash."""
    row = db.execute("SELECT id, password FROM user WHERE email = ?", (email,)).fetchone()
    if not row:
        return False
    user_id, stored_hash = row
    try:
        ph.verify(stored_hash, password)
        return user_id
    except VerifyMismatchError:
        return False
```