---
name: rs-tailwind-campos-do-formulario
description: "Applies Tailwind CSS Grid layout patterns when building form sections with labels, inputs, and responsive columns. Use when user asks to 'create a form', 'build form fields', 'layout form with grid', 'add form inputs with labels', or 'responsive form layout'. Enforces minmax grid columns, divide-y separators, and proper label-input alignment. Make sure to use this skill whenever building multi-field forms with Tailwind. Not for form validation, submission logic, or non-Tailwind styling."
---

# Campos do Formulário com Tailwind CSS Grid

> Organize formulários com CSS Grid usando minmax para colunas responsivas, divide-y para separadores, e estrutura consistente label-input.

## Rules

1. **Use CSS Grid para layout de formulário, não Flexbox** — `grid` com `grid-template-columns` usando `minmax()` permite que label, input e espaço vazio se adaptem responsivamente sem media queries
2. **Defina colunas com minmax para responsividade fluida** — a coluna da label tem tamanho mínimo e máximo fixo, a coluna do input usa `1fr` como máximo, e a coluna vazia pode colapsar para zero
3. **Use divide-y ao invés de divs separadoras** — Tailwind oferece `divide-y` que automaticamente coloca bordas entre elementos filhos, eliminando divs vazias para linhas
4. **Adicione padding-top nos itens após o primeiro** — quando usar `divide-y`, o segundo item em diante precisa de `pt-5` para distanciar da linha divisória
5. **Labels com descrição usam bloco separado** — quando a label tem texto auxiliar embaixo, use `<span>` com `block` e `mt-0.5` para quebrar linha e espaçar

## How to write

### Grid template para formulário

```tsx
// Defina um grid customizado no tailwind.config com 3 colunas minmax
// tailwind.config.ts
gridTemplateColumns: {
  form: 'minmax(7.5rem, 17.5rem) minmax(25rem, 1fr) minmax(0, 15rem)',
}

// Uso no formulário
<form className="mt-6 flex flex-col gap-5 divide-y divide-zinc-200">
  <div className="grid grid-cols-form gap-3">
    <label htmlFor="firstName" className="text-sm font-medium text-zinc-700">
      Name
    </label>
    <div className="grid grid-cols-2 gap-6">
      <Input.Root>
        <Input.Control id="firstName" defaultValue="Diego" />
      </Input.Root>
      <Input.Root>
        <Input.Control id="lastName" defaultValue="Fernandes" />
      </Input.Root>
    </div>
  </div>
</form>
```

### Campo com ícone e padding-top

```tsx
<div className="grid grid-cols-form gap-3 pt-5">
  <label htmlFor="email" className="text-sm font-medium text-zinc-700">
    Email Address
  </label>
  <Input.Root>
    <Input.Prefix>
      <Mail className="h-5 w-5 text-zinc-500" />
    </Input.Prefix>
    <Input.Control id="email" type="email" defaultValue="user@example.com" />
  </Input.Root>
</div>
```

### Label com descrição auxiliar

```tsx
<div className="grid grid-cols-form gap-3 pt-5">
  <label htmlFor="bio" className="text-sm font-medium text-zinc-700">
    Bio
    <span className="mt-0.5 block text-sm font-normal text-zinc-500">
      Write a short introduction.
    </span>
  </label>
  {/* Componente do input vai aqui */}
</div>
```

## Example

**Before (divs manuais como separadores):**
```tsx
<form className="flex flex-col gap-5">
  <div className="flex items-center gap-4">
    <label className="w-40">Name</label>
    <input className="flex-1" />
  </div>
  <div className="h-px w-full bg-zinc-300" />
  <div className="flex items-center gap-4">
    <label className="w-40">Email</label>
    <input className="flex-1" />
  </div>
</form>
```

**After (com Grid + divide-y):**
```tsx
<form className="flex flex-col gap-5 divide-y divide-zinc-200">
  <div className="grid grid-cols-form gap-3">
    <label htmlFor="name" className="text-sm font-medium text-zinc-700">Name</label>
    <div className="grid grid-cols-2 gap-6">
      <Input.Root><Input.Control id="name" defaultValue="Diego" /></Input.Root>
      <Input.Root><Input.Control defaultValue="Fernandes" /></Input.Root>
    </div>
  </div>
  <div className="grid grid-cols-form gap-3 pt-5">
    <label htmlFor="email" className="text-sm font-medium text-zinc-700">Email</label>
    <Input.Root>
      <Input.Prefix><Mail className="h-5 w-5 text-zinc-500" /></Input.Prefix>
      <Input.Control id="email" type="email" />
    </Input.Root>
  </div>
</form>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input único na linha | Não precisa de div wrapper, coloque direto no grid |
| Dois inputs lado a lado (ex: first/last name) | Wrapper div com `grid grid-cols-2 gap-6` |
| Campo ainda não implementado (select, upload) | Deixe div vazia como placeholder, construa incrementalmente |
| Botões de ação no final do form | `div` com `flex items-center justify-end gap-2 pt-5` |
| Terceira coluna do grid não usada | Não precisa de div vazia, grid cuida automaticamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div className="h-px bg-zinc-300" />` entre items | `divide-y divide-zinc-200` no container pai |
| `<label className="w-40">` com width fixo | `grid-cols-form` com `minmax()` responsivo |
| `flex` para alinhar label e input | `grid grid-cols-form gap-3` |
| Media queries para colapsar colunas | `minmax(0, 15rem)` que colapsa naturalmente |
| `<br />` para quebrar linha na label | `<span className="block mt-0.5">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-campos-do-formulario/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-campos-do-formulario/references/code-examples.md)
