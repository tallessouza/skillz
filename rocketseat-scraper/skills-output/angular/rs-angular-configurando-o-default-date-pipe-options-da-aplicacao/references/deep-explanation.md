# Deep Explanation: DatePipe Default Options

## Como funciona o mecanismo de fallback

O DatePipe do Angular segue uma hierarquia de prioridade para determinar formato e timezone:

1. **Parametros inline no template** (maior prioridade) — `{{ data | date:'fullDate':'+0900' }}`
2. **DATE_PIPE_DEFAULT_OPTIONS injection token** — configurado nos providers
3. **Defaults internos do Angular** (menor prioridade) — `mediumDate` para formato, timezone local do sistema para timezone

Isso significa que o injection token funciona como um "meio-termo": voce define um padrao global, mas qualquer uso especifico no template pode sobrescrever.

## Por que o timezone converte automaticamente

O instrutor demonstrou um ponto importante: quando voce passa uma data em UTC (ex: `13:38`), o DatePipe automaticamente converte para o offset do sistema local. No caso dele, `-0300` (Brasil), resultando em `10:38`.

Isso acontece porque o comportamento padrao do DatePipe (sem injection token) e usar `Intl.DateTimeFormat` do browser, que resolve para o timezone do sistema operacional do usuario.

## O injection token como padrao da aplicacao

A analogia e simples: o injection token funciona como uma "configuracao global" da aplicacao. E o mesmo padrao que o Angular usa para outros pipes (CurrencyPipe, DecimalPipe) — cada um tem seu proprio `DEFAULT_OPTIONS` token.

O padrao e consistente:
- `DATE_PIPE_DEFAULT_OPTIONS` para DatePipe
- `DEFAULT_CURRENCY_CODE` para CurrencyPipe
- Todos configurados via `providers` no `app.config.ts`

## Quando usar cada abordagem

- **Sem token, sem inline:** App simples, datas no formato padrao, timezone do usuario e suficiente
- **Com token, sem inline:** App que precisa de formato/timezone consistente (ex: dashboard financeiro sempre em UTC)
- **Com token + inline em casos especificos:** App com padrao global mas excecoes pontuais (ex: log de auditoria em UTC, resto no timezone local)

## Detalhe sobre o formato de timezone

O Angular espera o timezone como string no formato ISO 8601 offset:
- `'+0900'` = UTC+9 (Japao)
- `'-0300'` = UTC-3 (Brasil)
- `'+0000'` ou `'UTC'` = UTC

Nao aceita nomes de timezone como `'America/Sao_Paulo'` diretamente no DatePipe — apenas offsets.