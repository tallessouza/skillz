---
name: rs-seguranca-devs-click-jacking
description: "Enforces clickjacking protection using Content-Security-Policy frame-ancestors header when building web applications with sensitive actions. Use when user asks to 'secure a page', 'protect against iframe attacks', 'add CSP headers', 'prevent clickjacking', 'configure frame-ancestors', or 'protect financial transactions page'. Applies rules: frame-ancestors none for sensitive pages (transfers, password change, account deletion), whitelist model over blacklist, granular per-page CSP, never trust pointer-events as defense. Make sure to use this skill whenever generating pages that handle sensitive actions. Not for XSS protection (use devs-alternativas-a-innerhtml), CORS configuration (use devs-headers-http-para-o-cors), or general CSP directives beyond frame-ancestors."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: frontend-security
  tags: [security, clickjacking, csp, frame-ancestors, iframe, content-security-policy]
---

# Clickjacking Protection com Frame Ancestors

> Paginas sensiveis nunca devem ser incluiveis em iframes — use Content-Security-Policy frame-ancestors para controlar onde sua pagina pode ser embutida.

## Rules

1. **Use frame-ancestors none em paginas sensiveis** — transferencias, mudanca de senha, exclusao de conta, porque um atacante pode sobrepor elementos de UI transparentes sobre um iframe da sua pagina e induzir cliques
2. **Prefira whitelist sobre blacklist** — coloque `frame-ancestors none` como padrao e libere apenas onde necessario, porque o modelo restritivo protege paginas esquecidas
3. **Use frame-ancestors self quando precisar de iframes internos** — permite apenas o proprio dominio embutir a pagina
4. **Liste origens explicitas para widgets de parceiros** — `frame-ancestors self https://parceiro.com`
5. **Nunca confie em pointer-events como defesa** — `pointer-events: none` e tecnica de ATAQUE (torna botao transparente ao clique), nao de defesa

## How to write

### Node.js/Express — Middleware de protecao

```typescript
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  next();
});
```

### Nginx — Header no servidor

```nginx
add_header Content-Security-Policy "frame-ancestors 'none'" always;

location /widgets/ {
    add_header Content-Security-Policy "frame-ancestors 'self'" always;
}
```

### PHP — Por pagina

```php
<?php
// Paginas sensiveis
header("Content-Security-Policy: frame-ancestors 'none'");
```

## Example

**Before (vulneravel a clickjacking):**
```php
<?php
if ($_POST['action']) {
    // Processa transferencia sem protecao de iframe
    $mensagem = "Transferido!";
}
?>
```

**After (protegida):**
```php
<?php
header("Content-Security-Policy: frame-ancestors 'none'");
if ($_POST['action']) {
    $mensagem = "Transferido!";
}
?>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina com acao financeira | `frame-ancestors 'none'` obrigatorio |
| Pagina de mudanca de senha/email | `frame-ancestors 'none'` obrigatorio |
| Dashboard com componentes iframe | `frame-ancestors 'self'` |
| Widget para parceiros externos | `frame-ancestors 'self' https://dominio-parceiro` |
| Fintech, banco, governo | `frame-ancestors 'none'` em TODAS as paginas |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Nenhum header CSP em pagina sensivel | `frame-ancestors 'none'` |
| `frame-ancestors *` (permitir todos) | Listar origens explicitamente |
| Confiar em JS do client para bloquear iframe | Header server-side CSP frame-ancestors |

## Troubleshooting

### Pagina nao carrega em iframe proprio
**Symptom:** Iframe interno retorna pagina em branco ou erro de CSP
**Cause:** `frame-ancestors 'none'` aplicado globalmente, bloqueando iframes internos
**Fix:** Use `frame-ancestors 'self'` nas rotas que precisam ser embutidas internamente. Mantenha `none` para paginas sensiveis.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-click-jacking-em-iframe/references/deep-explanation.md) — Como o ataque funciona com camadas transparentes, pointer-events como vetor, historico do X-Frame-Options
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-click-jacking-em-iframe/references/code-examples.md) — Implementacoes em PHP, Express, Nginx, Apache
