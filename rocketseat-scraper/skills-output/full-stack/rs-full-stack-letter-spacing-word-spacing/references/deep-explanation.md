# Deep Explanation: Letter Spacing e Word Spacing

## O que são

**Letter Spacing** (`letter-spacing`) controla o espaço entre cada caractere individual de um texto. O termo técnico em tipografia é "tracking".

**Word Spacing** (`word-spacing`) controla o espaço entre palavras — ou seja, o tamanho do espaço em branco que separa cada palavra.

## Por que cuidado é necessário

O instrutor enfatiza repetidamente: **não saia aplicando de qualquer jeito**. A razão é dupla:

1. **Legibilidade** — Valores grandes de letter-spacing ou word-spacing tornam o texto difícil de ler. O olho humano é treinado para reconhecer palavras como blocos visuais. Quando o espaçamento é alterado significativamente, esse reconhecimento é prejudicado.

2. **Acessibilidade** — Pessoas com dislexia ou dificuldades de leitura podem ser especialmente afetadas por espaçamentos inadequados. O que parece "bonito" visualmente pode ser uma barreira real para alguns usuários.

## Quem decide o spacing

O instrutor é claro: **quem define é o designer**. O designer estuda tipografia, hierarquia visual e acessibilidade para determinar valores adequados. O desenvolvedor implementa o que foi especificado no design.

## Unidades aceitas

Ambas as propriedades aceitam:
- **Pixels** (`px`) — valores absolutos
- **Em** (`em`) — relativo ao font-size do elemento (preferido)
- **Rem** (`rem`) — relativo ao font-size root (cuidado: pode ser agressivo)
- **Valores numéricos** — também afetam o espaçamento, mas de forma menos previsível
- **`normal`** — reseta para o valor padrão do navegador

## A analogia do "agressivo"

O instrutor usa a palavra "agressivo" para descrever o efeito de `1rem` em letter-spacing. Isso ilustra bem o problema: unidades grandes como `rem` ou `px` em valores altos criam um espaçamento visual exagerado. Por isso ele recomenda "unidades mais quebradinhas" — valores decimais pequenos em `em` que produzem ajustes sutis.

## Quando letter-spacing é útil

- **Texto uppercase/caps** — letras maiúsculas ficam muito "apertadas" sem um leve tracking. Um `letter-spacing: 0.05em` a `0.1em` melhora significativamente a legibilidade.
- **Headings de design** — títulos decorativos ou de impacto visual frequentemente usam letter-spacing.
- **Logos e branding** — tipografia estilizada para identidade visual.

## Quando word-spacing é útil

- **Textos com fontes muito condensadas** — se a fonte tem espaço natural muito pequeno entre palavras.
- **Layouts específicos** — quando o design precisa de um respiro visual entre palavras.

## Valor `normal` e herança

Ambas as propriedades herdam do elemento pai. O valor `normal` reseta para o padrão do user-agent (navegador). É boa prática usar `normal` quando precisa anular um spacing herdado.