---
name: rs-seguranca-devs-csrf
description: "Applies Cross-Site Request Forgery (CSRF) protection patterns when writing backend code that handles forms, POST routes, or state-changing requests. Use when user asks to 'create a form', 'handle POST request', 'implement transfer', 'build checkout', 'add payment endpoint', or any state-changing server action. Enforces SameSite cookie config and nonce/anti-CSRF token implementation. Make sure to use this skill whenever generating form-handling or session-based endpoints. Not for XSS prevention, SQL injection, or frontend-only components."
---

# Cross-Site Request Forgery (CSRF) Protection

> Toda rota que executa acao com efeito colateral (transferencia, alteracao de senha, publicacao) deve ser protegida contra CSRF com cookie SameSite e nonce anti-CSRF.

## Rules

1. **Configure SameSite nos cookies de sessao** — use `SameSite=Strict` ou `SameSite=Lax`, porque sem isso um site externo pode submeter formularios que enviam o cookie de sessao do usuario logado
2. **Implemente nonce anti-CSRF em todo formulario POST** — gere um token unico por carregamento de pagina e valide no servidor, porque SameSite sozinho nao protege contra ataques vindos do proprio dominio (HTML Injection no mesmo site)
3. **Invalide o nonce apos uso** — apague da sessao imediatamente apos consumo, porque isso previne replay attacks e de quebra resolve double-submit acidental
4. **Use tokens criptograficamente seguros** — use `secrets.token_hex()` (Python), `crypto.randomBytes()` (Node), ou equivalente do framework, porque tokens previsiveis anulam a protecao
5. **Prefira o recurso do framework** — Django, Laravel, Rails, Py4Web ja tem anti-CSRF pronto e possivelmente ativo por padrao — nao reinvente a roda
6. **Nunca confie apenas em SameSite** — se o seu site tiver qualquer vulnerabilidade de HTML/Script Injection, um atacante injeta o formulario no proprio dominio e o cookie vai normalmente

## How to write

### Cookie de sessao com SameSite

```python
# Python/Flask
response.set_cookie('session_id', value, samesite='Strict', httponly=True, secure=True)
```

```javascript
// Express.js
res.cookie('session_id', value, { sameSite: 'strict', httpOnly: true, secure: true });
```

### Nonce anti-CSRF (padrao manual)

```python
import secrets
from flask import session, request

# Ao renderizar o formulario: gerar e salvar nonce
nonce = secrets.token_hex()
session['nonce'] = nonce
# Incluir no HTML: <input type="hidden" name="nonce" value="{{ nonce }}">

# Ao processar o POST: validar e invalidar
nonce = request.form.get('nonce')
if nonce != session.pop('nonce', None):
    return "Erro: token CSRF invalido", 403
```

### Formulario com campo nonce

```html
<form method="POST" action="/saque">
  <input type="hidden" name="nonce" value="TOKEN_GERADO_NO_SERVIDOR">
  <input name="chave_pix" placeholder="Chave PIX">
  <input name="valor" placeholder="Valor">
  <button type="submit">Enviar</button>
</form>
```

## Example

**Before (vulneravel a CSRF):**
```python
@app.route('/saque', methods=['POST'])
def saque():
    chave = request.form.get('chave')
    valor = request.form.get('valor')
    # Executa transferencia sem nenhuma validacao CSRF
    return f"Transferido {valor} para {chave}"
```

**After (protegido):**
```python
@app.route('/saque', methods=['POST'])
def saque():
    nonce = request.form.get('nonce')
    if nonce != session.pop('nonce', None):
        return "Requisicao invalida", 403
    chave = request.form.get('chave')
    valor = request.form.get('valor')
    # Agora seguro: nonce validado e consumido
    return f"Transferido {valor} para {chave}"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota POST que altera estado (DB, pagamento, config) | Sempre exigir nonce anti-CSRF |
| Framework full-stack (Django, Rails, Laravel) | Usar middleware CSRF nativo, verificar se esta ativo |
| Micro-framework (Flask, Express, Fastify) | Implementar nonce manual ou usar biblioteca dedicada |
| API REST pura (JWT, sem cookies) | CSRF nao se aplica — sem cookie, sem risco CSRF |
| SPA com fetch/axios | Usar header customizado (X-CSRF-Token) em vez de campo hidden |
| Pagina com CMS externo ou conteudo de terceiros | Risco alto de injection no mesmo dominio — nonce e obrigatorio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `set_cookie('session', val)` sem SameSite | `set_cookie('session', val, samesite='Strict')` |
| Formulario POST sem campo nonce | Formulario com `<input hidden name="nonce">` |
| Reusar o mesmo nonce em multiplas submissoes | `session.pop('nonce')` apos validacao |
| `random.randint()` para gerar token | `secrets.token_hex()` ou equivalente cripto |
| Confiar so em SameSite sem nonce | SameSite + nonce juntos |
| Reimplementar CSRF em Django/Rails | Usar `{% csrf_token %}` / `authenticity_token` nativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-cross-site-request-forgery-csrf/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-cross-site-request-forgery-csrf/references/code-examples.md)
