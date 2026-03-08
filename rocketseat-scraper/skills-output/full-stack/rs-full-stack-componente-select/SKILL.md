---
name: rs-full-stack-componente-select
description: "Enforces reusable Select component creation patterns when building form selects in React with Tailwind CSS. Use when user asks to 'create a select', 'build a dropdown', 'customize select arrow', 'make a form component', or 'reuse input as select'. Applies rules: duplicate shared structure from Input, use children for options, add disabled hidden default option, customize native arrow with CSS appearance none plus background-image. Make sure to use this skill whenever creating styled select components or customizing native select appearance. Not for headless UI dropdowns, combobox/autocomplete, or state management."
---

# Componente Select

> Crie componentes Select reutilizáveis duplicando a estrutura de Input existente, usando children para opções e customizando a aparência nativa com CSS.

## Rules

1. **Duplique a partir do Input** — componentes Input e Select compartilham fieldset, legend e classes de estilização, porque reescrever do zero gera inconsistência visual
2. **Use children para opções** — passe `<option>` como filhos do componente, porque isso mantém o componente genérico e reutilizável
3. **Adicione opção padrão desabilitada e oculta** — inclua um `<option value="" disabled hidden>Selecione</option>` antes do children, porque isso guia o usuário sem poluir a lista de opções
4. **Resete a aparência nativa** — aplique `appearance: none` no select, porque isso remove a seta padrão do browser e dá controle total sobre o visual
5. **Use background-image para a seta** — defina a seta como background-image com URL do ícone SVG, porque isso é cross-browser e não requer elementos extras
6. **Remova props desnecessárias** — ao converter de Input para Select, remova `type` e defaults que não se aplicam, porque props irrelevantes geram confusão

## How to write

### Componente Select reutilizável

```tsx
function Select({ legend, children, ...rest }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm text-gray-300">{legend}</legend>
      <select
        className="bg-gray-800 text-gray-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
        {...rest}
      >
        <option value="" disabled hidden>
          Selecione
        </option>
        {children}
      </select>
    </fieldset>
  )
}
```

### Uso na página

```tsx
<Select legend="Categoria" required>
  <option value="food">Alimentação</option>
  <option value="transport">Transporte</option>
</Select>
```

### CSS para customizar a seta

```css
select {
  appearance: none;
  background-image: url("./assets/chevron-down.svg");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 1.25rem auto;
}
```

## Example

**Before (input copiado sem ajustes):**
```tsx
function Select({ legend, type = "text", ...rest }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <input type={type} {...rest} />
    </fieldset>
  )
}
```

**After (componente select funcional):**
```tsx
function Select({ legend, children, ...rest }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm text-gray-300">{legend}</legend>
      <select className="bg-gray-800 text-gray-100 rounded-md px-3 py-2" {...rest}>
        <option value="" disabled hidden>Selecione</option>
        {children}
      </select>
    </fieldset>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Componente compartilha 80%+ da estrutura com outro | Duplique e adapte, não reescreva |
| Select precisa de placeholder visual | Use `<option disabled hidden>` com value vazio |
| Seta nativa do browser não combina com o design | `appearance: none` + `background-image` com SVG |
| Opções são dinâmicas | Passe via `children`, não via prop array |
| Select precisa de validação required | Combine `required` com option padrão value="" |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `<input type="select">` | `<select>` com children |
| Hardcodar opções dentro do componente Select | Passar opções via `children` |
| Manter prop `type` do Input no Select | Remover props irrelevantes ao converter |
| Usar div+JS para simular dropdown | Usar `<select>` nativo com CSS customizado |
| Esconder seta com `select::-ms-expand` apenas | Usar `appearance: none` (cross-browser) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre reutilização de componentes, opção padrão e customização CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações