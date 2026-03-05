# Deep Explanation: Estrutura de Projeto CSS Modular

## Por que separar CSS em multiplos arquivos?

O instrutor enfatiza que a organizacao em "pequenos arquivos" e a chave para manter CSS gerenciavel. A logica e simples: quando voce tem um portal de noticias com varias secoes, cards, grids, e layouts complexos, um unico arquivo CSS se torna impossivel de navegar.

A estrategia de usar `index.css` como hub central resolve isso elegantemente:
- O HTML so conhece um arquivo (`index.css`)
- A ordem de carregamento e controlada em um unico lugar
- Adicionar ou remover estilos e questao de adicionar/remover uma linha de `@import`

## O papel do global.css

O `global.css` existe para estilos que sao verdadeiramente universais:
- CSS reset (margin, padding, box-sizing)
- Variaveis CSS (`:root`)
- Tipografia base
- Cores do tema

Tudo que e especifico de uma secao (header, cards, footer) vai em seu proprio arquivo.

## Live Preview vs Live Server

O instrutor escolhe o Live Preview (Microsoft) ao inves do popular Live Server. A diferenca principal: Live Preview abre o preview dentro do proprio VS Code, ao lado do codigo. Isso permite:
- Ver mudancas em tempo real sem trocar de janela
- Usar com Zen Mode para foco total
- O preview pode ser posicionado embaixo ou ao lado do editor

O instrutor demonstra o workflow: ativar Zen Mode, posicionar o preview embaixo, e focar exclusivamente na criacao.

## Contexto do projeto

Este e o inicio de um projeto de portal de noticias focado em CSS Grid. O projeto vai evoluir com varias secoes e cards, tornando a organizacao modular essencial desde o inicio. A estrutura criada aqui serve como fundacao para todas as aulas seguintes do modulo.

## Git desde o inicio

O instrutor inicia o repositorio git imediatamente apos criar os primeiros arquivos, com commit "iniciando o projeto". A publicacao (push) e deixada para depois — o importante e ter o historico local desde o primeiro momento.