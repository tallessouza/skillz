# Code Examples: useWatch vs watch no React Hook Form

## Exemplo 1: Migracao direta no projeto da aula

O projeto da aula tinha um componente que observava o campo `content` usando `watch`:

### Antes (com watch)
```typescript
// Componente que observa o campo content
const { watch } = useForm();
const content = watch("content");
```

### Depois (com useWatch)
```typescript
// Substituicao direta por useWatch
const content = useWatch({
  control: form.control,
  name: "content",
});
```

A tipagem do campo `name` pode nao ser inferida automaticamente em todos os casos. No projeto da aula, o TypeScript nao reconheceu `"content"` como campo valido automaticamente, mas o valor correto e `"content"`.

## Exemplo 2: Passando control como prop

Quando um componente filho precisa observar um campo do formulario pai:

```typescript
import { useForm, useWatch, Control } from "react-hook-form";

interface FormData {
  content: string;
  title: string;
}

// Componente filho que observa "content"
function ContentPreview({ control }: { control: Control<FormData> }) {
  const content = useWatch({
    control,
    name: "content",
  });

  return <div className="preview">{content}</div>;
}

// Componente pai com o formulario
function MyForm() {
  const form = useForm<FormData>();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("title")} />
      <textarea {...form.register("content")} />
      <ContentPreview control={form.control} />
    </form>
  );
}
```

## Exemplo 3: useWatch com defaultValue

```typescript
const content = useWatch({
  control: form.control,
  name: "content",
  defaultValue: "", // valor enquanto o campo nao tem valor
});
```

## Exemplo 4: Observando multiplos campos

```typescript
// Observar varios campos de uma vez
const [title, content] = useWatch({
  control: form.control,
  name: ["title", "content"],
});
```

## Exemplo 5: useWatch dentro de custom hook

```typescript
function useFormFieldPreview(
  control: Control<FormData>,
  fieldName: keyof FormData
) {
  const value = useWatch({ control, name: fieldName });
  const charCount = value?.length ?? 0;
  const isEmpty = charCount === 0;

  return { value, charCount, isEmpty };
}

// Uso
function ContentStats({ control }: { control: Control<FormData> }) {
  const { charCount, isEmpty } = useFormFieldPreview(control, "content");

  return (
    <span>
      {isEmpty ? "Nenhum conteudo" : `${charCount} caracteres`}
    </span>
  );
}
```