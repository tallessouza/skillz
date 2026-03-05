# Deep Explanation: Removendo Agendamentos da API

## Por que isolar a funcao de cancel em arquivo proprio?

O instrutor cria `schedule-cancel.js` como um arquivo separado dentro da pasta `services/`. Isso segue o mesmo padrao usado para outras operacoes (fetch, create) — cada operacao da API tem seu proprio arquivo. A razao e simples: cada arquivo tem uma unica responsabilidade, e quando voce precisa debugar o cancelamento, sabe exatamente onde ir.

## O padrao confirmar-deletar-recarregar

O fluxo completo segue tres passos obrigatorios:

1. **Confirmar** — O usuario clicou no X, mas pode ter sido acidental. `confirm()` e a barreira minima antes de uma acao destrutiva.
2. **Deletar** — Requisicao DELETE para a API com o ID especifico. Nao e um soft-delete, e remocao real.
3. **Recarregar** — Apos deletar, a lista precisa ser recarregada. O instrutor enfatiza isso porque: (a) o horario que estava ocupado precisa aparecer como livre novamente, e (b) o agendamento removido precisa sumir da lista visualmente.

## Por que recarregar ao inves de remover localmente?

O instrutor opta por recarregar toda a lista (`loadSchedules()`) em vez de remover o item do DOM manualmente. Isso e mais simples e garante que a UI esta sincronizada com o servidor. Em aplicacoes mais complexas, voce poderia otimizar removendo o item localmente, mas para este projeto o reload e a abordagem correta — source of truth e a API.

## O papel do try/catch neste contexto

O bloco try/catch aqui nao e apenas "boa pratica" — e essencial porque:
- A rede pode falhar
- O agendamento pode ja ter sido cancelado
- A API pode estar fora do ar

Sem o catch, o usuario clica em cancelar e nada acontece, sem feedback. Com o catch, pelo menos recebe um alert informando que nao foi possivel.

## O metodo DELETE no fetch

O `fetch` por padrao usa GET. Para deletar, voce DEVE passar explicitamente `{ method: "DELETE" }`. O instrutor mostra isso como segundo argumento do fetch, passando um objeto com a propriedade `method`.

## Guard clauses no fluxo

O instrutor verifica duas coisas antes de chamar a API:
1. Se o `id` existe (foi selecionado)
2. Se o usuario confirmou via `confirm()`

Se qualquer um falhar, o fluxo para ali. Isso evita requisicoes desnecessarias e acoes acidentais.

## A importancia de importar o load junto com o cancel

O instrutor importa tanto `scheduleCancel` quanto a funcao de carregamento no mesmo modulo. Isso mostra que cancelar e recarregar sao operacoes acopladas no fluxo — voce nunca cancela sem recarregar depois.