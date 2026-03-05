# Deep Explanation: Flex Basis

## O conceito de "desejável"

O instrutor usa uma analogia fundamental: flex-basis é o **tamanho desejado** do item. Não é uma ordem absoluta — é um pedido. O item *deseja* ter 120px, mas o container e as outras propriedades (grow e shrink) podem negociar esse valor.

Isso é diferente de width/height que são mais "imperativos" (embora também possam ser sobrescritos por min/max). No contexto flex, o flex-basis é o ponto de partida da negociação de espaço.

### Analogia do instrutor:
> "Base significa algo como o que eu espero aqui de padrão normal dele. Eu espero que o padrão normal dele seja, por exemplo, 10%."

O "espero" é a palavra-chave. Você declara uma expectativa, e o algoritmo flexbox decide se pode atender.

## Relação com o eixo principal

Este é o diferencial mais importante do flex-basis vs width:

- **width** sempre controla a dimensão horizontal
- **height** sempre controla a dimensão vertical
- **flex-basis** controla a dimensão do **eixo principal**, que muda conforme flex-direction

```
flex-direction: row    → flex-basis = width
flex-direction: column → flex-basis = height
```

Quando você inverte o eixo com `flex-direction: column`, o flex-basis automaticamente passa a controlar a altura. Se você usasse width, ele continuaria controlando a largura (errado nesse contexto).

## Por que o valor não "aplica" às vezes

O instrutor demonstra que colocar `flex-basis: 220px` nem sempre resulta em 220px visíveis. Isso acontece por dois motivos:

1. **Container com tamanho fixo**: Se o container tem um tamanho definido (via height ou width), os itens são forçados a caber dentro dele. O shrink padrão (1) faz os itens encolherem.

2. **Shrink padrão é 1**: Por padrão, `flex-shrink: 1` permite que itens encolham. Então mesmo que flex-basis diga 220px, se não cabe, o item encolhe.

O instrutor remove a altura do container para demonstrar: sem restrição de tamanho, o flex-basis é respeitado integralmente.

## Valores possíveis

| Valor | Significado |
|-------|-------------|
| `auto` | Padrão. Usa width/height como referência |
| `0` | Desativa tamanho base. Espaço distribuído apenas por grow |
| `120px` | Tamanho fixo desejado |
| `10%` | Proporcional ao container |
| `content` | Baseado no conteúdo do item |

## Interação com grow e shrink

O flex-basis é o **ponto de partida** do cálculo:

1. Cada item recebe seu flex-basis
2. O espaço restante (ou faltante) é calculado
3. grow distribui espaço extra proporcionalmente
4. shrink reduz itens proporcionalmente quando falta espaço

Sem entender grow e shrink, o comportamento do flex-basis pode parecer "quebrado" — mas ele está funcionando conforme o algoritmo.

## Quando usar width vs flex-basis

- **Dentro de flex container**: sempre flex-basis (respeita eixo)
- **Fora de flex container**: width/height normalmente
- **Quando precisa de min/max**: pode combinar `flex-basis` com `min-width`/`max-width`