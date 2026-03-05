---
name: rs-seguranca-devs-hash-integrity
description: "Applies Subresource Integrity (SRI) hash calculation when loading external scripts or CDN resources. Use when user asks to 'add a CDN script', 'load external library', 'include third-party script', 'calculate SRI hash', or 'secure script tag'. Generates correct integrity attributes with SHA-256/384/512 hashes in base64. Make sure to use this skill whenever adding script tags with external src or linking CDN resources. Not for internal scripts, CSP headers, or general cryptography tasks."
---

# Calculo de Hash para Subresource Integrity

> Sempre que carregar scripts externos, calcule o hash SRI e inclua o atributo integrity no script tag.

## Rules

1. **Sempre use HTTPS para scripts externos** — `https://` nunca `http://`, porque sem transmissao segura o hash nao protege contra MITM
2. **Algoritmos aceitos: SHA-256, SHA-384, SHA-512** — qualquer um dos tres funciona no atributo `integrity`, porque sao os unicos suportados pela spec de Subresource Integrity
3. **O formato e: algoritmo-hashBase64** — `sha256-UAWC...` com hifen separando, porque o browser precisa saber qual algoritmo usar para verificar
4. **O hash e do conteudo do arquivo, nao da URL** — baixe o script, calcule o hash do conteudo, porque qualquer byte diferente invalida a verificacao
5. **Inclua crossorigin="anonymous"** — necessario para SRI funcionar com recursos cross-origin

## How to write

### Script tag com SRI

```html
<script
  src="https://cdn.example.com/lib.min.js"
  integrity="sha256-UAWC6q0v...hashBase64Aqui="
  crossorigin="anonymous"
></script>
```

### Calcular hash no terminal (Linux/Mac)

```bash
# Gera hash SHA-256 em base64 do arquivo
openssl dgst -sha256 -binary script.js | base64
```

### Calcular hash com Node.js

```javascript
import fs from 'fs'
import crypto from 'crypto'

const content = fs.readFileSync('script.js', 'utf8')
const hash = crypto.createHash('sha256').update(content, 'utf8').digest('base64')
console.log(`sha256-${hash}`)
```

### Calcular hash com Python

```python
import hashlib
import base64

with open('script.js', 'rb') as f:
    content = f.read()

hash_digest = hashlib.sha256(content).digest()
b64 = base64.b64encode(hash_digest).decode()
print(f"sha256-{b64}")
```

## Example

**Before (inseguro):**
```html
<script src="https://cdn.example.com/react.min.js"></script>
```

**After (com SRI):**
```html
<script
  src="https://cdn.example.com/react.min.js"
  integrity="sha256-UAWC6q0vBMnR...TRN8="
  crossorigin="anonymous"
></script>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| CDN de biblioteca popular (React, Vue, jQuery) | Calcule SRI hash e adicione integrity |
| Script interno do proprio dominio | SRI opcional, mas recomendado |
| Script carregado via HTTP | Migre para HTTPS primeiro, depois adicione SRI |
| Hash nao bate apos update da lib | Recalcule o hash com a nova versao do arquivo |
| Multiplos algoritmos disponiveis | SHA-384 e o mais comum em CDNs, qualquer um dos 3 funciona |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<script src="http://cdn...">` | `<script src="https://cdn...">` |
| `<script src="https://cdn..." integrity="sha256-...">` (sem crossorigin) | Adicione `crossorigin="anonymous"` |
| Hash calculado da URL | Hash calculado do conteudo do arquivo |
| Copiar hash antigo apos atualizar versao da lib | Recalcular hash do novo arquivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-processo-de-calculo-de-hash-para-integrity/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-processo-de-calculo-de-hash-para-integrity/references/code-examples.md)
