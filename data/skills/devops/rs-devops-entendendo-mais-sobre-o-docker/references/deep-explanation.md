# Deep Explanation: Docker — Imagens e Containers

## Analogia Central: Receita de Bolo

O instrutor usa a analogia de "receita de bolo" para explicar imagens Docker. A imagem e a receita — ela define todos os ingredientes e passos necessarios. O container e o bolo pronto — uma instancia concreta criada a partir daquela receita. Voce pode fazer varios bolos (containers) a partir da mesma receita (imagem), e cada bolo e independente.

## Por que Containers sao Efemeros

O ponto mais enfatizado na aula e a efemeridade dos containers. O instrutor destaca que isso e uma "configuracao padrao" que causa "dor de cabeca" quando nao entendida.

**O raciocinio completo:**
1. A imagem e imutavel (somente leitura)
2. O container roda "em cima" da imagem
3. Qualquer escrita no container acontece em uma camada temporaria
4. Quando o container para, essa camada temporaria e descartada
5. Ao rodar novamente, o container parte da imagem original (limpa)

**Exemplo pratico dado:** Se sua aplicacao aceita uploads de imagens e voce salva dentro do container, quando o container morrer e voce recriar, o upload nao estara mais la. O container novo parte da imagem original.

## Docker Desktop vs CLI

O instrutor apresenta o Docker Desktop como interface visual, mas deixa claro que o foco do curso sera na CLI (Command Line Interface). Ao instalar o Docker Desktop, a CLI ja vem incluida. O instrutor recomenda verificar com `docker --version` ou `docker info`.

## Logica Intuitiva dos Comandos

O instrutor destaca que os comandos Docker seguem um padrao logico:
- `docker <recurso> <acao>`
- Exemplo: `docker image ls`, `docker image rm`, `docker container ls`

Isso torna a CLI previsivel — uma vez que voce entende o padrao, pode deduzir comandos novos.

## Quatro Comandos Fundamentais

O instrutor identifica os quatro comandos iniciais mais importantes:
1. `docker image` — gerenciar imagens
2. `docker container` — gerenciar containers
3. `docker build` — criar imagens
4. `docker run` — executar containers

## Volumes: Mencionados mas Reservados

O instrutor menciona volumes como solucao para persistencia, mas explicitamente adia o topico para uma aula futura. Ele quer que os alunos primeiro experimentem a efemeridade na pratica para entender o problema antes de ver a solucao.

## Manifesto Declarativo

O instrutor usa o termo "manifesto declarativo" para se referir ao Dockerfile — o arquivo que descreve como a imagem deve ser construida. A imagem e o resultado do build desse manifesto.