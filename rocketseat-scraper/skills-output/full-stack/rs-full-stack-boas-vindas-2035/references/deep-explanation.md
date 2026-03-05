# Deep Explanation: Banco de Dados — Mapa de Aprendizado

## Por que estudar banco de dados isoladamente?

O instrutor da Rocketseat enfatiza um ponto pedagógico importante: **banco de dados deve ser estudado separado antes de criar aplicações que o utilizem**.

A lógica é simples mas frequentemente ignorada:

1. **Complexidade composta** — Se você não entende SQL e tenta usar dentro de uma aplicação Node/React, está lidando com duas incógnitas ao mesmo tempo. Quando algo dá errado, não sabe se o problema é no código da aplicação ou na query.

2. **Fundamentos transferíveis** — SQL é uma linguagem padrão. Aprender SQL puro (sem ORM, sem framework) significa que o conhecimento funciona em PostgreSQL, MySQL, SQLite, SQL Server. O investimento em fundamentos se paga em qualquer stack.

3. **Debugging eficiente** — Quando você domina SQL isoladamente, consegue testar queries direto no banco antes de integrar. Isso reduz o ciclo de debug drasticamente.

## Sequência pedagógica do módulo

O instrutor estrutura o aprendizado nesta ordem:

1. **O que é banco de dados** — Conceito, propósito, tipos
2. **Banco relacional** — Modelo de tabelas, colunas, linhas
3. **Linguagem SQL** — A linguagem padrão para bancos relacionais
4. **Operações práticas:**
   - Criar tabelas (CREATE TABLE)
   - Criar registros (INSERT)
   - Atualizar registros (UPDATE)
   - Deletar registros (DELETE)
   - Consultas (SELECT)
   - Filtros (WHERE, LIKE, etc.)
5. **Relacionamentos** — Como tabelas se conectam
6. **Tipos de dados** — Escolher o tipo correto para cada coluna

Só depois de dominar tudo isso é que o curso avança para "criar aplicações utilizando banco de dados".

## Insight do instrutor

A frase-chave: *"Primeiro você precisa compreender tudo isso, inclusive ver na prática"*

Não é apenas teoria. O instrutor enfatiza que a compreensão vem da prática isolada — criar tabelas, inserir dados, fazer queries — tudo no banco diretamente, sem a camada de aplicação no meio.