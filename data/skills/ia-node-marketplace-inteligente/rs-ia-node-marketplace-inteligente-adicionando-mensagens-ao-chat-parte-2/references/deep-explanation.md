# Deep Explanation: Agregacao de Mensagens no Chat

## Por que JSON aggregate ao inves de multiplas queries?

O instrutor escolhe resolver o problema de "buscar sessao com suas mensagens" em uma unica query SQL ao inves de fazer duas queries separadas (uma para sessao, outra para mensagens). A abordagem usa `json_agg` combinado com `json_build_object` para que o banco de dados ja retorne os dados no formato que a API precisa.

## O problema do null no array vazio

Quando se faz `left join` e nao ha mensagens, o PostgreSQL ainda cria uma "linha fantasma" com valores null. O `json_agg` inclui esse null no array, resultando em `[null]` ao inves de `[]`. O instrutor resolve isso com `filter (where messages.id is not null)`, que e uma clausula do PostgreSQL que filtra os valores ANTES da agregacao.

## O erro de referencia ambigua

O instrutor encontra um erro real durante a aula: "referencia a id ambigua". Isso acontece porque tanto `chat_sessions` quanto `messages` tem uma coluna `id`. A solucao e prefixar com o nome da tabela: `chat_sessions.id` nos locais relevantes (where, group by, etc).

## Design da tabela message_actions

A decisao de criar uma tabela separada para acoes (ao inves de colunas na tabela messages) segue o principio de extensibilidade:
- **type** como texto permite adicionar novos tipos de acao sem alterar schema
- **payload como jsonb** permite dados diferentes por tipo de acao
- **confirmed_at e executed_at** como timestamps separados permitem rastrear o ciclo de vida da acao (criada → confirmada pelo usuario → executada)
- **unique constraint (message_id, type)** garante que uma mensagem nao tenha a mesma acao duplicada

## Ordem dos DROP TABLE importa

O instrutor nota um bug no script de drop: estava fazendo `drop table actions` antes de `drop table messages`, quando deveria ser o contrario devido a foreign keys. O PostgreSQL nao reclamou porque a tabela nao existia ainda, mas e um erro que causaria problemas em re-execucoes.

## Estrategia de testes progressiva

O instrutor constroi os testes incrementalmente:
1. Primeiro verifica se o GET retorna mensagens (array nao vazio)
2. Depois verifica o conteudo da primeira mensagem (sender: 'user', content: 'hello world')
3. Entao adiciona expectativa de segunda mensagem (sender: 'assistant') que ainda nao existe — teste quebrando intencionalmente para guiar a proxima implementacao (TDD-like)