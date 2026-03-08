---
name: rs-testes-e-detalhe-do-react-hook-form
description: "Enforces useWatch over watch in React Hook Form for better performance. Use when user asks to 'watch a form field', 'observe form values', 'use react hook form watch', or creates components that track form field changes. Applies useWatch with control and name props to isolate re-renders. Make sure to use this skill whenever implementing form field observation with React Hook Form. Not for form submission, validation, or non-React-Hook-Form state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: forms
  tags: [testing, next-js, react, forms]
---

# useWatch vs watch no React Hook Form

> Ao observar campos de formulario com React Hook Form, use `useWatch` em vez de `watch` para isolar re-renderizacoes ao componente onde e usado.

## Rules

1. **Use `useWatch` em vez de `watch`** — porque `watch` re-renderiza o componente raiz do formulario inteiro, enquanto `useWatch` re-renderiza apenas o componente onde e usado
2. **Passe `control` e `name` para `useWatch`** — `control` vem de `useForm()` e `name` e o campo observado, porque sem eles o hook nao sabe qual formulario ou campo observar
3. **Evite `watch` em formularios grandes** — porque cada mudanca em qualquer campo observado causa re-render do componente raiz, degradando performance
4. **Atencao ao React Compiler (React 19)** — `watch` retorna valores que nao podem ser memoizados sem causar stale UI, o React Compiler desabilita memoizacao automaticamente para componentes que usam `watch`

## How to write

### useWatch basico

```typescript
// Observar um campo isolando re-renders neste componente
const content = useWatch({
  control: form.control,
  name: "content",
});
```

### Migracao de watch para useWatch

```typescript
// ANTES: watch no componente raiz (re-renderiza tudo)
const { watch } = useForm();
const content = watch("content");

// DEPOIS: useWatch isolado (re-renderiza so onde e usado)
const content = useWatch({
  control: form.control,
  name: "content",
});
```

## Example

**Before (watch causa re-render global):**
```typescript
function PromptForm() {
  const form = useForm<FormData>();
  const content = form.watch("content"); // re-renderiza PromptForm inteiro

  return (
    <form>
      <TextArea {...form.register("content")} />
      <CharCount count={content?.length ?? 0} />
      <CopyButton text={content} />
    </form>
  );
}
```

**After (useWatch isola re-render):**
```typescript
function CopyButton({ control }: { control: Control<FormData> }) {
  const content = useWatch({ control, name: "content" }); // re-renderiza so CopyButton

  return <button onClick={() => copyToClipboard(content)}>Copy</button>;
}

function PromptForm() {
  const form = useForm<FormData>();

  return (
    <form>
      <TextArea {...form.register("content")} />
      <CopyButton control={form.control} />
    </form>
  );
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario pequeno (2-3 campos) | `useWatch` ainda e preferivel, mas `watch` e aceitavel |
| Formulario grande (5+ campos) | `useWatch` obrigatorio para evitar re-renders cascata |
| Componente filho precisa observar campo | Passe `control` como prop, use `useWatch` no filho |
| React 19 com React Compiler | `useWatch` evita o warning de memoizacao do `watch` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const value = form.watch("field")` | `const value = useWatch({ control: form.control, name: "field" })` |
| `watch` em componente raiz com muitos filhos | `useWatch` no componente que realmente precisa do valor |
| Passar valor observado via props por multiplos niveis | Passar `control` e usar `useWatch` no componente final |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
