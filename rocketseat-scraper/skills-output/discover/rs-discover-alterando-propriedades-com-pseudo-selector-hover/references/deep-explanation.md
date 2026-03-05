# Deep Explanation: Pseudo-selector :hover e Transições

## O que é um pseudo-selector

No CSS, pseudo-selectors são identificados por dois pontos (`:`) antes do nome. O `:hover` é ativado quando o usuário passa o mouse em cima do elemento. Ele entra numa classificação especial do CSS chamada "pseudo-selector" — não é uma classe, não é um ID, é um estado do elemento.

Sintaxe: `seletor:hover { ... }`

Outros pseudo-selectors comuns: `:focus`, `:active`, `:visited`, `:first-child`.

## Por que a transição vai no estado base, não no :hover

Este é o insight mais importante da aula. Quando você coloca `transition` dentro do `:hover`, a transição só acontece na **ida** (quando o mouse entra). Na **volta** (quando o mouse sai), a mudança é instantânea e abrupta.

Colocando no estado base do elemento, a transição funciona nos dois sentidos:
- Mouse entra → transiciona suavemente para as propriedades do hover
- Mouse sai → transiciona suavemente de volta para as propriedades padrão

## O problema do `all` no transition

O instrutor demonstra ao vivo o que acontece com `transition: all 0.5s`:

1. Ao **carregar a página**, o browser aplica as propriedades CSS pela primeira vez
2. Com `all`, ele transiciona **todas** as propriedades: cor, borda, tamanhos, paddings
3. O resultado é uma animação indesejada no carregamento inicial
4. O mesmo acontece toda vez que você salva e o hot-reload atualiza a página

A solução é especificar exatamente qual propriedade transicionar: `transition: background-color 0.2s`.

## Duração ideal

O instrutor testa com 0.5s e ajusta para 0.2s, explicando:
- **0.5s**: funciona mas parece lento para interação com botão
- **0.2s**: rápido o suficiente para parecer responsivo, suave o suficiente para ser perceptível
- A escolha de 0.2s é uma preferência pessoal do instrutor baseada em experiência

## Contexto do design

A aula trabalha com um design do Figma (feito pela designer Ilana). O botão tem dois estados definidos no design system:
- **Default**: estado padrão com as propriedades já aplicadas
- **Hover**: borda 1.5px sólida branca + fundo com opacidade 0.05 (antes era 0.1)

O instrutor enfatiza que é importante consultar os componentes do design para saber exatamente quais propriedades mudam no hover.