# Deep Explanation: Tipos de Dados no SQLite

## Por que tipos de dados importam

Tipos de dados determinam o conteúdo de cada coluna numa tabela. O instrutor usa uma analogia visual: mostra uma tabela onde cada coluna tem um tipo diferente — a primeira coluna com números inteiros (INTEGER), a segunda com textos (TEXT), a terceira com números decimais (REAL), e a quarta com timestamps (INTEGER).

A ideia central é: **o tipo define o contrato da coluna**. Quando você declara uma coluna como INTEGER, está dizendo "aqui só entra número inteiro". Isso ajuda tanto na validação quanto na performance das queries.

## Cada tipo em detalhe

### NULL — o não-valor

NULL não é zero, não é string vazia, não é false. É a ausência de informação. Quando um campo na tabela "não tem nenhum dado" ou "nada foi informado", o valor é NULL.

Ponto importante do instrutor: NULL é um **valor**, não um tipo que você declara na criação da coluna. Você não cria uma coluna do tipo NULL — você permite que uma coluna aceite NULL como valor.

### INTEGER — números inteiros

Positivo ou negativo, sem casas decimais. O instrutor destaca dois usos:
1. **IDs e contadores** — o uso óbvio
2. **Timestamps** — menos óbvio mas muito importante. No SQLite, não existe tipo DATE nativo, então datas são armazenadas como números inteiros representando Unix timestamps (quantidade de segundos desde 1970-01-01)

### REAL — ponto flutuante

O instrutor chama de "a famosa casa decimal". Três cenários mencionados explicitamente:
- **Medições** — valores que precisam de precisão
- **Cálculos financeiros** — operações que envolvem decimais
- **Valores monetários** — preços em reais, por exemplo

O exemplo dado na aula é uma nota de 9.8 — um número que não pode ser INTEGER porque perderia a parte decimal.

### TEXT — texto

Sequência de caracteres. O instrutor menciona: nomes, descrições, "qualquer outro tipo de dado baseado em texto". No SQLite, TEXT é o único tipo de string — diferente de outros bancos que têm VARCHAR(n), CHAR(n), NVARCHAR, etc.

### BLOB — Binary Large Object

"Dados binários grandes" — a tradução literal. O instrutor explica: serve para armazenar "o binário mesmo do arquivo". Exemplos: imagens, arquivos, qualquer dado que não seja convertido automaticamente para texto ou número.

## SQLite vs outros bancos

O instrutor faz uma observação importante: "Cada banco de dados tem seus próprios tipos. Tem banco de dados que tem mais opções, menos opções." O SQLite é minimalista — apenas 5 tipos (NULL, INTEGER, REAL, TEXT, BLOB). PostgreSQL, por exemplo, tem dezenas (VARCHAR, BOOLEAN, TIMESTAMP, JSONB, ARRAY, etc.).

Isso significa que no SQLite você precisa ser criativo com os tipos disponíveis:
- Booleanos → INTEGER (0 ou 1)
- Datas → INTEGER (timestamp) ou TEXT (ISO 8601)
- JSON → TEXT
- Enums → TEXT com CHECK constraints

## Contexto da aula

Esta é uma aula preparatória — o instrutor está explicando os tipos antes de ensinar CREATE TABLE na próxima aula. O entendimento correto dos tipos é pré-requisito para criar tabelas bem estruturadas.