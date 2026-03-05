---
name: rs-seguranca-devs-unvalidated-redirects
description: "Guards against unvalidated redirect vulnerabilities when implementing login flows, authentication redirects, or any dynamic URL redirection in backend code. Use when user asks to 'implement login redirect', 'redirect after authentication', 'add return URL', 'redirect user back', or builds any dynamic redirect logic. Applies 4-tier mitigation hierarchy: avoid dynamic redirects, use destination dictionary, implement whitelist, validate URL format. Make sure to use this skill whenever code contains header redirects or response redirects based on user input, even in frameworks. Not for frontend-only navigation, SPA routing, or static redirects."
---

# Unvalidated Redirects

> Todo redirect cujo destino depende de entrada do usuario DEVE ser validado antes de executar.

## Rules

1. **Nunca redirecione para uma URL vinda do usuario sem validar** — `header("Location: $userInput")` e um vetor de phishing, porque o atacante envia um link legitimo do seu site que redireciona para um clone malicioso
2. **Siga a hierarquia de mitigacao: evitar > dicionario > whitelist > validar formato** — cada nivel e menos seguro que o anterior, porque reduz o controle sobre os destinos possiveis
3. **Prefira eliminar o redirect dinamico** — se a aplicacao funciona sem ele, remova, porque zero redirect dinamico significa zero risco de redirect nao validado
4. **Use dicionario de destinos quando possivel** — passe IDs (numeros/chaves) em vez de URLs, porque o atacante so pode enviar valores que mapeiam para destinos conhecidos
5. **Implemente whitelist quando dicionario nao for viavel** — mantenha um array/set de destinos permitidos e rejeite qualquer valor fora dele
6. **Valide o formato como ultimo recurso** — verifique que a URL comeca com `/` e nao com `//` ou `http`, porque impede redirecionamento externo mas ainda permite destinos internos indesejados

## How to write

### Sem redirect dinamico (mais seguro)

```php
// Sempre redireciona para o mesmo lugar — sem entrada do usuario
header("Location: /index.php");
exit;
```

### Dicionario de destinos

```php
$destinations = [
    1 => '/index.php',
    2 => '/dashboard.php',
    3 => '/profile.php',
];

$nextId = (int) ($_GET['next'] ?? 1);
$location = $destinations[$nextId] ?? '/index.php';
header("Location: $location");
exit;
```

### Whitelist

```php
$whitelist = ['/index.php', '/page1.php', '/page2.php', '/dashboard.php'];

$next = $_GET['next'] ?? '/index.php';
if (!in_array($next, $whitelist, true)) {
    $next = '/index.php';
    // Logar tentativa suspeita em aplicacoes criticas
}
header("Location: $next");
exit;
```

### Validacao de formato (menos seguro)

```php
$next = $_GET['next'] ?? '/index.php';
// Deve comecar com / e NAO com // (evita protocol-relative URLs)
if (!preg_match('/^\/[^\/]/', $next)) {
    $next = '/index.php';
}
header("Location: $next");
exit;
```

## Example

**Before (vulneravel a phishing):**

```php
// No header/middleware de autenticacao
if (!isset($_SESSION['user'])) {
    header("Location: /login.php?next=" . $_SERVER['REQUEST_URI']);
    exit;
}

// No login.php apos autenticar
$next = $_GET['next'] ?? '/index.php';
header("Location: $next");  // VULNERAVEL: aceita qualquer URL
exit;
```

**After (com whitelist):**

```php
// No login.php apos autenticar
$whitelist = ['/index.php', '/page1.php', '/page2.php'];
$next = $_GET['next'] ?? '/index.php';

if (!in_array($next, $whitelist, true)) {
    $next = '/index.php';
    error_log("Redirect bloqueado: tentativa de redirecionar para $next");
}

header("Location: $next");
exit;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Site com poucas paginas | Elimine o redirect dinamico completamente |
| Paginas vem de banco de dados | Use dicionario com IDs numericos |
| Muitas rotas mas conhecidas | Whitelist das rotas validas |
| Rotas imprevisiveis/dinamicas | Valide formato (comeca com `/`, sem `//`) |
| Aplicacao financeira/saude | Whitelist + logar tentativas bloqueadas + alertar admin |
| Framework com router | Use o sistema de named routes do framework como dicionario |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `header("Location: " . $_GET['next'])` | Valide `$_GET['next']` contra whitelist antes |
| `redirect($request->input('url'))` | `redirect($this->validateRedirect($url))` |
| `res.redirect(req.query.returnUrl)` | Valide `returnUrl` contra lista de rotas permitidas |
| `window.location = params.get('next')` | Valide no backend, nao confie no frontend |
| `if (str_starts_with($next, '/'))` sozinho | Adicione `&& !str_starts_with($next, '//')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
