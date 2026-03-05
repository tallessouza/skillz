---
name: rs-seguranca-devs-acesso-ssh
description: "Enforces secure SSH access configuration when setting up servers, VPS, or remote infrastructure. Use when user asks to 'configure SSH', 'setup a server', 'secure VPS access', 'create SSH keys', 'harden SSH', or 'deploy to production server'. Applies rules: disable root login, disable password auth, use key-based auth only, encrypt disks, proper file permissions on .ssh. Make sure to use this skill whenever provisioning or hardening remote servers. Not for application-level security, firewall rules, or SSL/TLS certificate setup."
---

# Acesso SSH Seguro

> Configure acesso SSH com chaves criptograficas, desabilite login por senha e root, e proteja permissoes de arquivos.

## Rules

1. **Desabilite login do root via SSH** — `PermitRootLogin no` em `sshd_config`, porque root com acesso remoto e superficie de ataque desnecessaria
2. **Desabilite autenticacao por senha** — `PasswordAuthentication no`, porque elimina ataques de forca bruta, dicionario e senhas fracas
3. **Use apenas autenticacao por chave** — par de chaves RSA/Ed25519 de 2048+ bits, porque e criptograficamente superior a qualquer senha
4. **Crie usuarios individuais** — um usuario por pessoa com sua propria chave, porque compartilhar usuario dificulta auditoria e revogacao
5. **Proteja permissoes do .ssh** — `chmod go-rwx` na pasta `.ssh` e no `authorized_keys`, porque outros usuarios do sistema nao devem ler suas chaves autorizadas
6. **Criptografe o disco do servidor** — ative disk encryption na criacao do VPS, porque impede que funcionarios do provedor ou backups vazados exponham dados
7. **Criptografe o disco local** — programador deve ter disco criptografado, porque notebook roubado com pendrive Linux da acesso a todos os arquivos
8. **Nunca descarte sua chave privada** — mantenha o mesmo par de chaves, porque trocar exige atualizar todos os servidores e e propenso a erros

## How to write

### Criar usuario com sudo

```bash
# Criar usuario dedicado (nunca usar root diretamente)
adduser elcio

# Dar permissao de sudo via arquivo separado em sudoers.d
# Facilita gerenciamento: um arquivo por usuario
echo "elcio ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/elcio
```

### Configurar chave publica no servidor

```bash
# Como o usuario (nao root)
mkdir ~/.ssh
nano ~/.ssh/authorized_keys
# Colar a chave publica (id_rsa.pub) do usuario

# Corrigir permissoes — CRITICO
chmod go-rwx ~/.ssh ~/.ssh/authorized_keys
```

### Hardening do sshd_config

```bash
# Editar /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no

# Restartar o servico
systemctl restart sshd
```

### Gerar par de chaves (maquina local)

```bash
# Gerar chave com senha (recomendado)
ssh-keygen

# Ou gerar senha forte para o servidor (sem reuso)
openssl rand -hex 32
```

## Example

**Before (inseguro):**
```bash
# Login como root com senha
ssh root@servidor
# Senha reutilizada de outro servico
# Disco sem criptografia
# authorized_keys legivel por todos
```

**After (com esta skill aplicada):**
```bash
# Login como usuario dedicado, sem senha, via chave
ssh elcio@servidor
# Dentro do servidor, elevar privilegios quando necessario
sudo su

# sshd_config: PermitRootLogin no, PasswordAuthentication no
# Disco criptografado, permissoes 700 no .ssh
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Restartou sshd | Abra outra janela e teste conexao ANTES de fechar a atual |
| Precisa de senha para o servidor | Gere com `openssl rand -hex 32`, nao reutilize |
| Mudou de emprego/computador | Leve seu par de chaves, nao gere um novo |
| Alguem pediu sua chave | Envie apenas a `.pub` (publica), nunca a privada |
| Chave privada sem senha | Garanta disco criptografado e SO seguro |
| Multiplos usuarios no servidor | Um usuario Linux por pessoa, cada um com sua chave |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `ssh root@servidor` em producao | `ssh usuario@servidor` + `sudo su` |
| Login com senha em servidor | Autenticacao por chave apenas |
| Compartilhar usuario admin entre pessoas | Um usuario por pessoa com chave individual |
| `chmod 777 ~/.ssh` | `chmod 700 ~/.ssh` e `chmod 600 ~/.ssh/authorized_keys` |
| Gerar nova chave a cada empresa | Manter e proteger o mesmo par de chaves |
| Enviar chave privada para alguem | Enviar apenas a chave publica (.pub) |
| Disco sem criptografia no notebook | Sempre criptografar disco local e remoto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-acesso-ssh/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-acesso-ssh/references/code-examples.md)
