# Deep Explanation: Rodando Multiplos Containers

## Por que localhost nao funciona entre containers

Cada container Docker tem seu proprio network namespace. Quando a aplicacao dentro do container A faz uma requisicao para `localhost`, ela esta falando com ela mesma — o loopback do proprio container. O container B (MySQL) esta em outro namespace completamente isolado.

A solucao eh usar **nomes de container como hostnames**. Quando voce cria um container com `--name mysql`, o Docker registra esse nome no DNS interno da rede. Qualquer outro container na mesma rede pode resolver `mysql` para o IP correto.

## Rede bridge default vs rede custom

A rede `bridge` (default) nao oferece resolucao DNS por nome de container. Ela funciona apenas por IP. Ja redes custom (criadas com `docker network create`) habilitam automaticamente o DNS interno.

Isso explica o erro `ENOTFOUND`: o container da app estava na rede custom `primeira-network`, mas o MySQL estava na rede `bridge` default. Mesmo que ambos existam no mesmo host fisico, estao em interfaces de rede diferentes e nao se enxergam.

## O problema de ordem de inicializacao

MySQL demora alguns segundos para inicializar completamente (criar databases, configurar usuarios, etc). Se a aplicacao subir antes e tentar conectar imediatamente, vai receber `Connection refused`.

Na aula, o instrutor menciona que isso sera resolvido em aulas futuras (com Docker Compose e healthchecks). Por hora, a solucao manual eh aguardar o MySQL estar pronto antes de subir a app.

## Diagnosticando containers que "somem"

Quando um container falha no startup (ex: app nao consegue conectar no banco), ele encerra e desaparece do `docker ps` (que mostra apenas containers rodando). Duas flags uteis:

- `docker ps -a` — mostra TODOS os containers, incluindo parados/crashados
- `docker ps -l` — mostra apenas o ultimo container criado (util quando ha muitos)

Depois de identificar o container, `docker logs <id>` mostra o que aconteceu.

## Movendo container para outra rede

Nao eh possivel alterar a rede de um container em execucao de forma simples. O fluxo eh:
1. `docker stop <container>`
2. `docker rm <container>`
3. `docker run` novamente com `--network` correto

## Inspecao de rede

`docker network inspect <nome-da-rede>` mostra todos os containers conectados aquela rede, seus IPs e configuracoes. Essa eh a ferramenta principal para debugar problemas de comunicacao entre containers.

## Crescimento da imagem

O instrutor observou que a imagem cresceu de 210MB (v8) para 263MB (v9) — 53MB a mais por causa do TypeORM e do pacote MySQL. Isso ilustra a importancia de monitorar o tamanho das imagens conforme dependencias sao adicionadas.