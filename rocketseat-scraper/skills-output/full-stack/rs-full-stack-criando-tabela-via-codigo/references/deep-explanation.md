# Deep Explanation: Criando Tabela via Código SQL

## Por que palavras reservadas em caixa alta?

O instrutor explica que escrever em minusculo funciona perfeitamente — o SQL nao e case-sensitive para palavras reservadas. No entanto, o padrao de mercado e escrever palavras reservadas em caixa alta (`CREATE TABLE`, `NOT NULL`, `INTEGER`) porque:

- Diferencia visualmente o que e comando SQL do que e nome de tabela/coluna
- Facilita leitura rapida do codigo
- E o padrao que voce vai encontrar em empresas e projetos open source

## Por que nome de tabela no plural?

A analogia do instrutor: uma tabela de produtos vai guardar **varios** produtos, nao apenas um. Por isso `products` e nao `product`. Faz sentido semantico — a tabela e um container de multiplos registros.

Convencoes de nomes de tabela:
1. **Plural** — `products`, `users`, `orders`
2. **Minusculo** — nunca `Products` ou `PRODUCTS`
3. **Underscore para compostos** — `products_categories`, `order_items` (nunca espaco)

## Por que PRIMARY KEY e essencial?

O instrutor usa um exemplo concreto: imagine 3 produtos com o mesmo ID 3. Ao atualizar o preco do produto com ID 3, os tres recebem a mesma atualizacao. Isso causa:
- Dor de cabeca operacional
- Problemas financeiros reais (precos errados)

A `PRIMARY KEY` faz o banco de dados **garantir** unicidade. E uma constraint, nao apenas uma convencao.

## Por que AUTOINCREMENT?

O problema sem AUTOINCREMENT: com mil produtos, voce teria que manualmente verificar qual ID ainda nao foi usado. Isso e:
- Impraticavel em escala
- Propenso a erro humano
- Desnecessario quando o banco pode fazer isso automaticamente

Com `AUTOINCREMENT`:
- Primeiro registro → ID 1
- Segundo → ID 2
- Terceiro → ID 3
- O banco gerencia tudo sozinho

## NOT NULL vs NULL vs DEFAULT

O instrutor faz uma distincao clara entre tres cenarios:

### NOT NULL (obrigatorio)
```sql
name TEXT NOT NULL
```
O registro **nao pode** ser criado sem informar esse campo. Tentativa de inserir sem ele gera erro.

### NULL (opcional)
```sql
category TEXT NULL
```
O campo pode ficar vazio. O registro e criado normalmente sem ele.

### NULL + DEFAULT (opcional com fallback)
```sql
category TEXT NULL DEFAULT 'general'
```
Se nao informado, assume o valor `'general'` automaticamente. O instrutor usa a analogia: "se um produto nao tem categoria informada, ele vai pra categoria geral."

Note que strings no SQL usam **aspas simples** (`'general'`), nao aspas duplas.

## Tipos de dados usados na aula

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `INTEGER` | Numeros inteiros | IDs, quantidades |
| `TEXT` | Strings/texto | Nomes, categorias |
| `REAL` | Numeros com decimal | Precos (70.50 = 70 reais e 50 centavos) |

O instrutor destaca que preco usa `REAL` e nao `INTEGER` porque precisa representar centavos com casas decimais.

## Sintaxe: virgula entre colunas

- Cada coluna e separada por virgula
- A **ultima** coluna NAO leva virgula
- Virgula = "quero adicionar mais uma coluna"
- Sem virgula = "essa e a ultima"

## Ferramenta: Beekeeper Studio

A aula usa o Beekeeper Studio como client SQL. Para criar uma nova query:
- Clicar no botao "+" para abrir novo documento
- Escrever o SQL
- Clicar em "RUN" para executar

Apos executar o CREATE TABLE, a tabela aparece na sidebar com suas colunas e tipos listados.