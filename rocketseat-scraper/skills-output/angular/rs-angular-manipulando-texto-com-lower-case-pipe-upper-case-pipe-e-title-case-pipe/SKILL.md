---
name: rs-angular-text-case-pipes
description: "Applies Angular text transformation pipes (lowercase, uppercase, titleCase) when generating Angular templates. Use when user asks to 'format text', 'transform string case', 'create Angular template', 'pipe text', or 'chain pipes in Angular'. Ensures correct import from @angular/common, proper pipe syntax, and pipe chaining patterns. Make sure to use this skill whenever generating Angular templates that display user-facing text. Not for custom pipes, date/number formatting, or non-Angular projects."
---

# Pipes de Manipulacao de Texto no Angular

> Ao exibir texto em templates Angular, use os pipes built-in lowercase, uppercase e titleCase para transformar strings sem logica no componente.

## Rules

1. **Importe o pipe do @angular/common** — `import { LowerCasePipe } from '@angular/common'`, porque pipes built-in nao sao globais e precisam estar no imports do componente
2. **Use o nome exato no template** — `lowercase`, `uppercase`, `titleCase`, porque nomes errados falham silenciosamente
3. **Encadeie pipes da esquerda para direita** — `{{ valor | date:'full' | uppercase }}`, porque o retorno de cada pipe e passado como entrada do proximo
4. **Nunca transforme case no componente quando o pipe resolve** — mantenha a transformacao no template, porque pipes sao puros e otimizados pelo Angular change detection
5. **Caracteres especiais e numeros sao preservados** — pipes de case so afetam letras, numeros e caracteres especiais passam intactos

## How to write

### LowerCasePipe — tudo minusculo

```typescript
// component.ts
import { LowerCasePipe } from '@angular/common';

@Component({
  imports: [LowerCasePipe],
  template: `<p>{{ userName | lowercase }}</p>`
})
export class UserComponent {
  userName = 'JOÃO_SILVA123';
  // resultado: joão_silva123
}
```

### UpperCasePipe — tudo maiusculo

```typescript
import { UpperCasePipe } from '@angular/common';

@Component({
  imports: [UpperCasePipe],
  template: `<p>{{ alertTitle | uppercase }}</p>`
})
export class AlertComponent {
  alertTitle = 'atenção: sistema em manutenção';
  // resultado: ATENÇÃO: SISTEMA EM MANUTENÇÃO
}
```

### TitleCasePipe — primeira letra de cada palavra maiuscula

```typescript
import { TitleCasePipe } from '@angular/common';

@Component({
  imports: [TitleCasePipe],
  template: `<p>{{ fullName | titleCase }}</p>`
})
export class ProfileComponent {
  fullName = 'maria da silva santos';
  // resultado: Maria Da Silva Santos
}
```

### Encadeamento de pipes

```typescript
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  imports: [DatePipe, UpperCasePipe],
  template: `<p>{{ createdAt | date:'full' | uppercase }}</p>`
})
export class EventComponent {
  createdAt = new Date();
  // date retorna string → uppercase transforma tudo em maiusculo
}
```

## Example

**Before (logica no componente):**
```typescript
export class UserComponent {
  rawName = 'JOÃO SILVA';
  displayName = this.rawName.toLowerCase(); // logica desnecessaria
}
```

**After (com pipe no template):**
```typescript
@Component({
  imports: [LowerCasePipe],
  template: `<p>{{ rawName | lowercase }}</p>`
})
export class UserComponent {
  rawName = 'JOÃO SILVA';
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Exibir nome de usuario normalizado | `{{ name \| lowercase }}` ou `{{ name \| titleCase }}` |
| Exibir alerta/badge em destaque | `{{ label \| uppercase }}` |
| Formatar titulo de pagina/card | `{{ title \| titleCase }}` |
| Transformar saida de outro pipe | Encadeie: `{{ val \| date:'full' \| uppercase }}` |
| Precisa de case customizado (camelCase, snake_case) | Crie um pipe custom, esses 3 nao resolvem |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `displayName = name.toLowerCase()` no .ts | `{{ name \| lowercase }}` no template |
| `{{ name \| lowercasepipe }}` (nome errado) | `{{ name \| lowercase }}` |
| Importar pipe sem adicionar no `imports` | `imports: [LowerCasePipe]` no @Component |
| `{{ name \| titlecase }}` (case errado) | `{{ name \| titleCase }}` (camelCase) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
