# Deep Explanation: Criando Projeto React com Vite

## Por que Vite e nao Create React App (CRA)?

O instrutor destaca a **velocidade** como principal vantagem do Vite. Ao executar `npm create vite@latest`, o projeto e criado quase instantaneamente — diferente do CRA que instala centenas de dependencias antes de estar pronto.

O Vite (pronuncia-se "vid", como o instrutor explica — referenciando inclusive o site oficial que tem um icone de audio com a pronuncia correta) usa ESBuild para bundling durante desenvolvimento, o que o torna ordens de magnitude mais rapido que ferramentas baseadas em Webpack.

## O fluxo interativo do Vite

O `npm create vite@latest` e um comando que:

1. **Baixa o pacote `create-vite`** — o npm pergunta se pode instalar o pacote. Basta confirmar com Enter.
2. **Pergunta o nome do projeto** — este nome sera usado como nome da pasta e no `package.json`. O instrutor usou "classroom" como exemplo, fazendo a analogia com "sala de aula".
3. **Oferece escolha de framework** — Vite nao e exclusivo do React. Ele suporta Vue, Svelte, Preact, Lit, e vanilla JS. Use as setas do teclado para navegar (o item selecionado fica sublinhado).
4. **Oferece escolha de variante** — Dentro de React, voce pode escolher JavaScript ou TypeScript (com ou sem SWC). O instrutor recomenda TypeScript como primeira opcao.

## Pronuncia do Vite

O instrutor faz questao de mencionar que a pronuncia correta e "vid" (do frances, significando "rapido"), nao "white" ou "vait". Ele mostra que no proprio site oficial (vitejs.dev) existe um icone de audio na pagina "Get Started" com a pronuncia correta. Porem, ressalta que isso e apenas curiosidade e que nao ha problema em usar outras pronuncias.

## Vantagem de velocidade

O ponto principal reforçado pelo instrutor: apos selecionar todas as opcoes, o projeto esta criado em segundos. Ele exclama "rapido demais, o projeto ja foi criado" — contrastando com ferramentas anteriores que podiam levar minutos para scaffolding.

## Dica de terminal

O instrutor demonstra uma tecnica pratica: ao inves de digitar o caminho completo da pasta no terminal, ele arrasta a pasta para o terminal apos digitar `cd `, e o terminal preenche automaticamente o caminho correto. Essa tecnica funciona na maioria dos terminais modernos (Windows Terminal, macOS Terminal, iTerm2).