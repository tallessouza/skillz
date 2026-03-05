---
name: rs-angular-keyvaluepipe
description: "Applies Angular KeyValuePipe patterns when iterating over objects or Maps in templates. Use when user asks to 'iterate over object properties', 'loop through a Map', 'display object keys and values', 'ngFor on object', or '@for on object'. Covers keyvalue pipe usage, original order preservation with compareFn, and injecting pipes in component classes. Make sure to use this skill whenever generating Angular template code that needs to iterate over non-array structures. Not for array iteration, custom pipe creation, or RxJS observables."
---

# KeyValuePipe — Iterando sobre Objetos e Maps

> Use o KeyValuePipe para transformar objetos e Maps em arrays iteraveis no template Angular.

## Rules

1. **Importe KeyValuePipe no componente** — adicione ao array de imports do componente, porque pipes standalone precisam de import explicito
2. **Use `| keyvalue` no `@for`** — `@for (item of objeto | keyvalue; track item.key)`, porque `@for` nao itera sobre objetos diretamente
3. **Preserve a ordem original com compareFn** — passe uma funcao que retorna 0 como segundo parametro, porque o KeyValuePipe ordena alfabeticamente por padrao
4. **Acesse `item.key` e `item.value`** — o pipe gera um array de objetos `{key, value}`, porque essa e a estrutura padrao do output
5. **Para usar pipe na classe, registre nos providers** — pipes com dependencias internas precisam estar nos `providers` do componente, porque diferente de services eles nao tem `providedIn: 'root'`
6. **Combine com outros pipes** — `item.value | currency` funciona normalmente apos o keyvalue, porque cada item.value e um valor independente

## How to write

### Iterando sobre objeto

```typescript
// No componente
import { KeyValuePipe } from '@angular/common';

@Component({
  imports: [KeyValuePipe],
  template: `
    @for (item of user | keyvalue; track item.key) {
      <p>{{ item.key }}: {{ item.value }}</p>
    }
  `
})
export class MyComponent {
  user = { name: 'Felipe', role: 'Dev', id: 1 };
}
```

### Mantendo ordem original

```typescript
// Funcao que impede a reordenacao do keyvalue
keepOriginalOrder = () => 0;

// No template
@for (item of user | keyvalue: keepOriginalOrder; track item.key) {
  <p>{{ item.key }}: {{ item.value }}</p>
}
```

### Iterando sobre Map

```typescript
cardapio = new Map<string, number>([
  ['X-Bacon', 25],
  ['Batata Frita', 15],
  ['Coca-Cola', 8],
]);

// No template — combine com currency pipe
@for (item of cardapio | keyvalue: keepOriginalOrder; track item.key) {
  <p>{{ item.key }}: {{ item.value | currency }}</p>
}
```

### Usando pipe na classe do componente

```typescript
@Component({
  providers: [KeyValuePipe], // Necessario para injetar
  imports: [KeyValuePipe],
})
export class MyComponent {
  private keyValuePipe = inject(KeyValuePipe);

  user = { name: 'Felipe', role: 'Dev', id: 1 };

  ngOnInit() {
    const entries = this.keyValuePipe.transform(this.user);
    // entries = [{key: 'name', value: 'Felipe'}, ...]
  }
}
```

## Example

**Before (erro comum — tentar iterar objeto diretamente):**
```typescript
// ERRO: @for nao aceita objetos
@for (item of user; track $index) {
  <p>{{ item }}</p>
}
```

**After (com KeyValuePipe):**
```typescript
@for (item of user | keyvalue: keepOriginalOrder; track item.key) {
  <p>{{ item.key }}: {{ item.value }}</p>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Iterar propriedades de objeto no template | `objeto \| keyvalue` com `@for` |
| Iterar Map no template | `map \| keyvalue` com `@for` |
| Ordem das propriedades importa | Passar `compareFn` que retorna 0 |
| Precisa da logica do pipe na classe | Registrar nos `providers` e usar `inject()` |
| Pipe simples sem dependencias (ex: UpperCasePipe) | Instanciar direto com `new UpperCasePipe()` |
| Pipe com dependencias internas | Obrigatorio usar `providers` + `inject()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@for (item of objeto)` | `@for (item of objeto \| keyvalue; track item.key)` |
| `new KeyValuePipe()` | `providers: [KeyValuePipe]` + `inject(KeyValuePipe)` |
| `keyvalue` sem track | `keyvalue; track item.key` |
| Recriar logica de transformacao objeto→array manualmente | Reutilizar `KeyValuePipe.transform()` na classe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
