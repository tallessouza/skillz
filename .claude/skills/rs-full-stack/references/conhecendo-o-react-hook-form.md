---
name: rs-full-stack-conhecendo-o-react-hook-form
description: "Enforces React Hook Form setup and usage patterns when managing form state in React applications. Use when user asks to 'create a form', 'handle form inputs', 'install react-hook-form', 'manage form state', or 'collect form data without useState'. Applies the register/handleSubmit pattern instead of creating individual useState for each input. Make sure to use this skill whenever building forms with multiple inputs in React. Not for server-side validation, backend form processing, or non-React form handling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-forms
  tags: [react, react-hook-form, forms, useForm, register]
---

# React Hook Form — Gerenciamento de Formulários

> Utilize React Hook Form para coletar dados de formulários sem criar estados individuais para cada input.

## Rules

1. **Use React Hook Form em formulários com múltiplos inputs** — em vez de criar um `useState` para cada campo, porque múltiplos estados tornam o componente verboso e difícil de manter
2. **Instale a versão específica quando necessário** — `npm i react-hook-form@7.53.2` para garantir compatibilidade, porque breaking changes entre versões podem quebrar formulários existentes
3. **Prefira `register` ao invés de controlled inputs** — porque o React Hook Form gerencia os dados internamente sem re-renders desnecessários
4. **Colete dados via `handleSubmit`** — deixe o React Hook Form orquestrar a submissão, porque ele já valida e agrupa os dados automaticamente

## How to write

### Instalação

```bash
# Instalar React Hook Form
npm i react-hook-form@7.53.2
```

### Setup básico com useForm

```typescript
import { useForm } from 'react-hook-form'

interface FormData {
  name: string
  email: string
  password: string
}

function SignUpForm() {
  const { register, handleSubmit } = useForm<FormData>()

  function onSubmit(data: FormData) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Nome" />
      <input {...register('email')} placeholder="E-mail" />
      <input {...register('password')} type="password" placeholder="Senha" />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

## Example

**Before (um useState por input):**
```typescript
function SignUpForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    console.log({ name, email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

**After (com React Hook Form):**
```typescript
function SignUpForm() {
  const { register, handleSubmit } = useForm<FormData>()

  function onSubmit(data: FormData) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <input {...register('password')} />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com 1-2 inputs simples | `useState` pode ser suficiente |
| Formulário com 3+ inputs | Use React Hook Form |
| Precisa de validação complexa | React Hook Form + resolver (Zod/Yup) |
| Inputs controlados com lógica visual | Combine `register` com `watch` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `useState` para cada campo do form | `useForm()` com `register` |
| `e.preventDefault()` manual no submit | `handleSubmit(onSubmit)` do hook |
| Objeto montado manualmente com cada state | `data` recebido no callback do `handleSubmit` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Dados do formulario chegam undefined | Campo nao registrado com `register` | Verifique que cada input tem `{...register('fieldName')}` |
| Formulario nao submete | `handleSubmit` nao envolvendo a funcao de callback | Use `onSubmit={handleSubmit(onSubmit)}` no form |
| Versao incompativel com o projeto | Breaking changes entre versoes do react-hook-form | Instale a versao especifica: `npm i react-hook-form@7.53.2` |
| Inputs nao re-renderizam ao mudar valor | React Hook Form usa uncontrolled inputs por padrao | Use `watch('fieldName')` se precisar observar mudancas em tempo real |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que React Hook Form substitui múltiplos useState
- [code-examples.md](references/code-examples.md) — Exemplos de instalação e setup expandidos com variações