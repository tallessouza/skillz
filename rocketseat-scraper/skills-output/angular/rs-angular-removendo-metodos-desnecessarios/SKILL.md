---
name: rs-angular-removendo-metodos-desnecessarios
description: "Applies safe code cleanup patterns when refactoring Angular components to remove unused logic. Use when user asks to 'clean up component', 'remove unused code', 'prepare for refactoring', 'simplify component', or 'remove dead code' in Angular projects. Enforces: initialize signals as undefined to prevent premature computed execution, stub methods before removing, replace removed bindings with safe defaults. Make sure to use this skill whenever cleaning up Angular component code before implementing new features. Not for adding new features, writing tests, or non-Angular refactoring."
---

# Removendo Metodos Desnecessarios

> Ao limpar codigo Angular, remova logica morta de forma segura, substituindo bindings por valores default antes de deletar, para manter o template compilando em cada passo.

## Rules

1. **Remova propriedades nao utilizadas primeiro** — delete signals/properties que nenhum template ou computed depende, porque codigo morto aumenta carga cognitiva sem beneficio
2. **Inicialize signals como undefined quando outros dependem dele** — `signal<number | undefined>(undefined)` evita que computed signals executem prematuramente, porque signals com valor inicial disparam dependentes imediatamente
3. **Substitua bindings removidos por valores seguros** — array vazio `[]`, `false`, ou stub method antes de deletar a implementacao real, porque template com binding quebrado impede compilacao
4. **Stub metodos antes de implementar** — crie o metodo vazio com assinatura correta (`updateRating(newRating: number)`) para o template compilar, porque Angular valida bindings em compile time
5. **Remova tipagens explicitas desnecessarias** — se TypeScript infere o tipo corretamente (ex: `WritableSignal`), remova a tipagem explicita para manter codigo enxuto
6. **Limpe em commits atomicos** — cada passo de remocao deve deixar o projeto compilando, porque refatoracao quebrada bloqueia todo o time

## How to write

### Signal inicializado como undefined (evitar execucao prematura)

```typescript
// Quando computed signals dependem deste valor
currentRating = signal<number | undefined>(undefined);

// Computed so executa quando currentRating receber valor real
averageDisplay = computed(() => {
  const rating = this.currentRating();
  if (rating === undefined) return '--';
  return rating.toFixed(1);
});
```

### Stub method com assinatura correta

```typescript
// Metodo stub para manter template compilando
updateRating(newRating: number) {
  // TODO: implementar logica de avaliacao
}
```

### Substituicao segura no template

```typescript
// Propriedade removida que o template ainda referencia
stars = []; // array vazio temporario
isStarFilled = false; // valor seguro temporario
```

## Example

**Before (componente com logica morta):**
```typescript
export class MovieDetailsComponent {
  reviewsCount = signal(0);
  stars = signal([1, 2, 3, 4, 5]);
  isFavorite: WritableSignal<boolean> = signal(false);
  currentRating = signal(0);

  constructor(private reviewService: ReviewService) {}

  isStarFilled(index: number) { return index <= this.currentRating(); }
  toggleFavorite() { this.isFavorite.update(v => !v); }
  setRating(event: Event) { /* logica antiga */ }
}
```

**After (limpo, pronto para nova feature):**
```typescript
export class MovieDetailsComponent {
  isFavorite = signal(false);
  currentRating = signal<number | undefined>(undefined);

  toggleFavorite() { this.isFavorite.update(v => !v); }
  updateRating(newRating: number) {
    // logica sera implementada no proximo passo
  }
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Propriedade usada apenas no .ts, nunca no template | Remova diretamente |
| Propriedade referenciada no template | Substitua por valor default, depois remova do template |
| Signal que alimenta computed signals | Inicialize como `undefined` com tipagem union |
| Metodo antigo sendo substituido por novo | Crie stub do novo, atualize template, depois delete antigo |
| Template usa `(click)="metodoRemovido()"` | Atualize para novo metodo ANTES de deletar o antigo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Remover propriedade sem checar template | Busque todas referencias no template antes de remover |
| Deixar `WritableSignal<T>` explicito quando inferivel | `signal(false)` — TypeScript infere `WritableSignal<boolean>` |
| Inicializar signal dependente com valor concreto `0` | Use `undefined` para evitar execucao prematura de dependentes |
| Remover metodo sem criar substituto | Crie stub com assinatura correta primeiro |
| Fazer toda limpeza em um unico commit gigante | Commits atomicos: cada passo compila |
| Usar `any` para "resolver rapido" erros de tipo | Tipagem correta: `number \| undefined` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
