# Deep Explanation: Populando Tabelas com INSERT INTO

## Por que especificar colunas explicitamente?

Quando você escreve `INSERT INTO students VALUES (...)`, o SQL espera valores para TODAS as colunas na ordem exata da tabela. Se amanhã alguém adicionar uma coluna `email` entre `id` e `name`, todos os seus inserts quebram silenciosamente ou inserem dados na coluna errada.

Ao escrever `INSERT INTO students (name) VALUES (...)`, você está dizendo explicitamente: "quero inserir apenas neste campo". O banco sabe exatamente onde colocar o dado, independente da ordem das colunas ou de colunas novas que apareçam.

## Por que um INSERT por linha ao invés de VALUES múltiplos?

SQL permite a sintaxe:
```sql
INSERT INTO students (name) VALUES
  ('Lucas Santos'),
  ('Beatriz Lima'),
  ('Gabriel Oliveira');
```

No contexto da aula, o instrutor optou por um INSERT por linha. Ambas as abordagens funcionam, mas statements separados têm vantagens para aprendizado:
- Cada linha é independente — se uma falhar, as outras executam
- Mais fácil de copiar, modificar e debugar individualmente
- Visualmente claro quantos registros estão sendo inseridos

Para produção com grandes volumes, a sintaxe de múltiplos VALUES em um único INSERT é mais performática.

## O papel do ponto e vírgula

Em SQL, o `;` é o terminador de statement. Quando você tem apenas um statement, muitos clientes SQL executam sem ele. Mas quando há múltiplos statements no mesmo script, o `;` é obrigatório para separar cada um.

O instrutor enfatiza: "como a gente vai inserir vários de uma vez, temos que colocar ponto e vírgula no final." É um hábito que previne erros — sempre use `;`.

## SELECT * FROM como verificação

Após inserir dados, a prática de executar `SELECT * FROM students` serve como verificação visual imediata. Você confirma:
- Quantos registros foram inseridos (10 no exemplo)
- Se os IDs foram gerados corretamente pelo auto-increment
- Se os nomes estão corretos e sem erros de digitação

O instrutor demonstra selecionar apenas a linha do SELECT antes de executar, para não re-executar os INSERTs e duplicar dados. Este é um cuidado importante ao trabalhar com ferramentas visuais de banco de dados.

## Colunas auto-increment

A tabela `students` tem uma coluna `id` auto-increment. Quando fazemos INSERT, omitimos essa coluna propositalmente. O banco de dados gera automaticamente os valores sequenciais (1, 2, 3... 10).

Tentar inserir um valor para uma coluna auto-increment pode causar conflitos ou erros, dependendo da configuração do banco.

## Nomes de exemplo realistas

O instrutor usa nomes brasileiros realistas (Lucas Santos, Beatriz Lima, etc.) ao invés de dados genéricos como "Test 1", "Test 2". Isso torna os dados de exemplo mais legíveis e facilita identificar registros durante o desenvolvimento.