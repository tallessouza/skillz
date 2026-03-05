---
name: rs-angular-o-que-sao-pipes
description: "Enforces Angular pipe usage over component methods for value transformation in templates. Use when user asks to 'format value in template', 'transform data for display', 'create Angular component', 'improve Angular performance', or 'avoid change detection issues'. Applies rules: prefer built-in pipes over custom functions, never mutate original values in custom pipes, chain pipes for complex transformations, use parentheses with ternaries. Make sure to use this skill whenever writing Angular template code that transforms values for display. Not for backend data transformation, RxJS operators, or non-Angular frameworks."
---

# Angular Pipes

> Usar pipes para toda transformacao de valor no template, nunca metodos da classe do componente.

## Rules

1. **Prefira pipes a metodos no template** — pipes puros so reexecutam quando o parametro muda, metodos reexecutam a cada change detection, causando problemas de performance especialmente em listas com `*ngFor`
2. **Nunca mute o valor original** — pipes recebem um valor e retornam um novo valor, sem alterar a propriedade original. Em pipes customizados, clone o objeto antes de manipular, porque mutacao causa bugs de imutabilidade dificeis de rastrear
3. **Use built-in pipes antes de criar custom** — Angular ja oferece `uppercase`, `lowercase`, `date`, `currency`, `decimal`, `titlecase`, `async` entre outros
4. **Importe o pipe no componente** — adicione a classe do pipe (ex: `CurrencyPipe`) nos `imports` do componente standalone
5. **Encadeie pipes para transformacoes compostas** — o retorno de um pipe pode ser passado como parametro para o proximo usando `|`
6. **Use parenteses com ternarios** — o operador pipe `|` tem precedencia maior que o ternario, entao `(condition ? 'a' : 'b') | uppercase` precisa dos parenteses

## How to write

### Usar pipe built-in no template

```html
<!-- Valor da propriedade amount passado ao currency pipe -->
<p>Total: {{ amount | currency }}</p>

<!-- Pipe com parametros adicionais separados por : -->
<p>{{ birthday | date:'fullDate' }}</p>
```

### Encadear pipes

```html
<!-- date formata, uppercase transforma o resultado -->
<p>{{ birthday | date:'fullDate' | uppercase }}</p>
```

### Importar pipe no componente

```typescript
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CurrencyPipe, UpperCasePipe],
  template: `<p>{{ price | currency }}</p>`
})
export class ExampleComponent {
  price = 1234.5;
}
```

## Example

**Before (metodo no template — problema de performance):**

```typescript
@Component({
  template: `<p>{{ formatPrice(amount) }}</p>`
})
export class BadComponent {
  amount = 1234.5;
  formatPrice(value: number) {
    return '$' + value.toFixed(2); // reexecuta a CADA change detection
  }
}
```

**After (pipe — performatico):**

```typescript
import { CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [CurrencyPipe],
  template: `<p>{{ amount | currency }}</p>`
})
export class GoodComponent {
  amount = 1234.5; // pipe so reexecuta se amount mudar
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formatar string para display | Usar `uppercase`, `lowercase`, `titlecase` pipes |
| Formatar data | Usar `date` pipe com formato como parametro |
| Formatar moeda/numeros | Usar `currency` ou `decimal` pipe |
| Transformacao dentro de `*ngFor` | Pipe obrigatorio — metodo causaria re-render massivo |
| Ternario + pipe | Envolver ternario em parenteses |
| Pipe customizado recebe objeto | Clonar antes de manipular, retornar nova instancia |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `{{ formatName(user) }}` (metodo no template) | `{{ user.name \| uppercase }}` |
| `{{ isActive ? 'Sim' : 'Nao' \| uppercase }}` | `{{ (isActive ? 'Sim' : 'Nao') \| uppercase }}` |
| Funcao utils global para formatacao de template | Pipe reutilizavel importado nos componentes |
| Mutar objeto original dentro de pipe customizado | Clonar objeto, manipular clone, retornar clone |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
