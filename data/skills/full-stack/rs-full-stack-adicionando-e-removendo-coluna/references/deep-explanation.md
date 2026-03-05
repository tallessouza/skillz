# Deep Explanation: Adicionando e Removendo Colunas

## Por que ALTER TABLE e nao recriar a tabela?

Quando uma tabela ja existe e tem dados, voce nao pode simplesmente apagar e recriar. O `ALTER TABLE` permite modificar a estrutura sem perder os dados existentes. E a unica forma segura de evoluir o schema de um banco em producao.

## A armadilha do "RUN" completo

O instrutor destaca um ponto critico de produtividade e seguranca: ferramentas SQL como o Beekeeper Studio, DBeaver, ou o proprio pgAdmin executam **todo o conteudo do editor** quando voce clica em "Run" sem selecao.

Isso significa que se voce tem:
```sql
ALTER TABLE products ADD quantity INTEGER NOT NULL;
ALTER TABLE products DROP COLUMN quantity;
```

Clicar em "Run" executa ambos — a coluna e adicionada e imediatamente removida. O resultado liquido e zero, mas voce acha que adicionou a coluna.

**Solucao:** Selecione apenas o trecho que deseja executar. A maioria dos editores SQL muda o botao para "Run Selection" quando ha texto selecionado.

## NOT NULL em colunas novas

Ao adicionar uma coluna `NOT NULL` em uma tabela que ja possui registros, o banco precisa saber qual valor colocar nas linhas existentes. Sem um `DEFAULT`, o comando pode falhar. Por isso:

- Tabela vazia: `ADD column TYPE NOT NULL` funciona
- Tabela com dados: `ADD column TYPE NOT NULL DEFAULT valor` e mais seguro

## DROP COLUMN — cuidados

Remover uma coluna e uma operacao **irreversivel**. Os dados daquela coluna sao perdidos permanentemente. Antes de executar:

1. Verifique se alguma query, view ou function depende da coluna
2. Faca backup se os dados sao importantes
3. Em producao, considere marcar como deprecated antes de remover

## Sintaxe resumida

| Operacao | Sintaxe |
|----------|---------|
| Adicionar coluna | `ALTER TABLE t ADD col TYPE [constraints];` |
| Remover coluna | `ALTER TABLE t DROP COLUMN col;` |
| Renomear coluna | `ALTER TABLE t RENAME COLUMN old TO new;` |
| Alterar tipo | `ALTER TABLE t ALTER COLUMN col TYPE new_type;` |

O instrutor focou em ADD e DROP COLUMN, que sao as operacoes mais comuns no dia a dia.