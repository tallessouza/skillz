# Deep Explanation: Criando Tabelas SQL

## Por que chave primaria com AUTO_INCREMENT?

O instrutor define o `id` como `INTEGER PRIMARY KEY AUTO_INCREMENT` por tres razoes:

1. **Unicidade garantida** — PRIMARY KEY impede dois registros com mesmo ID. O banco rejeita duplicatas automaticamente.

2. **Geracao automatica** — AUTO_INCREMENT significa que voce nao precisa informar o ID ao inserir. O banco gera sequencialmente (1, 2, 3...). O instrutor destaca: "dizendo que essa coluna vai ser gerada automaticamente, vai ser auto incremento".

3. **Simplicidade nos INSERTs** — ao inserir um curso, basta informar o nome. O ID cuida de si mesmo.

## Por que NOT NULL no nome?

O campo `name TEXT NOT NULL` impede que alguem crie um curso sem nome. Sem essa constraint, o banco aceitaria:

```sql
INSERT INTO courses (name) VALUES (NULL);  -- Seria aceito sem NOT NULL
```

Isso geraria registros "fantasma" — existem no banco mas nao tem informacao util.

## Padrao repetido: students e courses

O instrutor segue o mesmo padrao em ambas as tabelas:
- ID inteiro, chave primaria, auto incremento
- Campos de texto com NOT NULL

Esse padrao e a base para qualquer entidade em banco relacional. A consistencia facilita manutencao e leitura.

## Fluxo de trabalho do instrutor

1. Apagou codigo anterior (INSERT de exemplo na tabela students)
2. Criou CREATE TABLE com a estrutura completa
3. Executou o comando
4. Verificou visualmente que a tabela apareceu no painel lateral com as colunas corretas

Esse fluxo — escrever, executar, verificar — e o ciclo basico de desenvolvimento SQL.

## INTEGER vs INT vs SERIAL

Dependendo do banco:
- **SQLite**: `INTEGER PRIMARY KEY` ja faz auto incremento implicitamente
- **MySQL**: `INT AUTO_INCREMENT`
- **PostgreSQL**: `SERIAL` ou `GENERATED ALWAYS AS IDENTITY`

O instrutor usa a sintaxe generica que funciona na maioria dos contextos didaticos.