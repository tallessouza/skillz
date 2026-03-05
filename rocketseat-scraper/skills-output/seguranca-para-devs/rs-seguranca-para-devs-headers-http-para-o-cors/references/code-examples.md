# Code Examples: Headers HTTP para CORS

## Aplicacao completa em Ruby/Sinatra (da aula)

### Versao inicial — sem CORS

```ruby
require 'sinatra'
require 'json'
require 'time'

set :port, 5000
set :bind, '0.0.0.0'

get '/' do
  content_type :html
  <<-HTML
    <html>
    <body>
      <button onclick="fetch('/api/date').then(r=>r.json()).then(d=>alert(d.date))">GET</button>
      <button onclick="fetch('/api/date',{method:'POST'}).then(r=>r.json()).then(d=>alert(d.date))">POST</button>
    </body>
    </html>
  HTML
end

get '/api/date' do
  content_type :json
  { date: Time.now.to_s }.to_json
end

post '/api/date' do
  content_type :json
  { date: Time.now.to_s }.to_json
end
```

Nesse ponto, acessar de outra origem (ex: `127.0.0.1` tentando chamar `0.0.0.0`) resulta em erro de CORS.

### Versao com asterisco (INSEGURA)

```ruby
get '/api/date' do
  headers 'Access-Control-Allow-Origin' => '*'
  content_type :json
  { date: Time.now.to_s }.to_json
end

post '/api/date' do
  headers 'Access-Control-Allow-Origin' => '*'
  content_type :json
  { date: Time.now.to_s }.to_json
end
```

Ainda falha porque falta o handler OPTIONS para o preflight.

### Versao com OPTIONS mas ainda insegura

```ruby
options '/api/date' do
  headers 'Access-Control-Allow-Origin' => '*'
  ''
end

get '/api/date' do
  headers 'Access-Control-Allow-Origin' => '*'
  content_type :json
  { date: Time.now.to_s }.to_json
end

post '/api/date' do
  headers 'Access-Control-Allow-Origin' => '*'
  content_type :json
  { date: Time.now.to_s }.to_json
end
```

Funciona, mas qualquer site (incluindo hacker.com) pode acessar.

### Versao final — SEGURA com validacao de origem

```ruby
require 'sinatra'
require 'json'
require 'time'

set :port, 5000
set :bind, '0.0.0.0'

KNOWN_HOSTS = [
  'http://0.0.0.0:5000',
  'http://127.0.0.1:5000',
  # Adicione aqui seus dominios conhecidos
]

helpers do
  def set_cors(body)
    origin = request.env['HTTP_ORIGIN']
    if KNOWN_HOSTS.include?(origin)
      headers 'Access-Control-Allow-Origin' => origin
      headers 'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS'
      headers 'Access-Control-Allow-Headers' => 'Content-Type'
    end
    body
  end
end

get '/' do
  content_type :html
  # ... HTML com botoes ...
end

options '/api/date' do
  set_cors('')
end

get '/api/date' do
  content_type :json
  set_cors({ date: Time.now.to_s }.to_json)
end

post '/api/date' do
  content_type :json
  set_cors({ date: Time.now.to_s }.to_json)
end
```

Pontos-chave:
- `origin` e retornado no header ao inves de `*`
- Se a origem nao esta na lista, nenhum header e setado — o navegador bloqueia sozinho
- Metodos limitados a GET, POST, OPTIONS

## Equivalentes em outras linguagens

### Node.js/Express

```javascript
const ALLOWED_ORIGINS = [
  'https://meuapp.com',
  'https://admin.meuapp.com',
]

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  next()
}

app.use('/api', corsMiddleware)
```

### Python/Flask

```python
ALLOWED_ORIGINS = [
    'https://meuapp.com',
    'https://admin.meuapp.com',
]

@app.after_request
def set_cors(response):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response
```

### PHP/Laravel

```php
$allowedOrigins = [
    'https://meuapp.com',
    'https://admin.meuapp.com',
];

// Em um middleware
$origin = $request->header('Origin');
if (in_array($origin, $allowedOrigins)) {
    $response->header('Access-Control-Allow-Origin', $origin);
    $response->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Content-Type');
}
```

## Demonstracao do ataque (da aula)

O instrutor criou um arquivo `index.html` em outro dominio (`hacker.com:8080`) com o mesmo HTML da aplicacao, mostrando que com `*` no CORS, o site malicioso conseguia fazer GET e POST na API normalmente. Apos implementar a validacao de origem, `hacker.com` recebia erro de CORS enquanto as origens legitimas continuavam funcionando.