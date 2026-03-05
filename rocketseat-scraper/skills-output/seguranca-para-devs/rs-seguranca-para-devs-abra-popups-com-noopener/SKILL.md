---
name: rs-seguranca-devs-noopener
description: "Enforces noopener parameter when opening pop-ups or windows with JavaScript. Use when user asks to 'open a popup', 'window.open', 'open new tab', 'open external link', or any code that calls window.open(). Applies noopener to prevent tab-nabbing attacks via the opener property. Make sure to use this skill whenever generating code that opens new windows or popups, even if security isn't mentioned. Not for iframe sandboxing, postMessage communication, or anchor tag target=_blank."
---

# Abra Pop-ups com noopener

> Sempre passe `noopener` no terceiro parametro de `window.open()` para eliminar a propriedade `opener` e prevenir tab-nabbing.

## Rules

1. **Sempre passe `noopener` em `window.open()`** — `window.open(url, '_blank', 'noopener')` nao `window.open(url)`, porque sem isso a janela aberta tem acesso total a janela original via `opener`
2. **So permita `opener` quando houver comunicacao deliberada** — se as janelas precisam trocar dados via `opener`, documente explicitamente o motivo, porque `opener` expoe location, variaveis e permite executar JavaScript na janela pai
3. **Combine `noopener` com outras propriedades normalmente** — `'noopener,width=600,height=400'` funciona perfeitamente, porque `noopener` e apenas mais uma propriedade do terceiro parametro

## How to write

### Pop-up basico seguro

```typescript
// Sempre inclua noopener no terceiro parametro
window.open('https://support.example.com', '_blank', 'noopener')
```

### Pop-up com dimensoes

```typescript
// noopener combina com outras propriedades separadas por virgula
window.open(
  'https://help.example.com/chat',
  'support',
  'noopener,width=600,height=400'
)
```

### Link externo via JavaScript

```typescript
function openExternalLink(url: string) {
  window.open(url, '_blank', 'noopener')
}
```

## Example

**Before (vulneravel a tab-nabbing):**

```typescript
// A janela aberta tem acesso a opener.location, opener.document, etc.
window.open('https://third-party.com/widget')

// Atacante na pagina aberta pode fazer:
// opener.location.href = 'https://phishing-site.com/fake-login'
// opener.eval('malicious code')
```

**After (com noopener):**

```typescript
// opener sera null na janela aberta — sem acesso a janela pai
window.open('https://third-party.com/widget', '_blank', 'noopener')
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Abrindo servico de terceiro (chat, help desk) | Sempre `noopener` |
| Abrindo pagina institucional (FAQ, termos) | Sempre `noopener` |
| Pop-up que precisa comunicar com janela pai | Usar `opener` mas documentar o motivo |
| Qualquer `window.open()` sem necessidade explicita de `opener` | Sempre `noopener` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `window.open(url)` | `window.open(url, '_blank', 'noopener')` |
| `window.open(url, '_blank')` | `window.open(url, '_blank', 'noopener')` |
| `window.open(url, 'popup', 'width=600')` | `window.open(url, 'popup', 'noopener,width=600')` |
| `open(url)` | `open(url, '_blank', 'noopener')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
