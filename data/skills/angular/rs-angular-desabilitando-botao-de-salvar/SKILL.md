---
name: rs-angular-desabilitando-botao-salvar
description: "Applies Angular Template Driven Forms validation to disable buttons based on form validity. Use when user asks to 'disable a button', 'validate a form', 'require fields', 'template driven forms', or 'ngForm validation' in Angular projects. Enforces form-level validation over field-by-field checks, ngModel with name attributes, and disabled binding patterns. Make sure to use this skill whenever implementing form validation or conditional button states in Angular. Not for Reactive Forms, Signal Forms, or non-Angular frameworks."
---

# Desabilitando Botao com Template Driven Forms

> Valide formularios no nivel do form, nunca campo por campo — use `ngForm` para centralizar o estado de validacao.

## Rules

1. **Use form-level validation em vez de campo-por-campo** — `movieForm.invalid` em vez de `!title() && !year() && !category()`, porque escala melhor quando campos aumentam e centraliza a logica
2. **Sempre adicione `name` em inputs dentro de Template Driven Forms** — Angular exige o atributo `name` quando `ngModel` esta dentro de um `<form>` com `ngForm`, caso contrario gera erro
3. **Marque campos obrigatorios com `required`** — um campo vazio sem `required` nao invalida o formulario, gerando falsos positivos
4. **Combine validacao do form com validacoes extras no `[disabled]`** — se ha estado fora do formulario (ex: arquivo selecionado), inclua no binding com `||`
5. **Estilize o estado disabled visualmente** — um botao desabilitado sem feedback visual confunde o usuario; use classes como `disabled:opacity-50` e `disabled:cursor-not-allowed`

## How to write

### Criar formulario com ngForm

```html
<!-- Transforme a div container em <form> e crie referencia de template -->
<form #movieForm="ngForm">
  <input type="text" name="title" [(ngModel)]="title" required />
  <input type="number" name="year" [(ngModel)]="year" required />
  <input type="text" name="category" [(ngModel)]="category" required />
  <textarea name="description" [(ngModel)]="description" required></textarea>

  <button
    [disabled]="movieForm.invalid || !selectedFile()"
    class="bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
  >
    Salvar
  </button>
</form>
```

### Binding do disabled com condicoes extras

```html
<!-- Form invalido OU arquivo nao selecionado = botao desabilitado -->
<button [disabled]="movieForm.invalid || !selectedFile()">
  Salvar
</button>
```

## Example

**Before (validacao campo por campo):**
```html
<div>
  <input [(ngModel)]="title" />
  <input [(ngModel)]="year" />
  <input [(ngModel)]="category" />
  <textarea [(ngModel)]="description"></textarea>

  <button [disabled]="!title() || !year() || !category() || !description() || !selectedFile()">
    Salvar
  </button>
</div>
```

**After (com Template Driven Forms):**
```html
<form #movieForm="ngForm">
  <input name="title" [(ngModel)]="title" required />
  <input name="year" [(ngModel)]="year" required />
  <input name="category" [(ngModel)]="category" required />
  <textarea name="description" [(ngModel)]="description" required></textarea>

  <button
    [disabled]="movieForm.invalid || !selectedFile()"
    class="disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Salvar
  </button>
</form>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario simples com signals | Template Driven Forms + ngModel com signals |
| Formulario complexo com validacoes dinamicas | Reactive Forms |
| Precisa validar estado fora do form (ex: upload) | Combine `form.invalid` com `\|\|` no disabled |
| Botao desabilitado sem estilo visual | Adicione `disabled:opacity-50` e `disabled:cursor-not-allowed` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `[disabled]="!field1() \|\| !field2() \|\| !field3()"` | `[disabled]="myForm.invalid"` |
| `<input [(ngModel)]="x">` dentro de form sem `name` | `<input name="x" [(ngModel)]="x">` |
| Botao disabled sem estilo visual | `class="disabled:opacity-50 disabled:cursor-not-allowed"` |
| `<div>` como container de campos que precisam validacao | `<form #f="ngForm">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
