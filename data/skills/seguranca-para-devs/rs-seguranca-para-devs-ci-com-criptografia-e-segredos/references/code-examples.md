# Code Examples: CI com Criptografia e Segredos

## 1. Criando o servico systemd

```bash
# Conectar no servidor
ssh seguro@seguro.elcio.com.br

# Criar o arquivo de servico
sudo nano /etc/systemd/system/seguro.service
```

```ini
[Unit]
Description=App Seguro

[Service]
User=seguro
WorkingDirectory=/home/seguro/seguro
ExecStart=/home/seguro/seguro/run
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Recarregar configuracoes e iniciar
sudo systemctl daemon-reload
sudo systemctl start seguro
sudo systemctl status seguro
```

## 2. Script de deploy basico

```bash
#!/bin/bash
# ~/deploy.sh
cd /home/seguro/$1
git pull
```

```bash
chmod +x deploy.sh
```

## 3. Configuracao de chave SSH para deploy

```bash
# Na maquina local, criar usuario dedicado (ou usar existente)
ssh-keygen  # gera ~/.ssh/id_rsa e ~/.ssh/id_rsa.pub

# No servidor, adicionar chave publica ao authorized_keys
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys  # colar conteudo de id_rsa.pub
chmod 600 ~/.ssh/authorized_keys

# Testar conexao
ssh seguro@seguro.elcio.com.br
```

## 4. GitHub Actions — evolucao do deploy.yaml

### Versao 1 (falha — sem SSH key)

```yaml
name: deploy prod
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Run deploy
        run: ssh seguro@seguro.elcio.com.br ./deploy.sh seguro
```

Erro: `Permission Denied (publickey)` — o runner nao tem chave SSH.

### Versao 2 (falha — sem StrictHostKeyChecking)

```yaml
      - name: Run deploy
        run: ssh seguro@seguro.elcio.com.br ./deploy.sh seguro
```

Erro: `HostKeyVerificationFailed` — primeira conexao pede confirmacao interativa.

### Versao 3 (funciona — deploy sem restart)

```yaml
name: deploy prod
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      SSHKEY: ${{ secrets.SSH_KEY }}
    steps:
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "$SSHKEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      - name: Run deploy
        run: ssh -o StrictHostKeyChecking=no seguro@seguro.elcio.com.br ./deploy.sh seguro
```

Problema: faz `git pull` mas nao restarta o servico. Mudancas nao refletem.

### Versao 4 (completa — com restart)

```yaml
name: deploy prod
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      SSHKEY: ${{ secrets.SSH_KEY }}
    steps:
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "$SSHKEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      - name: Run deploy
        run: ssh -o StrictHostKeyChecking=no seguro@seguro.elcio.com.br ./deploy.sh seguro

      - name: Restart service
        run: ssh -o StrictHostKeyChecking=no seguro@seguro.elcio.com.br sudo /usr/local/bin/deploy-seguro.sh
```

## 5. Script de restart com permissao minima

```bash
# Criar como root: /usr/local/bin/deploy-seguro.sh
#!/bin/bash
service seguro restart
```

```bash
# Permissoes: root e dono, todos podem executar, ninguem mais edita
sudo chmod 755 /usr/local/bin/deploy-seguro.sh
```

## 6. Sudoers restrito

```bash
# /etc/sudoers.d/seguro
seguro ALL=(ALL) NOPASSWD: /usr/local/bin/deploy-seguro.sh
```

Comparacao com sudoers permissivo (ERRADO):
```bash
# NAO FACA ISSO
seguro ALL=(ALL) NOPASSWD: ALL
```

## 7. Adicionando secret no GitHub

1. Repositorio → Settings → Secrets and Variables → Actions
2. "New repository secret"
3. Nome: `SSH_KEY`
4. Valor: conteudo completo de `~/.ssh/id_rsa` (chave privada)
5. "Add secret"

Apos salvar: valor invisivel. Editar permite substituir, nunca recuperar.

## 8. Referencia no workflow

```yaml
# Segredo (criptografado, invisivel)
env:
  SSHKEY: ${{ secrets.SSH_KEY }}

# Variavel (visivel — NAO use para segredos)
env:
  APP_URL: ${{ vars.APP_URL }}
```