---
name: rs-angular-interpolacao-template
description: "Enforces correct Angular interpolation patterns when writing component templates. Use when user asks to 'display data in template', 'show component property', 'use interpolation', 'bind data to view', or any Angular template rendering task. Applies rules: only simple expressions, no method calls with side effects, no assignments, use pipes for transformation, use getters for computed values. Make sure to use this skill whenever generating Angular template code with double curly braces. Not for event binding, structural directives, or two-way binding."
---

# Interpolacao Angular — Passando Valores para o Template

> Interpolacao serve apenas para exibir valores — nunca para executar logica ou causar efeitos colaterais.

## Rules

1. **Apenas expressoes simples** — ternarios, concatenacoes, operacoes matematicas basicas, porque o Change Detection do Angular re-executa interpolacoes multiplas vezes e expressoes complexas causam problemas de performance
2. **Nunca chame metodos com efeitos colaterais** — metodos que alteram propriedades do componente serao re-executados pelo Change Detection, incrementando valores de forma inesperada (ex: counter mostrando 2, 3, 5, 8 ao inves de 1)
3. **Use pipes para transformacoes** — `uppercase`, `date`, `currency`, `async` — porque sao puros e otimizados pelo Angular para re-execucao
4. **Use getters para valores computados** — `get nomeCompleto()` acessa-se como propriedade no template, sem parenteses, porque mantem o template limpo
5. **Nunca faca atribuicoes dentro da interpolacao** — `{{ counter = 2 }}` nao funciona e nao e o proposito da interpolacao
6. **Acesse propriedades de objetos, nunca o objeto direto** — `{{ usuario.nome }}` nao `{{ usuario }}`, porque o Angular nao consegue converter instancias de objetos em string de forma legivel
7. **Importe pipes nos imports do componente** — todos os pipes nativos vem de `@angular/common` e precisam estar no array de imports

## How to write

### Propriedades simples
```typescript
// Componente
nome = 'Ana';
idade = 25;
estaAtivo = true;
```
```html
<!-- Template -->
<p>{{ nome }}</p>
<p>{{ idade }}</p>
<p>{{ estaAtivo }}</p>
```

### Operacoes matematicas
```typescript
precoUnitario = 10;
quantidade = 5;
```
```html
<p>Total: R$ {{ precoUnitario * quantidade }}</p>
<p>Soma: {{ 10 + 5 }}</p>
```

### Pipes de transformacao
```typescript
imports: [DatePipe, CurrencyPipe, UpperCasePipe]
```
```html
<p>{{ dataEvento | date:'shortDate' }}</p>
<p>{{ valorCompra | currency:'BRL':'symbol':'1.2-2' }}</p>
<p>{{ 'Ola Mundo' | uppercase }}</p>
```

### Getter (propriedade computada)
```typescript
nome = 'Ana';
sobrenome = 'Silva';

get nomeCompleto(): string {
  return `${this.nome} ${this.sobrenome}`;
}
```
```html
<!-- Chame como propriedade, SEM parenteses -->
<p>{{ nomeCompleto }}</p>
```

### AsyncPipe com Observable
```typescript
imports: [AsyncPipe]
// ...
dados$ = new Observable<string>(observer => {
  observer.next('Dados carregados');
});
```
```html
<p>{{ dados$ | async }}</p>
```

## Example

**Before (efeito colateral — BUG):**
```typescript
counter = 0;

meuCounter() {
  this.counter += 1; // efeito colateral!
  return this.counter;
}
```
```html
<p>{{ meuCounter() }}</p>
<!-- Mostra 2, 3, 5... Change Detection re-executa multiplas vezes -->
```

**After (correto):**
```typescript
counter = 0;

incrementar() {
  this.counter += 1;
}
```
```html
<p>{{ counter }}</p>
<button (click)="incrementar()">+1</button>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mostrar propriedade simples | `{{ propriedade }}` direto |
| Formatar data/moeda/texto | Use pipe nativo (`date`, `currency`, `uppercase`) |
| Concatenar strings | `{{ nome + ' ' + sobrenome }}` ou getter |
| Logica condicional simples | Ternario: `{{ ativo ? 'Online' : 'Offline' }}` |
| Valor precisa de calculo | Crie um getter no componente |
| Transformacao complexa | Crie um pipe customizado |
| Acessar item de array | `{{ frutas[0] }}` — nunca o array direto |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `{{ metodoComSideEffect() }}` | `{{ propriedade }}` e mude via evento |
| `{{ usuario }}` (objeto direto) | `{{ usuario.nome }}` |
| `{{ frutas }}` (array direto) | `{{ frutas[0] }}` ou use `*ngFor` |
| `{{ counter = 2 }}` | Atribua no componente, exiba no template |
| `{{ calcularDescontoComHTTP() }}` | Use getter ou pipe + async |
| `{{ lista.filter(...).map(...) }}` | Crie propriedade computada no componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
