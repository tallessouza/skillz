# Deep Explanation: Fundamentos do Grid no Código

## O modelo mental Container/Items

O Grid CSS é fundamentalmente baseado em dois grupos:

1. **Container (pai)** — a caixa que contém os elementos. Recebe `display: grid`.
2. **Items (filhos)** — as tags diretas dentro do container. São controlados pelo grid.

Isso é diferente de simplesmente estilizar cada elemento individualmente. Quando você aplica `display: grid` no pai, você está dizendo: "eu quero controlar o layout de todos os meus filhos a partir daqui".

## Por que elementos inline mudam de comportamento?

No HTML normal:
- `<div>` é `display: block` — ocupa a linha inteira
- `<span>` é `display: inline` — ocupa apenas a largura do conteúdo e fica ao lado de outros inlines

Quando o pai recebe `display: grid`, **todos os filhos diretos passam a ser controlados pelo grid**. Isso significa que mesmo um `<span>` (inline) agora se comporta como um bloco dentro do contexto do grid. Ele ocupa uma row inteira por padrão.

Isso é importante porque às vezes você coloca um elemento inline dentro do grid esperando o comportamento inline, e ele não funciona como esperado. É o grid assumindo o controle.

## display: grid vs display: inline-grid

### `display: grid`
- O **container** se comporta como um elemento block (largura 100%)
- Os filhos são organizados pelo grid (rows automaticas)
- **Este é o que você vai usar 99% das vezes**

### `display: inline-grid`
- O **container** se comporta como inline (largura do conteúdo)
- Os filhos continuam organizados pelo grid internamente
- O container aceita `margin-top` (diferente de inline puro)
- **Rarissimamente usado na prática**

### Analogia do instrutor
O instrutor menciona que não lembra a última vez que usou `inline-grid` fora de uma aula explicativa. Existe para você não ficar em dúvida quando encontrar, mas na prática `display: grid` resolve praticamente tudo.

## Diferença sutil: inline-grid vs inline puro

Um elemento `display: inline` puro **não aceita** `margin-top`. Isso é uma regra do CSS.

Já o `display: inline-grid`:
- Mantém a largura do conteúdo (aspecto inline)
- **Aceita** `margin-top` e outras propriedades de bloco
- É um híbrido: inline por fora, grid por dentro

## Rows automáticas

Sem nenhuma propriedade adicional além de `display: grid`, o grid cria automaticamente uma **row (linha) para cada filho direto**. Se você tem 3 filhos, terá 3 rows.

Isso é o comportamento padrão. Depois, com propriedades como `grid-template-columns` e `grid-template-rows`, você pode controlar manualmente como as linhas e colunas são distribuídas.

## Resumo da hierarquia de conceitos

1. Container (pai) + Items (filhos) — estrutura básica
2. `display: grid` no container — ativa o grid
3. Filhos mudam de comportamento — todos viram "blocos" controlados pelo grid
4. Rows são criadas automaticamente — uma por filho, sem configuração extra
5. Propriedades do container controlam o layout geral
6. Propriedades dos items permitem ajustes individuais (visto em aulas posteriores)