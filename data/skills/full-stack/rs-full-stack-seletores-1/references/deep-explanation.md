# Deep Explanation: Seletores CSS

## O lugar dos seletores na regra CSS

O instrutor destaca um ponto sutil: o espaco onde escrevemos seletores no CSS vai, com o tempo, receber outras coisas alem de seletores puros (pseudo-classes, pseudo-elementos, combinadores). E comum confundir tudo como "seletor", mas o seletor fundamental e especificamente o identificador do alvo — tipo, id, classe, atributo ou universal.

## Seletor de tipo (type/element/tag selector)

Tres nomes para a mesma coisa:
- **Type selector** (nome oficial na spec)
- **Element selector** (nome descritivo)
- **Tag selector** (nome informal)

Funciona escrevendo o nome da tag HTML diretamente. Se existem 2 `<p>` na pagina, AMBOS recebem o estilo. Nao ha filtragem — e por tag.

## Seletor de id

Usa `#` seguido do valor do atributo `id` no HTML. O id deve ser unico no documento. Portanto, esse seletor atinge no maximo um elemento.

Sintaxe alternativa pouco usada: `[id="text"]` tambem funciona (seletor de atributo), mas na pratica ninguem escreve assim — usa-se `#text`.

## Seletor de classe

Usa `.` seguido do nome da classe. Diferente do id, classes podem ser compartilhadas entre multiplos elementos. Se 3 elementos tem `class="pink"`, todos recebem o estilo.

Ponto importante do instrutor: se voce REMOVE a classe de um elemento no HTML, aquele elemento para de receber o estilo. O seletor so aplica onde a classe existe.

Sintaxe alternativa: `[class="pink"]` tambem funciona tecnicamente, mas ninguem usa — `.pink` e o padrao.

## Seletor de atributo

Dois modos:
1. **Presenca:** `[title]` — qualquer elemento que TENHA o atributo title, independente do valor
2. **Valor exato:** `[title="texto"]` — apenas elementos cujo title seja exatamente aquele valor

O instrutor nota que esse seletor e "bem interessante" porque permite selecionar por qualquer atributo HTML, nao apenas class/id.

## Seletor universal

`*` seleciona TUDO na pagina. Usado tipicamente para resets globais (ex: `* { margin: 0; box-sizing: border-box; }`).

## Comportamento de aplicacao multipla

Insight do instrutor: seletores de tipo aplicam para TODAS as tags daquele tipo. Se ha 5 `<p>`, todos ficam estilizados. Ja seletores de classe so aplicam onde a classe esta presente — remover a classe de um elemento remove o estilo. Isso e fundamental para entender a diferenca entre selecao por tipo vs por classe.