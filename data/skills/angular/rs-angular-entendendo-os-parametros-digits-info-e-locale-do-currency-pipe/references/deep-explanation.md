# Deep Explanation: CurrencyPipe digitsInfo e locale

## Dois parametros, duas responsabilidades

O instrutor enfatiza que digitsInfo e locale sao **preocupacoes completamente independentes** no CurrencyPipe. Isso e uma fonte comum de confusao porque ambos afetam a aparencia final do numero formatado, mas de formas distintas.

### digitsInfo — Precisao numerica

O digitsInfo controla **quantos digitos** aparecem, usando o formato:

```
{minInteiros}.{minDecimais}-{maxDecimais}
```

- `1.2-2` = minimo 1 inteiro, minimo 2 decimais, maximo 2 decimais
- `1.0-0` = sem casas decimais
- `1.4-4` = exatamente 4 casas decimais

Cada moeda tem um digitsInfo padrao (BRL e USD usam 2 decimais, JPY usa 0). O parametro digitsInfo **sobrescreve** esse padrao quando especificado.

O instrutor destaca: "Se voce colocar varias moedas para testar, vai notar que a formatacao de milhar e decimal pode estar diferente de acordo com a moeda." Isso acontece porque cada currency code carrega seu proprio padrao de digitsInfo.

### locale — Formatacao regional

O locale controla **como** os numeros e simbolos sao exibidos. Ele muda exatamente 3 coisas:

1. **Separadores de milhar e decimal** — BR usa ponto/virgula (1.234,56), US usa virgula/ponto (1,234.56)
2. **Posicao do simbolo** — BR mostra no inicio (R$ 100), Franca mostra no final (100 €)
3. **Simbolo da moeda** — Uma mesma moeda pode ter simbolos diferentes por regiao para evitar ambiguidade

### O que locale NAO faz

O instrutor faz questao de destacar: **locale nao muda digitsInfo**. Se a moeda tem 2 casas decimais por padrao, mudar o locale nao vai alterar isso. So o parametro digitsInfo sobrescreve a precisao decimal.

## Caso de uso: moeda estrangeira para publico local

Um cenario pratico que o instrutor menciona: voce pode ter um valor em EUR mas querer formata-lo para que **usuarios brasileiros entendam**. Nesse caso:

```html
{{ valor | currency:'EUR':'symbol':'':'pt-BR' }}
```

Isso mostra o valor em euros, mas com separadores brasileiros (ponto milhar, virgula decimal). O currency code define QUAL moeda e, o locale define PARA QUEM voce esta exibindo.

## Ordem dos parametros

A ordem e fixa e posicional (nao nomeada):

1. `currencyCode` — codigo ISO 4217 (BRL, USD, EUR)
2. `display` — como mostrar o simbolo (symbol, symbol-narrow, code)
3. `digitsInfo` — precisao decimal
4. `locale` — regiao de formatacao

O instrutor conta os parametros explicitamente: "1, 2, 3, 4 — o 4o que seria o nosso digitsInfo... nao, o 4o seria locale." Isso mostra que ate instrutores experientes precisam contar a posicao.

## Codigos BCP 47

O locale usa o padrao BCP 47, que o instrutor ja havia mostrado em video anterior sobre PercentPipe. Exemplos:

- `pt-BR` — Portugues do Brasil
- `en-US` — Ingles americano
- `en-ZA` — Ingles da Africa do Sul
- `es-MX` — Espanhol do Mexico
- `hi-IN` — Hindi da India
- `fr-FR` — Frances da Franca

## Relacao com PercentPipe

O instrutor referencia que o digitsInfo funciona da mesma forma que no PercentPipe (coberto em video anterior). O formato `{min}.{min}-{max}` e consistente entre todos os pipes numericos do Angular (DecimalPipe, PercentPipe, CurrencyPipe).