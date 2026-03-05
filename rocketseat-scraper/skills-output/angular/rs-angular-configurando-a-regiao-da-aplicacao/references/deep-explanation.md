# Deep Explanation: Configurando a Região da Aplicação Angular

## Por que essa configuração é necessária

O Angular usa `en-US` como locale padrão. Isso significa que todos os pipes de formatação (PercentPipe, DatePipe, DecimalPipe) usam convenções americanas: ponto para decimal, vírgula para milhares, formato de data MM/dd/yyyy. Para aplicações brasileiras, isso está errado — usamos vírgula para decimal, ponto para milhares, e dd/MM/yyyy.

## Os dois passos obrigatórios

### 1. registerLocaleData — Carregar os dados de formatação

O Angular não inclui dados de todos os locales no bundle por padrão (seria muito pesado). Você precisa importar explicitamente os dados do locale desejado e registrá-los.

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');
```

O primeiro parâmetro é o objeto com os dados de formatação (números, datas, moedas para português). O segundo é o código BCP 47 da região específica (`pt-BR` para Brasil, diferente de `pt-PT` para Portugal).

Se você tentar usar um locale sem registrar, o Angular lança um erro em runtime: `Missing locale data for the locale "pt-BR"`.

### 2. LOCALE_ID — Dizer ao Angular qual locale usar globalmente

Registrar os dados não muda o comportamento padrão. Você precisa sobrescrever o Injection Token `LOCALE_ID` para que os pipes usem o novo locale automaticamente.

```typescript
{ provide: LOCALE_ID, useValue: 'pt-BR' }
```

O instrutor explica que `LOCALE_ID` é um Injection Token que o DatePipe, PercentPipe e DecimalPipe consultam internamente antes de retornar o valor formatado. Ao sobrescrever com `pt-BR`, todos os pipes passam a usar formatação brasileira sem precisar especificar em cada uso.

## Uso local vs. global

- **Global (recomendado):** Configure LOCALE_ID no app.config.ts. Todos os pipes usam pt-BR automaticamente.
- **Local:** Passe o locale como segundo parâmetro do pipe: `{{ valor | percent: '1.2-2': 'en-US' }}`. Útil quando você precisa mostrar uma formatação diferente da global em um caso específico.

Quando o locale global é pt-BR e você precisa mostrar formato americano em um lugar específico, basta passar `'en-US'` naquele pipe.

## BCP 47 — O padrão de códigos de região

Os códigos de locale seguem o padrão BCP 47. Exemplos:
- `pt-BR` — Português do Brasil
- `en-US` — Inglês dos Estados Unidos
- `fr-CH` — Francês da Suíça
- `es-MX` — Espanhol do México

O instrutor mostra que existe uma lista completa de códigos BCP 47 disponível online para consulta.

## Múltiplos locales na mesma aplicação

O instrutor demonstra que é possível registrar múltiplos locales:

```typescript
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localePt, 'pt-BR');
registerLocaleData(localeFr, 'fr-CH');
```

Depois de registrados, qualquer um pode ser usado pontualmente nos pipes. O LOCALE_ID define apenas o padrão.

## Efeito em bibliotecas externas

O instrutor menciona que bibliotecas externas que usam o mesmo Injection Token `LOCALE_ID` também são afetadas pela configuração global. Isso é uma vantagem de usar o sistema de DI do Angular em vez de configurações manuais.

## Erro comum — locale não registrado

Se você passar um código de locale que não foi registrado (ex: `'es-MX'` sem o respectivo `registerLocaleData`), o Angular lança um erro informando que o locale data é inválido. A solução é sempre registrar antes de usar.