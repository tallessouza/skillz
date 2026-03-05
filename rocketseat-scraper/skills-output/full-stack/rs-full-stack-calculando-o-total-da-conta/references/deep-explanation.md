# Deep Explanation: Calculando o Total da Conta

## Desenvolvimento em etapas — a filosofia do instrutor

O instrutor enfatiza fortemente a pratica de **quebrar o desenvolvimento em etapas e validar cada uma**. A frase-chave:

> "É legal que você vai quebrando o que você precisa fazer em partes, em etapas, e aí isso ajuda a não se perder também. Eu uso bastante essa dica no dia a dia, principalmente quando eu vou fazer métodos ou funcionalidades que são muito grandes."

O fluxo demonstrado:
1. Cria o metodo `show` com `response.json()` vazio — testa que a rota funciona
2. Recupera `table_session_id` dos params — retorna o ID para confirmar que chega
3. Faz query basica sem agregacao — confirma que os dados retornam
4. Adiciona `SUM` com `knex.raw` — valida o calculo
5. Adiciona `COALESCE` — trata o caso de sessao sem itens

Cada etapa e um checkpoint. Se algo quebra, voce sabe exatamente onde.

## Teste de mesa

O instrutor faz uma validacao manual (chamada "teste de mesa"):
- Produto 1: R$7.50 x 2 = R$15.00
- Produto 2: R$100.00 x 1 = R$100.00
- Total esperado: R$115.00
- Total retornado pela API: R$115.00 ✓

> "O teste de mesa é quando a gente faz manual a continha para confrontar o resultado, ver se está coerente."

Para calculos financeiros, isso e obrigatorio. Nunca confie cegamente no resultado.

## Por que COALESCE e nao tratamento no JS

O instrutor demonstra o problema ao vivo: ao buscar o total de uma sessao sem itens, `SUM` retorna `null`. Em vez de tratar no JS (`total ?? 0`), ele usa `COALESCE` direto no SQL:

```sql
COALESCE(SUM(orders.price * orders.quantity), 0) AS total
```

Vantagens:
- O banco SEMPRE retorna um numero, nunca null
- Nao precisa de tratamento condicional no controller
- Funciona identicamente para qualquer client que consuma a query

## Convencao `show` vs `index`

O instrutor explica sua convencao pessoal:
> "Eu gosto de usar o nome show para quando eu quero exibir um específico ou um resumo, alguma coisa mais específica."

- `index` → lista colecao (todos os pedidos)
- `show` → item especifico ou resumo/agregacao

## Nomeacao semantica de parametros

Ao definir a rota, o instrutor inicialmente usa um nome generico e depois muda:
> "Eu estou usando esse nome aqui... vou deixar exatamente o mesmo nome, para ficar mais fácil a legibilidade ali, de que é o id, não é um id qualquer, é o id da sessão da mesa."

O parametro muda de `:id` para `:table_session_id`, facilitando entender o que o endpoint espera sem consultar documentacao.

## Estrutura da rota

A rota segue um padrao RESTful aninhado:
```
GET /table-session/:table_session_id/total
```

Isso comunica claramente: "pegue o total de uma sessao de mesa especifica". O `/total` no final indica que e uma agregacao, nao um CRUD padrao.

## Multiplas agregacoes na mesma query

O instrutor expande para calcular tambem a quantidade total de itens, reutilizando a mesma estrutura:

```sql
COALESCE(SUM(orders.price * orders.quantity), 0) AS total,
COALESCE(SUM(orders.quantity), 0) AS quantity
```

Isso evita fazer duas queries separadas — uma unica ida ao banco retorna tudo que o resumo precisa.