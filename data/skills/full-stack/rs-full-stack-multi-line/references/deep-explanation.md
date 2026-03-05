# Deep Explanation: Flex Wrap — Multilinhas

## O modelo mental dos sub-containers

O conceito mais importante do flex-wrap e que **cada nova linha cria um novo container virtual**. O instrutor enfatiza: "Quando acontece wrap, voce tem que saber que acontece uma duplicacao do eixo principal."

Isso significa:
- Linha 1 tem seu proprio main axis e cross axis
- Linha 2 tem seu proprio main axis e cross axis
- Sao independentes entre si

### Consequencia pratica

Quando voce aplica `align-items: center` com duas linhas wrappadas:
- Os itens da linha 1 se centralizam dentro do espaco da linha 1
- Os itens da linha 2 se centralizam dentro do espaco da linha 2
- Cada linha se comporta como se fosse um flex container separado

## align-content: unificando os eixos

Quando voce aplica `align-content`, o modelo mental muda completamente. Nas palavras do instrutor: "com o align-content eu posso imaginar apenas um eixo cortando tudo."

`align-content` controla como as **linhas inteiras** sao distribuidas no cross axis do container. Ele trata as linhas como itens a serem posicionados.

### Por que align-items "para de funcionar"

O instrutor observa: "voce esta percebendo que nao se aplica mais ou nao esta funcionando o align-items como center?"

Isso acontece porque align-content comprime as linhas juntas, eliminando o espaco extra dentro de cada sub-container. Sem espaco extra, align-items nao tem para onde mover os itens.

## flex-shrink: o comportamento padrao

O instrutor demonstra: colocou width: 100px nos itens, mas eles nao ficaram com 100px. Isso acontece porque `flex-shrink: 1` e o padrao — itens flex encolhem para caber no container.

Quando flex-wrap esta ativo, os itens que nao cabem na linha **nao encolhem** — eles quebram para a proxima linha, respeitando o width definido.

## wrap-reverse

Inverte a direcao de empilhamento das linhas:
- `wrap`: novas linhas vao para baixo (padrao)
- `wrap-reverse`: novas linhas vao para cima

No exemplo do instrutor: "1, 2, 3, 4 ficou aqui para baixo, 5, 6, 7, 8 ficou aqui para cima. Ele reverteu o wrap."

## Regra fundamental

**flex-wrap habilita align-content.** Sem flex-wrap, align-content nao tem efeito. Isso porque align-content distribui linhas — sem multilinhas, nao ha o que distribuir.

## Valores de align-content

| Valor | Comportamento |
|-------|---------------|
| `flex-start` | Todas as linhas agrupadas no inicio do cross axis |
| `flex-end` | Todas as linhas agrupadas no final do cross axis |
| `center` | Todas as linhas agrupadas no centro |
| `space-between` | Primeira linha no inicio, ultima no final, espaco entre elas |
| `space-around` | Espaco ao redor de cada linha (metade nas bordas) |
| `space-evenly` | Espaco identico entre todas as linhas e bordas |
| `stretch` (padrao) | Linhas esticam para preencher o container |