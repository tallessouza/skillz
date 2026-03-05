# Deep Explanation: Visao Integrada da Aplicacao

## Por que essa tecnica existe

O instrutor explica que usa essa tecnica no projeto da empresa em que trabalha atualmente. O problema que resolve: em aplicacoes Angular com muitos componentes e services, e dificil visualizar mentalmente quem chama quem, quem injeta o que, e como os dados fluem.

## Diferenca entre visao macro e visao integrada

O curso ja havia introduzido uma "visao macro" — uma visao de alto nivel dos componentes. A visao integrada vai alem: ela mostra **as conexoes** entre componentes e services, nao apenas a lista deles. A visao macro responde "o que existe?"; a visao integrada responde "como se conecta?".

## O conceito de fonte unica de verdade aplicado

O TaskService e descrito como a "fonte unica de verdade" — ele contem as tres listas de tarefas (toDo, doing, done) e todos os metodos de gerenciamento. Multiplos componentes injetam o mesmo service:

- **WelcomeSectionComponent** injeta TaskService para **criar** tarefas
- **TaskListSectionComponent** injeta TaskService para **atualizar status** ao mover entre colunas
- **TaskCardComponent** injeta TaskService para **deletar, editar e gerenciar comentarios**

Isso ilustra o principio de que o service centraliza estado e logica, enquanto componentes sao apenas consumidores.

## ModalControllerService como padrao de centralizacao

O instrutor criou um service dedicado para abrir modais (`ModalControllerService`) em vez de cada componente ter sua propria logica de abertura. Isso garante:
- Logica unificada de abertura/fechamento
- Um unico ponto de manutencao
- Dois componentes diferentes (WelcomeSectionComponent e TaskCardComponent) podem abrir os mesmos modais sem duplicar codigo

## Como usar na pratica profissional

O instrutor enfatiza que nao ha maneira certa ou errada — o importante e ter essa visao no repertorio. Ferramentas sugeridas: caderno, bloco de notas, Miro, ou qualquer ferramenta visual. O valor esta no exercicio de mapear as conexoes, nao na ferramenta usada.

## Beneficio principal: separacao de responsabilidades

A frase chave do instrutor: "isso me ajuda a criar uma aplicacao com melhor separacao de responsabilidades entre os componentes e os services." Ao visualizar as conexoes, fica evidente quando um componente esta fazendo demais ou quando um service deveria ser dividido.