# Code Examples: Headers HTTP de Seguranca

## Referrer-Policy — Configuracao por servidor

### Apache (.htaccess ou vhost)
```apache
# Padrao global
Header set Referrer-Policy "strict-origin-when-cross-origin"

# Pagina especifica de reset de senha
<Location /reset-password>
    Header set Referrer-Policy "no-referrer"
</Location>
```

### Nginx
```nginx
# Padrao global
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Pagina especifica
location /reset-password {
    add_header Referrer-Policy "no-referrer" always;
}
```

### Express.js
```javascript
const helmet = require('helmet');

// Padrao global
app.use(helmet.referrerPolicy({
  policy: 'strict-origin-when-cross-origin'
}));

// Pagina especifica
app.get('/reset-password', (req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});
```

### HTML meta tag (fallback)
```html
<!-- Para paginas individuais -->
<meta name="referrer" content="no-referrer">
```

## HSTS — Implementacao gradual

### Fase 1: Teste (15 minutos)
```
Strict-Transport-Security: max-age=900
```

### Fase 2: Validacao (1 semana)
```
Strict-Transport-Security: max-age=604800
```

### Fase 3: Producao (1 ano + preload)
```
Strict-Transport-Security: max-age=31536000; preload
```

### Apache
```apache
# Requer mod_headers
Header always set Strict-Transport-Security "max-age=31536000; preload"
```

### Nginx
```nginx
add_header Strict-Transport-Security "max-age=31536000; preload" always;
```

### Express.js
```javascript
const helmet = require('helmet');

app.use(helmet.hsts({
  maxAge: 31536000, // 1 ano em segundos
  preload: true
}));
```

## Ocultando informacoes do servidor

### Apache — ServerTokens
```bash
# Encontrar o arquivo de configuracao
grep -r "ServerTokens" /etc/apache2/

# Editar (normalmente em /etc/apache2/conf-available/security.conf)
# Mudar de:
ServerTokens OS
# Para:
ServerTokens Prod

# Reiniciar
sudo service apache2 restart
```

### Nginx
```nginx
# Em nginx.conf, dentro do bloco http
server_tokens off;
```

### Express.js
```javascript
// Remover X-Powered-By
app.disable('x-powered-by');

// Ou com helmet (remove automaticamente)
app.use(helmet());
```

### ASP.NET — Web.config
```xml
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <remove name="X-Powered-By" />
      <remove name="X-AspNet-Version" />
    </customHeaders>
  </httpProtocol>
  <security>
    <requestFiltering removeServerHeader="true" />
  </security>
</system.webServer>
```

## Verificacao com curl

```bash
# Ver todos os headers de resposta
curl -I https://seusite.com

# Verificar HSTS especificamente
curl -sI https://seusite.com | grep -i strict-transport

# Verificar Referrer-Policy
curl -sI https://seusite.com | grep -i referrer-policy

# Verificar se Server esta expondo demais
curl -sI https://seusite.com | grep -i "^server:"

# Verificar headers de tecnologia
curl -sI https://seusite.com | grep -iE "(x-powered|x-aspnet|x-generator)"
```

## Checklist de auditoria de headers

```bash
#!/bin/bash
URL=$1

echo "=== Auditoria de Headers: $URL ==="

echo -e "\n[1] Server header:"
curl -sI "$URL" | grep -i "^server:"

echo -e "\n[2] HSTS:"
curl -sI "$URL" | grep -i "strict-transport"

echo -e "\n[3] Referrer-Policy:"
curl -sI "$URL" | grep -i "referrer-policy"

echo -e "\n[4] Headers de tecnologia (devem estar ausentes):"
curl -sI "$URL" | grep -iE "(x-powered|x-aspnet|x-generator|x-drupal)"

echo -e "\n=== Fim ==="
```