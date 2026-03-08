---
name: rs-seguranca-devs-acesso-ssh
description: "Enforces secure SSH access configuration when setting up servers, VPS, or remote infrastructure. Use when user asks to 'configure SSH', 'setup a server', 'secure VPS access', 'create SSH keys', 'harden SSH', or 'deploy to production server'. Applies rules: disable root login via PermitRootLogin no, disable password auth via PasswordAuthentication no, use key-based auth only, encrypt disks, proper chmod permissions on .ssh directory. Make sure to use this skill whenever provisioning or hardening remote servers. Not for application-level security (use devs-input-validation), firewall rules, or SSL/TLS certificate setup (use devs-tls-com-lets-encrypt)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: infrastructure-security
  tags: [security, ssh, server, vps, keys, hardening, infrastructure, linux]
---

# Acesso SSH Seguro

> Configure acesso SSH com chaves criptograficas, desabilite login por senha e root, e proteja permissoes de arquivos.

## Rules

1. **Desabilite login do root via SSH** — `PermitRootLogin no` em `sshd_config`, porque root com acesso remoto e superficie de ataque desnecessaria
2. **Desabilite autenticacao por senha** — `PasswordAuthentication no`, porque elimina ataques de forca bruta, dicionario e senhas fracas de uma vez
3. **Use apenas autenticacao por chave** — par de chaves RSA/Ed25519 de 2048+ bits, porque e criptograficamente superior a qualquer senha memorizavel
4. **Crie usuarios individuais** — um usuario por pessoa com sua propria chave, porque compartilhar usuario dificulta auditoria e revogacao
5. **Proteja permissoes do .ssh** — `chmod go-rwx` na pasta `.ssh` e no `authorized_keys`, porque outros usuarios do sistema nao devem ler suas chaves autorizadas
6. **Criptografe o disco do servidor e local** — ative disk encryption na criacao do VPS e no notebook, porque disco sem criptografia + pendrive Linux = acesso total aos arquivos
7. **Nunca descarte sua chave privada** — mantenha o mesmo par de chaves entre empregos, porque trocar exige atualizar todos os servidores e a chave e sua identidade, nao da empresa
8. **Teste antes de desconectar** — ao restartar sshd, abra uma segunda janela para testar a nova conexao ANTES de fechar a atual, porque configuracao errada pode bloquear acesso permanentemente

## How to write

### Criar usuario com sudo

```bash
# Criar usuario dedicado (nunca usar root diretamente)
adduser elcio

# Dar permissao de sudo via arquivo separado em sudoers.d
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

# Restartar o servico (MANTER JANELA ABERTA)
systemctl restart sshd
```

### Gerar par de chaves (maquina local)

```bash
ssh-keygen
# Aceite default ~/.ssh/id_rsa, recomendado colocar passphrase
# id_rsa = privada (segredo absoluto), id_rsa.pub = publica (compartilhavel)

# Gerar senha forte descartavel para setup inicial
openssl rand -hex 32
```

## Example

**Before (inseguro):**
```bash
ssh root@servidor        # Login como root
# Senha reutilizada de outro servico
# Disco sem criptografia
# authorized_keys legivel por todos (chmod 755)
```

**After (com esta skill aplicada):**
```bash
ssh elcio@servidor       # Login como usuario dedicado, via chave
sudo su                  # Elevar privilegios quando necessario
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
| Multiplos usuarios no servidor | Um usuario Linux por pessoa, cada um com sua chave |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `ssh root@servidor` em producao | `ssh usuario@servidor` + `sudo su` |
| Login com senha em servidor | Autenticacao por chave apenas |
| Compartilhar usuario admin | Um usuario por pessoa com chave individual |
| `chmod 777 ~/.ssh` | `chmod 700 ~/.ssh` e `chmod 600 ~/.ssh/authorized_keys` |
| Gerar nova chave a cada empresa | Manter e proteger o mesmo par de chaves |

## Troubleshooting

### Permission denied apos configurar chave SSH
**Symptom:** `Permission denied (publickey)` ao tentar conectar
**Cause:** Permissoes do diretorio `.ssh` ou `authorized_keys` estao abertas demais — SSH recusa automaticamente
**Fix:** `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`. Verifique tambem que o dono dos arquivos e o usuario correto com `ls -la`.

### Bloqueado do servidor apos restartar sshd
**Symptom:** Nenhuma conexao SSH funciona apos mudar sshd_config
**Cause:** PasswordAuthentication desabilitado antes de configurar chave, ou chave configurada no usuario errado
**Fix:** Use o console web do provedor (Linode, DigitalOcean) para acessar o servidor e corrigir. Previna: sempre teste em segunda janela.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-acesso-ssh/references/deep-explanation.md) — Analogia da chave Pix, por que nao trocar chaves entre empregos, criptografia de disco, trade-off de senha na chave privada
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-acesso-ssh/references/code-examples.md) — Fluxo completo de setup, permissoes detalhadas, teste de bloqueio de root
