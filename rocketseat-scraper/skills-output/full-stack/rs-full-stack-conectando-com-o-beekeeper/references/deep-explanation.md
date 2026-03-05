# Deep Explanation: Conectando Beekeeper ao Postgres em Container

## Por que localhost funciona

Quando voce executa `docker run -p 5432:5432 postgres`, o Docker cria um mapeamento de porta: qualquer conexao na porta 5432 da sua maquina host e redirecionada para a porta 5432 dentro do container. Por isso, o Beekeeper (rodando no host) usa `localhost:5432` e a conexao chega ao Postgres dentro do container.

O instrutor enfatiza: **"como a gente esta fazendo aqui para a nossa maquina nessa porta, que vai ser entao direcionado para o nosso container, porque a gente fez esse mapeamento da porta"**. Esse e o conceito fundamental — o GUI client nao sabe que esta falando com um container, ele so ve uma porta local.

## Credenciais vem das variaveis de ambiente

As credenciais de conexao (user e password) sao definidas no momento do `docker run` via variaveis de ambiente (`POSTGRES_USER`, `POSTGRES_PASSWORD`). O Beekeeper precisa usar exatamente os mesmos valores. Nao ha magica — e uma correspondencia direta.

## O teste de pausar o container

O instrutor faz um teste importante: pausa o container com `docker pause` e mostra que:

1. Queries pendentes ficam travadas (o Beekeeper fica esperando indefinidamente)
2. Novas conexoes falham completamente
3. Ao despausar com `docker unpause`, a conexao volta a funcionar

Isso demonstra que **o banco de dados so existe enquanto o container esta executando**. Diferente de um Postgres instalado nativamente que roda como servico do SO, o container precisa estar ativo.

### Diferenca entre pause e stop

- `docker pause`: congela o container (processos suspensos via SIGSTOP). O container ainda existe, mas nao processa nada. Conexoes existentes ficam travadas.
- `docker stop`: encerra o container graciosamente (SIGTERM → SIGKILL). Conexoes sao fechadas, dados nao persistidos sao perdidos (a menos que haja volume).

O instrutor usa `pause` propositalmente porque e mais dramatico para demonstracao — a conexao trava em vez de falhar imediatamente.

## Esquemas internos do Postgres

Ao conectar, o Beekeeper mostra pastas como `pg_catalog`, `information_schema`, etc. Sao esquemas internos do Postgres usados para metadados. O esquema `public` e onde suas tabelas ficam por padrao.

## Por que fechar e reabrir o Beekeeper

Quando o container esta pausado e o Beekeeper tenta conectar, ele pode ficar em estado inconsistente (timeout nao tratado graciosamente). O instrutor mostra que fechar e reabrir o Beekeeper e a forma mais segura de resetar o estado do client antes de tentar reconectar.