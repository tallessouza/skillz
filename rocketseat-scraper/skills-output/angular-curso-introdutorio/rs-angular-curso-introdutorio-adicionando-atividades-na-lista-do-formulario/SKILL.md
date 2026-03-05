---
name: rs-angular-intro-form-list-crud
description: "Applies Angular list CRUD patterns when building forms with dynamic item addition and removal. Use when user asks to 'add items to a list', 'remove items from array', 'build a dynamic form', 'manage list in Angular', or 'splice array items'. Enforces ngModel binding, input clearing after add, index-based removal with splice, and conditional button state. Make sure to use this skill whenever implementing dynamic lists in Angular template-driven forms. Not for reactive forms, API calls, or routing."
---

# Adicionando e Removendo Itens em Listas Angular

> Ao implementar listas dinamicas em formularios Angular, use event binding para adicionar itens via push, limpe o campo apos adicao, e remova itens pelo index com splice.

## Rules

1. **Vincule o input com ngModel antes de usar o valor** — a variavel ja esta disponivel no componente, basta fazer push no array, porque o two-way binding garante sincronia
2. **Limpe o campo apos adicionar** — atribua string vazia a variavel vinculada ao ngModel apos o push, porque o usuario espera o campo limpo para a proxima entrada
3. **Remova pelo index, nunca pelo valor** — use `$index` do `@for` e `splice(index, 1)`, porque valores podem ser duplicados mas o index e unico na iteracao
4. **Habilite/desabilite botoes conforme o estado da lista** — use `[disabled]` vinculado ao length do array, porque da feedback visual imediato ao usuario

## How to write

### Adicionar item ao array

```typescript
// No componente
adicionarAtividade() {
  this.atividades.push(this.atividade);
  this.atividade = ''; // limpa o campo
}
```

```html
<!-- No template -->
<input [(ngModel)]="atividade" />
<button (click)="adicionarAtividade()">Adicionar</button>
```

### Remover item pelo index

```typescript
excluirAtividade(index: number) {
  this.atividades.splice(index, 1);
}
```

```html
@for (atividade of atividades; track $index) {
  <li>
    {{ atividade }}
    <button (click)="excluirAtividade($index)" class="remove-btn">X</button>
  </li>
}
```

### Botao condicional baseado na lista

```html
<button [disabled]="!atividades.length">Gerar Certificado</button>
```

## Example

**Before (sem limpeza, sem remocao por index):**

```typescript
adicionarAtividade() {
  this.atividades.push(this.atividade);
  // campo permanece preenchido apos adicionar
}

excluirAtividade(atividade: string) {
  // remove pelo valor — falha com duplicados
  const i = this.atividades.indexOf(atividade);
  this.atividades.splice(i, 1);
}
```

**After (com esta skill aplicada):**

```typescript
adicionarAtividade() {
  this.atividades.push(this.atividade);
  this.atividade = '';
}

excluirAtividade(index: number) {
  this.atividades.splice(index, 1);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input vinculado com ngModel | Use a variavel diretamente no push, sem querySelector |
| Precisa limpar campo apos acao | Atribua string vazia a variavel do ngModel |
| Precisa identificar item clicado em lista | Use `$index` do `@for`, passe como parametro |
| Botao depende do estado de um array | Use `[disabled]` com condicao sobre `.length` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `document.getElementById('input').value` | `this.atividade` (via ngModel) |
| `splice(atividades.indexOf(item), 1)` | `splice(index, 1)` com index do `@for` |
| Campo permanece preenchido apos push | `this.atividade = ''` apos push |
| `removeChild` ou manipulacao DOM direta | `splice` no array + Angular re-renderiza |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
