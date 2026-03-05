# Deep Explanation: Formatacao de Datas com DatePipe

## Por que salvar em UTC

O instrutor enfatiza fortemente: salve datas em UTC no banco de dados. A razao pratica e simples — se voce tem uma data salva com offset brasileiro (-3) e precisa mostrar no fuso do Japao (+9), voce teria que:

1. Pegar a data com offset -3
2. Converter para offset 0 (UTC)
3. Aplicar offset +9

Salvando direto em UTC, voce pula o passo 1 e 2. O DatePipe faz a conversao automaticamente.

## Como o DatePipe aplica o offset automaticamente

Quando voce passa uma data ISO com `Z` no final (ex: `2025-11-16T01:24:00.000Z`), o DatePipe detecta que e UTC e aplica o offset do navegador do usuario automaticamente. No exemplo do instrutor, a data UTC de 13:24 virou 10:24 porque o navegador estava em GMT-3 (Brasil).

Isso e transparente — voce nao precisa fazer nada. Mas e importante entender que esta acontecendo, para nao se confundir quando a hora exibida for diferente da hora no ISO string.

## Parametro timezone vs locale — a confusao comum

O instrutor destaca que muita gente confunde:
- **timezone** (segundo parametro): muda O OFFSET da data. Passa de um fuso para outro.
- **locale** (terceiro parametro): muda A FORMATACAO. Muda o idioma, ordem de dia/mes/ano, nome do mes.

Exemplo: passar `'fr-FR'` como locale NAO move a data para o fuso horario frances. Apenas formata o texto em frances.

## Registro de locales — armadilha silenciosa

O Angular so inclui en-US por padrao. Se voce tentar usar qualquer outro locale sem registrar, o pipe simplesmente nao renderiza nada e lanca um erro no console. O registro deve ser feito no main.ts:

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);
```

E para mudar o locale padrao da aplicacao inteira (em vez de passar em cada pipe), use o LOCALE_ID provider no app.config.ts.

## Limitacao: IANA timezone nao suportado

O DatePipe NAO aceita strings IANA como `America/Sao_Paulo`. Voce precisa passar o offset numerico (`-0300` ou `-03:00`). Se precisar converter de IANA para offset, isso deve ser feito no TypeScript antes de passar ao template, possivelmente usando `Intl.DateTimeFormat` ou uma lib como date-fns-tz.

## Formatos predefinidos disponiveis

O Angular oferece varios formatos prontos: `short`, `medium`, `long`, `full`, `shortDate`, `mediumDate`, `longDate`, `fullDate`, `shortTime`, `mediumTime`, `longTime`, `fullTime`. O padrao quando nao se passa nenhum formato e `mediumDate`.

Cada um desses formatos varia conforme o locale configurado — `fullDate` em pt-BR mostra "sabado, 15 de novembro de 2025", enquanto em en-US mostra "Saturday, November 15, 2025".