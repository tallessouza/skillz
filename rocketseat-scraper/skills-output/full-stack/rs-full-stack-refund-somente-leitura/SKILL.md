---
name: rs-full-stack-refund-somente-leitura
description: "Enforces read-only form patterns when reusing React pages across create and view contexts. Use when user asks to 'reuse a page for viewing and creating', 'disable form fields conditionally', 'make form read-only', 'share a component between routes', or 'add dynamic route parameters'. Applies double-negation boolean coercion for disabled props and context-aware UI text. Make sure to use this skill whenever building dual-purpose form pages that serve both creation and detail viewing. Not for server-side validation, access control, or authentication logic."
---

# Refund Somente Leitura — Reuso de Página com Contexto Dinâmico

> Reutilize uma mesma página para criar e visualizar dados, adaptando a interface com base na presença de um parâmetro de rota.

## Rules

1. **Registre a mesma página em rotas distintas** — uma rota sem parâmetro para criação, outra com `:id` para visualização, porque evita duplicação de componentes
2. **Use `useParams` para detectar o contexto** — se `params.id` existe, o usuário está visualizando; se não existe, está criando, porque um único booleano controla toda a adaptação da UI
3. **Desabilite campos com dupla negação `!!params.id`** — `!!value` converte qualquer valor para booleano puro, porque uma única negação inverte a lógica e duas confirmam a existência
4. **Adapte textos de botão pelo contexto** — "Voltar" quando visualizando, "Enviar" quando criando, porque o usuário precisa de feedback visual sobre o que a ação faz
5. **Intercepte o submit no modo leitura** — use `navigate(-1)` para voltar à página anterior quando o formulário está em modo visualização, porque o botão "Voltar" não deve submeter dados

## How to write

### Rotas reutilizando a mesma página

```tsx
// Em employee routes (criação)
{ path: "/refund", element: <Refund /> }

// Em manager routes (visualização)
{ path: "/refund/:id", element: <Refund /> }
```

### Detecção de contexto com useParams

```tsx
import { useParams, useNavigate } from "react-router-dom"

function Refund() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  const isReadOnly = !!params.id
}
```

### Campos desabilitados condicionalmente

```tsx
<Input disabled={!!params.id} />
<Select disabled={!!params.id} />
<Textarea disabled={!!params.id} />
```

### Botão e submit adaptados

```tsx
function handleSubmit(e: FormEvent) {
  e.preventDefault()

  if (params.id) {
    return navigate(-1)
  }

  // fluxo de criação...
}

<button type="submit">
  {params.id ? "Voltar" : "Enviar"}
</button>
```

## Example

**Before (páginas duplicadas):**
```tsx
// pages/RefundCreate.tsx — formulário editável
// pages/RefundView.tsx — formulário com campos duplicados e disabled hardcoded
// Duas páginas, mesma estrutura, manutenção dobrada
```

**After (página única com contexto):**
```tsx
function Refund() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (params.id) return navigate(-1)
    // lógica de envio...
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input disabled={!!params.id} />
      <Select disabled={!!params.id} />
      <button>{params.id ? "Voltar" : "Enviar"}</button>
    </form>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Página serve para criar E visualizar | Use `useParams` para detectar contexto |
| Campo deve ser somente leitura | `disabled={!!params.id}` |
| Botão muda de ação conforme contexto | Ternário no texto e lógica condicional no submit |
| Upload em modo leitura | Esconda o input e exiba o arquivo existente |
| Navegação de volta | `navigate(-1)` para voltar à página anterior |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Duplicar página para criar vs visualizar | Reutilize a mesma página com `useParams` |
| `disabled={!params.id}` (uma negação) | `disabled={!!params.id}` (dupla negação para booleano) |
| Hardcode `disabled={true}` no modo leitura | Derive de `params.id` dinamicamente |
| Submeter dados quando está em modo visualização | `if (params.id) return navigate(-1)` |
| Criar rota separada sem parâmetro dinâmico | `/refund/:id` reutilizando o componente existente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre reuso de páginas, dupla negação e adaptação contextual
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações