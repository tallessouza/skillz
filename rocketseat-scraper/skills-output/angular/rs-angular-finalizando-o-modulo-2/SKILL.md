---
name: rs-angular-pipes-overview
description: "Applies Angular built-in and custom pipe patterns when working with data transformation in templates. Use when user asks to 'format data', 'transform text', 'display currency', 'format date', 'create a pipe', or 'reuse template logic' in Angular. Ensures correct pipe selection, locale configuration, and custom pipe creation for reusability. Make sure to use this skill whenever generating Angular template code that displays formatted data. Not for RxJS operators, service-layer transformations, or non-Angular frameworks."
---

# Angular Pipes — Guia de Referencia

> Usar pipes existentes em vez de recriar logica; conhecer quais existem importa mais do que decorar detalhes.

## Conceito central

Pipes transformam dados no template sem poluir o componente com logica de formatacao. Angular oferece pipes built-in para os casos mais comuns. Quando nenhum pipe built-in resolve, crie um pipe customizado e reutilize em multiplos componentes.

## Decision framework

| Preciso de... | Use |
|---------------|-----|
| Texto maiusculo/minusculo/title | `UpperCasePipe`, `LowerCasePipe`, `TitleCasePipe` |
| Formatar moeda | `CurrencyPipe` (respeita locale) |
| Formatar data | `DatePipe` (respeita locale + timezone) |
| Formatar porcentagem | `PercentPipe` (respeita locale) |
| Exibir JSON para debug | `JsonPipe` |
| Cortar string/array | `SlicePipe` |
| Resolver Observable no template | `AsyncPipe` |
| Mesma logica de formatacao em 2+ componentes | Pipe customizado |
| Logica usada em 1 lugar so | Metodo no componente (nao precisa de pipe) |

## Rules

1. **Nunca recrie logica que um pipe built-in ja resolve** — verifique a documentacao antes de criar funcao manual, porque o Angular ja otimiza pipes puros com memoizacao
2. **Use pipes customizados para reutilizar logica entre componentes** — se a mesma transformacao aparece em 2+ templates, extraia para um pipe, porque copiar metodos entre componentes viola DRY
3. **Configure locale via LOCALE_ID injection token** — `CurrencyPipe`, `PercentPipe` e `DatePipe` dependem disso para formatar corretamente por regiao
4. **Entenda UTC antes de usar DatePipe** — datas vem em UTC do backend; aplique offset de timezone para exibir corretamente na regiao do usuario
5. **Prefira pipes puros** — pipes puros so reexecutam quando a referencia do input muda; pipes impuros reexecutam a cada change detection cycle, porque isso impacta performance
6. **Consulte a documentacao, nao decore** — saber que um pipe EXISTE e mais importante que decorar seus parametros

## Pipes built-in principais

| Pipe | Uso | Depende de Locale |
|------|-----|-------------------|
| `AsyncPipe` | Resolve Observable/Promise no template | Nao |
| `CurrencyPipe` | `{{ price \| currency:'BRL' }}` | Sim |
| `DatePipe` | `{{ date \| date:'dd/MM/yyyy' }}` | Sim |
| `PercentPipe` | `{{ value \| percent:'1.0-2' }}` | Sim |
| `UpperCasePipe` | `{{ text \| uppercase }}` | Nao |
| `LowerCasePipe` | `{{ text \| lowercase }}` | Nao |
| `TitleCasePipe` | `{{ text \| titlecase }}` | Nao |
| `SlicePipe` | `{{ array \| slice:0:5 }}` | Nao |
| `JsonPipe` | `{{ obj \| json }}` | Nao |

## Quando criar pipe customizado

```typescript
// Logica repetida em multiplos templates → extraia para pipe
@Pipe({ name: 'cpfFormat', standalone: true })
export class CpfFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
```

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Criar funcao `toUpperCase()` no componente | `{{ text \| uppercase }}` |
| Copiar logica de formatacao em 10 componentes | Criar pipe customizado reutilizavel |
| Usar pipe impuro sem necessidade | Pipe puro (default) — melhor performance |
| Ignorar locale e hardcodar formato | Configurar `LOCALE_ID` e deixar pipes respeitarem |
| Decorar todos os parametros de DatePipe | Consultar documentacao quando precisar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
