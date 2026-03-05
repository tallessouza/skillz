---
name: rs-angular-i18n-select-pipe
description: "Applies Angular I18nSelectPipe for key-based text mapping in templates. Use when user asks to 'map text by key', 'select text based on value', 'avoid switch in template', 'display status label', or 'show gender-based text' in Angular. Replaces @switch/@if blocks with declarative pipe syntax. Make sure to use this skill whenever generating Angular templates that conditionally display text based on a string key. Not for i18n/translation setup, custom pipe creation, or KeyValuePipe usage."
---

# I18nSelectPipe — Mapeamento de Textos por Chave

> Use o I18nSelectPipe para mapear uma string a um texto de exibicao sem @switch ou @if no template.

## Rules

1. **Use I18nSelectPipe em vez de @switch/@if para mapeamento simples** — `{{ chave | i18nSelect: mapping }}` em vez de blocos condicionais, porque reduz codigo no template e centraliza o mapeamento num objeto
2. **Sempre defina a chave `other` no mapping** — ela e o fallback quando a chave nao existe no objeto, porque sem ela o texto fica vazio
3. **Importe I18nSelectPipe nos imports do componente** — `imports: [I18nSelectPipe]`, porque e um pipe standalone do Angular
4. **Prefira pipe customizado quando o mapping repete em 2+ componentes** — porque duplicar o objeto de mapping em N componentes gera repeticao e dificulta manutencao
5. **O nome remete a i18n mas serve para qualquer mapeamento string→texto** — status de pedido, genero, role de usuario, qualquer chave string

## How to write

### Mapping basico no componente

```typescript
import { I18nSelectPipe } from '@angular/common';

@Component({
  imports: [I18nSelectPipe],
  template: `<p>{{ gender | i18nSelect: inviteMapping }}</p>`
})
export class MyComponent {
  gender = 'female';

  inviteMapping: Record<string, string> = {
    male: 'convidá-lo',
    female: 'convidá-la',
    other: 'convidar',
  };
}
```

### Mapping de status

```typescript
orderStatus = 'shipping';

orderStatusMapping: Record<string, string> = {
  created: 'Pedido criado',
  shipping: 'Saiu para entrega',
  delivered: 'Entregue',
  other: 'Status desconhecido',
};
```

```html
<p>{{ orderStatus | i18nSelect: orderStatusMapping }}</p>
<!-- Output: "Saiu para entrega" -->
```

## Example

**Before (com @switch no template):**

```html
@switch (gender) {
  @case ('male') { <p>convidá-lo</p> }
  @case ('female') { <p>convidá-la</p> }
  @default { <p>convidar</p> }
}
```

**After (com I18nSelectPipe):**

```html
<p>{{ gender | i18nSelect: inviteMapping }}</p>
```

```typescript
inviteMapping = { male: 'convidá-lo', female: 'convidá-la', other: 'convidar' };
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mapeamento usado em 1 componente | I18nSelectPipe com objeto local |
| Mapeamento usado em 2+ componentes | Pipe customizado com mapping interno |
| Chave vem de API/HTTP | Garanta que o valor existe como chave no mapping ou caia no `other` |
| Muitas chaves (10+) | Considere pipe customizado ou enum + pipe |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `@switch` / `@if` para mapear string→texto simples | `{{ chave \| i18nSelect: mapping }}` |
| Mapping sem chave `other` | Sempre inclua `other` como fallback |
| Mesmo objeto de mapping copiado em 10 componentes | Pipe customizado que encapsula o mapping |
| Interpolacao com ternario encadeado `{{ x === 'a' ? ... : x === 'b' ? ... }}` | I18nSelectPipe com mapping declarativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
