---
name: rs-angular-i18n-plural-pipe
description: "Applies Angular I18nPluralPipe for quantity-based text mapping in templates. Use when user asks to 'show text based on count', 'pluralize messages', 'display different text for zero/one/many items', or 'avoid if/switch for quantity text in Angular'. Enforces plural mapping pattern with =0, =1, and other keys. Make sure to use this skill whenever generating Angular templates that display text varying by numeric quantity. Not for i18n translation, SelectPipe, or date/currency pipes."
---

# I18nPluralPipe — Mapeamento de Textos por Quantidade

> Usar I18nPluralPipe para exibir textos diferentes baseados em quantidade, eliminando if/switch no template.

## Rules

1. **Importar I18nPluralPipe** — adicionar nos imports do componente, porque sem import o pipe nao e reconhecido
2. **Criar objeto de mapeamento no componente** — o map fica no `.ts`, nao inline no template, porque mantem o template limpo
3. **Usar chaves `=0`, `=1` e `other`** — esses sao os tres casos padrao (zero, um, multiplos), porque cobrem 99% dos cenarios
4. **Usar `#` como placeholder da quantidade** — dentro do texto do map, `#` e substituido pelo valor numerico real, porque evita interpolacao manual
5. **Preferir `other` ao inves de listar cada numero** — `other` e a chave coringa para qualquer valor nao mapeado, porque e impossivel listar todos os numeros

## How to write

### Mapeamento no componente

```typescript
// Definir o map com =0, =1 e other
resultsCountMap: Record<string, string> = {
  '=0': 'Nenhum produto encontrado',
  '=1': 'Exibindo um produto',
  'other': 'Exibindo # produtos encontrados',
};

resultsCount = 0;
```

### Uso no template

```html
<!-- pipe i18nPlural recebe o numero e o map -->
<p>{{ resultsCount | i18nPlural: resultsCountMap }}</p>
```

## Example

**Before (if/switch no template):**
```html
<p *ngIf="resultsCount === 0">Nenhum produto encontrado</p>
<p *ngIf="resultsCount === 1">Exibindo um produto</p>
<p *ngIf="resultsCount > 1">Exibindo {{ resultsCount }} produtos encontrados</p>
```

**After (with I18nPluralPipe):**
```html
<p>{{ resultsCount | i18nPlural: resultsCountMap }}</p>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Zero, um, muitos — tres textos diferentes | Usar `=0`, `=1`, `other` |
| Precisa do numero no texto | Usar `#` no valor do map |
| Numero especifico (ex: =50, =100) | Adicionar chave `=50` no map |
| Valor nao mapeado | Cai automaticamente em `other` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `*ngIf` encadeados para zero/um/muitos | `i18nPlural` com map |
| `{{ count }} produtos` sem tratar singular | Map com `=1` para singular |
| Interpolacao `{{ count }}` dentro do map | `#` como placeholder |
| Map inline gigante no template | Objeto map no componente `.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
