# Deep Explanation: Resumo de Transacoes

## Por que `.first()` e essencial em agregacoes

O Knex.js foi projetado para retornar arrays por padrao — faz sentido para SELECTs normais que podem retornar multiplas linhas. Porem, operacoes de agregacao como `SUM`, `COUNT`, `AVG` retornam um unico resultado. Sem `.first()`, voce recebe `[{ amount: 5000 }]` ao inves de `{ amount: 5000 }`, o que polui a resposta da API e obriga o frontend a fazer `response.summary[0].amount` ao inves de `response.summary.amount`.

## O problema do nome de coluna gerado pelo SQL

Quando voce executa `SELECT SUM(amount) FROM transactions` no SQL, o resultado vem com o nome da coluna sendo literalmente a expressao usada: `sum(\`amount\`)` ou `SUMAMOUNT` dependendo do dialeto SQL. Isso e terrivel para consumir em uma API JSON.

O segundo parametro do `.sum()` no Knex aceita um objeto `{ as: 'nomeDesejado' }` que gera o alias SQL (`SUM(amount) AS amount`), produzindo um JSON limpo e previsivel.

## Contexto na aplicacao

Esta rota de summary faz parte de uma API REST de transacoes financeiras onde:
- Transacoes podem ser credito (valor positivo) ou debito (valor negativo)
- O `SUM(amount)` naturalmente calcula o saldo, somando creditos e subtraindo debitos
- E a ultima rota CRUD antes de implementar identificacao de usuario (cookies/sessions)

O instrutor destaca que esta rota completa os requisitos basicos do README:
1. Criar transacao (POST)
2. Listar todas transacoes (GET /transactions)
3. Visualizar transacao unica (GET /transactions/:id)
4. **Obter resumo da conta (GET /transactions/summary)** — esta aula

## Padrao de organizacao de rotas

A rota de summary segue o padrao REST de sub-recurso: `/transactions/summary`. Nao e um endpoint separado `/summary` — pertence ao dominio de transacoes.