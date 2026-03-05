# Deep Explanation: Causa vs Efeito

## O problema central

O instrutor identifica um padrao muito comum em codebases: desenvolvedores nomeiam variaveis booleanas com base no **efeito visual** que elas produzem na interface, em vez do **motivo** pelo qual aquele estado existe.

## A analogia do formulario

O exemplo usado e um botao de submit em React. Quando um formulario esta sendo enviado, o desenvolvedor precisa:
1. Desabilitar o botao (para evitar duplo clique)
2. Trocar o texto de "Enviar" para "Carregando..."

A tentacao natural e criar `isButtonDisabled = true` porque o primeiro uso visivel e desabilitar o botao. Mas quando essa mesma variavel e reutilizada para trocar o texto, a leitura fica estranha:

> "Se o botao esta desabilitado, mostro 'Carregando'"

Isso nao faz sentido logico. O botao estar desabilitado nao e a **razao** de mostrar "Carregando". A razao e que o formulario esta sendo enviado. Ambos os efeitos (desabilitar + trocar texto) sao consequencias da mesma causa.

## Por que isso importa

Quando voce nomeia pela causa (`isFormSubmitting`):
- Cada uso da variavel faz sentido isoladamente
- Novos efeitos podem ser adicionados sem confusao
- Outro desenvolvedor entende o estado do sistema, nao apenas o estado de um elemento UI

Quando voce nomeia pelo efeito (`isButtonDisabled`):
- A variavel so faz sentido no contexto original
- Reutilizar em outros lugares gera leitura confusa
- O nome engana — parece especifico de um botao, mas controla multiplos comportamentos

## Regra geral do instrutor

> "A gente precisa sempre nomear as nossas variaveis pela causa e nunca pelo efeito que aquilo vai ter na nossa interface, no nosso codigo."

Isso se aplica alem de React — qualquer booleano que controla estado de UI deve representar o que esta acontecendo no sistema, nao o que muda na tela.