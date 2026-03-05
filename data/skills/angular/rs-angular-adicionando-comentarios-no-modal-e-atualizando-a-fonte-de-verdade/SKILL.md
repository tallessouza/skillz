---
name: rs-angular-comentarios-modal-fonte-verdade
description: "Enforces Angular CDK Dialog patterns for modal data flow and source-of-truth updates. Use when user asks to 'add comments in a modal', 'close dialog and return data', 'update parent from modal', 'use DialogRef', or 'sync modal changes with service'. Applies rules: inject DialogRef with typed close, unshift for newest-first lists, reset FormControl after submit, flag-based change tracking, subscribe to closed observable in parent. Make sure to use this skill whenever implementing Angular CDK dialog communication patterns. Not for modal styling, template layout, or non-Angular dialog libraries."
---

# Comentarios no Modal e Atualizacao da Fonte de Verdade

> Ao implementar modais com Angular CDK Dialog, o fluxo de dados segue: criar item → atualizar instancia local → sinalizar mudanca via DialogRef.close → componente pai reage via closed observable → atualizar fonte de verdade no service.

## Rules

1. **Injete DialogRef tipado com o tipo de retorno** — `DialogRef<boolean>`, porque o tipo generico garante type-safety no valor enviado ao fechar e recebido no subscribe do pai
2. **Use unshift para adicionar itens no inicio do array** — `array.unshift(newItem)` nao `array.push(newItem)`, porque comentarios mais recentes devem aparecer primeiro na lista
3. **Resete o FormControl apos adicionar** — `this.control.reset()`, porque manter o texto antigo no input prejudica a experiencia do usuario
4. **Use flag booleana para rastrear mudancas** — inicialize como `false`, set `true` ao modificar, porque evita chamadas desnecessarias ao service quando nada mudou
5. **Diferencie close de closed** — `dialogRef.close(value)` envia o valor de DENTRO do modal, `dialogRef.closed.subscribe()` recebe o valor NO componente pai, porque confundir os dois causa bugs silenciosos
6. **Gere IDs unicos para cada item criado** — use uma funcao utilitaria como `generateUniqueId()`, porque facilita identificacao e exclusao futura

## How to write

### Criar e adicionar comentario no modal

```typescript
onAddComment(): void {
  const newComment: IComment = {
    id: generateUniqueId(),
    description: this.commentControl.value
      ? this.commentControl.value
      : '',
  };

  this._task.comments.unshift(newComment);
  this.commentControl.reset();
  this.taskCommentsChanged = true;
}
```

### Fechar modal enviando flag de mudanca

```typescript
private readonly _dialogRef = inject(DialogRef<boolean>);
taskCommentsChanged = false;

onCloseModal(): void {
  this._dialogRef.close(this.taskCommentsChanged);
}
```

### Componente pai: reagir ao fechamento

```typescript
openTaskCommentsModal(): void {
  const dialogRef = this.dialog.open(TaskCommentsModalComponent, {
    data: { task: this.task },
  });

  dialogRef.closed.subscribe((taskCommentsChanged) => {
    if (taskCommentsChanged) {
      this._taskService.updateTaskComments(
        this.task.id,
        this.task.status,
        this.task.comments
      );
    }
  });
}
```

## Example

**Before (sem controle de mudancas):**
```typescript
// Modal fecha sem informar o pai
onClose(): void {
  this._dialogRef.close();
}

// Pai sempre atualiza, mesmo sem mudancas
dialogRef.closed.subscribe(() => {
  this.taskService.updateComments(this.task.id, this.task.comments);
});
```

**After (com flag e fluxo correto):**
```typescript
// Modal informa se houve mudanca
onCloseModal(): void {
  this._dialogRef.close(this.taskCommentsChanged);
}

// Pai so atualiza quando necessario
dialogRef.closed.subscribe((changed) => {
  if (changed) {
    this._taskService.updateTaskComments(
      this.task.id, this.task.status, this.task.comments
    );
  }
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo item deve aparecer primeiro na lista | `array.unshift(item)` |
| FormControl value pode ser null | Ternario com fallback para string vazia |
| Modal modifica dados do pai | Use flag + DialogRef tipado para comunicar |
| Instancia do objeto e compartilhada por referencia | Mutacoes no modal ja refletem no pai, so precisa sinalizar |
| Nenhuma mudanca foi feita no modal | Nao chame o service, verifique a flag primeiro |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `comments.push(newComment)` | `comments.unshift(newComment)` (mais recente primeiro) |
| `this._dialogRef.closed(value)` | `this._dialogRef.close(value)` (close sem d envia) |
| `dialogRef.close.subscribe()` | `dialogRef.closed.subscribe()` (closed com d recebe) |
| `DialogRef` sem tipo generico | `DialogRef<boolean>` com tipo do valor retornado |
| Atualizar service sem checar mudanca | `if (changed) { service.update(...) }` |
| Deixar input com texto apos submit | `this.formControl.reset()` apos adicionar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
