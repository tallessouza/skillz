# Deep Explanation: CurrencyPipe Display Parameter

## Por que o display importa

O parametro `display` do CurrencyPipe define **como** o indicador da moeda aparece para o usuario. A escolha errada pode causar ambiguidade — o usuario nao saber qual moeda esta vendo — ou estranheza cultural — o simbolo estar em formato nao familiar.

## As 4 opcoes de display

### 1. `'code'` — Codigo ISO da moeda
Cada moeda no mundo tem um codigo unico de 3 letras (ISO 4217): `USD`, `BRL`, `CAD`, `JPY`. Esse codigo **nunca se repete** entre moedas diferentes, por isso e a opcao mais segura quando a aplicacao precisa exibir multiplos tipos monetarios.

O instrutor enfatiza: "Se eu tiver uma aplicacao que eu mostre diversas moedas ao mesmo tempo, esse codigo e o identificador unico de cada uma delas e assim vai evitar que o usuario nao confunda uma moeda com a outra."

### 2. `'symbol'` — Simbolo padrao (DEFAULT)
E o comportamento padrao do CurrencyPipe. Exibe o simbolo da moeda conforme a localidade configurada. Ponto critico: **o mesmo simbolo pode ter representacoes diferentes dependendo da localidade**.

Exemplo do instrutor:
- `USD` no locale pt-BR → `US$`
- `USD` no locale en-US → `$`
- `USD` no locale fr-FR → `$US`

"Para uma mesma moeda, eu posso ter simbolos diferentes caso a regiao mude."

### 3. `'symbol-narrow'` — Simbolo simplificado
Versao mais enxuta do simbolo. O problema: **moedas diferentes podem ter o mesmo symbol-narrow**.

Exemplo critico do instrutor: tanto o dolar americano quanto o canadense tem `$` como symbol-narrow. "Se eu tivesse utilizando essa aplicacao ficaria dificil de distinguir entre um e outro."

**Quando usar:** "Quando voce tem uma aplicacao que so mostra um tipo monetario, por exemplo, apenas o tipo monetario americano, e que os seus usuarios sejam americanos. Porque ai voce vai estar se aproximando mais da cultura americana."

A analogia do instrutor: nas lojas fisicas americanas, o preco aparece como `$9.99`, nao `USD 9.99`. O symbol-narrow aproxima o digital do mundo fisico do usuario.

### 4. String customizada
Qualquer string passada no lugar das opcoes acima substitui o indicador de moeda. A formatacao numerica (casas decimais, separadores) continua sendo aplicada pelo pipe conforme o currency code e a localidade, so o texto do simbolo/codigo e substituido.

## Localidade e posicionamento

A posicao do simbolo (inicio ou fim do valor) e definida pela localidade, nao pelo display:
- **pt-BR:** simbolo no inicio → `R$ 1.234,56`
- **fr-FR:** simbolo no fim → `1 234,56 €`

Isso vale para todas as opcoes de display (code, symbol, symbol-narrow, custom).

## Como registrar localidades

Para usar qualquer localidade alem de en-US, e necessario:
1. Importar os dados do locale: `import localePt from '@angular/common/locales/pt'`
2. Registrar: `registerLocaleData(localePt)`
3. Usar via `LOCALE_ID` global ou via parametro `locale` no proprio pipe

## Arvore de decisao do instrutor

```
Sua app exibe multiplas moedas?
├── SIM → Use 'code' (unico, sem ambiguidade)
└── NAO → Seu publico e de uma unica regiao?
    ├── SIM → Use 'symbol-narrow' (mais proximo do dia-a-dia)
    └── NAO → Use 'symbol' (default seguro)
```

## Insight principal

O instrutor reforça varias vezes: "Eu nao quero que voce decore isso. Eu quero que voce saiba que existe esse comportamento." O valor esta em saber que:
1. Simbolos mudam com a localidade
2. Posicao do simbolo muda com a localidade
3. Symbol-narrow pode ser ambiguo
4. Code e sempre unico