---
name: rs-angular-utilizando-o-root
description: "Enforces correct usage of CSS :root and :host pseudo-classes for design tokens in Angular applications. Use when user asks to 'create CSS variables', 'define design tokens', 'theme an Angular app', 'use Shadow DOM styling', or 'set up a design system'. Applies rules: :root only in styles.css, :host for Shadow DOM scoped variables, var() for consumption. Make sure to use this skill whenever creating or organizing CSS custom properties in Angular projects. Not for component-specific styling, CSS layout, or non-Angular web projects."
---

# Utilizando o :root e :host no Angular

> Defina variáveis CSS no :root (styles.css) para toda a aplicação e no :host para escopo Shadow DOM — nunca declare :root dentro de componentes.

## Rules

1. **Declare :root apenas no styles.css global** — nunca dentro de arquivos CSS de componentes, porque variáveis declaradas em componentes não funcionam como globais no Angular
2. **Use :root para design tokens globais** — `--primary-color`, `--secondary-color`, `--font-size-base`, porque qualquer componente (incluindo Shadow DOM) consegue acessar essas variáveis
3. **Use :host para variáveis de escopo Shadow DOM** — variáveis declaradas no :host ficam disponíveis para todos os filhos dentro daquele Shadow DOM, porque o encapsulamento impede que vazem para fora
4. **Consuma variáveis com var()** — `color: var(--primary-color)`, porque é o mecanismo padrão CSS para referenciar custom properties
5. **Variáveis do Shadow DOM não saem para fora** — se declarar `--shadow-color` no :host de um Shadow DOM, componentes externos não conseguem acessá-la, porque o encapsulamento é unidirecional (fora → dentro funciona, dentro → fora não)

## How to write

### Design tokens globais (styles.css)

```css
/* styles.css — ÚNICO local para :root no Angular */
:root {
  --primary-color: orange;
  --secondary-color: gray;
  --font-size-base: 16px;
}
```

### Consumindo em componente Emulated

```css
/* qualquer-componente.component.css */
p {
  color: var(--primary-color);
}
```

### Consumindo em componente Shadow DOM

```css
/* shadow-component.component.css */
p {
  color: var(--secondary-color);
}
```

### Variáveis escopadas no Shadow DOM via :host

```css
/* shadow-host.component.css */
:host {
  --shadow-color: blue;
}
```

```css
/* child dentro do Shadow DOM */
p {
  color: var(--shadow-color);
}
```

## Example

**Before (variáveis declaradas no lugar errado):**

```css
/* some-component.component.css — ERRADO */
:root {
  --primary-color: orange;
}
p {
  color: var(--primary-color);
}
```

**After (variáveis no styles.css global):**

```css
/* styles.css */
:root {
  --primary-color: orange;
}
```

```css
/* some-component.component.css */
p {
  color: var(--primary-color);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Token usado em múltiplos componentes | Declare no :root (styles.css) |
| Token usado apenas dentro de um Shadow DOM | Declare no :host do Shadow DOM pai |
| Componente Emulated precisa de variável | Acesse via var() — :root já é visível |
| Componente Shadow DOM precisa de variável global | Acesse via var() — :root penetra Shadow DOM |
| Quer isolar variáveis dentro de um Shadow DOM | Use :host, não :root |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Declarar `:root` dentro de `*.component.css` | Declarar `:root` apenas no `styles.css` |
| Esperar que variável do `:host` seja acessível fora do Shadow DOM | Usar `:root` no `styles.css` para variáveis globais |
| Hardcodar cores repetidas em cada componente | Criar variáveis no `:root` e consumir com `var()` |
| Misturar design tokens e estilos de componente no `styles.css` | Manter apenas `:root` com tokens no `styles.css` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
