---
name: rs-acessibilidade-react-contraste
description: "Enforces WCAG color contrast requirements when styling web pages with CSS or React. Use when user asks to 'style a page', 'fix contrast', 'add colors', 'create a component with text', or 'improve accessibility'. Applies minimum 4.5:1 contrast ratio for normal text, 3:1 for large text, global color declarations in CSS, and per-element contrast fixes. Make sure to use this skill whenever choosing text or background colors. Not for semantic HTML, ARIA attributes, or keyboard navigation."
---

# Contraste de Cores — Acessibilidade WCAG

> Toda combinacao de texto e fundo deve atingir contraste minimo de 4.5:1 para texto normal e 3:1 para texto grande, verificavel pelo DevTools do navegador.

## Rules

1. **Defina cor de texto globalmente** — no `global.css` ou equivalente, porque evita que elementos herdem cores de baixo contraste do user-agent
2. **Contraste minimo 4.5:1 para texto normal** — esse e o nivel AA da WCAG, o minimo aceitavel para leitura
3. **Contraste minimo 3:1 para texto grande** — textos acima de 18pt (ou 14pt bold) tem requisito menor porque sao mais legiveis
4. **Inspecione com DevTools** — o Chrome mostra o ratio de contraste ao inspecionar um elemento de texto, use isso para validar antes de commitar
5. **Ajuste texto OU fundo, ou ambos** — voce tem tres estrategias: escurecer o fundo, clarear o texto, ou ajustar os dois simultaneamente
6. **Nunca escolha cor apenas por estetica** — toda cor de texto precisa ser validada contra seu fundo real

## How to write

### Cor global de texto

```css
/* global.css */
body {
  color: #a8a8b3; /* contraste 7.94:1 contra fundo escuro — nivel AAA */
  background: #121214;
}
```

### Corrigindo elemento especifico com baixo contraste

```css
/* Quando um link/botao tem contraste insuficiente contra seu fundo */
.footer a {
  color: #996dff; /* roxo mais claro — contraste 4.62:1, passa nivel AA */
  background: #202024;
  padding: 1rem 2rem;
  border-radius: 5px;
}
```

## Example

**Before (contraste 2.5:1 — FALHA):**
```css
body {
  /* sem cor definida, herda cinza claro do browser */
}
.home p {
  color: #555; /* cinza medio contra fundo escuro — contraste insuficiente */
}
```

**After (contraste 7.94:1 — PASSA):**
```css
/* global.css — define cor uma vez para toda a pagina */
body {
  color: #a8a8b3;
  background: #121214;
}
/* Remove color duplicada dos modulos */
/* home.module.css — color: #555 removido */
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Texto claro em fundo escuro | Verificar ratio >= 4.5:1 no DevTools |
| Texto grande (titulos h1-h3) | Ratio minimo 3:1 e suficiente |
| Link com baixo contraste | Clarear a cor do texto OU escurecer o fundo |
| Multiplos elementos com mesmo problema | Resolver globalmente no body/root, nao elemento por elemento |
| Designer entregou cor que nao passa | Ajustar tom mais claro/escuro mantendo a matiz, negociar com design |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Ignorar warnings de contraste no DevTools | Corrigir ate ratio >= 4.5:1 |
| Definir cor por elemento quando todos usam a mesma | Definir uma vez no `body` ou `global.css` |
| Escolher cor "bonita" sem verificar contraste | Verificar no DevTools antes de commitar |
| Usar `color: #555` em fundo escuro | Usar cor com contraste validado como `#a8a8b3` |
| Remover background como "fix" sem verificar resultado | Testar o ratio resultante apos qualquer mudanca |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
