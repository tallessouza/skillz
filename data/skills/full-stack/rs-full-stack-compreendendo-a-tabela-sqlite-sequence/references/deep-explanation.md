# Deep Explanation: Tabela sqlite_sequence

## Por que o SQLite precisa dessa tabela?

Quando voce define uma coluna como `INTEGER PRIMARY KEY AUTOINCREMENT`, o SQLite garante que o proximo ID sera **sempre maior** que qualquer ID ja usado — mesmo que registros tenham sido deletados.

Sem `AUTOINCREMENT`, o SQLite usa o mecanismo de rowid padrao, que simplesmente pega `MAX(rowid) + 1`. Isso significa que se voce deletar o registro com o maior ID, o proximo registro pode reutilizar aquele ID.

Com `AUTOINCREMENT`, o SQLite consulta a `sqlite_sequence` para garantir monotonia estrita — o valor so cresce, nunca volta.

## AUTOINCREMENT vs INTEGER PRIMARY KEY (sem AUTOINCREMENT)

| Comportamento | INTEGER PRIMARY KEY | INTEGER PRIMARY KEY AUTOINCREMENT |
|--------------|--------------------|------------------------------------|
| Gera IDs automaticamente | Sim | Sim |
| Cria entrada em sqlite_sequence | Nao | Sim |
| Reutiliza IDs deletados | Pode reutilizar | Nunca reutiliza |
| Performance | Ligeiramente melhor | Overhead minimo da consulta a sqlite_sequence |
| Garantia de monotonia | Nao (usa MAX(rowid)+1) | Sim (usa MAX(seq, MAX(rowid))+1) |

## Como o SQLite decide o proximo ID

Com AUTOINCREMENT, o algoritmo e:

```
proximo_id = MAX(sqlite_sequence.seq, MAX(rowid da tabela)) + 1
```

Isso garante que mesmo que a sqlite_sequence esteja desatualizada (por algum motivo), o ID nunca colide com um existente.

## A tabela sqlite_sequence na pratica (contexto da aula)

O instrutor demonstrou criando uma tabela `products` com ID auto-increment. Apos inserir 2 produtos:

1. A tabela `sqlite_sequence` foi criada automaticamente
2. Consultando `SELECT * FROM sqlite_sequence` retornou: `products | 2`
3. Isso confirma que o ultimo ID atribuido foi 2
4. Consultando `SELECT * FROM products` confirmou que o ultimo registro tinha ID 2

## Quando a sqlite_sequence causa problemas

### Limite de ID
O SQLite usa `INTEGER` que suporta ate 9,223,372,036,854,775,807 (2^63 - 1). Com AUTOINCREMENT, se esse limite for atingido, o INSERT falha com `SQLITE_FULL`. Sem AUTOINCREMENT, o SQLite tentaria encontrar um rowid nao usado aleatoriamente.

### Gaps nos IDs
E perfeitamente normal ter gaps (ex: 1, 2, 5, 8). Isso acontece por:
- Delecoes de registros
- Transacoes que falharam (o seq ja foi incrementado)
- INSERTs com ID explicito maior que o seq atual

Gaps nao sao bugs — sao comportamento esperado.

## Insight do instrutor

O instrutor enfatizou que a `sqlite_sequence` serve para o SQLite **"memorizar"** a sequencia. Essa analogia de memoria e precisa — e literalmente um registro persistente que sobrevive ao fechamento e reabertura do banco, garantindo que a sequencia continue de onde parou.