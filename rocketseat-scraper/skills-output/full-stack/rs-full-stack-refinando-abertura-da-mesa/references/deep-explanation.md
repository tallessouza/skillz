# Deep Explanation: Validacao Pre-Mutacao em Endpoints de Criacao

## Por que validar antes de inserir?

O instrutor demonstra um problema comum: ao executar o endpoint de abertura de mesa repetidamente, o sistema permitia abrir uma mesa ja aberta. Isso gera dados inconsistentes — multiplas sessoes ativas para a mesma mesa.

A solucao nao e adicionar constraints no banco (embora seja complementar), mas implementar **validacao no nivel da aplicacao** que:
1. Consulta o estado atual
2. Aplica a regra de negocio
3. Somente entao executa a mutacao

## Short syntax do Knex para where

O instrutor explica que ao usar `.where('table_id', tableId)`, voce repete o nome do campo duas vezes de forma redundante. A short syntax `.where({ table_id: tableId })` e mais limpa e, quando a variavel tem o mesmo nome da coluna, evita duplicidade visual.

Exemplo do instrutor:
```typescript
// Duplicidade visual
.where('table_id', table_id)

// Short syntax — mais limpo
.where({ table_id })
```

## Omitir o select

O instrutor mostra que no Knex voce pode omitir `.select()` e ir direto para `.where()`. O select total (`SELECT *`) e o comportamento padrao. So especifique `.select('coluna1', 'coluna2')` quando quiser limitar colunas.

## orderBy + first: pegando o registro mais recente

O problema: a query sem `.first()` retorna um array. Para validacao, voce precisa de um unico registro. O instrutor combina:
- `.orderBy('opened_at', 'desc')` — ordena do mais recente para o mais antigo
- `.first()` — retorna apenas o primeiro (mais recente)

Isso garante que, se houver multiplas sessoes historicas para a mesma mesa, voce valida contra a mais recente.

## Logica de validacao: session && !session.closed_at

A verificacao tem duas partes:
1. `session` — existe alguma sessao para essa mesa?
2. `!session.closed_at` — o campo closed_at e null/undefined?

Se ambas sao verdadeiras, a mesa esta aberta e nao pode ser reaberta. O uso da exclamacao (`!`) e intencional: verifica a **ausencia** de valor no campo de fechamento.

## AppError como padrao de erros de negocio

O instrutor importa `AppError` — uma classe customizada que sinaliza erros tratados pela aplicacao (diferente de erros inesperados). Isso permite:
- Middleware global capturar e formatar a resposta
- Diferenciar erros de negocio de erros de sistema
- Mensagens claras como "This table is already open"

## Fluxo de debug do instrutor

O instrutor mostra uma tecnica de debug interessante: ele temporariamente adiciona um `return response.json(session)` logo apos a consulta para inspecionar o que esta voltando do banco. Nota que o codigo abaixo fica "apagado" (unreachable) — isso e intencional e temporario. Apos verificar que a query retorna o esperado, remove o return e implementa a validacao real.

## Edge cases

- **Mesa que nunca foi aberta:** `session` sera `undefined`, o `if` falha, e o fluxo segue para a criacao normalmente
- **Mesa que foi aberta e fechada:** `session.closed_at` tera valor, `!session.closed_at` sera `false`, o `if` falha, e a mesa pode ser reaberta
- **Mesa aberta pela primeira vez:** Nenhuma sessao existe, validacao passa direto