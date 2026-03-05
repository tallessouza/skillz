# Deep Explanation: Fundamentos de API REST com Node e Express

## Progressao pedagogica

O instrutor estrutura o curso de forma modular e incremental:

1. **Primeiro: fundamentos isolados** — Cada modulo foca em um tema (REST, banco de dados, autenticacao, etc.)
2. **Depois: integracao** — Os conhecimentos sao combinados em um projeto real

Essa abordagem segue o principio de "aprenda os blocos antes de montar a construcao". O aluno nao deve pular para o projeto sem dominar cada fundamento individualmente.

## Por que Express como base

Express e o framework minimalista padrao do ecossistema Node.js para APIs REST. Ele fornece:

- Roteamento declarativo por verbo HTTP
- Sistema de middleware composavel
- Flexibilidade para adicionar camadas (validacao, auth, ORM) conforme necessidade

O instrutor escolhe Express porque permite ensinar os conceitos REST de forma direta, sem abstrações que escondam o que esta acontecendo.

## O que significa "fundamentos" neste contexto

Os fundamentos cobertos nesta etapa incluem:

1. **Criacao de servidor HTTP com Express** — `express()`, `app.listen()`
2. **Definicao de rotas REST** — `app.get()`, `app.post()`, `app.put()`, `app.delete()`
3. **Manipulacao de request** — params, query strings, body parsing
4. **Respostas adequadas** — status codes corretos, JSON formatado
5. **Middleware basico** — `express.json()`, middleware customizado
6. **Organizacao de codigo** — separacao de rotas e responsabilidades

## Conexao com modulos futuros

O instrutor explicita que esses fundamentos serao base para:

- Integracao com banco de dados
- Autenticacao e autorizacao
- Validacao de dados
- Deploy e infraestrutura
- O projeto final que combina tudo

Isso reforça que o aluno deve ter confianca nos fundamentos antes de avancar.