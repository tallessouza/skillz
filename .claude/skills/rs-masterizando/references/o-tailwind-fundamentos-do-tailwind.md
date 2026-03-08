---
name: rs-tailwind-fundamentos
description: "Applies Tailwind CSS utility-first fundamentals when writing HTML/JSX markup. Use when user asks to 'style a component', 'add CSS classes', 'create a card', 'build a layout with Tailwind', or any frontend styling task. Enforces declarative interface patterns: utilities over custom classes, composition over inheritance, inline utility classes over separate CSS files. Make sure to use this skill whenever generating Tailwind markup or discussing CSS architecture decisions. Not for CSS-in-JS libraries, vanilla CSS methodology debates, or Tailwind configuration/theme setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: tailwind-css
  tags: [tailwind, react]
---

# Fundamentos do Tailwind CSS

> Estilize componentes com classes utilitarias compostas diretamente no markup, eliminando a necessidade de inventar nomes de classes e navegar entre arquivos.

## Rules

1. **Use utilities ao inves de classes customizadas** — `w-48 bg-white border-gray-300` nao `.card`, porque cada variacao exigiria uma nova classe (.card-shadow, .card-rounded, .card-rounded-sm) criando uma explosao combinatoria
2. **Compose variacoes adicionando classes** — para um card com sombra, adicione `shadow-md` ao markup existente ao inves de criar `.card-shadow` no CSS, porque o atrito para diferenciar elementos cai a praticamente zero
3. **Mantenha estilizacao proxima da estrutura** — interface declarativa significa que estrutura HTML e visual caminham juntos, como Flutter (VStack/HStack) e SwiftUI fazem no mobile
4. **Nao tema muitas classes no HTML** — markup verboso com utilities nao e um problema quando se usa componentizacao (React, Vue, Svelte) e ferramentas como @apply para casos extremos
5. **Prefira o design system do Tailwind** — use os valores do theme (w-48, text-sm, rounded-lg) ao inves de valores arbitrarios, porque o Theme First API garante consistencia mesmo em times com pouca experiencia em CSS
6. **Elimine o ciclo "pensar nome → navegar ao CSS → verificar duplicata"** — utilities removem completamente esse fluxo que desperdicava tempo e criava CSS esquecido

## How to write

### Card com utilities (ao inves de classe .card)

```html
<!-- Cada classe = uma propriedade CSS. Variacoes = adicionar/remover classes -->
<div class="w-48 bg-white border border-gray-300 rounded-lg p-4">
  <h3 class="text-lg font-semibold text-gray-900">Titulo</h3>
  <p class="text-sm text-gray-600">Descricao do card</p>
</div>
```

### Variacao com sombra (zero atrito)

```html
<!-- Mesmo card, agora com sombra: apenas adicionei shadow-md -->
<div class="w-48 bg-white border border-gray-300 rounded-lg p-4 shadow-md">
  <h3 class="text-lg font-semibold text-gray-900">Titulo</h3>
  <p class="text-sm text-gray-600">Descricao do card com sombra</p>
</div>
```

## Example

**Before (CSS tradicional com explosao de classes):**

```html
<div class="card card-shadow card-rounded card-rounded-sm">...</div>
```
```css
.card { width: 200px; background: white; border: 1px solid grey; }
.card-shadow { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.card-rounded { border-radius: 8px; }
.card-rounded-sm { border-radius: 4px; }
```

**After (Tailwind — utilities compostas):**

```html
<div class="w-48 bg-white border border-gray-300 shadow-sm rounded">...</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento repetido em varias telas | Extraia para componente (React/Vue), nao para classe CSS |
| Variacao pequena de um elemento existente | Adicione/remova classes utilitarias no markup |
| Time com pouca experiencia em CSS | Use Tailwind — Theme First API garante padroes desde o dia zero |
| HTML ficando muito verboso | Componentize no framework JS, use @apply apenas como ultimo recurso |
| Tentado a criar .card no CSS | Pare — compose com utilities direto no markup |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `.card { width: 200px; background: white; }` | `class="w-48 bg-white"` |
| `.card-shadow` para uma unica variacao | Adicione `shadow-md` ao markup |
| `.card-rounded-sm` para arredondamento menor | Troque `rounded-lg` por `rounded` no markup |
| Navegar ao CSS para verificar se classe ja existe | Compose utilities — nao ha nome para duplicar |
| Criar metodologia BEM/SMACSS com Tailwind | Deixe o Tailwind ser utility-first como projetado |
## Troubleshooting

### Classes Tailwind nao aplicam
**Symptom:** Classe adicionada mas sem efeito visual.
**Cause:** O arquivo nao esta incluido no `content` do tailwind.config, ou a classe esta sendo sobrescrita por especificidade.
**Fix:** Verifique que o path do arquivo esta em `content: ['./src/**/*.tsx']` no tailwind.config. Use DevTools para inspecionar se outra classe sobrescreve.

### Autocomplete do Tailwind nao funciona
**Symptom:** VS Code nao sugere classes Tailwind.
**Cause:** Extensao Tailwind CSS IntelliSense nao instalada ou configurada.
**Fix:** Instale a extensao "Tailwind CSS IntelliSense" no VS Code e recarregue a janela.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-fundamentos-do-tailwind/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-fundamentos-do-tailwind/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
