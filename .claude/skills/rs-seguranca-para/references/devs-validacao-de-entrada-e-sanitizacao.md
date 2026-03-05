---
name: rs-seguranca-devs-validacao-entrada
description: "Enforces input validation and sanitization patterns when writing backend code that handles user input. Use when user asks to 'create an endpoint', 'handle form data', 'write a login route', 'query database with user input', or any code receiving external data. Applies rules: always use prepared queries, validate all inputs before processing, never concatenate user data into SQL strings, treat cookies/headers/params as untrusted. Make sure to use this skill whenever generating backend code that touches user-supplied data, even if the user doesn't mention security. Not for frontend-only validation, UI styling, or cryptography/hashing concerns."
---

# Validacao de Entrada e Sanitizacao

> Todo dado que vem do usuario e hostil ate que seja validado — use prepared queries e valide antes de processar.

## Rules

1. **Nunca concatene input do usuario em queries SQL** — use prepared queries com placeholders, porque escapar manualmente e fragil e voce vai esquecer algum caso
2. **Valide TODAS as entradas antes de usar** — email, telefone, IDs, temas, qualquer coisa, porque validacao e uma camada de defesa que mitiga erros nas camadas internas
3. **Trate TUDO que vem do usuario como hostil** — form fields, cookies, headers HTTP, query params, filenames, porque atacantes controlam todos esses vetores
4. **Deixe a biblioteca fazer o escape** — nunca tente escapar strings manualmente, porque bibliotecas tem comunidades inteiras testando e reportando falhas
5. **Validacao e defesa em profundidade** — mesmo com prepared queries, valide os inputs, porque se voce cometer erro em outra camada, a validacao ainda protege (analogia: tranque o portao E a porta)

## How to write

### Prepared queries (correto)

```python
# Placeholders + parametros separados — a biblioteca cuida do escape
query = "SELECT * FROM users WHERE email = ? AND password = ?"
result = db.execute(query, (email, password))
```

### Validacao antes do processamento

```python
import re

def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# Na rota: validar ANTES de usar
if not is_valid_email(email):
    return {"error": "Email invalido"}, 400
```

### Cookies e headers tambem sao input

```python
# Cookie de tema — validar contra lista permitida
theme = request.cookies.get("theme", "default")
ALLOWED_THEMES = {"light", "dark", "blue", "green", "red"}
if theme not in ALLOWED_THEMES:
    theme = "default"
```

## Example

**Before (vulneravel a SQL Injection):**
```python
@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]
    query = f"SELECT * FROM users WHERE email = '{email}' AND password = '{password}'"
    user = query_db(query)
    # Atacante envia: email = "x' OR 1=1 --"  → acesso total
```

**After (com prepared query + validacao):**
```python
@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]

    if not is_valid_email(email):
        return "Email invalido", 400

    query = "SELECT * FROM users WHERE email = ? AND password = ?"
    user = query_db(query, (email, password))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Query SQL com dados do usuario | Sempre prepared query com placeholders |
| Recebendo email | Validar formato antes de qualquer uso |
| Recebendo valor de cookie | Validar contra whitelist de valores permitidos |
| Recebendo header HTTP para log | Sanitizar antes de gravar no banco |
| Recebendo filename em upload | Validar extensao, remover caracteres especiais |
| Valor numerico do usuario | Converter para int/float e validar range |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `f"SELECT * FROM users WHERE email = '{email}'"` | `"SELECT * FROM users WHERE email = ?", (email,)` |
| `query = "... " + user_input + " ..."` | `query = "... ? ...", (user_input,)` |
| `theme = request.cookies.get("theme")` sem validar | `theme = validated_theme(request.cookies.get("theme"))` |
| Escapar aspas manualmente com `.replace("'", "")` | Usar prepared queries da biblioteca |
| Validar so o form field e ignorar cookies/headers | Validar TUDO que vem do usuario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-validacao-de-entrada-e-sanitizacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-validacao-de-entrada-e-sanitizacao/references/code-examples.md)
