---
name: rs-full-stack-encerramento-61
description: "Applies React form best practices when choosing between controlled inputs, uncontrolled inputs, and React Hook Form. Use when user asks to 'create a form', 'handle form data', 'validate inputs', 'build a registration form', or 'manage form state in React'. Guides selection of the optimal form strategy based on complexity and performance needs. Make sure to use this skill whenever building any form in React. Not for server-side form handling, non-React frameworks, or database operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-forms
  tags: [react, forms, controlled-inputs, react-hook-form, zod, validation]
---

# Formulários em React — Guia de Decisão

> Escolha a estratégia de formulário correta baseada na complexidade: inputs controlados para simplicidade, React Hook Form para performance.

## Decision framework

| Cenário | Estratégia | Motivo |
|---------|-----------|--------|
| Formulário com 1-2 campos simples | Inputs controlados (`useState`) | Simplicidade, sem dependência extra |
| Formulário com 3+ campos | React Hook Form | Evita criar um estado para cada input, melhor performance |
| Precisa de valor do campo apenas no submit | Input não controlado (`useRef`) | Sem re-renders desnecessários |
| Formulário com validação complexa | React Hook Form + Zod/Yup | Validação declarativa integrada |
| Campo que precisa reagir em tempo real (ex: busca) | Input controlado | Precisa do valor a cada keystroke |

## Key concepts

### Inputs controlados vs não controlados

**Controlado:** React gerencia o valor via `useState`. Cada digitação causa re-render.

```tsx
const [name, setName] = useState('')
<input value={name} onChange={e => setName(e.target.value)} />
```

**Não controlado:** DOM gerencia o valor. React acessa via `ref` apenas quando necessário.

```tsx
const nameRef = useRef<HTMLInputElement>(null)
<input ref={nameRef} />
// No submit: nameRef.current?.value
```

### React Hook Form

Gerencia dados do formulário sem criar estados individuais — estratégia amplamente usada no mercado para formulários otimizados.

```tsx
const { register, handleSubmit } = useForm()

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('name')} />
  <input {...register('email')} />
  <button type="submit">Enviar</button>
</form>
```

### Validação de inputs

Combine React Hook Form com schema validation para garantir dados corretos antes do submit.

```tsx
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário de cadastro/login | React Hook Form + Zod |
| Campo de busca com debounce | Input controlado |
| Formulário simples de contato (2 campos) | `useState` controlado |
| Upload de arquivo | Input não controlado |
| Formulário com muitos campos dinâmicos | React Hook Form com `useFieldArray` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Um `useState` para cada campo em formulário grande | `useForm()` do React Hook Form |
| Validação manual com `if/else` em cascata | Schema validation com Zod |
| `onChange` + `setState` em 10+ campos | `register()` do React Hook Form |
| Ignorar feedback visual de erros | `formState.errors` com mensagens claras |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Input controlado nao atualiza ao digitar | Faltou `onChange` handler ou `setState` no handler | Adicionar `onChange={e => setField(e.target.value)}` |
| React Hook Form nao captura valor | Campo nao registrado com `register` | Garantir `{...register('fieldName')}` no input |
| Validacao Zod nao dispara | Resolver nao configurado no `useForm` | Adicionar `resolver: zodResolver(schema)` nas opcoes |
| Erro de tipo no `handleSubmit` | Schema Zod nao inferido corretamente | Usar `z.infer<typeof schema>` como tipo do formulario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre controlado vs não controlado e quando usar cada estratégia
- [code-examples.md](references/code-examples.md) — Exemplos completos de formulários com React Hook Form e validação