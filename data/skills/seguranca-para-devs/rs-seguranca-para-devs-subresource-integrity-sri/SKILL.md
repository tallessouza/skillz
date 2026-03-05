---
name: rs-seguranca-devs-subresource-integrity-sri
description: "Enforces Subresource Integrity (SRI) when including third-party scripts or CSS from CDNs. Use when user asks to 'add a CDN script', 'include external library', 'add script tag', 'use a CDN', or 'include third-party JavaScript'. Applies integrity attribute with SHA-256/384/512 hash, requires versioned URLs, and flags missing SRI on external resources. Make sure to use this skill whenever generating HTML that loads external scripts or stylesheets. Not for bundled dependencies via npm/yarn, inline scripts, or same-origin resources."
---

# Subresource Integrity (SRI)

> Ao incluir JavaScript ou CSS de terceiros, garanta a integridade do recurso com o atributo `integrity` para impedir execucao de codigo modificado.

## Rules

1. **Sempre use o atributo `integrity` em scripts/CSS externos** — `<script src="..." integrity="sha256-..." crossorigin="anonymous">`, porque se o arquivo for modificado na CDN (conta hackeada, injecao de codigo), o navegador bloqueia a execucao
2. **Sempre use URLs versionadas** — `cdn.example.com/lib@2.3.1/lib.min.js` nao `cdn.example.com/lib/latest/lib.min.js`, porque sem versao fixa qualquer atualizacao quebra sua aplicacao sem aviso
3. **Sempre inclua `crossorigin="anonymous"`** — obrigatorio para SRI funcionar com recursos de outro dominio, porque o servidor precisa ter CORS habilitado e o navegador precisa enviar a request correta
4. **Prefira SHA-384 ou SHA-512** — algoritmos mais fortes oferecem maior seguranca, SHA-256 e o minimo aceitavel
5. **Audite o codigo antes de gerar o hash** — leia o codigo original (nao minificado) no GitHub, confirme que nao ha codigo malicioso, depois minifique e calcule o hash, porque o hash so garante integridade, nao que o codigo original e seguro
6. **Para maxima seguranca, baixe o script para seu projeto** — copie para seu servidor e versione no controle de versao, porque elimina completamente a dependencia de infraestrutura de terceiros

## How to write

### Script externo com SRI

```html
<script
  src="https://cdn.example.com/library@3.2.1/library.min.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

### CSS externo com SRI

```html
<link
  rel="stylesheet"
  href="https://cdn.example.com/library@3.2.1/library.min.css"
  integrity="sha384-abc123..."
  crossorigin="anonymous"
/>
```

### Gerar hash via terminal

```bash
# Gerar hash SHA-384 de um arquivo local
openssl dgst -sha384 -binary library.min.js | openssl base64 -A

# Gerar hash SHA-256
shasum -a 256 library.min.js | xxd -r -p | base64

# Usar diretamente com curl (arquivo remoto)
curl -s https://cdn.example.com/lib@1.0.0/lib.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

## Example

**Before (vulneravel):**

```html
<script src="https://cdn.example.com/masks/latest/masks.min.js"></script>
```

**After (com SRI aplicado):**

```html
<script
  src="https://cdn.example.com/masks@2.1.0/masks.min.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Script de CDN publica (cdnjs, unpkg, jsdelivr) | SRI obrigatorio |
| Script de analytics/tracking (GA, GTM) | SRI quando possivel, mas analytics mudam frequentemente — considere self-hosting |
| Projeto critico onde seguranca e prioridade | Baixe o script para seu servidor |
| Biblioteca sem versionamento no CDN | Nao use essa biblioteca, encontre alternativa versionada |
| Multiplos algoritmos de hash | Pode incluir mais de um: `integrity="sha256-... sha384-..."` — navegador usa o mais forte |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `src="cdn.com/lib/latest/lib.js"` | `src="cdn.com/lib@2.1.0/lib.min.js"` com integrity |
| `<script src="...">` sem integrity para CDN | `<script src="..." integrity="sha384-..." crossorigin="anonymous">` |
| Confiar cegamente em CDN conhecida | Auditar codigo + SRI + versao fixa |
| Gerar hash sem ler o codigo fonte | Ler codigo original no GitHub, depois gerar hash |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
