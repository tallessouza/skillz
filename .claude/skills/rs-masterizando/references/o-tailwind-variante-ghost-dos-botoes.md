---
name: rs-tailwind-variante-ghost-botoes
description: "Applies ghost button variant pattern when building button components with Tailwind CSS. Use when user asks to 'create a button variant', 'add ghost button', 'make a minimal button', 'style icon buttons', or 'create subtle buttons'. Enforces reduced padding, less rounding, no background, no shadow, hover with subtle bg. Make sure to use this skill whenever creating minimal or tertiary button styles in Tailwind. Not for primary/outline button variants, form inputs, or link styling."
---

# Variante Ghost dos Botoes

> Botoes ghost sao botoes terciarios: sem borda, sem fundo, sem shadow — apenas o conteudo com hover sutil.

## Rules

1. **Use rounded-md ao inves de rounded-full** — ghost buttons sao menos arredondados que botoes primarios, porque precisam parecer mais discretos e integrados ao layout
2. **Padding X igual ao Padding Y** — `px` e `py` iguais (ou px menor), porque ghost buttons sao compactos e proporcionais
3. **Sem shadow** — `shadow-none` obrigatorio, porque sem borda e sem background o shadow fica visualmente estranho e deslocado
4. **Hover com background sutil** — `hover:bg-zinc-50` (ou equivalente no tema), porque o unico feedback visual e a mudanca de fundo no hover
5. **Sem cor de fundo no estado default** — background transparente, porque o ghost button deve se misturar ao layout
6. **Mantenha focus ring** — focus visible deve funcionar normalmente para acessibilidade

## How to write

### Variante ghost no componente Button

```typescript
// Dentro das variants do componente Button (ex: tailwind-variants ou cva)
ghost: [
  'rounded-md',
  'px-2 py-2',        // padding compacto e igual
  'shadow-none',
  'hover:bg-zinc-50',
  'dark:hover:bg-zinc-800',
].join(' '),
```

### Uso do ghost button

```tsx
// Botoes de acao sutil: logout, icones de toolbar, delete em listas
<Button variant="ghost">
  <Trash2 className="h-4 w-4" />
</Button>

// Botoes de formatacao em toolbar (bold, italic, etc)
<Button variant="ghost">
  <Bold className="h-4 w-4" />
</Button>
```

## Example

**Before (botao com classes inline):**
```tsx
<button className="p-2 rounded-md hover:bg-zinc-50">
  <LogOut className="h-4 w-4" />
</button>
```

**After (com variante ghost do componente):**
```tsx
<Button variant="ghost">
  <LogOut className="h-4 w-4" />
</Button>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Botao de icone em toolbar (bold, italic, underline) | Use ghost |
| Botao de acao destrutiva sutil (trash em lista) | Use ghost |
| Botao de logout/configuracao secundaria | Use ghost |
| Botao que precisa chamar atencao | NAO use ghost, use primary/outline |
| Botao com borda visivel | NAO use ghost, use outline |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Ghost button com `shadow-sm` | `shadow-none` sempre |
| Ghost com `rounded-full` | `rounded-md` para visual discreto |
| Ghost com `bg-zinc-100` no default | Background transparente, so bg no hover |
| Repetir classes ghost inline em cada botao | Criar variante no componente e usar `variant="ghost"` |
| Ghost com padding grande (`px-6 py-3`) | Padding compacto e proporcional (`px-2 py-2`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-variante-ghost-dos-botoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-variante-ghost-dos-botoes/references/code-examples.md)
