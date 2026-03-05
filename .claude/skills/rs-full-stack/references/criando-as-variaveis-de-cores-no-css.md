---
name: rs-full-stack-variaveis-cores-css
description: "Enforces CSS custom properties setup for color systems when writing stylesheets. Use when user asks to 'create CSS variables', 'setup color tokens', 'configure design tokens', 'create a style guide in CSS', or 'setup global styles'. Applies rules: variables in :root, semantic naming from design system, global reset with asterisk selector, body applies base colors via var(). Make sure to use this skill whenever setting up a new project's color system or global CSS. Not for JavaScript theming, CSS-in-JS, or Tailwind configuration."
---

# Variáveis de Cores no CSS

> Definir todas as cores do projeto como CSS custom properties no :root, com nomes semânticos extraídos do Style Guide.

## Rules

1. **Declare variáveis no :root** — `--brand-color-light: #value`, porque :root tem a menor especificidade necessária e garante acesso global
2. **Nomeie pela função semântica** — `--text-color-primary` não `--dark-gray`, porque a função sobrevive a mudanças de tema
3. **Extraia nomes do Style Guide** — use exatamente os nomes do design system (Brand Color, Beige Color, Stroke Color, etc.), porque mantém alinhamento design-dev
4. **Reset global com asterisco** — `* { margin: 0; padding: 0; box-sizing: border-box; }`, porque remove inconsistências entre navegadores
5. **Aplique cores base no body** — `body { color: var(--text-color-primary); background-color: var(--beige-color); }`, porque estabelece o padrão herdável
6. **Valide cada valor hex** — confira caracteres no Figma/Style Guide, porque um caractere faltando gera cor errada silenciosamente

## How to write

### Reset global

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### Variáveis de cores

```css
:root {
  --brand-color: #E05A1A;
  --brand-color-light: #F4A261;
  --beige-color: #F5F0EB;
  --stroke-color: #E0D5C9;
  --text-color-primary: #1A1A1A;
  --text-color-secondary: #6B6B6B;
  --color-secondary: #2A9D8F;
}
```

### Aplicação no body

```css
body {
  color: var(--text-color-primary);
  background-color: var(--beige-color);
}
```

## Example

**Before (cores hardcoded):**
```css
body {
  color: #1A1A1A;
  background-color: #F5F0EB;
}

h1 {
  color: #E05A1A;
}

.card {
  border: 1px solid #E0D5C9;
  background: #F5F0EB;
}
```

**After (com variáveis):**
```css
:root {
  --brand-color: #E05A1A;
  --beige-color: #F5F0EB;
  --stroke-color: #E0D5C9;
  --text-color-primary: #1A1A1A;
}

body {
  color: var(--text-color-primary);
  background-color: var(--beige-color);
}

h1 {
  color: var(--brand-color);
}

.card {
  border: 1px solid var(--stroke-color);
  background: var(--beige-color);
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Style Guide tem nome "Brand Color" | Variável: `--brand-color` (kebab-case direto) |
| Cor aparece em 2+ lugares | Obrigatório extrair para variável |
| Cor usada uma única vez | Ainda assim crie variável se está no Style Guide |
| Asterisco não aplicou em tag específica | Especificidade do navegador venceu — aplique direto na tag |
| Hex parece errado visualmente | Confira no Figma clicando em Custom para ver o valor real |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `color: #1A1A1A` repetido | `color: var(--text-color-primary)` |
| `--gray-1, --gray-2, --gray-3` | `--text-color-primary, --stroke-color` (semântico) |
| Variáveis dentro de `.class {}` | Variáveis no `:root {}` |
| `--cor-do-botao-principal` | `--brand-color` (nome do Style Guide) |
| Reset sem `box-sizing: border-box` | Reset completo: margin + padding + box-sizing |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre especificidade, reset CSS e organização de variáveis
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-as-variaveis-de-cores-no-css/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-as-variaveis-de-cores-no-css/references/code-examples.md)
