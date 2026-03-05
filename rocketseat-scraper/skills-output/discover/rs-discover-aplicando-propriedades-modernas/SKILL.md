---
name: rs-discover-aplicando-propriedades-modernas
description: "Applies modern CSS properties including Flexbox layout, RGBA colors, border-radius, and backdrop-filter when writing CSS code. Use when user asks to 'style a button', 'add flexbox', 'create a layout', 'add transparency', or 'blur effect in CSS'. Enforces correct flex-direction with gap, RGBA transparency values, and vendor prefixes for backdrop-filter. Make sure to use this skill whenever generating CSS that involves flexible layouts, color transparency, or visual filters. Not for JavaScript logic, backend code, or CSS preprocessor configuration."
---

# Propriedades Modernas do CSS

> Ao escrever CSS moderno, use Flexbox para layout, RGBA para transparencia, e verifique compatibilidade de propriedades experimentais com caniuse.com antes de usar.

## Rules

1. **Use `display: flex` no pai para habilitar propriedades flex nos filhos** — propriedades como `gap`, `flex-direction`, `align-items` so funcionam se o container pai tiver `display: flex`, porque sem flex declarado essas propriedades sao ignoradas silenciosamente
2. **Use `gap` em vez de margin para espacamento entre filhos flex** — `gap` da espaco ENTRE elementos sem adicionar espaco antes do primeiro ou depois do ultimo, porque evita hacks com `:last-child` e margin negativa
3. **Escreva RGBA com Alpha entre 0 e 1** — `rgba(255, 255, 255, 0.1)` nao `rgba(255, 255, 255, 10%)`, porque o canal Alpha vai de 0 (totalmente transparente) a 1 (totalmente opaco)
4. **Adicione vendor prefix `-webkit-` para `backdrop-filter`** — porque Safari requer o prefix para funcionar, e sem ele o efeito simplesmente nao aparece
5. **Verifique compatibilidade em caniuse.com antes de usar propriedades experimentais** — porque cada browser tem versoes minimas diferentes e algumas propriedades precisam de prefixos especificos

## How to write

### Flexbox com gap para lista vertical

```css
/* Container pai recebe flex + direction + gap */
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
/* Filhos se alinham automaticamente com espaco uniforme */
```

### RGBA para transparencia

```css
/* Branco com 10% de opacidade */
.button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### Backdrop-filter com vendor prefix

```css
.button {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px); /* Safari */
  border-radius: 8px;
}
```

## Example

**Before (sem propriedades modernas):**

```css
.list li {
  margin-bottom: 16px;
}
.list li:last-child {
  margin-bottom: 0;
}
.button {
  background: white;
  border: 1px solid gray;
}
```

**After (com propriedades modernas):**

```css
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Espacamento uniforme entre filhos | `display: flex` + `gap` no pai |
| Lista vertical com espacamento | `flex-direction: column` + `gap` |
| Cor com transparencia | `rgba(R, G, B, alpha)` com alpha 0-1 |
| Efeito de vidro/blur no fundo | `backdrop-filter: blur()` + `-webkit-backdrop-filter` |
| Propriedade CSS nova/experimental | Verificar caniuse.com antes |
| Borda arredondada | `border-radius` em pixels |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `margin-bottom` em cada filho + reset no ultimo | `gap` no container flex |
| `opacity: 0.1` no elemento inteiro | `rgba()` so no background |
| `backdrop-filter` sem `-webkit-` prefix | Ambas as declaracoes juntas |
| `background: white` quando precisa de transparencia | `background: rgba(255, 255, 255, 0.1)` |
| Propriedades flex em elemento sem `display: flex` | Declarar `display: flex` no pai primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre RGBA, Flexbox e compatibilidade de browsers
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes