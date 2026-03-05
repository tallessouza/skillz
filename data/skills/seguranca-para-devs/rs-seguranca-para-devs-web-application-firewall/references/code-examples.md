# Code Examples: Web Application Firewall

## Exemplo 1: Instalacao completa do ModSecurity

```bash
# 1. Instalar o modulo do ModSecurity para Apache
sudo apt install libapache2-mod-security2

# 2. Habilitar o modulo
sudo a2enmod security2

# 3. Verificar os arquivos de configuracao
ls /etc/modsecurity/
# Saida esperada: modsecurity.conf-recommended (entre outros)

# 4. Ativar a configuracao recomendada (copiar ou renomear)
sudo cp /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf
```

## Exemplo 2: Alternar entre modos

```bash
# Editar o arquivo de configuracao
sudo nano /etc/modsecurity/modsecurity.conf

# Modo DetectionOnly (apenas loga, nao bloqueia)
# SecRuleEngine DetectionOnly

# Modo On (loga E bloqueia)
# SecRuleEngine On

# Apos alterar, restartar o Apache
sudo systemctl restart apache2
```

## Exemplo 3: Testando o WAF

```bash
# Requisicao maliciosa de teste (command injection via query string)
curl "https://seguro.else.com.br/?cmd=cat%20/etc/passwd"

# Com SecRuleEngine DetectionOnly: retorna 200 OK (mas loga o alerta)
# Com SecRuleEngine On: retorna 403 Forbidden
```

## Exemplo 4: Lendo o log de auditoria

```bash
# Ver as ultimas entradas do log
sudo tail -50 /var/log/apache2/modsec_audit.log

# Exemplo de saida (simplificada):
# [warning] Matched Phrase "etc/passwd" at ARGS:cmd
#   [file "/usr/share/modsecurity-crs/rules/REQUEST-932-APPLICATION-ATTACK-RCE.conf"]
#   [line "501"] [id "932160"]
#
# [warning] Matched Phrase "etc/passwd" at ARGS:cmd
#   [file "/usr/share/modsecurity-crs/rules/REQUEST-930-APPLICATION-ATTACK-LFI.conf"]
#   [id "930120"]
#
# [error] Inbound Anomaly Score Exceeded: operator > 5

# Interpretacao:
# - Linhas "Matched Phrase" = regras que dispararam (CAUSA)
# - Linhas "Anomaly Score Exceeded" = resultado do bloqueio (CONSEQUENCIA)
# - IDs importantes: 932160 (RCE), 930120 (LFI)
```

## Exemplo 5: Criando excecao cirurgica

```bash
# 1. Criar o arquivo de configuracao
sudo nano /etc/apache2/conf-available/waf.conf
```

```apache
# /etc/apache2/conf-available/waf.conf
#
# Excecoes para a rota /ajuda que precisa receber comandos Linux
# como query string (ex: /ajuda?cmd=cat /etc/passwd)
<Location /ajuda>
    SecRuleRemoveById 932160
    SecRuleRemoveById 930120
</Location>
```

```bash
# 2. Habilitar a configuracao
sudo a2enconf waf

# 3. Restartar o Apache
sudo systemctl restart apache2
```

## Exemplo 6: Verificando o resultado

```bash
# Na rota /ajuda: requisicao agora funciona (200 OK)
curl "https://seguro.else.com.br/ajuda?cmd=cat%20/etc/passwd"
# Retorna: 200 OK (pagina carregada)

# Na raiz: requisicao continua bloqueada (403 Forbidden)
curl "https://seguro.else.com.br/?cmd=cat%20/etc/passwd"
# Retorna: 403 Forbidden
```

## Exemplo 7: Preparando a estrutura da aplicacao

```bash
# Criar diretorio para a aplicacao
sudo mkdir /var/www/html/ajuda

# Copiar pagina inicial
sudo cp /var/www/html/index.html /var/www/html/ajuda/
```

## Erros comuns na configuracao

### Erro de sintaxe na diretiva

```apache
# ERRADO (nome da diretiva incorreto)
<Location /ajuda>
    RemoveRuleById 932160
</Location>

# CORRETO
<Location /ajuda>
    SecRuleRemoveById 932160
</Location>
```

### Esquecendo de habilitar e restartar

```bash
# Criar o arquivo nao e suficiente!
# Precisa habilitar:
sudo a2enconf waf

# E restartar:
sudo systemctl restart apache2
```