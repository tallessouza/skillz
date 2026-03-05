# Code Examples: Clickjacking

## Exemplo completo do ataque (prova de conceito)

### Aplicacao-alvo: transaction.php (porta 8000)

```php
<?php
$mensagem = "";

if ($_POST['action']) {
    $mensagem = "Transferido!";
    error_log("\033[1;4;31m Transferência realizada! \033[0m");
}
?>

<div style="background-color: yellow; padding: 20px;">
    <div><?= $mensagem ?></div>
    <form method="POST">
        <input type="text" name="nome" placeholder="Nome do destinatario">
        <input type="hidden" name="action" value="transfer">
        <button type="submit">Transferir</button>
    </form>
</div>
```

Servido com: `php -S 0.0.0.0:8000`

### Pagina do atacante: index.html (porta 8080)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        iframe {
            position: absolute;
            top: 100px;
            left: 10px;
            z-index: 1;
            width: 50%;
            height: 200px;
        }

        #botao-falso {
            position: absolute;
            top: 110px;
            left: 150px;
            z-index: 2;
            pointer-events: none; /* Cliques atravessam o botao */
        }
    </style>
</head>
<body>
    <div>
        <h1>Prove que voce e humano!</h1>
        <p>Digite seu nome e clique no botao</p>
    </div>

    <button id="botao-falso">Clique aqui para verificar</button>

    <iframe src="http://localhost:8000/transaction.php"></iframe>
</body>
</html>
```

### Mecanica do ataque

1. O iframe carrega a pagina real de transferencia
2. O botao falso fica posicionado EXATAMENTE sobre o botao "Transferir" do iframe
3. `pointer-events: none` faz o botao falso ser "transparente" para cliques
4. O usuario clica pensando que esta verificando identidade, mas esta transferindo dinheiro

## Defesa: adicionando frame-ancestors

### Bloqueio total (paginas sensiveis)

```php
<?php
// ADICIONAR ANTES DE QUALQUER OUTPUT
header("Content-Security-Policy: frame-ancestors 'none'");

$mensagem = "";
if ($_POST['action']) {
    $mensagem = "Transferido!";
}
?>
```

Resultado: iframe mostra "conexao recusada", ataque neutralizado.

### Permitir apenas proprio dominio

```php
<?php
header("Content-Security-Policy: frame-ancestors 'self'");
```

### Permitir dominio especifico

```php
<?php
header("Content-Security-Policy: frame-ancestors 'self' http://127.0.0.1:8080");
```

Resultado: iframe volta a funcionar APENAS para a origem listada.

## Aplicacao pratica em frameworks modernos

### Express.js middleware

```typescript
import { Request, Response, NextFunction } from "express";

// Middleware padrao: bloqueia todas as paginas em iframes
function clickjackingProtection(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  next();
}

// Middleware para paginas que precisam de iframe interno
function allowSelfFraming(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
  next();
}

// Uso
app.use(clickjackingProtection); // Padrao restritivo
app.use("/widgets", allowSelfFraming); // Excecao para widgets
```

### Next.js middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SENSITIVE_PATHS = ["/transfer", "/settings", "/password", "/delete-account"];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const isSensitive = SENSITIVE_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  response.headers.set(
    "Content-Security-Policy",
    isSensitive ? "frame-ancestors 'none'" : "frame-ancestors 'self'"
  );

  return response;
}
```

### Django middleware

```python
# middleware.py
class ClickjackingProtectionMiddleware:
    SENSITIVE_PATHS = ['/transfer/', '/password/', '/delete-account/']

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        is_sensitive = any(
            request.path.startswith(path) for path in self.SENSITIVE_PATHS
        )
        policy = "frame-ancestors 'none'" if is_sensitive else "frame-ancestors 'self'"
        response["Content-Security-Policy"] = policy
        return response
```