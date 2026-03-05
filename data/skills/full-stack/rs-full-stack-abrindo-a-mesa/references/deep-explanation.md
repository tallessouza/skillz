# Deep Explanation: Abrindo Sessao de Mesa

## Por que validar com Zod antes do banco?

O instrutor demonstra que sem o `table_id` no body, o Zod ja rejeita a request imediatamente. Isso evita que queries invalidas cheguem ao banco de dados. A validacao acontece em camadas:

1. **Camada 1 — Zod:** Valida tipo e presenca (`z.number()` rejeita strings, undefined, null)
2. **Camada 2 — Foreign Key:** O banco rejeita IDs que nao existem na tabela referenciada

O instrutor mostra isso ao vivo: quando envia um texto no campo `table_id`, o Zod rejeita. Quando envia o numero 2, passa. Quando envia 114 (mesa que nao existe), o Zod aceita mas o banco rejeita com erro de foreign key constraint.

## A importancia das Foreign Keys

O instrutor enfatiza: "Essa que e a grande vantagem da gente trabalhar com um banco de dados relacional, utilizando as conexoes, o relacionamento entre as tabelas."

A FK em `tables_sessions.table_id → tables.id` garante que:
- Nao e possivel criar uma sessao para uma mesa inexistente
- O banco e a ultima linha de defesa para integridade dos dados
- Nao precisamos fazer um SELECT antes do INSERT para verificar existencia

Quando tentou abrir a mesa 114, o erro retornado foi de "restricao de chave estrangeira" — o proprio banco protege a consistencia.

## Por que `closed_at` fica nulo?

O campo `closed_at` nao e preenchido no momento da abertura porque a mesa ainda esta em uso. O instrutor explica: "nao tem uma data de fechamento ainda, porque essa mesa esta aberta e esta sendo usada." O campo sera atualizado via UPDATE quando a mesa for fechada — pattern classico de sessoes com inicio/fim.

## Por que `knex.fn.now()` e nao `new Date()`?

`knex.fn.now()` delega a geracao do timestamp ao banco de dados, garantindo consistencia com o timezone configurado no servidor de banco. `new Date()` usaria o timezone do servidor Node.js, que pode divergir.

## Organizacao de tipagem

O instrutor cria o arquivo `tables-sessions-repository.d.ts` dentro de `database/types/`. O pattern e:
- Um arquivo `.d.ts` por tabela
- Nome segue o pattern `{nome-da-tabela}-repository.d.ts`
- O type exportado reflete exatamente as colunas da tabela
- Isso habilita autocomplete ao usar `knex<Type>("table")` nos inserts e queries

## Fluxo completo demonstrado

```
Request POST /sessions { table_id: 2 }
  → Zod valida body (rejeita se invalido)
  → Knex insere em tables_sessions com tipagem
  → knex.fn.now() preenche opened_at
  → closed_at fica null (sessao aberta)
  → Retorna 201
```