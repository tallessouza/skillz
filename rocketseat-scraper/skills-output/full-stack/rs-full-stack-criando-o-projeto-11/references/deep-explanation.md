# Deep Explanation: Criando Projeto React com Vite

## Por que Vite e nao Create React App (CRA)

O Vite usa ESBuild para bundling em desenvolvimento, resultando em startup instantaneo comparado ao Webpack do CRA. O comando `npm create vite@latest` e o substituto moderno do `npx create-react-app`.

### O comando `npm create`

`npm create vite@latest` e um alias para `npm init vite@latest`, que por sua vez executa o pacote `create-vite`. O `@latest` garante que sempre usa a versao mais recente do scaffold.

## Fluxo interativo do CLI

O instrutor demonstra o fluxo padrao:

1. **Navegar ate a pasta** — Usa `cd` e a tecnica de arrastar a pasta para o terminal, que automaticamente insere o caminho absoluto. Isso evita erros de digitacao em caminhos longos.

2. **Executar o scaffold** — `npm create vite@latest` inicia o wizard interativo.

3. **Nome do projeto** — O nome escolhido (`react-halter` no exemplo) se torna o nome da pasta e do `package.json`. Usar kebab-case e convencao padrao.

4. **Selecao de framework** — Vite suporta React, Vue, Svelte, Preact, Lit, e Vanilla. Selecionar React.

5. **Selecao de variante** — TypeScript e a escolha recomendada. O Vite configura automaticamente o `tsconfig.json` e os tipos necessarios.

## Tecnica do drag-and-drop no terminal

O instrutor destaca uma tecnica pratica: arrastar uma pasta do explorador de arquivos e soltar no terminal insere automaticamente o caminho completo. Isso e especialmente util em caminhos com espacos ou caracteres especiais, porque o terminal ja adiciona as aspas necessarias.

## Abrindo no VS Code

Apos a criacao, o instrutor arrasta a pasta para o VS Code. Alternativamente, pode-se usar `code .` dentro da pasta do projeto. Ambos os metodos abrem o projeto na raiz correta.

## Contexto da aula

Este projeto e criado especificamente para estudar React Router. O foco nao e na configuracao do Vite em si, mas em ter um projeto React + TypeScript limpo como base para implementar rotas e navegacao.