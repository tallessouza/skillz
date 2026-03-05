# Deep Explanation: Fundamentos do Redux e Arquitetura Flux

## Por que o Redux se tornou tao popular

O Redux se tornou a ferramenta de gerenciamento de estado mais famosa do ecossistema React porque, ate 2017-2018, a Context API do React era muito precaria — especialmente na epoca de class components. Nao existia uma forma oficial e simples de compartilhar informacoes entre componentes distantes na arvore. O Redux preenchia esse vazio.

Isso significa que **muitos projetos legados usam Redux**, e programadores front-end vao encontrar Redux em manutencao de projetos antigos. Porem, o Redux moderno (com Redux Toolkit) e muito mais simples do que o Redux classico.

## A confusao Context API vs Redux

Uma das confusoes mais comuns na comunidade React: achar que Context API substitui Redux. A diferenca fundamental:

- **Context API** = mecanismo de compartilhamento de dados entre componentes. Ela nao gerencia estado — apenas transporta informacao.
- **Redux** = ferramenta de **gerenciamento** de estado. Traz arquitetura (Flux), historico, timeline de alteracoes, e uma forma estruturada de fazer modificacoes via actions e reducers.

O equivalente mais proximo do Redux usando APIs nativas do React seria: **Context API + useReducer**. O useReducer e um hook do React totalmente baseado no conceito de reducers do Redux — ele traz uma estrutura para gerenciar estado local com actions e reducers.

## Os tres tipos de estado no React

O instrutor (Diego) enfatiza que a comunidade moderna define claramente tres categorias:

1. **UI State (Local)**: Estado usado para mudar a interface dentro de um componente. Exemplo: qual aba esta ativa, se um dropdown esta aberto.

2. **UI State (Global)**: Estado compartilhado entre toda a aplicacao. Exemplo: usuario logado, tema dark/light.

3. **HTTP/Server State**: Dados retornados de requisicoes ao backend. Exemplo: lista de produtos, detalhes de um pedido.

**O erro historico**: antigamente, a comunidade usava Redux para os tres tipos. "Era uma terra sem lei." Hoje, cada tipo tem sua ferramenta adequada.

## Centralizacao vs Descentralizacao

Existem dois modelos mentais para gerenciamento de estado:

**Centralizado (Redux, Zustand)**: Um grande estado (Store) compartilhado por toda a aplicacao. Todos os componentes podem acessar e, via actions, modificar esse estado.

**Descentralizado (Context API, Jotai, Recoil)**: Varios pequenos estados, cada um compartilhado entre um subconjunto de componentes. A ideia e ter "pedacinhos" de estado conforme a necessidade.

Curiosidade do instrutor: Jotai e criado pelo mesmo criador do Zustand, mas com proposito diferente — Jotai substitui Context API (descentralizado), Zustand substitui Redux (centralizado).

## Arquitetura Flux em detalhe

A arquitetura Flux e uma **arquitetura de eventos**, nao de mutacao direta:

1. **View** (componentes) — o usuario clica em algo
2. **Action** — uma funcao e disparada descrevendo a intencao ("adicionar produto X ao carrinho"). Essa funcao **nao altera o estado** — ela apenas dispara um evento.
3. **Reducer** — um pedaco do estado que "ouve" aquela action. O reducer de carrinho ouve a action de "adicionar ao carrinho" e decide como alterar o estado.
4. **Store** — o estado atualizado reflete automaticamente na interface.

Ponto crucial do instrutor: "A action nao adiciona o produto no carrinho, ela nao mexe no estado, ela so dispara um evento." Isso e o que diferencia Flux de mutacao direta — e uma camada de indirecao que permite historico, debugging (time-travel), e multiplos reducers ouvindo a mesma action.

Varios reducers podem ouvir a mesma action. Exemplo: ao adicionar um produto ao carrinho, o reducer de carrinho adiciona o item, mas o reducer de analytics poderia registrar o evento tambem.

## Zustand como alternativa moderna

O instrutor posiciona o Zustand como "Redux muito mais simplificado, mais simples de utilizar, mais leve." Ambos seguem o modelo de store centralizada, mas Zustand remove a boilerplate que tornava o Redux classico verboso.