# Code Examples: Content-Type e X-Content-Type-Options

## 1. Demonstracao UTF-7 (ataque historico)

Arquivo `UTF-7.txt` contem bytes que em UTF-8 parecem lixo, mas em UTF-7 sao JavaScript:

```python
# Leitura normal (UTF-8) — texto ilegivel
with open('UTF-7.txt', 'r') as f:
    print(f.read())  # Caracteres estranhos, nao-inteligiveis

# Leitura como UTF-7 — revela o script
with open('UTF-7.txt', encoding='utf-7') as f:
    print(f.read())  # <script>alert('XSS')</script>
```

**Nota:** Navegadores modernos removeram suporte a UTF-7. O principio permanece para outros encodings.

## 2. Arquivo Polyglot (4 formatos em 1)

```bash
# O arquivo index.html e simultaneamente HTML, JPEG, PDF e ZIP
ls -la polyglot/
# index.html

# Copiar como JPEG — abre como imagem valida
cp index.html index.jpeg
# Visualizador de imagem exibe JPEG valido

# Copiar como PDF — abre como PDF valido
cp index.html index.pdf
# Leitor de PDF exibe documento valido

# Copiar como ZIP — extrai arquivos
cp index.html index.zip
unzip index.zip
# Extrai: main.jpg, main.pdf
```

## 3. MIME Sniffing — .txt executado como JavaScript

### Arquivo vulneravel (test.txt):
```javascript
document.write('<h1>XSS via TXT file</h1>')
```

### HTML que carrega o .txt como script:
```html
<!DOCTYPE html>
<html>
<head><title>Hello</title></head>
<body>
  <h1>Hello</h1>
  <script src="test.txt"></script>
</body>
</html>
```

### Sem nosniff:
- Navegador executa o JavaScript contido em test.txt
- Nenhum erro no console

### Com nosniff (.htaccess):
```apache
Header set X-Content-Type-Options "nosniff"
```

### Resultado com nosniff:
```
Refused to execute script from 'test.txt' because its MIME type
('text/plain') is not executable, and strict MIME type checking is enabled.
```

## 4. Configuracao em diferentes servidores

### Apache (.htaccess)
```apache
# Habilitar nosniff globalmente
Header set X-Content-Type-Options "nosniff"

# Content-Type com charset para HTML
AddDefaultCharset UTF-8
```

### Nginx
```nginx
# No bloco server ou http
add_header X-Content-Type-Options "nosniff" always;
charset utf-8;
```

### Express.js (Node)
```typescript
import express from 'express'
import helmet from 'helmet'

const app = express()

// helmet ja inclui X-Content-Type-Options: nosniff
app.use(helmet())

// Ou manualmente:
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})

// Endpoint servindo JSON
app.get('/api/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.json({ users: [] })
})

// Endpoint servindo arquivo de upload com tipo forcado
app.get('/uploads/avatar/:id', (req, res) => {
  const avatar = getAvatarPath(req.params.id)
  res.setHeader('Content-Type', 'image/jpeg')
  res.sendFile(avatar)
})
```

### Flask (Python)
```python
from flask import Flask, make_response, send_file

app = Flask(__name__)

@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

@app.route('/api/data')
def get_data():
    response = make_response({'users': []})
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

@app.route('/uploads/<filename>')
def serve_upload(filename):
    response = send_file(f'uploads/{filename}')
    response.headers['Content-Type'] = 'image/jpeg'
    return response
```

### Fastify (Node)
```typescript
import Fastify from 'fastify'

const app = Fastify()

// Hook global para nosniff
app.addHook('onSend', async (request, reply) => {
  reply.header('X-Content-Type-Options', 'nosniff')
})

app.get('/api/users', async (request, reply) => {
  reply.header('Content-Type', 'application/json; charset=utf-8')
  return { users: [] }
})
```

## 5. Cenario de ataque completo e defesa

### Ataque (sem protecao):
```
1. Atacante faz upload de "notes.txt" contendo:
   fetch('/api/admin/delete-all', { method: 'POST' })

2. CMS aceita (e um .txt valido, so texto)

3. Atacante encontra XSS refletido e injeta:
   <script src="/uploads/notes.txt"></script>

4. Vitima acessa a pagina → navegador faz MIME sniff →
   interpreta .txt como JS → executa o fetch → dados deletados
```

### Defesa:
```
1. X-Content-Type-Options: nosniff (bloqueia execucao do .txt como JS)
2. Content-Type: text/plain; charset=utf-8 (ao servir o .txt)
3. Validacao de upload (aula futura — verifica conteudo, nao so extensao)
```