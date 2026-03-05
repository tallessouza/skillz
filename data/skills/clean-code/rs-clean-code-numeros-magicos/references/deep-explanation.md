# Deep Explanation: Numeros Magicos

## O que sao numeros magicos

Numeros magicos sao valores numericos literais no codigo cujo significado nao e imediatamente obvio para quem le. O termo vem do fato de que o numero "magicamente" aparece no codigo sem explicacao.

## Por que datas sao o caso mais problematico

O instrutor destaca que datas sao especialmente problematicas porque:

1. **Bancos de dados, linguagens e APIs lidam com datas de formas diferentes** — milissegundos, segundos, minutos, strings formatadas
2. **JavaScript tem uma API de datas particularmente confusa** — por exemplo, `getMonth()` retorna 0 para janeiro, nao 1
3. **Conversoes entre unidades sao frequentes** — horas para minutos, dias para milissegundos, etc.

Essas conversoes geram calculos como `1000 * 60 * 60 * 24 * 30` que, quando pre-calculados (ex: `2592000000`), perdem todo o significado.

## A progressao de clareza

O instrutor mostra uma progressao de 3 niveis:

1. **Pior:** numero pre-calculado (`2592000000`) — impossivel de entender
2. **Melhor:** calculo inline (`1000 * 60 * 60 * 24 * 30`) — legivel para quem conhece o padrao
3. **Ideal:** constante nomeada (`THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30`) — auto-documentado

## Por que trabalhar com centavos

O instrutor explica que trabalhar com precos em centavos (inteiros) e uma boa pratica geral de programacao, nao especifica de clean code:

- **Evita problemas de precisao de float** — `0.1 + 0.2 !== 0.3` em JavaScript
- **Numeros inteiros sao mais previsiveis** — sem arredondamentos inesperados
- **Multiplique por 100 antes de salvar** — e reconverta na apresentacao

## Por que salvar horarios em minutos

Muitos bancos de dados nao tem um tipo nativo para "hora do dia". As alternativas comuns sao:

- **String** (`"18:00"`) — ruim para calculos e comparacoes
- **Minutos desde meia-noite** (`1080`) — facil de calcular, comparar e armazenar

O instrutor recomenda minutos porque e um inteiro simples que permite operacoes matematicas diretas.

## Numeric separators no JavaScript

O underline (`_`) pode ser usado como separador visual em numeros literais:

```typescript
const billion = 1_000_000_000 // mais facil de ler
const billion2 = 1000000000   // quantos zeros tem?
```

O separador nao afeta o valor — e puramente visual. Funciona em TypeScript e JavaScript moderno.

## Conexao com nomenclatura de variaveis

O instrutor conecta numeros magicos com a aula de nomenclatura: incluir a unidade no nome da variavel (`priceInCents`, `timeoutInMs`) e uma forma de eliminar a "magia" do numero, tornando explicito o formato em que o valor esta armazenado.