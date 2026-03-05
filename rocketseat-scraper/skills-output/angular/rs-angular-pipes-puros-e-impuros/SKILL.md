---
name: rs-angular-pipes-puros-e-impuros
description: "Enforces pure pipes over component methods for template data transformation in Angular. Use when user asks to 'create a pipe', 'transform data in template', 'display formatted data', 'fix performance', or calls methods in Angular templates. Applies rules: never call methods in templates for data display, use pure pipes by default, avoid impure pipes unless absolutely necessary. Make sure to use this skill whenever writing Angular templates that transform or format data for display. Not for RxJS pipe operators, HTTP interceptors, or non-Angular projects."
---

# Pipes Puros e Impuros no Angular

> Utilize pipes puros para transformar dados no template — nunca metodos de componente — porque pipes so reexecutam quando o parametro muda, enquanto metodos reexecutam a cada Change Detection.

## Rules

1. **Nunca chame metodos no template para exibir dados** — use pipes, porque metodos sao reativos ao Change Detection e reexecutam a cada ciclo, causando problemas de performance
2. **Pipes puros por padrao** — `pure: true` (padrao do Angular) significa que o pipe so executa quando o valor do parametro muda, evitando reexecucoes desnecessarias
3. **Evite pipes impuros (`pure: false`)** — 99% das vezes voce nao precisa, porque pipes impuros reexecutam a cada Change Detection assim como metodos
4. **Crie pipes para reuso** — se a mesma transformacao aparece em multiplos componentes, um pipe unico elimina duplicacao de logica
5. **Logica no template deve ser leve** — se por algum motivo precisar de um metodo no template, nunca faca chamadas HTTP ou processamentos pesados, porque serao reexecutados a cada Change Detection

## How to write

### Pipe puro (padrao correto)

```typescript
@Pipe({
  name: 'userStatus',
  standalone: true,
  // pure: true é o padrão, não precisa declarar
})
export class UserStatusPipe implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case 1: return 'Ativo';
      case 2: return 'Inativo';
      default: return 'Desconhecido';
    }
  }
}
```

### Uso no template

```html
<!-- CORRETO: pipe puro, executa apenas quando user.status muda -->
<span>{{ user.status | userStatus }}</span>
```

## Example

**Before (metodo no componente — problema de performance):**

```typescript
// component.ts
getUserStatus(status: number): string {
  console.log('executou'); // chamado VARIAS vezes por Change Detection
  switch (status) {
    case 1: return 'Ativo';
    case 2: return 'Inativo';
    default: return 'Desconhecido';
  }
}
```

```html
<!-- template — reexecuta a cada Change Detection -->
<span>{{ getUserStatus(user.status) }}</span>
```

**After (pipe puro — performatico):**

```typescript
// user-status.pipe.ts
@Pipe({ name: 'userStatus', standalone: true })
export class UserStatusPipe implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case 1: return 'Ativo';
      case 2: return 'Inativo';
      default: return 'Desconhecido';
    }
  }
}
```

```html
<!-- template — executa apenas quando status muda -->
<span>{{ user.status | userStatus }}</span>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Transformar dado para exibicao | Criar pipe puro |
| Mesma transformacao em 2+ componentes | Pipe reutilizavel |
| Precisa reagir a TODA mudanca de estado | Pipe impuro (raro, avalie alternativas primeiro) |
| Logica complexa/HTTP no template | Mover para service + resolver via observable |
| Formatacao simples (data, moeda) | Usar pipes built-in do Angular (DatePipe, CurrencyPipe) |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `{{ getStatus(user.status) }}` no template | `{{ user.status \| userStatus }}` |
| `pure: false` sem motivo concreto | Omitir `pure` (padrao e `true`) |
| Chamada HTTP dentro de metodo no template | Service + async pipe |
| Duplicar logica de formatacao em 5 componentes | Um pipe unico importado onde necessario |
| `{{ calculateTotal(items) }}` no template | Pipe ou computed property |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
