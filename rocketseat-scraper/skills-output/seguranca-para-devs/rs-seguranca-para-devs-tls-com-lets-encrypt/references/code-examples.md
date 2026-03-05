# Code Examples: TLS com Let's Encrypt

## Fluxo completo passo a passo

### 1. Verificar propagacao DNS

```bash
# Verificar se o dominio ja aponta para o IP do servidor
dig +short seudominio.com.br
# Deve retornar o IP do seu servidor

# Alternativa com nslookup
nslookup seudominio.com.br
```

### 2. Atualizar o servidor

```bash
# Debian/Ubuntu
sudo apt update
sudo apt upgrade -y

# Se o kernel foi atualizado, agendar restart
# NAO reiniciar imediatamente em producao
```

### 3. Configurar unattended-upgrades

```bash
# Verificar se ja esta instalado (Linode ja instala por padrao)
dpkg -l | grep unattended-upgrades

# Se nao estiver instalado
sudo apt install unattended-upgrades -y

# Verificar que o servico esta rodando
systemctl status unattended-upgrades.service
```

### 4. Configurar firewall com UFW

```bash
# Ativar UFW
sudo ufw enable
# Vai perguntar se quer continuar — responder yes

# Liberar portas necessarias
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# IMPORTANTE: testar SSH em outra janela ANTES de fechar a atual

# Verificar status
sudo ufw status
# Deve mostrar:
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

### 5. Instalar servidor web (Apache)

```bash
sudo apt install apache2 -y

# Verificar que esta rodando
# Acessar http://seudominio.com.br no navegador
# Deve mostrar a pagina padrao do Apache
# Chrome vai mostrar "Nao seguro" — normal, ainda nao tem TLS
```

### 6. Instalar Certbot via Snap

```bash
# Verificar se snap esta instalado
snap --version

# Remover versoes antigas do certbot (se existirem)
sudo apt remove certbot -y

# Instalar Certbot
sudo snap install --classic certbot

# Verificar que o atalho foi criado
which certbot
# Deve retornar /snap/bin/certbot
```

### 7. Obter certificado TLS

```bash
# Para Apache
sudo certbot --apache -d seudominio.com.br

# Para Nginx
sudo certbot --nginx -d seudominio.com.br

# O Certbot vai:
# 1. Pedir seu email
# 2. Pedir que aceite os termos
# 3. Perguntar se quer compartilhar email com EFF
# 4. Verificar que voce controla o dominio
# 5. Obter o certificado
# 6. Configurar o servidor web automaticamente

# Para multiplos dominios
sudo certbot --apache -d seudominio.com.br -d www.seudominio.com.br
```

### 8. Configurar renovacao automatica via cron

```bash
# Editar crontab do root
sudo crontab -e

# Adicionar esta linha ao final do arquivo:
12 2 * * * /snap/bin/certbot renew

# Formato: minuto hora dia-mes mes dia-semana comando
# 12 2 * * * = todo dia as 02:12
```

### 9. Verificar resultado

```bash
# Listar certificados instalados
sudo certbot certificates

# Testar renovacao (dry run)
sudo certbot renew --dry-run

# Acessar https://seudominio.com.br
# Deve mostrar cadeado verde no navegador
```

## Variacao: Nginx como proxy reverso com TLS

```bash
# Instalar Nginx
sudo apt install nginx -y

# Configurar proxy reverso para aplicacao Node na porta 3000
# /etc/nginx/sites-available/seudominio.com.br
server {
    server_name seudominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ativar o site
sudo ln -s /etc/nginx/sites-available/seudominio.com.br /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Depois obter certificado — Certbot configura HTTPS automaticamente
sudo certbot --nginx -d seudominio.com.br
```