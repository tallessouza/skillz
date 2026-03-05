---
name: rs-seguranca-devs-iframe-sandbox
description: "Enforces iframe sandbox security patterns when embedding external or user-generated content. Use when user asks to 'embed iframe', 'load user content', 'sandbox iframe', 'restrict iframe', or 'show user HTML safely'. Applies sandbox attribute with granular allow-* permissions. Make sure to use this skill whenever iframes display untrusted or user-generated content. Not for same-origin trusted iframes, video embeds from YouTube/Vimeo, or CSP header configuration."
---

# Iframe Sandbox

> Ao incluir iframes com conteudo nao confiavel, sempre use o atributo `sandbox` para bloquear tudo por padrao e libere apenas o necessario.

## Rules

1. **Sempre adicione `sandbox` em iframes com conteudo de usuario** — sem valor, bloqueia tudo: JavaScript, popups, formularios, navegacao top-level, porque conteudo de usuario e imprevisivel por definicao
2. **Libere permissoes granularmente** — use `allow-scripts`, `allow-popups`, `allow-forms` individualmente, porque liberar tudo anula o proposito do sandbox
3. **Nunca combine `allow-scripts` com `allow-same-origin`** — juntos permitem que o iframe remova o proprio sandbox, porque o script pode acessar o DOM pai e modificar o atributo
4. **Prefira o minimo de permissoes** — comece com `sandbox` vazio e adicione apenas o que quebra a funcionalidade desejada, porque cada permissao e uma superficie de ataque

## How to write

### Iframe sandbox basico (bloqueia tudo)

```html
<!-- Conteudo gerado pelo usuario: bloqueia JS, popups, forms, tudo -->
<iframe src="/user-content/preview.html" sandbox></iframe>
```

### Liberando permissoes especificas

```html
<!-- Permite apenas popups -->
<iframe src="/preview.html" sandbox="allow-popups"></iframe>

<!-- Permite scripts e popups -->
<iframe src="/preview.html" sandbox="allow-scripts allow-popups"></iframe>

<!-- Permite scripts, popups e envio de formularios -->
<iframe src="/preview.html" sandbox="allow-scripts allow-popups allow-forms"></iframe>
```

## Example

**Before (iframe sem protecao):**
```html
<!-- Conteudo do usuario executa JS, abre popups, envia forms livremente -->
<iframe src="/user-content/page.html"></iframe>
```

**After (com sandbox aplicado):**
```html
<!-- Bloqueia tudo, libera apenas o necessario para preview -->
<iframe src="/user-content/page.html" sandbox="allow-scripts"></iframe>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Preview de HTML do usuario | `sandbox` sem valor (bloqueia tudo) |
| Widget de terceiro que precisa de JS | `sandbox="allow-scripts"` |
| Embed que abre links externos | `sandbox="allow-popups"` |
| Formulario embarcado de terceiro | `sandbox="allow-forms allow-scripts"` |
| Conteudo totalmente confiavel (mesmo dominio) | Avalie se sandbox e necessario |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<iframe src="/user-content.html">` (sem sandbox) | `<iframe src="/user-content.html" sandbox>` |
| `sandbox="allow-scripts allow-same-origin"` | `sandbox="allow-scripts"` (nunca combine os dois) |
| `sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-top-navigation"` | `sandbox="allow-scripts"` (libere apenas o necessario) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
