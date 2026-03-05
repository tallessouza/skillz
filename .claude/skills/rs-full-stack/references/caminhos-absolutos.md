---
name: rs-full-stack-caminhos-absolutos
description: "Enforces correct absolute path usage in HTML links and resource references. Use when user asks to 'add a link', 'reference external site', 'create anchor tag', 'fix broken link', or any HTML href task. Applies rules: always include protocol (http/https), understand file:// vs http:// context, use full URLs for external resources. Make sure to use this skill whenever generating HTML links to external resources. Not for relative paths, file organization, or CSS/JS imports."
---

# Caminhos Absolutos em HTML

> Ao referenciar recursos externos em HTML, sempre use a URL completa com protocolo — sem protocolo, o navegador interpreta como caminho local.

## Rules

1. **Sempre inclua o protocolo na URL** — `http://` ou `https://`, porque sem ele o navegador trata o href como caminho relativo ao arquivo atual
2. **Entenda o contexto do protocolo** — arquivo aberto localmente usa `file://`, servidor usa `http://` — o comportamento dos links muda conforme o protocolo ativo
3. **URL completa = caminho absoluto** — `https://google.com` é absoluto porque especifica o local exato do recurso na internet, independente de onde está o arquivo HTML
4. **Barra inicial sem protocolo aponta para a raiz** — `/index.html` no protocolo `file://` busca na raiz do sistema operacional, não na pasta do projeto
5. **Com ou sem barra final no domínio é equivalente** — `https://google.com` e `https://google.com/` resolvem para o mesmo recurso

## How to write

### Link absoluto correto

```html
<!-- Sempre com protocolo completo -->
<a href="https://google.com">Ver o Google</a>
<a href="https://github.com/user/repo">Repositório</a>
```

### Recurso externo em qualquer tag

```html
<img src="https://example.com/images/logo.png" alt="Logo">
<script src="https://cdn.example.com/lib.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">
```

## Example

**Before (link quebrado):**

```html
<!-- Sem protocolo — navegador interpreta como caminho local -->
<a href="google.com">Ver o Google</a>
<!-- Resultado: file:///users/projeto/google.com → arquivo não encontrado -->
```

**After (com this skill applied):**

```html
<!-- Com protocolo — navegador resolve na internet -->
<a href="https://google.com">Ver o Google</a>
<!-- Resultado: abre o Google corretamente -->
```

## Heuristics

| Situação | Faça |
|----------|------|
| Link para site externo | URL completa com `https://` |
| Link para arquivo do próprio projeto | Use caminho relativo (não absoluto) |
| Href começa com `/` em arquivo local | Lembre que aponta para raiz do SO, não do projeto |
| Dúvida se precisa de protocolo | Se é recurso externo na internet, sempre precisa |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<a href="google.com">` | `<a href="https://google.com">` |
| `<a href="www.google.com">` | `<a href="https://www.google.com">` |
| `<a href="/index.html">` (esperando site externo) | `<a href="https://site.com/index.html">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre protocolos, file:// vs http://, e como o navegador resolve URLs
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-caminhos-absolutos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-caminhos-absolutos/references/code-examples.md)
