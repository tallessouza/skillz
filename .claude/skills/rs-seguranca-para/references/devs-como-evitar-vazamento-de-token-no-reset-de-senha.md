---
name: rs-seguranca-devs-vazamento-token-reset
description: "Enforces security practices on password reset and authentication pages to prevent token leakage. Use when user asks to 'build a reset password page', 'create login form', 'implement forgot password', 'add authentication flow', or 'secure sensitive pages'. Applies Referrer-Policy no-referrer header, blocks external scripts/CSS/analytics on auth pages, and removes unnecessary links. Make sure to use this skill whenever generating password reset, login, or signup pages. Not for general HTTP security headers, API authentication, or session management."
---

# Seguranca em Paginas de Reset de Senha

> Paginas de reset de senha, login e cadastro devem ser programadas em modo paranoico: zero recursos externos, zero links desnecessarios, e Referrer-Policy no-referrer.

## Rules

1. **Zero scripts/CSS/imagens externos** — nao carregue CDNs, analytics, Tag Manager ou qualquer recurso de terceiros nessas paginas, porque um unico script externo comprometido pode ler `window.location` e roubar o token da URL
2. **Zero links desnecessarios** — idealmente a pagina tem apenas o logotipo (sem link) e o formulario, porque qualquer link envia o token via header Referer para a pagina de destino
3. **Envie Referrer-Policy: no-referrer** — adicione este header HTTP antes de renderizar qualquer pagina que receba segredos na URL, porque impede o navegador de enviar a URL completa (com token) no header Referer
4. **Copie bibliotecas para o servidor** — se precisar de CSS ou JS, sirva localmente, porque a funcionalidade dessas paginas e simples o suficiente para nao depender de CDNs
5. **Sem analytics nessas paginas** — estatisticas de reset de senha devem vir dos logs do servidor (Apache, Nginx, aplicacao), nunca de ferramentas externas como Google Analytics ou Tag Manager

## How to write

### Header Referrer-Policy (qualquer linguagem)

```php
<?php
// Antes de qualquer output HTML
header("Referrer-Policy: no-referrer");
?>
```

```javascript
// Express.js
app.get('/reset-password', (req, res) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.render('reset-password');
});
```

```python
# Django
from django.http import HttpResponse
def reset_password(request):
    response = render(request, 'reset_password.html')
    response['Referrer-Policy'] = 'no-referrer'
    return response
```

### Pagina de reset de senha segura

```html
<!-- Tudo local, sem CDN, sem links externos -->
<html>
<head>
  <link rel="stylesheet" href="/local/styles.css">
  <!-- SEM: <link href="https://cdn.jsdelivr.net/..."> -->
  <!-- SEM: Google Analytics, Tag Manager, etc -->
</head>
<body>
  <img src="/local/logo.png" alt="Logo">
  <!-- Logo SEM link para home -->
  <form method="POST" action="/reset-password">
    <input type="hidden" name="token" value="...">
    <input type="password" name="password" placeholder="Nova senha">
    <button type="submit">Redefinir senha</button>
  </form>
  <!-- SEM links para politica de privacidade, ajuda, home, etc -->
</body>
</html>
```

## Example

**Before (inseguro):**
```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/pico.css" rel="stylesheet">
  <script src="https://www.googletagmanager.com/gtag/js"></script>
</head>
<body>
  <a href="/">Home</a>
  <a href="/privacy">Politica de Privacidade</a>
  <form action="/reset">...</form>
</body>
```

**After (com esta skill aplicada):**
```php
<?php header("Referrer-Policy: no-referrer"); ?>
<head>
  <link href="/assets/pico.min.css" rel="stylesheet">
</head>
<body>
  <img src="/assets/logo.png" alt="Logo">
  <form action="/reset" method="POST">...</form>
</body>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina recebe token/segredo na URL | Referrer-Policy: no-referrer obrigatorio |
| Cliente pede analytics no reset de senha | Recusar, usar logs do servidor |
| Precisa de CSS framework na pagina | Copiar arquivo para servir localmente |
| Alguem quer adicionar link de ajuda | Avaliar risco, preferir nao ter links |
| Aplicacao e fintech ou lida com dinheiro | Modo paranoico em TODAS as paginas sensiveis |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `<script src="https://cdn...">` em pagina de reset | `<script src="/local/lib.js">` |
| `<a href="/privacy">` na pagina de reset | Remova o link completamente |
| Google Analytics na pagina de login | Analise logs do servidor |
| Logo com `<a href="/">` no reset | `<img>` sem link |
| Confiar que ninguem adicionara links no futuro | Configurar Referrer-Policy: no-referrer como defesa permanente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-como-evitar-vazamento-de-token-no-reset-de-senha/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-como-evitar-vazamento-de-token-no-reset-de-senha/references/code-examples.md)
