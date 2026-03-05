---
name: rs-angular-configurando-regiao-app
description: "Applies Angular locale configuration when setting up i18n, formatting dates, numbers, or percentages with pipes like DatePipe, PercentPipe, DecimalPipe. Use when user asks to 'configure locale', 'format date in Portuguese', 'change number format', 'set up pt-BR', or 'use Brazilian formatting in Angular'. Ensures registerLocaleData and LOCALE_ID injection token are correctly configured. Make sure to use this skill whenever generating Angular code that involves locale-sensitive formatting. Not for translation/i18n content, HTTP interceptors, or backend locale logic."
---

# Configurando a Região da Aplicação Angular

> Registre o locale no main.ts e sobrescreva o LOCALE_ID no app.config.ts para que todos os pipes formatem conforme a região desejada.

## Rules

1. **Sempre registre o locale no main.ts** — chame `registerLocaleData()` antes do bootstrap, porque sem registro o Angular lança erro ao usar o locale
2. **Use LOCALE_ID para configuração global** — sobrescreva via providers no app.config.ts, porque configurar locale individualmente em cada pipe é repetitivo e frágil
3. **Siga o padrão BCP 47 para códigos de região** — `pt-BR`, `en-US`, `fr-CH`, porque é o padrão que o Angular reconhece internamente
4. **Importe o locale data do pacote correto** — `@angular/common/locales/pt` para português, porque cada idioma tem seu módulo separado
5. **Não passe locale manualmente quando já configurado globalmente** — omita o segundo parâmetro do pipe, porque o LOCALE_ID já fornece o padrão

## How to write

### Registro no main.ts

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');
```

### Configuração global no app.config.ts

```typescript
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... outros providers
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

### Uso no template (com locale global)

```html
<!-- Sem segundo parâmetro — usa o LOCALE_ID global -->
<p>{{ valor | percent: '1.2-2' }}</p>

<!-- Sobrescrevendo pontualmente para outra região -->
<p>{{ valor | percent: '1.2-2': 'en-US' }}</p>
```

## Example

**Before (locale padrão en-US):**

```typescript
// main.ts — sem registro de locale
// app.config.ts — sem LOCALE_ID

// template
{{ 0.5 | percent: '1.2-2' }}
// Resultado: 50.00%  (ponto como separador decimal)
```

**After (com locale pt-BR configurado):**

```typescript
// main.ts
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt-BR');

// app.config.ts
{ provide: LOCALE_ID, useValue: 'pt-BR' }

// template
{{ 0.5 | percent: '1.2-2' }}
// Resultado: 50,00%  (vírgula como separador decimal)
```

## Heuristics

| Situação | Faça |
|----------|------|
| App para usuários brasileiros | Configure `pt-BR` global via LOCALE_ID |
| App multi-região | Configure global para a principal, passe locale pontual nos pipes para exceções |
| Locale não registrado | Erro em runtime — sempre registre no main.ts antes de usar |
| Biblioteca externa usa LOCALE_ID | A configuração global já cobre automaticamente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Passar `'pt-BR'` manualmente em cada pipe | Configurar LOCALE_ID global no app.config.ts |
| Usar locale sem registrar no main.ts | Chamar `registerLocaleData()` antes do bootstrap |
| Inventar códigos de região | Consultar o padrão BCP 47 para o código correto |
| Importar locale de path errado | Usar `@angular/common/locales/{idioma}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
