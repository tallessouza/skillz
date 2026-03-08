---
name: rs-seguranca-devs-senha-autenticacao-legados
description: "Applies secure password migration and re-authentication patterns when working with legacy authentication systems. Use when user asks to 'migrate password hashing', 'upgrade bcrypt to argon2', 'improve legacy auth', 'add re-authentication', or 'secure existing login system'. Enforces double-hash migration strategy, re-authentication on sensitive operations, and MFA adoption. Make sure to use this skill whenever modifying authentication code in existing systems. Not for greenfield auth setup, OAuth/SSO flows, or session management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: autenticacao
  tags: [security, legacy, migration, password-hashing]
---

# Senha e Autenticacao em Sistemas Legados

> Ao lidar com autenticacao legada, migre hashes incrementalmente no login, reautentique em operacoes sensiveis e implemente MFA.

## Rules

1. **Migre hashes sem downtime usando double-hash** — aplique o novo algoritmo (Argon2) sobre o hash antigo (SHA-256), porque isso permite migrar sem forcar reset de senha em todos os usuarios
2. **Atualize o hash no momento do login** — quando o usuario se loga com sucesso e ainda tem hash legado, recalcule com o algoritmo novo usando a senha em memoria, porque esse e o unico momento em que voce tem acesso a senha em texto
3. **Reautentique em operacoes sensiveis** — troca de senha, troca de e-mail, transacoes financeiras, envio para novo endereco, exibicao de dados sensiveis — sempre peca a senha novamente, porque o usuario pode ter deixado a sessao aberta e um agressor (colega, acesso remoto) pode explorar isso
4. **Nunca peca apenas a senha nova na troca** — sempre exija senha atual + senha nova, porque frustrar o agressor que encontrou uma sessao aberta e a primeira linha de defesa
5. **Mantenha compatibilidade ate migrar todos** — so remova o codigo de double-hash apos confirmar via logs que todos os usuarios se logaram pelo menos uma vez apos a migracao
6. **Implemente MFA como camada adicional** — especialmente nos momentos de reautenticacao (troca de senha, transacoes), porque mesmo com hash seguro, um fator unico e insuficiente contra ataques modernos

## How to write

### Migracao em batch (preparacao inicial)

```python
def migrate_passwords():
    """Aplica Argon2 sobre hashes SHA-256 existentes no banco."""
    conn = sqlite3.connect("app.db")
    cursor = conn.execute("SELECT id, password FROM user")
    for user_id, password in cursor:
        if not password.startswith("$argon2"):
            new_hash = phash(password)  # Argon2 sobre o SHA-256
            conn.execute("UPDATE user SET password = ? WHERE id = ?", (new_hash, user_id))
            print(f"Updated user {user_id}")
    conn.commit()
```

### Login com upgrade transparente

```python
def login(email: str, password: str):
    row = db.execute("SELECT id, password FROM user WHERE email = ?", (email,))
    if not row:
        return False

    stored_hash = row["password"]

    # Tenta verificar com Argon2 direto (usuario ja migrado)
    if verify(stored_hash, password):
        return row["id"]

    # Tenta double-hash: SHA-256 da senha + Argon2
    sha256_password = hashlib.sha256(password.encode()).hexdigest()
    if verify(stored_hash, sha256_password):
        # Upgrade: recalcula hash usando senha pura com Argon2
        new_hash = phash(password)
        db.execute("UPDATE user SET password = ? WHERE id = ?", (new_hash, row["id"]))
        return row["id"]

    return False
```

### Reautenticacao em operacao sensivel

```python
def change_password(user_id: int, current_password: str, new_password: str):
    """Sempre exige senha atual antes de aceitar a nova."""
    stored_hash = db.get_password(user_id)
    if not verify(stored_hash, current_password):
        raise AuthError("Senha atual incorreta")
    db.update_password(user_id, phash(new_password))
```

## Example

**Before (sistema legado inseguro):**
```python
# Mesmo hash para mesma senha — atacante identifica senhas iguais
# SHA-256 sem salt/pepper
password_hash = hashlib.sha256(password.encode()).hexdigest()
db.store(email, password_hash)

# Troca de senha sem pedir a atual
def change_password(user_id, new_password):
    db.update_password(user_id, hash(new_password))
```

**After (com este skill aplicado):**
```python
# Argon2 com salt aleatorio — hashes unicos mesmo para senhas iguais
password_hash = phash(password)
db.store(email, password_hash)

# Troca exige reautenticacao
def change_password(user_id, current_password, new_password):
    if not verify(db.get_hash(user_id), current_password):
        raise AuthError("Reautenticacao falhou")
    db.update_password(user_id, phash(new_password))
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Banco tem hashes SHA-256/MD5 sem salt | Migre em batch com Argon2 sobre o hash antigo |
| Usuario faz login com hash legado | Atualize para Argon2 puro naquele momento |
| Todos usuarios ja logaram pos-migracao | Remova o codigo de double-hash |
| Operacao altera credenciais | Peca reautenticacao |
| Operacao tem impacto financeiro | Peca reautenticacao + considere MFA |
| Sessao pode ficar aberta em computador compartilhado | Reautenticacao obrigatoria em acoes criticas |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Forcar reset de senha de todos os usuarios | Migrar incrementalmente no login |
| Guardar SHA-256 sem salt | Usar Argon2 com salt aleatorio |
| Tela de troca de senha pedindo so a nova | Exigir senha atual + nova |
| Confiar na sessao para operacoes sensiveis | Reautenticar em cada operacao critica |
| Remover codigo legado antes de todos migrarem | Manter double-hash ate logs confirmarem 100% |
| Usar mesmo hash sem salt (hashes identicos = senhas identicas) | Salt aleatorio por usuario |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-senha-e-autenticacao-em-sistemas-legados/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-senha-e-autenticacao-em-sistemas-legados/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
