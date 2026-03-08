# Deep Explanation: Ambiente de Desenvolvimento React com Vite

## Por que Vite e nao Create React App?

O instrutor escolhe Vite como ferramenta de scaffolding para projetos React. Vite e descrito como "um boilerplate ou ferramenta que permite criar projetos React" com a vantagem de trazer "uma estrutura bem moderna para trabalhar com o desenvolvimento".

A distincao importante feita pelo instrutor:
- **React** e o "core", o "motor" — a biblioteca/framework para desenvolver a aplicacao
- **Vite** e a ferramenta para **criar** o projeto React — scaffolding, dev server, build

Essa separacao conceitual e importante: React e Vite tem papeis diferentes. React cuida da UI, Vite cuida do tooling (bundling, hot module replacement, dev server).

## Por que NPM como padrao?

O instrutor reconhece que existem alternativas (Yarn, PNPM, Bun), mas recomenda explicitamente usar NPM:

> "Eu super recomendo que voce usa o padrao aqui junto comigo para voce nao ter problemas ai durante as aulas."

A razao e pragmatica: NPM vem instalado com Node.js, e o gerenciador padrao, e usar o mesmo gerenciador que o instrutor evita problemas de compatibilidade com lockfiles e resolucao de dependencias.

## Versao LTS do Node

O instrutor enfatiza: "sempre da versao LTS". LTS (Long Term Support) significa que a versao recebe correcoes de seguranca e bugs por um periodo estendido. Para desenvolvimento, estabilidade e mais importante que ter a ultima feature do Node.

## Organizacao de pastas

O instrutor cria uma estrutura `aulas/react/` para organizar projetos. Essa pratica de ter uma pasta dedicada para projetos de estudo facilita:
- Navegacao rapida entre projetos
- Backup organizado
- Separacao entre projetos de estudo e projetos reais

## VS Code minimalista

O instrutor menciona que gosta de manter o VS Code "mais minimalista" e mostra que tem extensoes desabilitadas. Isso reflete uma boa pratica: instalar apenas extensoes que voce realmente usa. Extensoes desnecessarias podem:
- Tornar o editor mais lento
- Causar conflitos entre extensoes
- Adicionar ruido visual desnecessario

## Prerequisito: Node.js

A verificacao do NPM via terminal (`npm --version`) e o primeiro passo antes de qualquer coisa. Sem Node.js/NPM, nao e possivel:
- Instalar dependencias
- Criar projetos com Vite
- Executar scripts de desenvolvimento
- Gerenciar pacotes