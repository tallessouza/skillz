---
name: rs-full-stack-componente-de-botao-parte-1
description: "Enforces reusable button component patterns with CSS custom properties and utility classes. Use when user asks to 'create a button component', 'style buttons', 'make reusable button styles', 'add hover effects', or 'build a component library'. Applies tag-agnostic reset, size variants via modifier classes, CSS custom properties for hover state swaps, and linear-gradient hover effects. Make sure to use this skill whenever creating button components or styling interactive elements with variants. Not for JavaScript button logic, form validation, or accessibility/ARIA patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, button, component, custom-properties, variants, hover]
---

# Componente de Botao com CSS

> Crie botoes tag-agnosticos usando classe base + modificadores de tamanho e estilo, com CSS custom properties para simplificar estados de hover.

## Rules

1. **Reset completo na classe base** — remova `border`, `background`, `color` e defina `cursor: pointer`, porque o componente pode ser `<a>`, `<button>`, `<span>` ou qualquer tag
2. **Use `width: fit-content`** — o botao deve se ajustar ao conteudo, nunca esticar ou encolher arbitrariamente
3. **Separe tamanho de estilo** — `.btn-small`, `.btn-md`, `.btn-large` controlam `font-size` e `padding`; `.btn-primary` controla cores, porque composicao de classes permite combinar livremente
4. **Use CSS custom properties locais para hover** — defina `--btn-bgcolor` e `--btn-color` no seletor base, e no `:hover` apenas redefina essas variaveis, porque evita repetir propriedades inteiras
5. **Referencie variaveis globais do design system** — use `var(--text-color-primary)`, `var(--bg-color)`, `var(--surface-color)` em vez de cores hardcoded, porque mantem consistencia com o tema
6. **Crie classes utilitarias conforme necessidade** — `.flex`, `.grid`, `.gap-1` sao validas quando usadas em mais de um lugar, porque reduzem repeticao sem over-engineering

## How to write

### Classe base (reset tag-agnostico)

```css
.btn {
  border: none;
  background: transparent;
  color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border-radius: 0.5rem;
  font-weight: var(--font-weight-md);
  font-size: var(--font-size-base);
  line-height: 1.5rem;
  font-family: var(--ff-sans);
  cursor: pointer;
}
```

### Variantes de tamanho

```css
.btn-small {
  font-size: var(--font-size-small);
  padding: 0.5rem 1rem;
}

.btn-md {
  font-size: var(--font-size-base);
  padding: 0.75rem 1.5rem;
}

.btn-large {
  font-size: 1.125rem;
  padding: 1rem 2rem;
}
```

### Variante primary com custom properties para hover

```css
.btn-primary {
  --btn-bgcolor: var(--text-color-primary);
  --btn-color: var(--bg-color);
  background: var(--btn-bgcolor);
  color: var(--btn-color);
}

.btn-primary:hover {
  --btn-bgcolor: linear-gradient(90deg, var(--bg-color-secondary) 0%, var(--bg-color-primary) 100%);
  --btn-color: var(--surface-color);
  background: var(--btn-bgcolor);
  color: var(--btn-color);
}
```

## Example

**Before (estilos acoplados a tag e sem variantes):**

```css
button {
  background: #7c3aed;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}

button:hover {
  background: linear-gradient(90deg, #6d28d9, #7c3aed);
  color: #f5f5f5;
}
```

**After (com este skill aplicado):**

```css
.btn {
  border: none;
  background: transparent;
  color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: var(--ff-sans);
  font-weight: var(--font-weight-md);
  line-height: 1.5rem;
}

.btn-md { font-size: var(--font-size-base); padding: 0.75rem 1.5rem; }

.btn-primary {
  --btn-bgcolor: var(--text-color-primary);
  --btn-color: var(--bg-color);
  background: var(--btn-bgcolor);
  color: var(--btn-color);
}

.btn-primary:hover {
  --btn-bgcolor: linear-gradient(90deg, var(--bg-color-secondary) 0%, var(--bg-color-primary) 100%);
  --btn-color: var(--surface-color);
}
```

```html
<!-- Funciona em qualquer tag -->
<a class="btn btn-primary btn-small" href="#">Label</a>
<button class="btn btn-primary btn-md">Label</button>
<span class="btn btn-primary btn-large">Label</span>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao pode ser `<a>`, `<button>` ou `<span>` | Use classe base com reset completo, nunca estilize a tag diretamente |
| Hover muda apenas cores | Defina custom properties `--btn-bgcolor` e `--btn-color`, redefina no `:hover` |
| Hover com degradê | Use `linear-gradient(90deg, cor1 0%, cor2 100%)` como valor da custom property |
| Tamanho usado apenas em um componente | Coloque valor direto (ex: `1.125rem`) em vez de criar variavel global |
| Tamanho usado em multiplos lugares | Crie variavel no design system global |
| Precisa de layout rapido para visualizar | Crie classes utilitarias `.flex`, `.grid`, `.gap-1` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `button { background: #7c3aed }` (tag selector) | `.btn-primary { background: var(--btn-bgcolor) }` |
| Repetir `background` e `color` no `:hover` | Redefinir `--btn-bgcolor` e `--btn-color` no `:hover` |
| `width: 200px` em botao | `width: fit-content` |
| Cores hardcoded no componente | `var(--text-color-primary)` do design system |
| Um unico `.btn` com todos os estilos | `.btn` (reset) + `.btn-primary` (cor) + `.btn-md` (tamanho) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Botao estica para largura total | Faltou `width: fit-content` na classe base | Adicione `width: fit-content` ao `.btn` |
| Hover nao muda as cores | Custom properties nao redefinidas no `:hover` | Redefina `--btn-bgcolor` e `--btn-color` no seletor `:hover` |
| Gradiente no hover nao aparece | `background` nao referencia a custom property | Use `background: var(--btn-bgcolor)` no seletor base e hover |
| Botao `<a>` nao aplica estilos de botao | Tag `<a>` tem estilos padrao diferentes | Use a classe `.btn` que faz reset completo de border, background e color |
| Variavel CSS `var(--*)` mostra valor raw | Variavel nao definida no `:root` ou escopo errado | Defina as variaveis no design system global (`:root`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tag-agnosticismo, custom properties para hover e decisoes de design
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes