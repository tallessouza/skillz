# Deep Explanation: SQL Fundamentals

## Contexto da aula

Esta aula e um encerramento do modulo de banco de dados do curso full-stack da Rocketseat. O instrutor recapitula todos os topicos cobertos no modulo, servindo como mapa mental do que foi aprendido.

## O que foi coberto no modulo

### 1. Criacao de tabelas
O primeiro passo em qualquer banco relacional e definir a estrutura. `CREATE TABLE` com tipos de dados, constraints (`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `FOREIGN KEY`) e valores default.

### 2. Consultas com filtros
`SELECT` e a operacao mais usada em SQL. O modulo cobriu diversos tipos de filtro:
- Comparacao direta (`=`, `!=`, `>`, `<`)
- Ranges (`BETWEEN`)
- Pattern matching (`LIKE`, `ILIKE`)
- Listas (`IN`)
- Combinacoes logicas (`AND`, `OR`, `NOT`)

### 3. CRUD completo
As quatro operacoes fundamentais:
- **C**reate → `INSERT INTO`
- **R**ead → `SELECT`
- **U**pdate → `UPDATE ... SET ... WHERE`
- **D**elete → `DELETE FROM ... WHERE`

A enfase em sempre usar `WHERE` com `UPDATE` e `DELETE` e critica — sem filtro, a operacao afeta a tabela inteira.

### 4. Banco de dados relacional
O conceito fundamental: dados sao organizados em tabelas que se relacionam entre si atraves de chaves (PK e FK). Isso e o que diferencia um banco relacional de um banco de documentos ou key-value.

### 5. Tipos de relacionamento
- **Um para um (1:1):** Cada registro tem no maximo um correspondente. Implementado com FK + UNIQUE.
- **Um para muitos (1:N):** O caso mais comum. Um registro "pai" tem multiplos "filhos". FK simples no lado "muitos".
- **Muitos para muitos (N:N):** Requer tabela intermediaria (junction/pivot table) com duas FKs.

## Modelo mental para escolher relacionamentos

Pergunte sempre:
1. "Um X pode ter quantos Y?" → Se a resposta e "muitos", Y tem a FK
2. "Um Y pode ter quantos X?" → Se ambas as respostas sao "muitos", voce precisa de tabela intermediaria
3. "X e Y sempre existem juntos?" → Se sim, considere 1:1 ou ate mesclar na mesma tabela

## Proximo passo

O instrutor indica que o conhecimento de SQL sera aplicado em um novo projeto nas proximas etapas. Isso significa que o SQL aprendido aqui sera usado com uma linguagem de programacao (provavelmente Node.js/TypeScript no contexto Rocketseat) para construir APIs que interagem com o banco.