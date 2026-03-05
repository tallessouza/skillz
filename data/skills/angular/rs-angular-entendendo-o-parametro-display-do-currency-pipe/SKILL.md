---
name: rs-angular-currency-pipe-display
description: "Applies correct CurrencyPipe display parameter configuration when writing Angular templates with currency formatting. Use when user asks to 'format currency', 'display money', 'show price', 'currency pipe', or 'CurrencyPipe display'. Enforces correct choice between code, symbol, symbol-narrow, and custom string based on application context. Make sure to use this skill whenever generating Angular templates that display monetary values. Not for non-Angular projects, general number formatting, or DecimalPipe usage."
---

# CurrencyPipe — Parâmetro Display

> Ao formatar moedas em Angular, escolha o display (code, symbol, symbol-narrow ou string customizada) baseado no contexto da aplicacao: quantidade de moedas exibidas e publico-alvo.

## Rules

1. **Use `'code'` quando a aplicacao exibe multiplas moedas** — `USD`, `BRL`, `CAD` sao unicos por moeda, porque symbols podem ser identicos entre moedas diferentes (ex: dolar americano e canadense tem o mesmo symbol-narrow `$`)
2. **Use `'symbol'` como padrao seguro** — ja e o default do CurrencyPipe, porque exibe o simbolo completo da moeda com diferenciacao regional (ex: `US$` no pt-BR vs `$` no en-US)
3. **Use `'symbol-narrow'` apenas quando a aplicacao exibe UMA unica moeda** — porque moedas diferentes podem compartilhar o mesmo simbolo narrow, causando ambiguidade
4. **Lembre que o simbolo muda com a localidade** — `USD` no pt-BR e `US$`, no en-US e `$`, no fr-FR e `$US`, porque o Angular respeita as convencoes regionais de formatacao
5. **Lembre que a posicao do simbolo muda com a localidade** — no pt-BR o simbolo vai no inicio, no fr-FR vai no fim, porque cada locale define sua propria convencao de posicionamento
6. **Use string customizada para substituir o simbolo** — passe qualquer string no lugar de code/symbol para exibir texto personalizado no lugar do indicador de moeda

## How to write

### Display code (multiplas moedas)
```html
<!-- Seguro para aplicacoes multi-moeda: cada moeda tem codigo unico -->
<p>{{ preco | currency:'BRL':'code' }}</p>        <!-- BRL 1.234,56 -->
<p>{{ price | currency:'USD':'code' }}</p>         <!-- USD 1,234.56 -->
<p>{{ prix | currency:'CAD':'code' }}</p>          <!-- CAD 1,234.56 -->
```

### Display symbol (padrao, moeda unica com diferenciacao)
```html
<!-- Default do pipe — pode omitir o parametro -->
<p>{{ preco | currency:'BRL' }}</p>                <!-- R$ 1.234,56 (pt-BR) -->
<p>{{ preco | currency:'BRL':'symbol' }}</p>       <!-- Equivalente ao acima -->
```

### Display symbol-narrow (moeda unica, publico local)
```html
<!-- Apenas quando ha UMA moeda e usuarios sao do mesmo pais -->
<p>{{ price | currency:'USD':'symbol-narrow' }}</p>  <!-- $ 1,234.56 -->
```

### Display com string customizada
```html
<!-- Substitui o simbolo/codigo por texto livre -->
<p>{{ price | currency:'USD':'Dolares' }}</p>      <!-- Dolares 1,234.56 -->
```

### Registrar localidade (prerequisito)
```typescript
// app.config.ts ou main.ts
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localePt);
registerLocaleData(localeFr);
```

## Example

**Before (ambiguidade em app multi-moeda):**
```html
<p>{{ precoUS | currency:'USD':'symbol-narrow' }}</p>   <!-- $ 100.00 -->
<p>{{ precoCA | currency:'CAD':'symbol-narrow' }}</p>   <!-- $ 100.00 -->
<!-- Usuario nao sabe qual e qual! -->
```

**After (com esta skill aplicada):**
```html
<p>{{ precoUS | currency:'USD':'code' }}</p>   <!-- USD 100.00 -->
<p>{{ precoCA | currency:'CAD':'code' }}</p>   <!-- CAD 100.00 -->
<!-- Identificacao inequivoca -->
```

## Heuristics

| Situacao | Display recomendado |
|----------|-------------------|
| App exibe multiplas moedas simultaneamente | `'code'` |
| App exibe uma moeda, publico internacional | `'symbol'` |
| App exibe uma moeda, publico local unico | `'symbol-narrow'` |
| Precisa de texto customizado no lugar do simbolo | String personalizada |
| Nao sabe qual usar | `'symbol'` (default seguro) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `symbol-narrow` com multiplas moedas | `code` para garantir unicidade |
| Assumir que o simbolo e igual em todas localidades | Testar com a localidade real do publico-alvo |
| Ignorar `registerLocaleData` ao usar locale nao-ingles | Registrar o locale no bootstrap da app |
| Hardcodar posicao do simbolo (ex: prefixar `R$` manualmente) | Deixar o pipe + locale posicionar automaticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
