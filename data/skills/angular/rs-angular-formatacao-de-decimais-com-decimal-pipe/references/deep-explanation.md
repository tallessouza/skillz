# Deep Explanation: Formatacao de Decimais com DecimalPipe

## Relacao entre DecimalPipe e PercentPipe

O instrutor enfatiza que o DecimalPipe e o PercentPipe sao "muito parecidos" — compartilham a mesma configuracao de `digitsInfo` e `locale`. A diferenca fundamental:

- **DecimalPipe (`number`)**: formata o numero tal como ele e. `100` fica `100`.
- **PercentPipe (`percent`)**: trata o valor como fracao. `1` = `100%`, `100` = `10.000%`.

Esse ponto e crucial porque desenvolvedores frequentemente confundem qual pipe usar. Se voce quer mostrar um numero formatado sem significado percentual, use `number`.

## O nome do pipe no template: `number` e nao `decimal`

O instrutor faz questao de alertar: "Lembrando que para utilizar ele aqui, ele se chama `number` e nao `decimal`, toma bastante cuidado." Isso e uma armadilha comum porque:

1. A classe se chama `DecimalPipe`
2. A documentacao fala "Decimal Pipe"
3. Mas no template, o seletor registrado e `number`

Se voce escrever `{{ val | decimal }}`, o Angular nao vai encontrar o pipe e vai lancar um erro.

## digitsInfo em detalhe

O formato `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`:

- **minIntegerDigits** (padrao 1): numero minimo de digitos inteiros. Se o numero tiver menos, preenche com zeros a esquerda.
- **minFractionDigits** (padrao 0): numero minimo de casas decimais. Se o numero tiver menos, preenche com zeros.
- **maxFractionDigits** (padrao 3): numero maximo de casas decimais. Se o numero tiver mais, arredonda.

### Exemplo do instrutor:
- `100 | number` com padrao `1.0-3` → mostra `100` (sem decimais porque min e 0)
- `100 | number:'1.3-3'` → mostra `100.000` (ou `100,000` em pt-BR) porque exige minimo 3 decimais
- `100.678 | number:'1.3-3'` → mostra `100.678` (ja tem 3 decimais, respeita o maximo)

## Comportamento de separadores por locale

O instrutor demonstra como o locale afeta os separadores:

| Locale | Separador decimal | Separador milhar |
|--------|------------------|-----------------|
| `en-US` (padrao) | `.` (ponto) | `,` (virgula) |
| `pt-BR` | `,` (virgula) | `.` (ponto) |

Isso e configurado globalmente via `LOCALE_ID` nos providers. Se voce nao configurar, o padrao e `en-US`.

O instrutor mostra que ao remover o `LOCALE_ID` configurado como `pt-BR`, os separadores invertem — o que era virgula vira ponto e vice-versa. Isso pode causar confusao visual para usuarios brasileiros se nao configurado corretamente.

## Quando usar DecimalPipe vs formatacao manual

O DecimalPipe e preferivel a `toFixed()` ou formatacao manual porque:
1. Respeita o locale automaticamente
2. E declarativo no template (separation of concerns)
3. E puro (pure pipe) — so recalcula quando o valor muda
4. Segue o padrao Angular de transformacao na view