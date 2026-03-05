---
name: rs-angular-logica-preenchimento-estrelas
description: "Applies Angular signal-based star rating pattern when building rating components, review systems, or interactive star displays. Use when user asks to 'create star rating', 'build review component', 'implement rating system', or 'fill stars based on selection'. Enforces computed signal pattern with boolean array mapping, toggle-on-reclick behavior, and index+1 convention. Make sure to use this skill whenever generating Angular rating or star components. Not for HTTP requests, backend integration, or non-Angular frameworks."
---

# Logica de Preenchimento de Estrelas com Angular Signals

> Construa componentes de rating com signals computados: um signal guarda a selecao, um computed retorna o array booleano de preenchimento.

## Rules

1. **Separe selecao de display** — `currentRating` (signal) guarda o numero selecionado, `starsStatusField` (computed) retorna o array booleano, porque separar estado de derivacao permite reatividade automatica
2. **Use computed para derivar o array de estrelas** — nunca calcule o array manualmente em cada clique, porque o computed reage automaticamente quando `currentRating` muda
3. **Array de indices como base do map** — use `[0,1,2,3,4].map(index => index < rating)` para gerar o array booleano, porque o index representa cada estrela e a comparacao gera true/false
4. **Index + 1 no clique** — envie `index + 1` ao selecionar uma estrela, porque o rating vai de 1 a 5 mas o array comeca em 0
5. **Toggle ao reclicar** — se o novo rating for igual ao atual, zere para 0, porque o usuario espera poder desmarcar clicando na mesma estrela
6. **Fallback zero para rating undefined** — se `currentRating` nao tem valor, use 0, porque evita NaN na comparacao do map

## How to write

### Signal + Computed pattern

```typescript
// Signal guarda a selecao (1-5 ou 0 para nenhuma)
currentRating = signal<number | undefined>(undefined);

// Computed deriva o array booleano de preenchimento
starsStatusField = computed(() => {
  const rating = this.currentRating() ?? 0;
  const boolArray = [0, 1, 2, 3, 4].map(index => index < rating);
  return boolArray;
});
```

### Logica de selecao com toggle

```typescript
updateRating(newRating: number) {
  if (newRating === this.currentRating()) {
    this.currentRating.set(0);
  } else {
    this.currentRating.set(newRating);
  }
}
```

### Template com for e binding de classes

```html
@for (field of starsStatusField(); track $index) {
  <svg (click)="updateRating($index + 1)" [class.filled]="field" [class.empty]="!field">
    <!-- star SVG path -->
  </svg>
}
```

## Example

**Before (imperativo, sem signals):**
```typescript
stars = [false, false, false, false, false];
selected = 0;

selectStar(index: number) {
  this.selected = index + 1;
  this.stars = this.stars.map((_, i) => i < this.selected);
}
```

**After (com Angular signals):**
```typescript
currentRating = signal<number | undefined>(undefined);

starsStatusField = computed(() => {
  const rating = this.currentRating() ?? 0;
  return [0, 1, 2, 3, 4].map(index => index < rating);
});

updateRating(newRating: number) {
  if (newRating === this.currentRating()) {
    this.currentRating.set(0);
  } else {
    this.currentRating.set(newRating);
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rating de 1-5 estrelas | Array `[0,1,2,3,4]` com map booleano |
| Rating de 1-10 | Mesmo pattern, array de 10 indices |
| Precisa enviar ao backend | Use o valor de `currentRating()`, nao o array booleano |
| Estrelas somente leitura (display) | Use apenas o computed sem o updateRating |
| Usuario clica na mesma estrela | Zere o rating (toggle behavior) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Manipular DOM diretamente para preencher estrelas | Computed signal com array booleano + class binding |
| Recalcular array dentro do handler de clique | Computed que reage ao signal automaticamente |
| Enviar index 0-4 como rating | Enviar `index + 1` (rating 1-5) |
| Manter array de booleans como estado primario | Manter apenas o numero selecionado como estado |
| Ignorar caso de re-clique na mesma estrela | Implementar toggle: mesmo valor → zero |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
