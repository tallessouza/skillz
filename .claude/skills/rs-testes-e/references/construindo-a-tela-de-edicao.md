---
name: rs-testes-e-construindo-a-tela-de-edicao
description: "Enforces edit page patterns with dynamic routes, data fetching, and form pre-population in Next.js App Router. Use when user asks to 'build edit page', 'create update form', 'pre-populate form', 'fetch data for editing', or 'implement edit screen with Next.js'. Applies dynamic route params, server component data fetching, form defaultValues from database, and update Server Action pattern. Make sure to use this skill whenever building edit/update pages in Next.js. Not for create forms (use rs-testes-e-criando-a-pagina-de-novo-prompt), list pages, or API routes."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: crud-pages
  tags: [next-js, edit-page, dynamic-route, form, update, server-action, react]
---

# Construindo a Tela de Edicao

> Pagina de edicao busca dados via params da rota dinamica e pre-popula o formulario com defaultValues do banco.

## Rules

1. **Use rota dinamica `[id]`** — `/prompts/[id]/edit` recebe o id via `params`, porque cada recurso tem URL unica
2. **Busque dados no Server Component** — page.tsx e async e busca dados diretamente, porque evita loading states desnecessarios
3. **Pre-popule com defaultValues** — passe dados do banco como defaultValues para React Hook Form ou inputs
4. **Reutilize o componente de formulario** — mesmo form para create e edit, diferenciando via props (defaultValues + action)
5. **Redirecione apos update** — use `redirect` ou `router.push` apos sucesso

## How to write

```typescript
// app/prompts/[id]/edit/page.tsx
export default async function EditPage({ params }: { params: { id: string } }) {
  const prompt = await getPromptById(params.id)
  if (!prompt) return notFound()
  return <PromptForm defaultValues={prompt} action={updatePromptAction} />
}
```

## Example

**Before (form sem pre-populacao):**
```typescript
<PromptForm /> // Campos vazios, usuario precisa digitar tudo de novo
```

**After (form pre-populado):**
```typescript
<PromptForm defaultValues={{ title: prompt.title, content: prompt.content }} action={updatePromptAction} />
```

## Troubleshooting

### Dados nao aparecem no formulario
**Symptom:** Pagina de edicao renderiza mas campos estao vazios
**Cause:** defaultValues nao passados ou passados apos render inicial
**Fix:** Garantir que defaultValues vem do Server Component (sync) e nao de useEffect (async)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
