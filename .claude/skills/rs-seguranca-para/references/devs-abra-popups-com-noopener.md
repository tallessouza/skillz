---
name: rs-seguranca-devs-noopener
description: "Enforces noopener parameter when opening pop-ups or windows with JavaScript window.open(). Use when user asks to 'open a popup', 'window.open', 'open new tab', 'open external link in JavaScript', or any code that calls window.open(). Applies noopener to prevent tab-nabbing attacks where the opened window gains access to the opener's location, document, and eval via the opener property. Make sure to use this skill whenever generating code that opens new browser windows or popups, even if security is not explicitly mentioned. Not for iframe sandboxing (use devs-iframe-atributo-sandbox), postMessage communication (use devs-web-messaging-api-html), or anchor tag rel=noopener."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: frontend-security
  tags: [security, window-open, noopener, tab-nabbing, popup, frontend, xss]
---

# Abra Pop-ups com noopener

> Sempre passe `noopener` no terceiro parametro de `window.open()` para eliminar a propriedade `opener` e prevenir tab-nabbing.

## Rules

1. **Sempre passe `noopener` em `window.open()`** — `window.open(url, '_blank', 'noopener')` nao `window.open(url)`, porque sem isso a janela aberta tem acesso total a janela original via `opener` (location, document, eval)
2. **So permita `opener` quando houver comunicacao deliberada** — se as janelas precisam trocar dados via `opener`, documente explicitamente o motivo, porque `opener` expoe location, variaveis e permite executar JavaScript na janela pai
3. **Combine `noopener` com outras propriedades normalmente** — `'noopener,width=600,height=400'` funciona perfeitamente, porque `noopener` e apenas mais uma propriedade do terceiro parametro
4. **Crie um wrapper seguro para window.open** — centralize a chamada numa funcao `safeOpen()` que injeta `noopener` automaticamente, porque elimina dependencia de memoria humana

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

### Wrapper generico seguro

```typescript
function safeOpen(
  url: string,
  target = '_blank',
  features = ''
): Window | null {
  const safeFeatures = features.includes('noopener')
    ? features
    : features
      ? `noopener,${features}`
      : 'noopener'

  return window.open(url, target, safeFeatures)
}

// Impossivel esquecer noopener:
safeOpen('https://external.com')
safeOpen('https://external.com', 'popup', 'width=800,height=600')
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
| Projeto novo com multiplos pop-ups | Criar wrapper `safeOpen()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `window.open(url)` | `window.open(url, '_blank', 'noopener')` |
| `window.open(url, '_blank')` | `window.open(url, '_blank', 'noopener')` |
| `window.open(url, 'popup', 'width=600')` | `window.open(url, 'popup', 'noopener,width=600')` |
| `open(url)` | `open(url, '_blank', 'noopener')` |

## Troubleshooting

### Pop-up aberta tem acesso a opener mesmo com noopener
**Symptom:** `opener` nao e `null` na janela aberta
**Cause:** O terceiro parametro nao foi passado, ou `noopener` foi escrito errado (maiusculas, espacos)
**Fix:** Verifique que `noopener` esta exatamente como string no terceiro parametro: `window.open(url, '_blank', 'noopener')`. Navegadores modernos corrigiram isso para links `<a>`, mas `window.open()` via JS ainda requer explicitamente.

### Navegador abre aba em vez de pop-up
**Symptom:** Ao passar `noopener` junto com dimensoes, abre como aba normal
**Cause:** Navegadores modernos bloqueiam pop-ups por padrao se nao forem acionados por interacao do usuario (click handler)
**Fix:** Garanta que `window.open()` e chamado dentro de um event handler de click do usuario, nao em timers ou callbacks asincronos.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-abra-popups-com-noopener/references/deep-explanation.md) — Raciocinio completo do instrutor sobre tab-nabbing, cenarios reais com CMS desatualizado, filosofia de paranoia em seguranca
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-abra-popups-com-noopener/references/code-examples.md) — Demonstracao ao vivo no console, wrapper safeOpen, ESLint detection
