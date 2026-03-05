---
name: rs-seguranca-devs-click-jacking
description: "Enforces clickjacking protection using Content-Security-Policy frame-ancestors header when building web applications. Use when user asks to 'secure a page', 'protect against iframe attacks', 'add CSP headers', 'prevent clickjacking', or 'configure frame-ancestors'. Applies rules: frame-ancestors none for sensitive pages, whitelist model over blacklist, granular per-page CSP. Make sure to use this skill whenever generating pages that handle sensitive actions like password changes, financial transactions, or account deletion. Not for XSS protection, CORS configuration, or general CSP directives beyond frame-ancestors."
---

# Clickjacking Protection com Frame Ancestors

> Paginas sensiveis nunca devem ser incluiveis em iframes — use Content-Security-Policy frame-ancestors para controlar onde sua pagina pode ser embutida.

## Rules

1. **Use frame-ancestors none em paginas sensiveis** — transferencias, mudanca de senha, exclusao de conta, porque um atacante pode sobrepor elementos de UI transparentes sobre um iframe da sua pagina e induzir cliques
2. **Prefira whitelist sobre blacklist** — coloque `frame-ancestors none` como padrao e libere apenas onde necessario, porque o modelo restritivo protege paginas esquecidas
3. **Use frame-ancestors self quando precisar de iframes internos** — permite apenas o proprio dominio embutir a pagina, porque aplicacoes frequentemente usam iframes para componentes internos
4. **Liste origens explicitas para widgets de parceiros** — `frame-ancestors self https://parceiro.com`, porque domínios genericos abrem superficie de ataque
5. **Nunca confie em pointer-events como defesa** — `pointer-events: none` e tecnica de ATAQUE (torna botao transparente ao clique), nao de defesa, porque a protecao real e server-side via headers

## How to write

### PHP — Protecao padrao para paginas sensiveis

```php
<?php
// Paginas sensiveis: transferencia, senha, exclusao
header("Content-Security-Policy: frame-ancestors 'none'");
```

### PHP — Permitir iframe do proprio dominio

```php
<?php
// Paginas que precisam ser incluidas em iframes internos
header("Content-Security-Policy: frame-ancestors 'self'");
```

### PHP — Permitir origens especificas

```php
<?php
// Widgets embarcados em sites parceiros
header("Content-Security-Policy: frame-ancestors 'self' https://parceiro1.com https://parceiro2.com");
```

### Node.js/Express — Middleware de protecao

```typescript
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  next();
});
```

### Nginx — Header no servidor

```nginx
# Para todo o site (padrao restritivo)
add_header Content-Security-Policy "frame-ancestors 'none'" always;

# Para rotas que precisam de iframe interno
location /widgets/ {
    add_header Content-Security-Policy "frame-ancestors 'self'" always;
}
```

## Example

**Before (vulneravel a clickjacking):**
```php
<?php
// Pagina de transferencia sem protecao
if ($_POST['action']) {
    // Processa transferencia...
    $mensagem = "Transferido!";
}
?>
<form method="POST">
    <input type="hidden" name="action" value="transfer">
    <button type="submit">Transferir</button>
</form>
```

**After (protegida):**
```php
<?php
header("Content-Security-Policy: frame-ancestors 'none'");

if ($_POST['action']) {
    $mensagem = "Transferido!";
}
?>
<form method="POST">
    <input type="hidden" name="action" value="transfer">
    <button type="submit">Transferir</button>
</form>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina com acao financeira | `frame-ancestors 'none'` obrigatorio |
| Pagina de mudanca de senha/email | `frame-ancestors 'none'` obrigatorio |
| Pagina de exclusao de conta | `frame-ancestors 'none'` obrigatorio |
| Dashboard com componentes iframe | `frame-ancestors 'self'` |
| Widget para parceiros externos | `frame-ancestors 'self' https://dominio-parceiro` |
| Fintech, banco, governo | `frame-ancestors 'none'` em TODAS as paginas |
| Sem necessidade de iframe | `frame-ancestors 'none'` sempre |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Nenhum header CSP em pagina sensivel | `header("Content-Security-Policy: frame-ancestors 'none'")` |
| `frame-ancestors 'self'` em pagina de transferencia | `frame-ancestors 'none'` para paginas sensiveis |
| `frame-ancestors *` (permitir todos) | Listar origens explicitamente |
| Blacklist (none so nas sensiveis) | Whitelist (none padrao, self onde precisa) |
| Confiar em JS do client para bloquear iframe | Header server-side CSP frame-ancestors |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
