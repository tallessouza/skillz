# Deep Explanation: PercentPipe e DigitsInfo

## Por que o valor de entrada e uma fracao?

O PercentPipe segue o padrao matematico onde 1.0 = 100%. Isso significa que o backend e o frontend precisam estar alinhados nesse padrao. Se o backend envia `50` querendo dizer "50%", voce precisa converter para `0.5` antes de passar ao pipe.

O instrutor enfatiza: "100% e 1, entao se eu passar o valor 1, vamos ter 100%". Esse e o ponto mais importante para evitar bugs silenciosos.

## Como funciona o arredondamento (passo a passo)

O processo de arredondamento e aplicado digito a digito, da direita para a esquerda, ate atingir o maxFrac desejado.

### Exemplo detalhado: 0.123456 com DigitsInfo `1.0-3`

1. Valor x 100 = 12.3456
2. maxFrac = 3, mas temos 4 decimais (3, 4, 5, 6)
3. Ultimo digito a descartar: 6
4. 6 >= 5? Sim → incrementa o anterior: 5 + 1 = 6
5. Resultado: 12.346%

### Exemplo detalhado: 0.123456 com DigitsInfo `1.0-0`

1. Valor x 100 = 12.3456
2. maxFrac = 0, precisa eliminar todos os decimais
3. Arredondamento em cadeia:
   - 6 >= 5? Sim → 5+1 = 6
   - 6 >= 5? Sim → 4+1 = 5
   - 5 >= 5? Sim → 3+1 = 4
   - 4 >= 5? Nao → inteiro 12 se mantem
4. Resultado: 12%

O instrutor destaca que esse arredondamento em cadeia e crucial: "tem que tomar bastante cuidado com essas conversõezinhas para voce nao ter um valor inesperado".

### Exemplo: 0.005 com DigitsInfo `1.0-0`

1. Valor x 100 = 0.5
2. maxFrac = 0
3. 5 >= 5? Sim → 0 + 1 = 1
4. Resultado: 1%

## Preenchimento com zeros

Quando o valor tem menos decimais que o minFrac exige, zeros sao adicionados a direita.

- Entrada 0.5, DigitsInfo `1.2-2`: valor x 100 = 50, precisa de 2 decimais minimos → 50.00%
- Entrada 0.123, DigitsInfo `1.4-4`: valor x 100 = 12.3, precisa de 4 decimais minimos → 12.3000%

## Locale e separador decimal

- `en-US` (padrao): usa ponto como separador decimal (12.35%)
- `pt-BR`: usa virgula como separador decimal (12,35%)

O instrutor menciona que a configuracao de locale sera abordada separadamente. Quando nao especificado, o Angular usa `en-US` como padrao.

## Padrao do DigitsInfo quando omitido

Quando voce nao passa o parametro DigitsInfo, o Angular usa `1.0-0`:
- minInteger: 1
- minFraction: 0
- maxFraction: 0

Isso significa que, por padrao, nenhuma casa decimal e exibida.

## Analogia do instrutor

O instrutor compara o processo a "regrinhas de matematica" que voce nao precisa decorar, mas precisa saber que existem. A recomendacao e: pratique com valores diferentes no template e confira mentalmente se o resultado bate com as regras.