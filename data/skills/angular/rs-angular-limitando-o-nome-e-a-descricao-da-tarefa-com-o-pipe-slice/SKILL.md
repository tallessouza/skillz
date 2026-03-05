---
name: rs-angular-slice-pipe-truncate
description: "Applies Angular slice pipe pattern to truncate long text in templates. Use when user asks to 'limit text length', 'truncate string', 'add ellipsis', 'fix layout breaking with long text', or 'slice pipe'. Enforces ternary-based length check with slice pipe and title tooltip for full text on hover. Make sure to use this skill whenever truncating display text in Angular templates. Not for backend string manipulation, CSS text-overflow, or custom pipe creation."
---

# Truncar Texto com Slice Pipe no Angular

> Usar o slice pipe nativo do Angular com ternario de length para limitar texto no template, preservando acesso ao texto completo via title.

## Rules

1. **Use ternario antes do slice** — verifique `text.length < maxChars` antes de aplicar o pipe, porque textos curtos nao precisam de truncamento e nao devem mostrar reticencias
2. **Use o slice pipe nativo** — `text | slice:0:maxChars` nao `text.substring()` no template, porque pipes sao a forma idiomatica do Angular para transformar dados no template
3. **Concatene reticencias apos o slice** — `(task.name | slice:0:13) + '...'` porque indica visualmente que o texto foi cortado
4. **Adicione property binding no title** — `[title]="task.name"` no elemento, porque permite ao usuario ver o texto completo ao passar o mouse
5. **Ajuste o limite por contexto** — titulos menores (13 chars), descricoes maiores (20 chars), porque cada area do layout tem espaco diferente

## How to write

### Truncamento com ternario + slice pipe

```html
<p [title]="task.name">
  {{ task.name.length < 13
    ? task.name
    : (task.name | slice:0:13) + '...' }}
</p>
```

### Import do SlicePipe

```typescript
import { SlicePipe } from '@angular/common';

@Component({
  // ...
  imports: [SlicePipe],
})
export class TaskCardComponent { }
```

## Example

**Before (texto longo quebra o layout):**
```html
<p>{{ task.name }}</p>
<p>{{ task.description }}</p>
```

**After (com truncamento e tooltip):**
```html
<p [title]="task.name">
  {{ task.name.length < 13
    ? task.name
    : (task.name | slice:0:13) + '...' }}
</p>

<p [title]="task.description">
  {{ task.description.length < 20
    ? task.description
    : (task.description | slice:0:20) + '...' }}
</p>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Titulo de card (espaco pequeno) | Limite em 13 chars |
| Descricao de card | Limite em 20 chars |
| Texto em lista/tabela | Ajuste o limite ao tamanho da coluna |
| Logica de truncamento complexa | Crie um custom pipe ao inves de ternario inline |
| Precisa de "ver mais" clicavel | Use componente dedicado, nao apenas slice |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `{{ task.name.substring(0, 13) }}` no template | `{{ task.name \| slice:0:13 }}` com pipe |
| Truncar sem verificar length | Ternario `length < max ? original : sliced + '...'` |
| Truncar sem forma de ver o completo | Adicione `[title]="task.name"` para tooltip |
| Mesmo limite para titulo e descricao | Limites diferentes conforme espaco disponivel |
| Pipe personalizado para logica simples | Ternario inline com slice pipe nativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
