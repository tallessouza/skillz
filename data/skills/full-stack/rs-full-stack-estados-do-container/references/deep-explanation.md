# Deep Explanation: Estados do Container Docker

## Modelo mental: Os tres estados

Pense em um container como um computador:

- **Running (Up):** Computador ligado, programas rodando, consumindo energia e memoria.
- **Paused:** Computador em modo sleep/suspensao — a memoria RAM mantem o estado, mas o processador para. Retorno instantaneo ao acordar.
- **Stopped (Exited):** Computador desligado — nenhum recurso consumido. Precisa "ligar" novamente para usar.

## Por que pause nao consome CPU mas consome memoria?

Quando voce pausa um container, o Docker envia o sinal `SIGSTOP` para todos os processos dentro do container via cgroups freezer. Os processos sao congelados no estado exato em que estavam — toda a memoria alocada permanece intacta, mas nenhuma instrucao de CPU e executada.

Isso e util quando voce precisa liberar capacidade de processamento temporariamente (por exemplo, para rodar um build pesado na maquina host) mas quer retomar o container exatamente de onde parou, sem re-inicializacao.

## Por que stop libera tudo?

O `docker stop` envia `SIGTERM` para o processo principal do container, aguarda um grace period (10s por padrao), e depois envia `SIGKILL` se necessario. O container sai do estado de execucao completamente — os processos sao encerrados, a memoria e liberada.

O container nao e destruido — seu filesystem e metadados permanecem. Por isso `docker start` consegue reinicia-lo. Ja `docker rm` destruiria o container permanentemente.

## Diferenca no comportamento de rede

- **Container pausado:** A porta continua mapeada, mas nenhum processo responde. O cliente fica aguardando (timeout eventual). O navegador mostra "carregando" indefinidamente.
- **Container parado:** A porta nao esta mais mapeada. O cliente recebe "connection refused" imediatamente. O navegador mostra erro de conexao.

Essa diferenca e util para diagnostico: se a requisicao fica pendente, o container pode estar pausado. Se recebe erro imediato, esta parado.

## A flag `-a` no docker ps

Por padrao, `docker ps` mostra apenas containers em estado Running. Isso e uma decisao de UX — na maioria das vezes voce quer ver o que esta ativo.

A flag `-a` (de "all") mostra todos os containers, incluindo os que estao em estado Exited. E essencial para:
- Encontrar containers que foram parados
- Verificar o exit code de containers que falharam
- Limpar containers antigos

## Fluxo completo de estados

```
[Criado] --docker start--> [Running]
[Running] --docker pause--> [Paused]
[Paused] --docker unpause--> [Running]
[Running] --docker stop--> [Exited]
[Exited] --docker start--> [Running]
[Exited] --docker rm--> [Removido]
```

## Edge cases mencionados

- Ao pausar e tentar acessar no navegador, a requisicao fica pendente ate o timeout. Nao ha resposta de erro — simplesmente nao ha resposta.
- Ao retomar com unpause, o container volta exatamente de onde parou, como se nada tivesse acontecido.
- Ao parar e iniciar com start, o processo principal do container e re-executado do zero (nao e um resume como no unpause).