---
name: rs-tailwind-valores-arbitrarios
description: "Guards against Tailwind CSS arbitrary values and enforces theme extension instead. Use when user writes Tailwind classes with brackets like 'bg-[#hex]', 'max-w-[700px]', 'text-[14px]', or asks to 'add a custom value', 'use a specific color', 'set exact width'. Make sure to use this skill whenever reviewing or generating Tailwind CSS code that contains square bracket notation. Not for vanilla CSS, inline styles, or CSS-in-JS solutions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: tailwind-css
  tags: [tailwind]
---

# Valores Arbitrários no Tailwind

> Evite valores arbitrários — estenda o tema no tailwind.config para manter padrões consistentes no projeto.

## Rules

1. **Nunca use valores arbitrários para cores** — `bg-[#825760]` quebra o design system, porque cores fora do tema são impossíveis de manter consistentes e não aparecem no autocomplete
2. **Nunca use valores arbitrários para spacing/sizing recorrente** — se um `max-w-[700px]` aparece mais de uma vez, é um padrão não documentado
3. **Estenda o tema ao invés de usar colchetes** — adicione valores custom em `tailwind.config` com nomes semânticos, porque isso cria um vocabulário compartilhado do projeto
4. **Nomeie extensões pelo propósito, não pelo valor** — `max-w-app` não `max-w-700`, porque o valor pode mudar mas o propósito permanece
5. **Valores arbitrários são aceitáveis apenas para one-offs verdadeiros** — um valor usado uma única vez em todo o projeto, sem chance de reuso, pode usar colchetes como último recurso

## How to write

### Estendendo o tema (correto)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      maxWidth: {
        app: '700px',
      },
      colors: {
        brand: '#825760',
      },
    },
  },
}
```

```html
<!-- Uso com nome semântico -->
<div class="max-w-app">...</div>
<button class="bg-brand">...</button>
```

## Example

**Before (valores arbitrários espalhados):**
```html
<div class="max-w-[700px] bg-[#825760] p-[13px] text-[#1a1a2e]">
  <button class="bg-[blue] rounded-[7px]">Click</button>
</div>
```

**After (tema estendido):**
```html
<div class="max-w-app bg-brand p-3.5 text-foreground">
  <button class="bg-primary rounded-lg">Click</button>
</div>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cor custom necessária | Adicione em `theme.extend.colors` com nome semântico |
| Width/height específico recorrente | Adicione em `theme.extend` com nome descritivo |
| Valor usado 1 única vez em todo projeto | Valor arbitrário aceitável como exceção |
| Designer mandou valor fora do tema | Pergunte se pode mapear para token existente antes de criar novo |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `bg-[#825760]` | `bg-brand` (após estender tema) |
| `max-w-[700px]` em múltiplos lugares | `max-w-app` (após estender tema) |
| `text-[14px]` | `text-sm` ou estenda `fontSize` |
| `p-[13px]` | `p-3` ou `p-3.5` (valor mais próximo do tema) |
| `rounded-[7px]` | `rounded-lg` (valor mais próximo do tema) |
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

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-valores-arbitrarios/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-valores-arbitrarios/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
