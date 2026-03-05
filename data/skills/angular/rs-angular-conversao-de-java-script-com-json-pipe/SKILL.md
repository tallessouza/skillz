---
name: rs-angular-json-pipe
description: "Applies Angular JsonPipe for template debugging when writing Angular components. Use when user asks to 'debug template', 'display object in template', 'log data in Angular template', 'inspect array in component', or 'visualize data binding'. Ensures proper JsonPipe import and usage for readable object/array display. Make sure to use this skill whenever debugging Angular template data binding issues. Not for console.log debugging, unit testing, or non-Angular frameworks."
---

# JsonPipe para Debug no Template Angular

> Use o JsonPipe para visualizar objetos e arrays diretamente no template, eliminando o inutil `[object Object]`.

## Rules

1. **Importe do `@angular/common`** — `import { JsonPipe } from '@angular/common'`, porque sem o import o pipe nao e reconhecido no template
2. **Use para debug, nao para producao** — JsonPipe e ferramenta de depuracao, remova antes de fazer merge porque exibir JSON bruto nao e UX aceitavel
3. **Prefira JsonPipe ao console.log no template** — interpolacao com `| json` mostra o estado real do binding, enquanto console.log mostra o estado no momento da execucao do TypeScript
4. **Nunca interpole objetos sem pipe** — `{{ myObject }}` resulta em `[object Object]`, que e inutil para debug

## How to write

### Import e uso basico

```typescript
// No componente standalone, adicione JsonPipe aos imports
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <pre>{{ config | json }}</pre>
    <pre>{{ tags | json }}</pre>
  `
})
export class DebugComponent {
  config = { theme: 'dark', language: 'pt-BR' };
  tags = ['angular', 'typescript', 'pipes'];
}
```

## Example

**Before (sem JsonPipe — output inutil):**
```html
<p>{{ config }}</p>    <!-- [object Object] -->
<p>{{ tags }}</p>      <!-- angular,typescript,pipes -->
```

**After (com JsonPipe — output legivel):**
```html
<pre>{{ config | json }}</pre>
<!-- { "theme": "dark", "language": "pt-BR" } -->

<pre>{{ tags | json }}</pre>
<!-- [ "angular", "typescript", "pipes" ] -->
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nao sabe o que o template esta recebendo | Adicione `{{ propriedade \| json }}` temporariamente |
| Array exibindo valores separados por virgula | Use `\| json` para ver a estrutura completa |
| Objeto mostrando `[object Object]` | Use `\| json` para expandir as propriedades |
| Debug finalizado | Remova todos os `\| json` antes do commit |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `{{ meuObjeto }}` para debug | `{{ meuObjeto \| json }}` |
| `console.log()` para inspecionar binding | `<pre>{{ dado \| json }}</pre>` no template |
| JsonPipe em producao sem motivo | Remova apos depuracao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
