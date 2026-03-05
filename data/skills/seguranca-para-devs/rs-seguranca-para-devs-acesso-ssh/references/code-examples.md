# Code Examples: Acesso SSH Seguro

## 1. Gerar senha forte e descartavel

```bash
# Gerar senha hex randomica de 32 caracteres
openssl rand -hex 32
# Output: algo como "a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0"

# Usar para criacao inicial do servidor, NAO salvar
# O acesso futuro sera por chave SSH, nao por senha
```

## 2. Criar usuario e configurar sudo

```bash
# No servidor como root
adduser elcio
# Sistema pede senha — usar outra gerada com openssl rand -hex 32

# Opcao 1: Editar /etc/sudoers diretamente (nao recomendado)
# visudo  # abre o editor seguro do sudoers

# Opcao 2: Usar sudoers.d (recomendado pelo instrutor)
# O arquivo /etc/sudoers inclui: #includedir /etc/sudoers.d
# Criar um arquivo por usuario:
echo "elcio ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/elcio

# Verificar que funciona
su elcio
sudo su
# Deve virar root sem pedir senha
```

## 3. Gerar par de chaves SSH (maquina local)

```bash
# Na sua maquina local, NAO no servidor
ssh-keygen

# Ele vai perguntar:
# - Onde salvar (default: ~/.ssh/id_rsa) — aceite o default
# - Passphrase — recomendado colocar uma senha

# Resultado: dois arquivos
# ~/.ssh/id_rsa      — chave PRIVADA (segredo absoluto)
# ~/.ssh/id_rsa.pub  — chave PUBLICA (pode compartilhar)
```

## 4. Configurar authorized_keys no servidor

```bash
# No servidor, como o usuario (nao root)
su elcio
cd ~

# Criar diretorio .ssh
mkdir ~/.ssh

# Criar arquivo de chaves autorizadas
nano ~/.ssh/authorized_keys
# Colar o conteudo de ~/.ssh/id_rsa.pub da sua maquina local
# Uma chave por linha (uma linha = um usuario autorizado)

# CRITICO: corrigir permissoes
chmod go-rwx ~/.ssh ~/.ssh/authorized_keys
# Resultado: apenas o dono pode ler/escrever

# Verificar permissoes
ls -la ~
ls -la ~/.ssh

# Deve mostrar:
# drwx------  .ssh           (700 — so dono)
# -rw-------  authorized_keys (600 — so dono)
```

### Entendendo as permissoes do ls -la

```
drwxr-xr-x  .ssh
│├─┤├─┤├─┤
│ │   │  └── Outros: r-x (podem ler e listar) ← ERRADO
│ │   └──── Grupo: r-x (podem ler e listar)  ← ERRADO
│ └──────── Dono: rwx (pode tudo)             ← OK
└────────── d = diretorio

drwx------  .ssh  (apos chmod)
│├─┤├─┤├─┤
│ │   │  └── Outros: --- (sem acesso)  ← CORRETO
│ │   └──── Grupo: --- (sem acesso)    ← CORRETO
│ └──────── Dono: rwx (pode tudo)      ← OK
└────────── d = diretorio
```

## 5. Hardening do SSH daemon

```bash
# No servidor como root
nano /etc/ssh/sshd_config

# Encontrar e alterar estas duas linhas:
PermitRootLogin no
PasswordAuthentication no

# Salvar e restartar o servico
systemctl restart sshd
```

## 6. Procedimento seguro de restart do sshd

```bash
# JANELA 1 (ja conectada — NAO FECHAR):
systemctl restart sshd

# JANELA 2 (nova — testar conexao):
ssh elcio@ip-do-servidor
# Se conectou: tudo OK, pode fechar janela 1
# Se NAO conectou: use janela 1 para corrigir sshd_config

# Testar que e sudoer:
sudo su
# Deve virar root
```

## 7. Testar que root esta bloqueado

```bash
# Da maquina local, tentar conectar como root:
ssh root@ip-do-servidor
# Deve recusar a conexao (Permission denied)

# Tentar conectar com senha:
ssh -o PubkeyAuthentication=no elcio@ip-do-servidor
# Deve recusar (Permission denied — password auth desabilitado)
```

## 8. Configuracao DNS (contexto da aula)

```
# Criar registro A (IPv4)
seguro.elcio.com.br → IP_DO_SERVIDOR

# Criar registro AAAA (IPv6)
seguro.elcio.com.br → IPv6_DO_SERVIDOR

# Depois de propagado, conectar pelo dominio:
ssh elcio@seguro.elcio.com.br
```

## 9. Fluxo completo resumido

```bash
# === MAQUINA LOCAL ===
# 1. Gerar chave (se nao tem)
ssh-keygen

# 2. Copiar chave publica
cat ~/.ssh/id_rsa.pub

# === SERVIDOR (primeira vez, como root) ===
# 3. Criar usuario
adduser meuusuario

# 4. Configurar sudo
echo "meuusuario ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/meuusuario

# 5. Configurar chave SSH
su meuusuario
mkdir ~/.ssh
echo "CONTEUDO_DA_CHAVE_PUBLICA" > ~/.ssh/authorized_keys
chmod go-rwx ~/.ssh ~/.ssh/authorized_keys

# 6. Hardening (como root)
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# 7. Restartar (MANTER JANELA ABERTA)
systemctl restart sshd

# === MAQUINA LOCAL (nova janela) ===
# 8. Testar
ssh meuusuario@ip-do-servidor
sudo su  # verificar que virou root
```