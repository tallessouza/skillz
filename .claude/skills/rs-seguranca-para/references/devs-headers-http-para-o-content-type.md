---
name: rs-seguranca-devs-content-type-headers
description: "Enforces correct Content-Type and X-Content-Type-Options headers when building HTTP responses or configuring web servers. Use when user asks to 'serve files', 'handle uploads', 'configure headers', 'set up Express/Fastify responses', 'build an API endpoint', or 'configure Nginx/Apache'. Applies rules: always set Content-Type with charset, always enable X-Content-Type-Options nosniff, never trust file extensions alone. Make sure to use this skill whenever generating server-side code that serves files or builds HTTP responses. Not for client-side fetch calls, CSS styling, or frontend component logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: http-security
  tags: [security, content-type, headers, mime]
---

# Headers HTTP: Content-Type e X-Content-Type-Options

> Sempre defina Content-Type com charset em toda resposta HTTP e habilite X-Content-Type-Options: nosniff globalmente para impedir que o navegador reinterprete o tipo do arquivo.

## Rules

1. **Sempre envie Content-Type com charset** — `Content-Type: text/html; charset=utf-8` nao apenas `text/html`, porque sem charset um atacante pode explorar encodings alternativos (como UTF-7 no passado) para injetar scripts que bypassam filtros de HTML
2. **Habilite X-Content-Type-Options: nosniff globalmente** — configure no servidor para TODAS as rotas, remova apenas em rotas especificas se necessario, porque sem esse header o navegador tenta adivinhar o tipo MIME pelo contexto e pode executar um .txt como JavaScript
3. **Nunca confie apenas na extensao do arquivo** — um arquivo .jpg pode ser simultaneamente HTML, PDF, ZIP e executavel (arquivos polyglot), porque o formato binario dos headers pode ser manipulado para satisfazer multiplos parsers
4. **Sirva arquivos de upload com Content-Type explicito** — ao servir thumbnails ou documentos enviados por usuarios, force o Content-Type correto (ex: `image/jpeg`), porque isso impede que um arquivo polyglot seja interpretado como script ou HTML
5. **Em frameworks custom (Node, Flask, micro-frameworks), sete Content-Type manualmente** — servidores de mercado (Apache, Nginx) ja fazem isso automaticamente, mas ao construir respostas sob medida voce precisa definir explicitamente

## How to write

### Express/Node.js — resposta com Content-Type correto
```typescript
// Sempre defina Content-Type ao servir arquivos ou respostas custom
app.get('/api/users', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.json(users)
})

// Ao servir arquivos de upload, force o tipo MIME
app.get('/uploads/:filename', (req, res) => {
  res.setHeader('Content-Type', 'image/jpeg')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.sendFile(filepath)
})
```

### Middleware global para nosniff
```typescript
// Aplique nosniff em TODAS as respostas
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})
```

### Apache (.htaccess)
```apache
Header set X-Content-Type-Options "nosniff"
```

### Nginx
```nginx
add_header X-Content-Type-Options "nosniff" always;
```

## Example

**Before (vulneravel):**
```typescript
app.get('/uploads/:file', (req, res) => {
  // Sem Content-Type — navegador vai adivinhar
  // Sem nosniff — arquivo .txt pode executar como JS
  res.sendFile(path.join(uploadsDir, req.params.file))
})
```

**After (com esta skill aplicada):**
```typescript
app.get('/uploads/:file', (req, res) => {
  const mimeType = getMimeTypeFromStoredMetadata(req.params.file)
  res.setHeader('Content-Type', `${mimeType}; charset=utf-8`)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.sendFile(path.join(uploadsDir, req.params.file))
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| API JSON | `Content-Type: application/json; charset=utf-8` |
| Servindo HTML | `Content-Type: text/html; charset=utf-8` |
| Servindo imagem de upload | `Content-Type: image/jpeg` (ou png, webp) + nosniff |
| Servindo PDF | `Content-Type: application/pdf` + nosniff |
| Download forcado | `Content-Type: application/octet-stream` + `Content-Disposition: attachment` |
| Servidor de mercado (Apache/Nginx) | Content-Type ja automatico, mas adicione nosniff manualmente |
| Framework custom (Express/Flask) | Defina Content-Type em CADA resposta |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `res.send(data)` sem Content-Type | `res.setHeader('Content-Type', 'application/json; charset=utf-8')` |
| `Content-Type: text/plain` sem charset | `Content-Type: text/plain; charset=utf-8` |
| Confiar na extensao do arquivo para determinar tipo | Armazenar o MIME type no momento do upload e usa-lo ao servir |
| Habilitar nosniff apenas em algumas rotas | Habilitar globalmente via middleware, desabilitar por excecao |
| Servir uploads de usuario sem Content-Type | Forcar Content-Type baseado no tipo esperado (thumbnail = image/*) |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-headers-http-para-o-content-type/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-headers-http-para-o-content-type/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
