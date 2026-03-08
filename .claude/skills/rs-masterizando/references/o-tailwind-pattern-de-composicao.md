---
name: rs-tailwind-pattern-de-composicao
description: "Applies the React composition pattern when creating reusable UI components. Use when user asks to 'create a component', 'make a reusable input', 'build a flexible component', 'split component into parts', or 'compose components'. Breaks larger components into Root/Prefix/Control sub-components instead of prop-drilling className variants. Make sure to use this skill whenever building form controls, inputs, or any component with customizable visual sub-parts. Not for state management, business logic, or non-visual component architecture."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: componentes
  tags: [tailwind, react, radix-ui, flexbox, composition-pattern]
---

# Pattern de Composição

> Quebre componentes visuais em sub-componentes (Root, Prefix, Control) ao invés de criar propriedades para customizar cada parte.

## Rules

1. **Divida por responsabilidade visual** — cada parte visualmente distinta do componente vira um sub-componente, porque isso elimina props como `iconClassName`, `wrapperClassName`, `controlClassName`
2. **Nomeie pela posição, nao pelo conteudo** — `Prefix` nao `Icon`, porque o usuario pode colocar imagem, texto ou qualquer coisa naquela posicao
3. **Estenda props nativas do HTML** — cada sub-componente estende `ComponentProps<'div'>` ou `ComponentProps<'input'>`, porque isso da acesso total a customizacao sem criar props extras
4. **Spread todas as props** — passe `{...props}` no elemento raiz de cada sub-componente, porque permite className, style, event handlers sem codigo adicional
5. **Exporte com namespace ou nomes completos** — use `Input.Root` (estilo Radix) ou `InputRoot` (estilo shadcn/ui), porque ambos sao patterns estabelecidos no ecossistema React

## How to write

### Estrutura dos sub-componentes

```typescript
import { ComponentProps } from 'react'

type InputRootProps = ComponentProps<'div'>

export function Root(props: InputRootProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2"
      {...props}
    />
  )
}

type InputPrefixProps = ComponentProps<'div'>

export function Prefix(props: InputPrefixProps) {
  return <div {...props} />
}

type InputControlProps = ComponentProps<'input'>

export function Control(props: InputControlProps) {
  return (
    <input
      className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none"
      {...props}
    />
  )
}
```

### Uso com namespace (estilo Radix)

```typescript
import * as Input from './input'

<Input.Root>
  <Input.Prefix>
    <Search className="h-5 w-5 text-zinc-500" />
  </Input.Prefix>
  <Input.Control placeholder="Search" />
</Input.Root>
```

### Uso com nomes completos (estilo shadcn/ui)

```typescript
import { InputRoot, InputPrefix, InputControl } from './input'

<InputRoot>
  <InputPrefix>
    <Search className="h-5 w-5 text-zinc-500" />
  </InputPrefix>
  <InputControl placeholder="Search" />
</InputRoot>
```

## Example

**Before (prop-drilling para customizacao):**
```typescript
export function Input({ icon: Icon, placeholder, className, iconClassName }: InputProps) {
  return (
    <div className={cn("flex items-center gap-2 border rounded-lg px-3 py-2", className)}>
      {Icon && <Icon className={cn("h-5 w-5 text-zinc-500", iconClassName)} />}
      <input className="flex-1 bg-transparent outline-none" placeholder={placeholder} />
    </div>
  )
}

// Precisa de input sem icone? Nova prop. Icone na direita? Nova prop. Imagem ao inves de icone? Nova prop.
```

**After (composition pattern):**
```typescript
// Cada parte e um componente independente — zero props extras necessarias
<Input.Root>
  <Input.Prefix>
    <Search className="h-5 w-5 text-zinc-500" />
  </Input.Prefix>
  <Input.Control placeholder="Search" />
</Input.Root>

// Sem icone? Nao coloque Prefix. Icone na direita? Coloque Prefix depois de Control.
// Imagem? Coloque <img> dentro de Prefix. Zero mudancas no componente.
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente tem 2+ partes visuais distintas | Aplique composition pattern |
| Componente so tem uma variacao (ex: size) | Use prop simples, nao precisa compor |
| Usuario pode querer trocar o conteudo de uma area | Essa area vira sub-componente |
| Sub-componente precisa de classes base | Coloque antes do spread (`className="base" {...props}`) |
| Namespace vs nome completo | Escolha um padrao pro projeto e mantenha |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `iconClassName`, `wrapperClassName` props | Sub-componentes com `{...props}` |
| `icon: Icon` como prop de componente composto | `<Input.Prefix><Icon /></Input.Prefix>` |
| `position="left" \| "right"` para icone | Ordene os sub-componentes na posicao desejada |
| `variant="with-icon" \| "without-icon"` | Inclua ou omita o sub-componente Prefix |
| `renderPrefix={() => <Icon />}` render props | Composition com children direto |
## Troubleshooting

### Componente Radix nao funciona no Next.js App Router
**Symptom:** Erro de hydration ou componente nao interativo.
**Cause:** Componentes Radix usam hooks client-side mas estao em Server Component.
**Fix:** Adicione `'use client'` no topo do arquivo que usa componentes Radix.

### Dropdown aparece atras de outros elementos
**Symptom:** O conteudo do select fica escondido atras de outros componentes.
**Cause:** Falta de Portal ou z-index insuficiente.
**Fix:** Use `SelectPrimitive.Portal` para renderizar no body e adicione `z-10` ou superior no Content.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-pattern-de-composicao/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-pattern-de-composicao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
