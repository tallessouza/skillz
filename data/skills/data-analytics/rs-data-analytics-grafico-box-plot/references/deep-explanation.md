# Deep Explanation: Grafico BoxPlot

## Por que o box plot existe

A media e uma medida fragil. Um unico valor muito alto ou muito baixo "arrasta" a media, gerando uma analise imprecisa. O box plot resolve isso ao tornar visualmente obvio quais valores estao fora do padrao (outliers), permitindo que o analista decida conscientemente se os inclui ou exclui.

## A analogia da "caixa e meia"

O instrutor Rodolfo enfatiza que decorar a formula `Q3 + 1.5 * IQR` nao e o caminho. O modelo mental correto e:

- A **caixa** (entre Q1 e Q3) contem 50% dos dados centrais
- O **limite** e projetado "uma caixa e meia" para frente do Q3 e para tras do Q1
- Se voce entende que esta medindo 1.5x o tamanho da caixa, a formula se torna intuitiva

## O ponto critico: limite vs min/max

Este e o conceito que mais confunde. O limite calculado pode ser maior que o maior dado ou menor que o menor dado. Nesse caso, o proprio dado assume como limite:

- **Se limite_calculado > max(dados):** limite real = max(dados), sem outliers acima
- **Se limite_calculado < max(dados):** limite real = limite_calculado, dados acima sao outliers
- Mesma logica se aplica ao limite inferior

### Exemplo numerico do instrutor

- Q3 = 70, IQR = 30, maior valor = 100
- Limite calculado = 70 + 45 = 115
- 100 < 115 → o proprio 100 vira o limite, sem outliers
- Se maior valor fosse 135 → 135 > 115 → limite = 115, e 135 e outlier

## Estrutura visual do box plot

```
        Outlier    LI    Q1   Q2(mediana)  Q3    LS    Outlier
          *    ----|-----|========|=========|-----|----    *
                        |   25%  |   25%   |
                        |<--- 50% (IQR) -->|
               |<- 1.5*IQR ->|        |<- 1.5*IQR ->|
```

- Pode aparecer horizontal ou vertical
- Outliers sao representados por asterisco (*) ou ponto
- A linha central da caixa e a mediana (Q2)

## Ordem de construcao

1. **Roll** — ordenar os dados
2. **Mediana (Q2)** — valor central
3. **Q1** — mediana dos 50% inferiores
4. **Q3** — mediana dos 50% superiores
5. **IQR** — Q3 - Q1 (tamanho da caixa)
6. **Limites** — Q1 - 1.5*IQR e Q3 + 1.5*IQR (ajustado contra min/max)
7. **Outliers** — valores alem dos limites

## Quando descartar outliers

O instrutor destaca que outliers nao sao automaticamente "lixo". Antes de descartar:

- Verificar se houve erro de coleta
- Verificar se o sistema que gerou o dado teve falha
- Investigar se e um alerta real (um evento genuinamente atipico)

So apos essa investigacao, descarte para obter uma analise mais precisa.