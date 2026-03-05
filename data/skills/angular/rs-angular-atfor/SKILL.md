---
name: rs-angular-atfor
description: "Enforces correct usage of Angular's @for block syntax when rendering lists in templates. Use when user asks to 'render a list', 'loop through items', 'display array', 'iterate over data', or 'create a list component' in Angular. Applies rules: always use track with unique ID, use @empty for empty states, prefer @for over *ngFor. Make sure to use this skill whenever generating Angular template code that involves arrays or collections. Not for React, Vue, or non-Angular list rendering."
---

# Angular @for — Renderizacao de Listas

> Ao renderizar listas em templates Angular, use sempre `@for` com `track` por identificador unico para garantir performance e controle de atualizacoes no DOM.

## Rules

1. **Use `@for` em vez de `*ngFor`** — `@for` e a sintaxe moderna do Angular, nao requer importacao de diretivas e possui track obrigatorio, porque isso garante performance por padrao
2. **Sempre use `track` com identificador unico** — `track product.id` nao `track $index`, porque o Angular usa o track para identificar quais itens mudaram sem re-renderizar a lista inteira
3. **Use `@empty` para listas vazias** — coloque o bloco `@empty` dentro do `@for`, porque substitui a necessidade de um `@if` separado para verificar lista vazia
4. **Garanta ID unico em cada item** — mesmo itens criados no front devem receber um ID (use UUID), porque facilita remocao, atualizacao e o proprio track do Angular
5. **Nao importe nada para usar `@for`** — diferente do `*ngFor` que exigia `NgFor` ou `CommonModule`, o `@for` funciona nativamente no template

## How to write

### Estrutura basica do @for

```typescript
// Template (component.html)
@for (product of products; track product.id) {
  <div>
    <h3>{{ product.name }}</h3>
    <p>{{ product.price | number: '1.2-2' }}</p>
    <button (click)="removeProduct(product.id)">Remover</button>
  </div>
} @empty {
  <p>Nenhum item encontrado.</p>
}
```

### Componente com lista e manipulacao

```typescript
interface IProduct {
  id: string;
  name: string;
  price: number;
}

@Component({ /* ... */ })
export class ProductListComponent {
  products: IProduct[] = [
    { id: '1', name: 'Produto A', price: 100 },
    { id: '2', name: 'Produto B', price: 200 },
  ];

  removeProduct(id: string) {
    this.products = this.products.filter(product => product.id !== id);
  }
}
```

## Example

**Before (sintaxe antiga com *ngFor):**
```html
<!-- Requer importar NgFor e NgIf no componente -->
<div *ngFor="let product of products">
  <h3>{{ product.name }}</h3>
  <button (click)="removeProduct(product.id)">Remover</button>
</div>
<p *ngIf="products.length === 0">Nenhum item encontrado.</p>
```

**After (com @for):**
```html
<!-- Nao requer importacao de diretivas -->
@for (product of products; track product.id) {
  <div>
    <h3>{{ product.name }}</h3>
    <button (click)="removeProduct(product.id)">Remover</button>
  </div>
} @empty {
  <p>Nenhum item encontrado.</p>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista vem de chamada HTTP | Use o ID retornado pela API como track |
| Itens criados no front | Gere UUID antes de adicionar na lista |
| Lista pode ser vazia | Sempre inclua bloco `@empty` |
| Projeto legado sem suporte a `@for` | Use `*ngFor` com trackBy function |
| Precisa usar pipes na renderizacao | Importe o pipe (ex: `DecimalPipe`) no componente |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `*ngFor="let item of items"` (projeto novo) | `@for (item of items; track item.id)` |
| `track $index` (com dados mutaveis) | `track item.id` (identificador unico) |
| `*ngIf="items.length === 0"` para empty state | `@empty { ... }` dentro do `@for` |
| `@for` sem track | `@for` com track obrigatorio (compilador exige) |
| Importar `CommonModule` so para loop | `@for` nao requer importacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
