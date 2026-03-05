# Code Examples: CSRF Protection

## Exemplo completo do instrutor (Flask)

### Aplicacao vulneravel (antes)

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
    return '''
    <h1>Faça um saque</h1>
    <form method="POST" action="/saque">
        <input name="chave" placeholder="Chave PIX">
        <input name="valor" placeholder="Valor">
        <button type="submit">Enviar</button>
    </form>
    '''

@app.route('/saque', methods=['POST'])
def saque():
    chave = request.form.get('chave')
    valor = request.form.get('valor')
    # Aqui faria a transferencia real
    return f"Transferido {valor} para {chave}"
```

### Site do hacker (o ataque)

```html
<!-- hacker.com/index.html -->
<form method="POST" action="http://127.0.0.1:5000/saque">
    <input type="hidden" name="valor" value="1000000">
    <input type="hidden" name="chave" value="chave-pix-do-hacker">
    <button type="submit">Clique aqui para ganhar um premio!</button>
</form>
```

Quando o usuario clica, o navegador envia o POST com o cookie de sessao e a transferencia acontece.

### Ataque via mesmo dominio (injection no CMS)

```python
# Rota que serve conteudo de CMS externo (WordPress invadido)
@app.route('/termos')
def termos():
    return render_template('termos.html')  # Conteudo comprometido
```

```html
<!-- termos.html - conteudo injetado pelo hacker no WordPress -->
<h1>Termos de Uso</h1>
<p>Texto legitimo dos termos...</p>

<!-- Injetado pelo hacker: -->
<iframe style="display:none" name="csrf-frame"></iframe>
<form method="POST" action="/saque" target="csrf-frame" id="csrf-form">
    <input type="hidden" name="valor" value="1000000">
    <input type="hidden" name="chave" value="chave-pix-do-hacker">
</form>
<script>document.getElementById('csrf-form').submit();</script>
```

### Aplicacao protegida (depois)

```python
import secrets
from flask import Flask, request, session

app = Flask(__name__)
app.secret_key = 'chave-secreta-aqui'

@app.route('/')
def index():
    nonce = secrets.token_hex()
    session['nonce'] = nonce
    return f'''
    <h1>Faça um saque</h1>
    <form method="POST" action="/saque">
        <input type="hidden" name="nonce" value="{nonce}">
        <input name="chave" placeholder="Chave PIX">
        <input name="valor" placeholder="Valor">
        <button type="submit">Enviar</button>
    </form>
    '''

@app.route('/saque', methods=['POST'])
def saque():
    nonce = request.form.get('nonce')
    if nonce != session.pop('nonce', None):
        return "Requisição inválida", 403
    chave = request.form.get('chave')
    valor = request.form.get('valor')
    return f"Transferido {valor} para {chave}"
```

## Equivalente em Node.js/Express

```javascript
import express from 'express';
import crypto from 'crypto';
import session from 'express-session';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'chave-secreta',
  cookie: { sameSite: 'strict', httpOnly: true }
}));

app.get('/', (req, res) => {
  const nonce = crypto.randomBytes(32).toString('hex');
  req.session.nonce = nonce;
  res.send(`
    <form method="POST" action="/saque">
      <input type="hidden" name="nonce" value="${nonce}">
      <input name="chave" placeholder="Chave PIX">
      <input name="valor" placeholder="Valor">
      <button>Enviar</button>
    </form>
  `);
});

app.post('/saque', (req, res) => {
  const { nonce, chave, valor } = req.body;
  const sessionNonce = req.session.nonce;
  delete req.session.nonce;

  if (!nonce || nonce !== sessionNonce) {
    return res.status(403).send('Token CSRF inválido');
  }
  res.send(`Transferido ${valor} para ${chave}`);
});
```

## Configuracao SameSite em diferentes frameworks

### Express.js
```javascript
app.use(session({
  cookie: { sameSite: 'strict', secure: true, httpOnly: true }
}));
```

### Django (settings.py)
```python
CSRF_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_SAMESITE = 'Strict'
# Anti-CSRF ja ativo por padrao via CsrfViewMiddleware
```

### Laravel (config/session.php)
```php
'same_site' => 'strict',
// Anti-CSRF: usar @csrf no Blade template
```

### Flask
```python
app.config.update(
    SESSION_COOKIE_SAMESITE='Strict',
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
)
```

## SPA com API: header customizado

```javascript
// Frontend (React/Vue/etc)
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/api/saque', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({ chave, valor })
});
```

```python
# Backend: validar header
@app.route('/api/saque', methods=['POST'])
def api_saque():
    token = request.headers.get('X-CSRF-Token')
    if token != session.pop('csrf_token', None):
        return jsonify(error='CSRF token invalido'), 403
    # processar...
```