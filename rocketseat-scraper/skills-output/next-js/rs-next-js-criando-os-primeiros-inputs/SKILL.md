---
name: rs-next-js-criando-os-primeiros-inputs
description: "Applies reactive form input patterns when building forms with shadcn/ui in Next.js. Use when user asks to 'create a form', 'add inputs', 'build a registration form', 'add form fields', or 'use shadcn form components'. Enforces FormField/FormItem/FormControl/FormMessage structure, icon-inside-input pattern, and textarea customization. Make sure to use this skill whenever creating forms with shadcn/ui and react-hook-form. Not for server actions, API routes, or form validation logic."
---

# Criando Inputs com Formularios Reativos (shadcn/ui)

> Ao criar formularios com shadcn/ui, siga a hierarquia FormField > FormItem > FormLabel > FormControl > Input > FormMessage, sempre com spread do field no input.

## Rules

1. **Sempre use a hierarquia completa do FormField** — `FormField` > `FormItem` > `FormLabel` > `FormControl` > `Input` > `FormMessage`, porque pular niveis quebra acessibilidade e validacao
2. **Spread do field no input** — `{...field}` conecta o react-hook-form ao componente, porque sem isso o formulario nao rastreia o valor
3. **Icone dentro do input usa wrapper relativo** — div `relative` com icone `absolute` e input com `pl-10`, porque mantem o icone alinhado sem quebrar o layout
4. **Textarea sem resize** — adicione `resize-none` no textarea de descricao, porque resize manual quebra o layout do formulario
5. **Espacamento vertical no form** — use `space-y-4` no form pai, porque mantem consistencia entre campos sem margin manual
6. **Customizacao de componentes shadcn** — sobrescreva estilos diretamente no componente copiado (ex: `input.tsx`, `textarea.tsx`), porque shadcn e copy-paste por design

## How to write

### FormField com icone

```tsx
<FormField
  control={form.control}
  name="tutorName"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-label-medium text-content-primary">
        nome do tutor
      </FormLabel>
      <FormControl>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brands" size={20} />
          <Input placeholder="nome do tutor" className="pl-10" {...field} />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### FormField com textarea (sem icone)

```tsx
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-label-medium text-content-primary">
        descrição do serviço
      </FormLabel>
      <FormControl>
        <Textarea
          placeholder="descrição do serviço"
          className="resize-none"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Example

**Before (sem estrutura shadcn):**
```tsx
<form>
  <label>Nome</label>
  <input type="text" name="tutorName" />
  <label>Descrição</label>
  <textarea name="description" />
</form>
```

**After (com shadcn/ui + react-hook-form):**
```tsx
<Form {...form}>
  <form className="space-y-4">
    <FormField
      control={form.control}
      name="tutorName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-label-medium text-content-primary">
            nome do tutor
          </FormLabel>
          <FormControl>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brands" size={20} />
              <Input placeholder="nome do tutor" className="pl-10" {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-label-medium text-content-primary">
            descrição do serviço
          </FormLabel>
          <FormControl>
            <Textarea placeholder="descrição do serviço" className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo com icone decorativo | Wrapper `relative` + icone `absolute` + padding-left no input |
| Campo sem icone (textarea) | Sem wrapper extra, textarea direto no FormControl |
| Varios campos no form | `space-y-4` no form pai |
| Placeholder segue Figma | Minusculo conforme design, nao capitalize |
| Componente shadcn precisa de estilo custom | Edite o arquivo copiado em `components/ui/` |
| Campo repetido com mesmo layout | Copie o FormField e troque `name`, label, placeholder e icone |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<input {...field}>` sem FormControl | `<FormControl><Input {...field} /></FormControl>` |
| `<FormField>` sem `<FormMessage />` | Sempre inclua `<FormMessage />` para erros de validacao |
| `<textarea>` sem `resize-none` em forms | `<Textarea className="resize-none" {...field} />` |
| Icone dentro do input sem position absolute | Wrapper `relative` + icone `absolute` |
| `className="paddingLeft: 40px"` inline | `className="pl-10"` com Tailwind |
| Campos sem espacamento | `space-y-4` no container pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
