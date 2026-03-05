# Deep Explanation: CurrencyPipe CurrencyCode e Locale

## O que o currencyCode realmente controla

O currencyCode (parametro obrigatorio do CurrencyPipe) e um codigo ISO 4217 que identifica a moeda. Exemplos: `BRL` (Real Brasileiro), `USD` (Dolar Americano), `EUR` (Euro), `JPY` (Yen Japones).

Baseado nesse codigo, o CurrencyPipe formata **dois aspectos** do valor:

1. **Simbolo inicial** — o simbolo que aparece antes (ou depois, dependendo da regiao) do numero. Ex: `R$`, `$`, `€`, `¥`
2. **Formatacao de milhar e decimal** — a configuracao equivalente ao digitsInfo (`1.2-2` por exemplo), que varia por moeda. Cada moeda tem sua propria configuracao padrao de casas decimais.

## A interacao entre currencyCode e locale

Esse e o ponto mais importante e sutil: **a localidade muda como o mesmo currencyCode e exibido**.

### Exemplo concreto

O valor `1500` com currencyCode `USD`:

- **Locale `pt-BR`**: `US$ 1.500,00` — simbolo `US$` com espaco, milhar com ponto, decimal com virgula
- **Locale `en-US`**: `$1,500.00` — simbolo `$` sem espaco, milhar com virgula, decimal com ponto

O mesmo valor, o mesmo currencyCode, resultado visual completamente diferente. Isso acontece porque:

- Cada localidade tem sua propria tabela de simbolos para cada moeda
- Cada localidade tem suas proprias regras de separacao de milhar/decimal
- Cada localidade define se ha espaco entre simbolo e valor

### Outro exemplo: moeda japonesa (JPY)

- **Locale `pt-BR`**: `JP¥ 1.500` — com prefixo JP
- **Locale `en-US`**: `¥1,500` — apenas o simbolo ¥

## Estrategia de configuracao: global vs especifico

### Global (recomendado para apps single-region)

Configura-se o injection token `LOCALE_ID` nos providers do `appConfig`. Isso afeta TODOS os pipes da aplicacao (CurrencyPipe, PercentPipe, DatePipe, DecimalPipe).

O instrutor enfatiza: se sua aplicacao sera consumida por usuarios brasileiros, faz mais sentido padronizar tudo no formato brasileiro globalmente.

### Especifico (para excecoes)

O CurrencyPipe aceita locale como ultimo parametro: `{{ value | currency: code : display : digitsInfo : locale }}`.

Quando voce precisa que UMA moeda especifica seja formatada em um padrao diferente do global, passe o locale diretamente no pipe. Exemplo real do instrutor: app brasileira (global `pt-BR`) mas um valor em dolar precisa ser exibido no padrao americano — nesse caso, passa-se `'en-US'` apenas naquele pipe.

### Caso real apresentado pelo instrutor

App com locale global `pt-BR`, tres valores monetarios:
- `BRL` sem locale especifico → usa `pt-BR` → `R$ 1.500,00`
- `USD` com locale `en-US` → usa `en-US` → `$1,500.00`
- `JPY` sem locale especifico → usa `pt-BR` → `JP¥ 1.500`

O resultado: os pipes sem configuracao especifica seguem o formato brasileiro (global), enquanto o pipe com configuracao propria usa a formatacao americana.

## ISO 4217 — a lista de codigos

O ISO 4217 e um padrao internacional que define codigos de tres letras para todas as moedas do mundo. O instrutor mostrou a lista completa e destacou que sao centenas de codigos. Os mais usados no contexto brasileiro:

- `BRL` — Real Brasileiro
- `USD` — Dolar Americano
- `EUR` — Euro
- `GBP` — Libra Esterlina
- `JPY` — Yen Japones

## Ponto de atencao: registerLocaleData

O instrutor nao detalhou neste video, mas referenciou aulas anteriores: antes de usar qualquer locale diferente do `en-US` (default do Angular), e necessario registrar os dados daquele locale com `registerLocaleData()`. Sem isso, o Angular nao tera as tabelas de formatacao necessarias.