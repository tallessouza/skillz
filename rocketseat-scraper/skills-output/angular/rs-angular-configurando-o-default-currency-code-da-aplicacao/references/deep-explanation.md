# Deep Explanation: Default Currency Code no Angular

## O que e um Injection Token

O `DEFAULT_CURRENCY_CODE` e um **Injection Token** — um mecanismo do Angular para guardar um valor que pode ser injetado em qualquer parte da aplicacao via dependency injection. Funciona de forma identica ao `LOCALE_ID`:

- `LOCALE_ID` → usado internamente por DatePipe, DecimalPipe, PercentPipe e CurrencyPipe
- `DEFAULT_CURRENCY_CODE` → usado internamente **apenas** pelo CurrencyPipe

Ambos sao configurados da mesma forma nos providers do `app.config.ts`, usando `provide` + `useValue`.

## Por que configurar

Sem configuracao, o Angular assume que o currency code padrao e **USD** (dolar americano). Isso significa que qualquer uso de `| currency` sem parametro vai formatar o valor como dolar.

Se a aplicacao trabalha predominantemente com Real brasileiro (ou qualquer outra moeda), voce teria que repetir `| currency:'BRL'` em **cada template** que usa o pipe. Isso viola o principio DRY e e propenso a erros.

## Relacao com LOCALE_ID

O `LOCALE_ID` controla a **formatacao** (separadores, posicao do simbolo), enquanto o `DEFAULT_CURRENCY_CODE` controla **qual moeda** e usada.

Exemplo pratico do instrutor:
- Com `LOCALE_ID` = `'fr-CA'` (canadense frances) e sem currency code → formata como dolar mas com formatacao canadense
- Com `LOCALE_ID` = `'pt-BR'` e sem currency code → formata como dolar com formatacao brasileira
- Com `LOCALE_ID` = `'pt-BR'` e `DEFAULT_CURRENCY_CODE` = `'BRL'` → formata como Real com formatacao brasileira

Sao configuracoes **complementares**, nao substitutas.

## Comportamento de override

Quando o token esta configurado:
- `{{ valor | currency }}` → usa o currency code do token (ex: BRL)
- `{{ valor | currency:'USD' }}` → ignora o token e usa USD

O parametro explicito sempre tem prioridade sobre o token. Isso permite ter um padrao global mas ainda usar outras moedas quando necessario.