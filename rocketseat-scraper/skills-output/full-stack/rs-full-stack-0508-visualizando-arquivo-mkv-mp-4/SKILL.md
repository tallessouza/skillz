---
name: rs-full-stack-0508-visualizando-arquivo
description: "Enforces dynamic URL construction for file viewing in frontend applications. Use when user asks to 'open a file', 'view uploaded file', 'display attachment', 'show file preview', or 'build file URL'. Applies pattern: interpolate base URL with dynamic file path instead of hardcoding full URLs. Make sure to use this skill whenever constructing URLs to serve static files or uploaded content from a backend. Not for file upload logic, backend file serving routes, or file download with streams."
---

# Visualizando Arquivo no Frontend

> Construa URLs de arquivos por interpolacao, mantendo a base estatica e o caminho do arquivo dinamico.

## Rules

1. **Nunca hardcode a URL completa do arquivo** — interpole `${baseURL}/${filePath}`, porque URLs hardcoded quebram ao mudar de ambiente (dev/staging/prod)
2. **Separe base URL da referencia do arquivo** — a base (`http://localhost:3333`) e fixa por ambiente, o `fileURL` vem do backend, porque isso permite trocar facilmente entre ambientes
3. **Use template literals para interpolacao** — backticks com `${}`, porque concatenacao com `+` e fragil e dificil de ler
4. **O fileURL contem nome + extensao** — ex: `comprovante.pdf`, porque o backend retorna o nome completo do arquivo salvo

## How to write

### URL dinamica para visualizar arquivo

```javascript
// Base URL do servidor (idealmente vem de variavel de ambiente)
const baseURL = "http://localhost:3333"

// fileURL vem do backend (ex: "comprovante-12345.pdf")
const fileViewURL = `${baseURL}/uploads/${fileURL}`

// Usar no link ou window.open
window.open(fileViewURL)
```

### Em um botão de visualização

```html
<button onclick="handleOpenFile()">Abrir comprovante</button>
```

```javascript
function handleOpenFile() {
  const fileViewURL = `${baseURL}/uploads/${fileURL}`
  window.open(fileViewURL)
}
```

## Example

**Before (URL hardcoded):**
```javascript
// URL fixa aponta para exemplo externo ou valor estatico
const url = "https://exemplo.rocketseat.com.br/uploads/arquivo.pdf"
window.open(url)
```

**After (URL interpolada e dinamica):**
```javascript
const baseURL = "http://localhost:3333"
const fileViewURL = `${baseURL}/uploads/${fileURL}`
window.open(fileViewURL)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ambiente de desenvolvimento | `http://localhost:{porta}` como base |
| Ambiente de producao | Base URL vem de variavel de ambiente |
| Arquivo retornado pela API | Use o campo `fileURL` diretamente na interpolacao |
| Precisa testar se funciona | Acesse `baseURL/uploads/nomeDoArquivo.ext` no navegador |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"http://localhost:3333/uploads/arquivo.pdf"` (hardcoded) | `` `${baseURL}/uploads/${fileURL}` `` |
| `baseURL + "/uploads/" + fileURL` (concatenacao) | `` `${baseURL}/uploads/${fileURL}` `` |
| URL de exemplo externo em producao | URL interpolada com base configuravel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre interpolacao de URLs e ambientes
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes de framework