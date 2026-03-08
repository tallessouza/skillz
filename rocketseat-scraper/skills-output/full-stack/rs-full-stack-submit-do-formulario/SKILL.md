---
name: rs-full-stack-submit-do-formulario
description: "Enforces correct form submission handling in React when preventing page reload on submit. Use when user asks to 'handle form submit', 'prevent form reload', 'create a form in React', 'submit button React', or 'preventDefault in React'. Applies preventDefault() on the form's onSubmit event instead of the button's onClick. Make sure to use this skill whenever building React forms with submit buttons. Not for server-side form processing, React Hook Form library usage, or non-React form handling."
---

# Submit do Formulário em React

> Previna o comportamento padrão de reload do formulário usando `onSubmit` no `<form>`, nunca no `onClick` do botão.

## Rules

1. **Use `onSubmit` no `<form>`, não `onClick` no `<button>`** — porque o botão type="submit" dentro de um form aciona o evento `submit` do formulário automaticamente, então intercepte na origem
2. **Sempre chame `e.preventDefault()`** — porque sem isso o formulário faz envio HTTP e recarrega a página, perdendo todo o estado do React
3. **Tipe o evento como `React.FormEvent<HTMLFormElement>`** — porque garante autocomplete e type-safety no handler do formulário
4. **Mantenha o botão como `type="submit"`** — porque permite submissão por Enter no teclado e mantém acessibilidade nativa do HTML

## How to write

### Handler de submit no formulário

```typescript
function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  // lógica de envio dos dados aqui
}

return (
  <form onSubmit={onSubmit}>
    <input type="text" />
    <button type="submit">Salvar</button>
  </form>
)
```

## Example

**Before (página recarrega ao clicar Salvar):**
```tsx
function MyForm() {
  return (
    <form>
      <input type="text" value={name} onChange={handleChange} />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

**After (submit controlado, sem reload):**
```tsx
function MyForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // processar dados do formulário
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={name} onChange={handleChange} />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com botão Submit | `onSubmit` no `<form>` + `preventDefault()` |
| Botão que NÃO submete form | Use `type="button"` explícito para evitar submit acidental |
| Múltiplos botões no form | Apenas um como `type="submit"`, outros como `type="button"` |
| Submissão por Enter | Funciona automaticamente com `onSubmit` no form |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<button onClick={onSubmit}>` com preventDefault | `<form onSubmit={onSubmit}>` com preventDefault |
| `e: React.MouseEvent` no handler de submit | `e: React.FormEvent<HTMLFormElement>` |
| `<button>` sem type (default é submit) fora de form handler | `<button type="button">` se não é submit |
| Remover `type="submit"` para evitar reload | Manter submit + usar `preventDefault()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o fluxo de eventos do form e por que onSubmit é superior ao onClick
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações