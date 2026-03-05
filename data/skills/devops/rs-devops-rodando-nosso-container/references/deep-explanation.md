# Deep Explanation: Rodando Containers Docker

## Ciclo de vida do container

O instrutor enfatiza que containers sao efemeros por natureza. A flag `--rm` reforça esse conceito: ao parar o container, ele e completamente deletado. A imagem permanece intacta — ela e o template imutavel, o container e a instancia descartavel.

**Analogia implicita:** A imagem e a receita, o container e o prato. Voce pode jogar o prato fora e fazer outro identico a partir da receita.

## Diferenca entre Image ID e Container ID

- **Image ID:** hash unica gerada no `docker build`, identifica a imagem
- **Container ID:** hash unica gerada no `docker run`, identifica a instancia em execucao

Sao IDs independentes. Uma imagem pode ter multiplos containers rodando simultaneamente, cada um com seu proprio ID.

## Port mapping (-p HOST:CONTAINER)

O mapeamento de portas conecta uma porta da maquina host a uma porta dentro do container. O formato e `HOST:CONTAINER`.

- A porta do host pode ser qualquer porta livre
- A porta do container e definida pela aplicacao (e idealmente pelo EXPOSE no Dockerfile)
- Coincidencia: neste exemplo ambas sao 3000, mas podem ser diferentes (ex: `-p 3001:3000`)

O instrutor demonstra isso trocando para 3001 no host enquanto o container continua na 3000.

## Modo interativo vs detached

**Sem `-d` (interativo):**
- O terminal fica preso ao processo do container
- Logs aparecem em tempo real
- Util para debug rapido
- Ctrl+C para parar

**Com `-d` (detached/background):**
- Terminal e liberado imediatamente
- Retorna apenas o hash do container
- Para ver logs: `docker logs CONTAINER_ID`
- Para parar: `docker stop CONTAINER_ID`

## O efeito do --rm no restart

O instrutor demonstra na pratica:
1. Roda com `--rm`, para com `docker stop` → container deletado, `docker start` falha
2. Roda sem `--rm`, para com `docker stop` → container preservado, `docker start` funciona

Isso mostra que `--rm` e ideal para desenvolvimento rapido, mas inadequado quando voce precisa inspecionar o estado do container apos parada.

## Docker logs e historico

`docker logs` mostra o historico completo de execucao, incluindo multiplos ciclos de start/stop. O instrutor mostra que apos dois starts, a pilha de logs contem ambas as execucoes com seus respectivos timestamps.

## Observacoes sobre tamanho da imagem

O instrutor menciona que a imagem tem quase 400MB na etapa do RUN e 225MB na copia de arquivos — valores altos que serao otimizados nas proximas aulas. Ele intencionalmente parte de um cenario fora das boas praticas para demonstrar a evolucao.

## docker history

O comando `docker history IMAGEM` mostra cada camada da imagem com seu tamanho, revelando onde o espaco esta sendo consumido. Util para identificar oportunidades de otimizacao.