# Deep Explanation: Estrutura de Projeto API REST com CRUD

## Por que usar um template como ponto de partida

O instrutor enfatiza que, quando o foco da aula e um conceito especifico (neste caso, ORM), nao faz sentido repetir a criacao de estrutura basica que o aluno ja domina. O template serve como **scaffold** — uma base funcional que elimina trabalho repetitivo e permite ir direto ao ponto.

Essa abordagem reflete uma pratica profissional real: equipes mantem boilerplates e templates para novos projetos, evitando recriar rotas, controllers e configuracoes basicas toda vez.

## Anatomia da estrutura

### Server como ponto de entrada minimo

O `server.ts` nao contem rotas nem logica de negocio. Ele apenas:
1. Importa o framework (Express/Fastify)
2. Registra o router centralizado
3. Inicia o servidor na porta configurada

Isso segue o principio de responsabilidade unica — o server so "liga" a aplicacao.

### Separacao rotas vs controllers

**Rotas** definem os endpoints HTTP (verbo + path) e delegam para controllers. **Controllers** contem a logica de cada operacao. Essa separacao permite:
- Trocar a implementacao do controller sem mudar as rotas
- Testar controllers isoladamente (sem HTTP)
- Visualizar rapidamente todos os endpoints de um recurso

### Index como centralizador

O `routes/index.ts` importa todos os arquivos de rotas e os registra em um unico router. O `server.ts` so precisa conhecer esse router central. Quando um novo recurso e adicionado, basta criar os arquivos de rota/controller e registrar no index — nenhum outro arquivo precisa mudar.

## O padrao CRUD nos controllers

Cada controller expoe funcoes nomeadas por operacao:
- `list` — GET (todos)
- `show` — GET (um especifico, por ID)
- `create` — POST
- `update` — PUT/PATCH
- `remove` — DELETE

O instrutor mostra que inicialmente os controllers retornam JSON vazio (`res.json({})`). Isso e intencional: o scaffold define a **interface** (quais operacoes existem) antes da **implementacao** (que sera feita com o ORM nas aulas seguintes).

## Node modules e .gitignore

O instrutor demonstra que ao clonar o projeto do GitHub, a pasta `node_modules` nao existe. Isso e padrao porque:
1. `node_modules` e enorme e redundante (pode ser recriada a partir do `package.json`)
2. O `.gitignore` impede que ela seja versionada
3. O comando `npm install` (ou `npm i`) regenera a pasta localmente

Esse e um conceito fundamental de qualquer projeto Node.js — dependencias sao declarativas (no `package.json`) e resolvidas localmente.

## Contexto do projeto

O projeto e uma **API de perguntas e respostas** com dois dominios:
- **Usuarios** — listar todos, criar, exibir um especifico
- **Perguntas** — listar todas, criar, atualizar, deletar

Essa estrutura sera a base para implementar o ORM (Prisma/Drizzle) nas aulas seguintes, substituindo os retornos vazios por operacoes reais no banco de dados.