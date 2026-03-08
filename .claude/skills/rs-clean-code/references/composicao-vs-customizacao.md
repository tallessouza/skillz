---
name: rs-clean-code-composicao-vs-customizacao
description: "Enforces React composition pattern over configuration pattern when creating reusable components. Use when user asks to 'create a component', 'build a reusable input', 'make a flexible component', 'refactor props', or any component with more than 3 visual configuration props. Applies sub-component decomposition (Root, Label, Icon, ErrorMessage) instead of prop-based customization. Make sure to use this skill whenever a React component accumulates multiple optional visual props. Not for simple leaf components, utility functions, or non-React code."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: componentes-react
  tags: [react, composition, compound-components, sub-components, design-system, reusability]
---

# Composicao vs Customizacao — React Components

> Divida componentes em sub-componentes compostos ao inves de acumular props de configuracao visual.

## Rules

1. **Prefira composicao sobre configuracao** — quando um componente tem mais de 3 props que controlam aparencia (icon, label, errorMessage, leftIcon), decomponha em sub-componentes, porque props de configuracao criam combinacoes exponenciais e inflexibilidade
2. **Exporte sub-componentes nomeados** — `Root`, `Label`, `Icon`, `ErrorMessage`, `FormField`, porque permite reposicionamento livre e extensibilidade via props nativas do HTML
3. **Root recebe children** — o componente raiz apenas aplica estilizacao padrao e repassa children, porque a ordem e composicao dos filhos define o layout
4. **Sub-componentes estendem elementos nativos** — `Label` estende `LabelHTMLAttributes<HTMLLabelElement>`, porque permite repassar qualquer prop HTML sem criar wrappers artificiais como `labelProps`
5. **Nunca crie props de posicionamento** — proibido `leftIcon`/`rightIcon`, porque no pattern de composicao o usuario controla a posicao colocando o sub-componente onde quiser no JSX

## How to write

### Estrutura de composicao

```typescript
// components/input.tsx — cada sub-componente exportado separadamente
import { ComponentProps, ReactNode } from 'react'

interface RootProps {
  children: ReactNode
}

export function Root({ children }: RootProps) {
  return <div className="input-wrapper">{children}</div>
}

export function Label(props: ComponentProps<'label'>) {
  return <label {...props} />
}

export function Icon({ children }: { children: ReactNode }) {
  return <span className="input-icon">{children}</span>
}

export function ErrorMessage({ message }: { message: string }) {
  return <span className="input-error">{message}</span>
}

export function FormField(props: ComponentProps<'input'>) {
  return <input {...props} />
}
```

### Uso com sintaxe de ponto

```typescript
import * as Input from './components/input'

// Composicao: ordem dos sub-componentes define o layout
<Input.Root>
  <Input.Label htmlFor="name">Nome</Input.Label>
  <Input.Icon><SearchIcon /></Input.Icon>
  <Input.FormField id="name" />
  <Input.ErrorMessage message="Digite seu nome corretamente" />
</Input.Root>

// Icone antes? Basta reposicionar no JSX
<Input.Root>
  <Input.Icon><SearchIcon /></Input.Icon>
  <Input.FormField id="search" />
</Input.Root>
```

## Example

**Before (pattern de configuracao — ruim):**
```typescript
interface InputProps {
  label?: string
  icon?: ReactNode
  leftIcon?: ReactNode
  errorMessage?: string
}

export function Input({ label, icon, leftIcon, errorMessage }: InputProps) {
  return (
    <div>
      {label ? <label>{label}</label> : null}
      {leftIcon}
      <input />
      {icon}
      {errorMessage ? <span>{errorMessage}</span> : null}
    </div>
  )
}

// Uso: sem controle de posicao, sem props nativas na label
<Input label="Nome" icon={<SearchIcon />} errorMessage="Erro" />
```

**After (pattern de composicao):**
```typescript
import * as Input from './components/input'

<Input.Root>
  <Input.Label htmlFor="name" id="name-label">Nome</Input.Label>
  <Input.FormField id="name" />
  <Input.Icon><SearchIcon /></Input.Icon>
  <Input.ErrorMessage message="Digite seu nome corretamente" />
</Input.Root>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente com 1-2 props visuais simples | Configuracao esta OK, nao decomponha |
| Componente com 3+ props opcionais visuais | Decomponha em sub-componentes |
| Precisa reposicionar elementos internos | Composicao obrigatoria |
| Precisa repassar props HTML nativas a sub-elementos | Composicao com extensao de HTML attributes |
| Biblioteca de componentes (design system) | Composicao como padrao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `leftIcon` + `rightIcon` props | `<Input.Icon>` posicionado no JSX |
| `labelProps={{ id: 'x' }}` | `<Input.Label id="x">` |
| `showError={true} errorText="..."` | `<Input.ErrorMessage message="..." />` |
| Um componente com 8 props opcionais | Sub-componentes compostos |
| `<Input label="..." icon={...} error="..." />` | `<Input.Root>` com children compostos |

## Troubleshooting

### Sub-componentes nao aparecem na ordem esperada
**Symptom:** Os elementos dentro do componente composto renderizam fora da ordem em que foram declarados no JSX.
**Cause:** O componente Root esta reorganizando children internamente (ex: usando Children.map ou slots fixos) em vez de simplesmente renderizar `{children}`.
**Fix:** Garanta que Root apenas aplica estilizacao e repassa `{children}` diretamente, sem reordenar. A ordem no JSX deve ser a ordem final.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-composicao-vs-customizacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-composicao-vs-customizacao/references/code-examples.md)
