# Deep Explanation: Formatacao Monetaria com CurrencyPipe

## O que o CurrencyPipe faz

O CurrencyPipe e um **Pure Pipe** integrado do Angular, importado de `@angular/common`. Sua funcao e transformar um **numero** em uma **string de valor monetario formatada**, adaptando-se as regras de internacionalizacao (i18n) da aplicacao.

Quando voce passa um numero para o CurrencyPipe, ele devolve uma string formatada com:
- **Simbolo da moeda** — `R$`, `$`, `€`, `¥`
- **Separadores corretos** — uso de ponto e virgula para milhar e decimal conforme a regiao
- **Posicao do simbolo** — antes ou depois do valor, dependendo da convencao regional

## Visao do instrutor sobre aprendizado

O instrutor enfatiza que **nao e para decorar** os parametros do CurrencyPipe. O importante e saber que essas configuracoes existem. Quando precisar usar (que e "bem de vez em quando na verdade"), volte a referencia e consulte os detalhes.

Isso reflete uma abordagem pragmatica: CurrencyPipe e uma ferramenta de consulta, nao de memorizacao.

## Sintaxe completa

```
{{ valor | currency : currencyCode : display : digitsInfo : locale }}
```

### Parametros

1. **currencyCode** (string) — Codigo ISO 4217 da moeda. Exemplos: `BRL`, `USD`, `EUR`, `CAD`, `JPY`. Define qual moeda o numero representa.

2. **display** (string) — Formato de exibicao do indicador da moeda:
   - `'symbol'` → exibe o simbolo (`R$`, `$`, `€`)
   - `'code'` → exibe o codigo ISO (`BRL`, `USD`, `EUR`)
   - Outras configuracoes existem e sao abordadas em aulas posteriores

3. **digitsInfo** (string) — Controle de precisao decimal. Formato: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. Exemplo: `'1.2-2'` forca exatamente 2 casas decimais. Funciona identicamente ao PercentPipe e DecimalPipe.

4. **locale** (string) — Define a regiao base para formatacao. Muda separadores de milhar/decimal e posicao do simbolo. Padrao: `en-US`.

## Locale padrao e configuracao global

Se nenhum locale global for configurado na aplicacao, o Angular usa `en-US` como padrao. Isso significa que mesmo ao formatar BRL, os separadores seguirao o padrao americano (virgula para milhar, ponto para decimal) a menos que o locale seja configurado.

A configuracao de locale global e abordada em aulas separadas (apos o PercentPipe). O parametro locale no proprio pipe permite override pontual.

## Relacao com outros pipes

O `digitsInfo` e compartilhado entre tres pipes:
- **CurrencyPipe** — formatacao monetaria
- **PercentPipe** — formatacao percentual
- **DecimalPipe** — formatacao numerica

Se voce entende o digitsInfo em qualquer um deles, entende em todos.