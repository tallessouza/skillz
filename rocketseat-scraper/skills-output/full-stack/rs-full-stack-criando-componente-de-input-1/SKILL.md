---
name: rs-full-stack-criando-componente-de-input-1
description: "Enforces reusable Input component patterns with Tailwind CSS when building form fields, creating fieldset-based inputs with legend labels, applying focus states, or styling form elements. Use when user asks to 'create an input component', 'build a form field', 'style an input', 'add focus states to inputs', or 'make a reusable form component'. Make sure to use this skill whenever creating form inputs in React with Tailwind CSS. Not for select dropdowns, checkboxes, radio buttons, or form validation logic."
---

# Criando Componente de Input com Tailwind CSS

> Encapsule inputs em componentes reutilizaveis com fieldset, legend opcional, tipagem extensivel e estados visuais de foco via Tailwind.

## Rules

1. **Use fieldset + legend para agrupar input com label** — `<fieldset>` agrupa semanticamente o campo, e `<legend>` exibe a legenda, porque isso melhora acessibilidade e permite heranca de estilos via `focus-within`
2. **Estenda ComponentProps do React** — use `React.ComponentProps<"input">` intersectado com props customizadas, porque permite repassar todas as props nativas do input sem redeclarar cada uma
3. **Legend deve ser opcional** — declare `legend?: string` e renderize condicionalmente com `&&`, porque nem todo input precisa de legenda
4. **Use rest operator para repassar props** — desestruture apenas props customizadas e repasse `...rest` ao elemento nativo, porque mantém o componente flexível
5. **Use `focus-within` no fieldset para herdar estados** — aplique `focus-within:text-green-100` no fieldset e `text-inherit` no legend, porque o foco no input propaga o estilo visual para o label sem JavaScript
6. **Defina valores padrão via defaultProps ou spread** — coloque `type="text"` antes do `{...rest}` para que o consumidor possa sobrescrever, porque evita repetição em cada uso

## How to write

### Tipagem do componente

```tsx
type Props = React.ComponentProps<"input"> & {
  legend?: string
}
```

### Estrutura do componente

```tsx
export function Input({ legend, ...rest }: Props) {
  return (
    <fieldset className="flex flex-1 max-h-20 focus-within:text-green-100">
      {legend && (
        <legend className="uppercase text-xs text-gray-200 mb-2 text-inherit">
          {legend}
        </legend>
      )}
      <input
        type="text"
        className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-100 bg-transparent outline-none focus:border-2 focus:border-green-100 placeholder:text-gray-300"
        {...rest}
      />
    </fieldset>
  )
}
```

### Uso do componente

```tsx
<form className="w-full flex flex-col gap-4">
  <Input legend="E-mail" type="email" placeholder="seu@email.com" required />
  <Input legend="Senha" type="password" placeholder="123456" required />
</form>
```

## Example

**Before (input inline sem componente):**
```tsx
<form>
  <label>E-mail</label>
  <input type="email" className="border p-2" placeholder="email" />
  <label>Senha</label>
  <input type="password" className="border p-2" placeholder="senha" />
</form>
```

**After (com componente reutilizavel):**
```tsx
<form className="w-full flex flex-col gap-4">
  <Input legend="E-mail" type="email" placeholder="seu@email.com" required />
  <Input legend="Senha" type="password" placeholder="123456" required />
</form>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input precisa de label visivel | Use prop `legend` com fieldset |
| Input sem label (ex: search bar) | Omita `legend`, fieldset ainda agrupa |
| Precisa mudar cor ao focar | Use `focus-within` no fieldset + `text-inherit` no legend |
| Precisa mudar borda ao focar | Use `focus:border-2 focus:border-{cor}` no input |
| Placeholder precisa de cor diferente | Use `placeholder:text-gray-300` |
| Input precisa remover outline padrao | Use `outline-none` e substitua por borda customizada no focus |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `<label>` solto sem agrupamento semantico | `<fieldset>` + `<legend>` para agrupar |
| Repetir classes em cada input | Extrair componente `Input` reutilizavel |
| `onChange` manual para estado de foco | `focus-within` e `focus:` do Tailwind |
| `rounded-l-lg` sem intencao (apenas left) | `rounded-lg` para todos os lados |
| Redeclarar `type`, `placeholder`, etc. na tipagem | Estender `ComponentProps<"input">` |
| Outline padrao do browser sem substituicao | `outline-none` + `focus:border` customizado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre focus-within, heranca de estilos e fieldset semantico
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes