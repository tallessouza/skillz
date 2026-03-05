# Deep Explanation: Estrutura de Projeto Express para Autenticação

## Por que POST /sessions e não POST /users/login?

O instrutor faz uma distinção importante: login não é uma operação sobre o recurso "user". Login **cria uma sessão**. Seguindo REST, se você está criando algo, usa POST. O recurso sendo criado é uma sessão, então: `POST /sessions`.

Essa convenção vem do padrão RESTful onde cada endpoint representa um recurso. A sessão é o recurso que nasce quando o usuário faz login e morre quando faz logout. Isso facilita:
- `POST /sessions` → login (criar sessão)
- `DELETE /sessions` → logout (destruir sessão)

Se usássemos `/users/login`, quebramos a semântica REST porque "login" não é um substantivo/recurso, é um verbo.

## A separação server → routes → controllers

O instrutor já traz essa estrutura pronta porque "não tem nada de novo aqui" — é um padrão que os alunos já aprenderam. A motivação:

1. **server.ts** — responsabilidade única: configurar e iniciar o Express. Define porta, middlewares globais (JSON), importa rotas, registra error handler.

2. **routes/index.ts** — responsabilidade única: mapear URLs para controllers. Não tem lógica, só conexões.

3. **controllers/** — responsabilidade única: lógica de cada ação. Cada método (index, create, show, update, delete) corresponde a uma operação HTTP.

## Por que trazer estrutura pronta?

O instrutor explica: "ficaria bem repetitivo você criar tudo isso do zero junto comigo, sendo que você já aprendeu a fazer isso." O foco da aula é autenticação e autorização, não Express básico. Trazer o scaffold pronto permite ir "direto ao ponto."

Isso reflete um princípio pedagógico importante: **isolar o conceito novo**. Se o aluno precisa criar o projeto do zero, a atenção se divide entre setup e auth. Com o projeto pronto, 100% do foco vai para o conceito novo.

## A importância de ver cada coisa separada

O instrutor enfatiza: "é importante a gente ver cada coisa separada agora" e que "depois a gente vai criar um projeto novo também, conectando e juntando todas essas peças."

Isso reflete o padrão de ensino:
1. Primeiro aprende cada peça isoladamente
2. Depois conecta tudo em um projeto real

Para auth, isso significa: primeiro entender JWT, hashing, middleware de auth cada um sozinho, depois juntar tudo.

## Testando com Insomnia

O instrutor mostra como configurar o Insomnia antes de implementar:
1. Criar uma request collection
2. Organizar em pastas por recurso (sessions, products)
3. Criar requests nomeados (login/create, index, create)
4. Testar com retornos simples (`response.json({ message: "ok" })`)

Isso confirma que as rotas funcionam ANTES de adicionar complexidade. É debugging preventivo — se algo falhar depois de adicionar auth, você sabe que o problema está no auth, não nas rotas.

## Erro ao digitar localhost

O instrutor comete um erro ao digitar a URL no Insomnia (esqueceu o "l" em localhost). Isso é um lembrete prático: sempre verifique a URL exata antes de debugar problemas de conexão. Erros de digitação em URLs são uma das causas mais comuns de "não funciona" em desenvolvimento.