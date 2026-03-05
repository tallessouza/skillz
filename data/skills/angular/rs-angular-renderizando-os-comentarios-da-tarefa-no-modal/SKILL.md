---
name: rs-angular-renderizando-comentarios-modal
description: "Applies Angular pattern for rendering lists inside CDK Dialog modals with instance passing, dynamic class binding, and @for loop variables like $last. Use when user asks to 'render comments in modal', 'pass data to Angular dialog', 'conditional last item styling', 'dynamic classes in Angular template', or 'open modal with instance data'. Make sure to use this skill whenever building Angular modals that display lists with conditional styling. Not for creating the modal component itself, form submission, or modal creation/configuration."
---

# Renderizando Listas em Modais Angular com Classes Dinâmicas

> Ao renderizar listas dentro de modais Angular CDK, passe a instância clonada do objeto via `data`, use `@for` com variáveis contextuais como `$last`, e aplique classes dinâmicas via template literals para controlar bordas e espaçamentos condicionalmente.

## Rules

1. **Passe instâncias clonadas para modais, nunca a referência original** — use `structuredClone` antes de enviar via `data`, porque alterações no modal não devem afetar a fonte de verdade até confirmação explícita
2. **Use `DIALOG_DATA` injection token para receber dados no modal** — `inject(DIALOG_DATA)` do Angular Material CDK é o padrão oficial para acessar o objeto passado via propriedade `data`
3. **Use variáveis contextuais do `@for` para estilização condicional** — `$last`, `$first`, `$even`, `$odd`, `$index` evitam lógica manual de índice
4. **Aplique classes dinâmicas via template literal interpolation** — `[class]="` com backticks e ternários é mais legível que `[ngClass]` para casos simples
5. **Use `disableClose: true` quando o modal só deve fechar pelo botão X** — evita fechamento acidental ao clicar fora do modal
6. **Remova bordas e margens do último item da lista** — melhora a aparência visual sem CSS adicional, usando `$last` diretamente no template

## How to write

### Abrindo modal com instância de dados

```typescript
// No componente que abre o modal
openTaskCommentsModal() {
  this.modalControllerService.openTaskCommentsModal({
    disableClose: true,
    data: this.task // instância clonada via structuredClone
  });
}
```

### Recebendo dados no componente do modal

```typescript
// No componente do modal
readonly _task = inject<ITask>(DIALOG_DATA);
```

### Renderizando lista com @for e $last

```html
@for (comment of _task.comments; track comment.id; let last = $last) {
  <div [class]="`py-4 ${!last ? 'border-b border-gray-200' : ''}`">
    <span>Comentado há 10 minutos atrás</span>
    <p [class]="`text-sm ${!last ? 'mb-3' : ''}`">
      {{ comment.description }}
    </p>
  </div>
}
```

## Example

**Before (classes estáticas, sem tratamento do último item):**
```html
<div class="py-4 border-b border-gray-200">
  <p class="text-sm mb-3">{{ comment.description }}</p>
</div>
```

**After (classes dinâmicas com $last):**
```html
@for (comment of _task.comments; track comment.id; let last = $last) {
  <div [class]="`py-4 ${!last ? 'border-b border-gray-200' : ''}`">
    <p [class]="`text-sm ${!last ? 'mb-3' : ''}`">
      {{ comment.description }}
    </p>
  </div>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Modal exibe lista sem botão de confirmação | Passe instância clonada, atualize fonte de verdade só ao fechar |
| Último item não deve ter borda/margem | Use `let last = $last` no `@for` com ternário nas classes |
| Modal não deve fechar ao clicar fora | Use `disableClose: true` na config do modal |
| Precisa de dados dentro do modal | Injete `DIALOG_DATA` com `inject()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Passar referência direta do objeto ao modal | Passar instância clonada via `structuredClone` |
| `*ngFor="let item of list; let last = last"` | `@for (item of list; track item.id; let last = $last)` |
| `[ngClass]="{'border-b': !last}"` para casos simples | `[class]="` com template literal e ternário |
| Atualizar fonte de verdade diretamente no modal | Atualizar instância local, sincronizar ao fechar |
| Lógica manual de `index === list.length - 1` | Usar `$last` do `@for` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
