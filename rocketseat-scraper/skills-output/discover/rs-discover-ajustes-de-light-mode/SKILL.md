---
name: rs-discover-ajustes-de-light-mode
description: "Applies CSS custom properties for light/dark mode theming when writing CSS code. Use when user asks to 'create dark mode', 'add light mode', 'theme switching', 'CSS variables for colors', or 'mode toggle styling'. Enforces semantic variable naming (stroke-color, surface-color, highlight-color) and hover state variables. Make sure to use this skill whenever generating CSS that involves color theming or mode switching. Not for JavaScript toggle logic, image swapping, or animation."
---

# Ajustes de Light Mode com CSS Variables

> Defina todas as cores do layout como CSS custom properties semanticas, agrupando variantes por modo (claro/escuro) e estado (default/hover).

## Rules

1. **Nunca use cores hardcoded em seletores** — use `var(--nome-semantico)` porque trocar de modo exige apenas redefinir variaveis, nao reescrever regras
2. **Nomeie variaveis pelo papel, nao pela cor** — `--stroke-color` nao `--border-white`, porque o valor muda entre modos mas o papel permanece
3. **Copie nomes do design original** — se o Figma diz `surface-color`, use `--surface-color`, porque facilita rastrear de volta ao design
4. **Crie variavel separada para hover** — `--surface-color-hover` ao lado de `--surface-color`, porque estados interativos frequentemente tem cores distintas por modo
5. **Agrupe variaveis de modo no seletor correto** — `:root` para dark (default), `.light-mode` ou `[data-theme="light"]` para light, porque evita cascata confusa
6. **Imagens nao se resolvem com CSS** — troca de imagem entre modos requer JavaScript, nao tente resolver com `background-image` em variavel

## How to write

### Declaracao de variaveis por modo

```css
:root {
  --text-color: rgba(255, 255, 255, 1);
  --stroke-color: rgba(255, 255, 255, 0.5);
  --surface-color: rgba(0, 0, 0, 0.1);
  --surface-color-hover: rgba(0, 0, 0, 0.3);
  --highlight-color: rgba(255, 255, 255, 0.2);
}

.light-mode {
  --text-color: rgba(0, 0, 0, 1);
  --stroke-color: rgba(0, 0, 0, 0.5);
  --surface-color: rgba(255, 255, 255, 0.1);
  --surface-color-hover: rgba(255, 255, 255, 0.9);
  --highlight-color: rgba(0, 0, 0, 0.2);
}
```

### Consumo nos componentes

```css
.button {
  border: 1px solid var(--stroke-color);
  background: var(--surface-color);
  color: var(--text-color);
}

.button:hover {
  background: var(--surface-color-hover);
}

.social-link:hover {
  color: var(--highlight-color);
}
```

## Example

**Before (cores hardcoded, impossivel trocar modo):**
```css
.button {
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.1);
}
.button:hover {
  background: rgba(0, 0, 0, 0.3);
}
```

**After (variaveis semanticas, modo trocavel):**
```css
:root {
  --stroke-color: rgba(255, 255, 255, 0.5);
  --surface-color: rgba(0, 0, 0, 0.1);
  --surface-color-hover: rgba(0, 0, 0, 0.3);
}
.light-mode {
  --stroke-color: rgba(0, 0, 0, 0.5);
  --surface-color: rgba(255, 255, 255, 0.1);
  --surface-color-hover: rgba(255, 255, 255, 0.9);
}
.button {
  border: 1px solid var(--stroke-color);
  background: var(--surface-color);
}
.button:hover {
  background: var(--surface-color-hover);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Cor aparece em border | Variavel `--stroke-color` |
| Cor aparece em background de container | Variavel `--surface-color` |
| Cor muda no hover | Crie variavel separada com sufixo `-hover` |
| Cor destaca elemento interativo | Variavel `--highlight-color` |
| Imagem muda entre modos | Deixe para JavaScript, nao CSS |
| Nomes ja existem no design/Figma | Copie exatamente, nao invente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `border: 1px solid white` | `border: 1px solid var(--stroke-color)` |
| `--border-white: white` | `--stroke-color: rgba(255,255,255,1)` |
| `background: rgba(0,0,0,0.1)` (direto no componente) | `background: var(--surface-color)` |
| `.button:hover { background: black }` | `.button:hover { background: var(--surface-color-hover) }` |
| Criar nomes novos quando o design ja tem | Copiar os nomes do design original |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre naming, inversao de cores entre modos, e separacao HTML/CSS/JS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes