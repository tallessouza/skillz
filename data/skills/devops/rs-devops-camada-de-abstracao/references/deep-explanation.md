# Deep Explanation: Docker Network — Camada de Abstracao

## Por que redes sao uma "camada de abstracao"

O instrutor enfatiza que `docker network` e uma **abstracao** — ela existe para facilitar toda a parte comunicativa do container. Comunicacao entre containers, comunicacao externa com containers, e controle de acesso. Em vez de configurar interfaces de rede manualmente, o Docker fornece uma interface declarativa.

## Os tres drivers nativos

### Bridge
- Driver e rede **default** para qualquer container
- Se voce nao especificar `--network` no `docker run`, o container vai para a bridge
- Fornece uma interface que faz o "bridge" com o Docker0 (interface virtual do host)
- Cada container recebe um endereco IP automaticamente
- Comunicacao TCP/IP habilitada por default
- **Unico driver que permite criar multiplas redes** — voce pode ter quantas redes bridge quiser

### Null (None)
- Isola completamente o container da rede
- A unica interface disponivel dentro do container e localhost
- Use case: containers que processam dados sem necessidade de comunicacao externa (seguranca)
- Nao faz sentido criar redes adicionais com driver null — use a existente

### Host (Roast)
- Entrega **todas as interfaces existentes** do Docker host para o container
- O nome "host" vem de "Docker Host" — o container compartilha o network namespace do host
- **So pode existir UMA instancia** — tentar `docker network create --driver host` resulta em erro: "Only one instance of the host network is allowed"
- Para usar, basta associar no `docker run --network host`

## Boa pratica: redes por projeto

O instrutor destaca que a organizacao por projeto e fundamental tanto localmente quanto em producao:

- Projeto NestJS com banco de dados → rede propria
- Outro microservico → rede separada
- Isso cria **agrupamentos de aplicacao escopados dentro da propria rede**
- Beneficios: isolamento, organizacao, seguranca entre dominios

## Anatomia dos comandos Docker

O instrutor observa que os comandos Docker sao muito intuitivos e seguem um padrao consistente:
- `docker image ls`, `docker image rm` — operacoes sobre imagens
- `docker container ls`, `docker container rm` — operacoes sobre containers
- `docker network ls`, `docker network create`, `docker network connect` — operacoes sobre redes

Esse padrao de `docker <recurso> <acao>` facilita a descoberta de comandos.

## Contexto da aula dentro do curso

Esta aula faz parte de uma sequencia onde:
1. Ja criaram uma imagem Docker a partir de um Dockerfile (app NestJS)
2. Ja fizeram otimizacao (container de 1GB+ reduzido com boas praticas)
3. Ja estao usando tags (manual por ora, futuramente baseado em commits SCM)
4. Proximo passo: conectar o container existente a uma rede e explorar comandos de debug