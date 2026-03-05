# Deep Explanation: Inserindo Dados com SQL

## Por que omitir colunas AUTO_INCREMENT?

O instrutor mostra que a coluna `id` na tabela `products` é definida como auto-incremento. Isso significa que o banco de dados gera automaticamente o próximo valor sequencial. Se você tentar passar um valor manualmente, pode causar conflitos de chave primária ou desperdiçar IDs. O primeiro produto inserido recebeu `id = 1` automaticamente sem que fosse especificado no INSERT.

## O mecanismo de DEFAULT

Quando uma coluna é definida com `DEFAULT 'General'` (como `category` na aula), existem dois cenários:

1. **Você omite a coluna no INSERT** → o banco usa o valor padrão (`'General'`)
2. **Você lista a coluna e passa um valor** → o banco usa o valor que você passou, ignorando o DEFAULT

O instrutor demonstrou ambos os casos:
- Primeiro INSERT: omitiu `category` → resultado foi `'General'`
- Segundo INSERT: passou `'Acessório'` → resultado foi `'Acessório'`

## O erro clássico de mismatch coluna-valor

O instrutor cometeu propositalmente (ou acidentalmente) um erro ao adicionar `'Acessório'` nos VALUES sem adicionar `category` na lista de colunas. O banco retornou erro: "3 valores para 2 colunas". Esse é um dos erros mais comuns para iniciantes em SQL.

**A regra é simples:** o número de itens em `(col1, col2, col3)` deve ser exatamente igual ao número de itens em `VALUES (val1, val2, val3)`.

## Comentários SQL

O instrutor ensinou dois tipos de comentários para evitar execução acidental de código:

- `--` (dois hífens): comentário de uma linha
- `/* ... */`: comentário de múltiplas linhas

O caso de uso mostrado foi comentar o `CREATE TABLE` que já havia sido executado, para manter como referência visual sem risco de executar novamente.

## Execução parcial no editor SQL

Um ponto prático importante: ao usar um editor SQL (como o Beekeeper, DBeaver, etc.), é possível selecionar apenas uma parte do código e executar apenas a seleção. O instrutor enfatizou isso para evitar executar o CREATE TABLE novamente por acidente.

## Colunas NULLable vs DEFAULT

A coluna `category` foi definida como nullable (`pode ser nulo`) com um valor padrão. Isso significa:
- Se omitida → usa DEFAULT (`'General'`)
- Se passada como `NULL` explicitamente → armazena NULL (não usa DEFAULT)
- Se passada com valor → armazena o valor passado

Essa distinção é sutil mas importante.