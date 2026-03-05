# Deep Explanation: Introdução ao SQL

## O que é SQL

SQL significa **Structured Query Language** (Linguagem de Consulta Estruturada). É a linguagem padrão para gerenciar e manipular bancos de dados relacionais. Isso significa que todo banco relacional — seja SQLite, PostgreSQL, MySQL, SQL Server, Oracle — utiliza SQL como interface de comunicação.

## Por que SQL é portável

O instrutor enfatiza um ponto fundamental: **tudo que você aprender de SQL, você consegue utilizar em qualquer banco de dados relacional.** Isso acontece porque SQL é um padrão (originalmente definido pela ANSI/ISO) que todas as engines implementam.

A analogia prática: é como aprender a dirigir. Uma vez que você sabe dirigir, consegue dirigir qualquer carro — pode ter o volante num lugar levemente diferente, os botões podem mudar, mas o conceito fundamental (volante, pedais, marchas) é o mesmo.

## Diferenças entre engines — "Pequenos detalhes"

O instrutor destaca que as diferenças são **pequenas** e geralmente caem em duas categorias:

### 1. Sintaxe opcional vs obrigatória
- **Ponto e vírgula:** No SQLite é opcional no final da linha. No PostgreSQL é obrigatório. A recomendação prática é sempre usar ponto e vírgula — funciona em todos e é boa prática.

### 2. Convenções de texto
- **SQLite e PostgreSQL:** Usam aspas simples para texto (`'texto'`)
- **SQL Server:** Aceita aspas duplas para texto

Essas diferenças são "sotaques" — não mudam o significado fundamental da linguagem.

## As quatro operações fundamentais

O instrutor resume SQL em três verbos de ação: **criar, modificar e consultar** dados dentro do banco. Expandindo para o modelo CRUD completo:

1. **CREATE** — Inserir novos dados
2. **READ** — Consultar/ler dados existentes
3. **UPDATE** — Modificar dados existentes
4. **DELETE** — Remover dados

Toda interação com um banco relacional se resume a combinações dessas quatro operações.

## Contexto da aula

Esta aula é introdutória e conceitual — o instrutor está preparando o terreno para a prática. O ponto central é: não tenha medo de SQL, é uma linguagem padrão e portável. Aprenda os fundamentos e aplique em qualquer engine.