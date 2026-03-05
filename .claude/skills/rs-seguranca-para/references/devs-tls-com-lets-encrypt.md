---
name: rs-seguranca-devs-tls-lets-encrypt
description: "Applies TLS certificate setup with Let's Encrypt and Certbot when configuring HTTPS on web servers. Use when user asks to 'setup SSL', 'configure HTTPS', 'install TLS certificate', 'secure my server', or 'setup Let''s Encrypt'. Covers DNS verification, firewall rules, Certbot installation via snap, certificate auto-renewal via cron. Make sure to use this skill whenever deploying a web server to production or enabling encrypted connections. Not for application-level encryption, JWT tokens, or API authentication."
---

# TLS com Let's Encrypt

> Ao configurar um servidor web para producao, garanta criptografia em transito com certificado TLS gratuito via Let's Encrypt antes de qualquer deploy.

## Rules

1. **Atualize o servidor antes de qualquer configuracao** — `apt update && apt upgrade`, porque falhas de seguranca publicadas sem patch tornam o servidor vulneravel imediatamente
2. **Instale e configure unattended-upgrades** — atualizacoes criticas de seguranca devem ser automaticas toda madrugada, porque o risco de incompatibilidade e menor que o risco de invasao
3. **Configure firewall antes do servidor web** — libere apenas SSH, HTTP e HTTPS, porque portas abertas desnecessarias sao vetores de ataque
4. **Use Certbot via snap para Let's Encrypt** — porque e o metodo oficial, mais simples e com auto-configuracao do servidor web
5. **Configure renovacao automatica via cron** — certificados Let's Encrypt expiram em 90 dias, sem renovacao o site fica sem HTTPS
6. **Garanta criptografia em transito E em repouso** — TLS cobre transito, disco encriptado cobre repouso, ambos sao requisitos de seguranca corporativos

## Steps

### Step 1: Verificar DNS e atualizar servidor

```bash
# Verificar propagacao do DNS
dig +short seudominio.com.br

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Garantir atualizacoes automaticas de seguranca
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Step 2: Configurar firewall

```bash
# Instalar e ativar UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw status
```

Testar SSH em outra janela antes de fechar a sessao atual.

### Step 3: Instalar servidor web

```bash
# Apache
sudo apt install apache2 -y

# OU Nginx
sudo apt install nginx -y
```

### Step 4: Instalar Certbot e obter certificado

```bash
# Instalar Certbot via snap
sudo snap install --classic certbot

# Obter e configurar certificado automaticamente
sudo certbot --apache -d seudominio.com.br
# OU para Nginx:
sudo certbot --nginx -d seudominio.com.br
```

O Certbot verifica que voce controla o dominio, obtem o certificado e configura o servidor web automaticamente.

### Step 5: Configurar renovacao automatica

```bash
# Editar crontab
sudo crontab -e

# Adicionar ao final:
12 2 * * * /snap/bin/certbot renew
```

Todo dia as 2:12 da manha o Certbot verifica e renova se necessario.

## Verification

- Acessar `https://seudominio.com.br` e verificar cadeado no navegador
- `sudo certbot certificates` — listar certificados instalados e datas de expiracao
- `sudo ufw status` — confirmar que apenas SSH, HTTP e HTTPS estao abertos

## Heuristics

| Situacao | Acao |
|----------|------|
| Provedor ja oferece certificado gratuito | Use o do provedor, nao precisa do Certbot |
| Usando proxy reverso ou load balancer do cloud | Configure TLS no load balancer, nao no servidor |
| Aplicacao Node/Python/Ruby atras do Apache/Nginx | Configure proxy reverso + TLS no servidor web |
| Precisa reiniciar servidor para atualizar kernel | Agende o restart, nunca reinicie em producao sem aviso |
| Unattended-upgrades causa incompatibilidade | Corrija o problema especifico — e menos grave que ser invadido |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar servidor sem atualizacoes automaticas | Instalar unattended-upgrades |
| Abrir todas as portas no firewall | Liberar apenas SSH, HTTP, HTTPS |
| Ignorar HTTPS porque "e so um site simples" | Sempre configurar TLS, e gratuito |
| Renovar certificado manualmente | Configurar cron para `certbot renew` |
| Reiniciar servidor de producao sem agendar | Planejar janela de manutencao |
| Comprar certificado TLS pago sem necessidade | Usar Let's Encrypt (gratuito, 700M+ sites) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-tls-com-lets-encrypt/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-tls-com-lets-encrypt/references/code-examples.md)
