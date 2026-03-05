# Deep Explanation: Alpine em Imagens Docker

## Por que Alpine?

Alpine Linux e uma distribuicao minimalista criada especificamente para containers. Ela usa musl libc e busybox ao inves de glibc e GNU coreutils, resultando em imagens drasticamente menores.

O instrutor demonstrou uma reducao de **597MB para 473MB** (~124MB) apenas trocando de `node:18-slim` para `node:18-alpine3.19`. Nenhuma linha de codigo da aplicacao foi alterada — apenas a diretiva `FROM` no Dockerfile.

## Padrao universal de nomenclatura

O instrutor enfatizou que o sufixo `-alpine` e um **padrao quase universal** entre imagens Docker, nao algo especifico do Node.js. A logica se mantem para qualquer tecnologia:

- `node:18-alpine3.19`
- `python:3.11-alpine`
- `golang:1.21-alpine`
- `ruby:3.2-alpine`

Alem de `-alpine`, existe tambem `-slim` (baseado em Debian com pacotes minimos). A hierarquia de tamanho e:
```
full > slim > alpine
```

## Mecanismo de cache do Docker

Um dos pontos mais importantes da aula: o Docker possui um sistema de cache por layers no build.

### Como funciona:
1. Cada instrucao no Dockerfile cria uma layer
2. Se nenhuma instrucao mudou desde o ultimo build, o Docker reutiliza o cache
3. O build roda em segundos ao inves de minutos

### Quando o cache e invalidado:
- Qualquer alteracao no Dockerfile (ex: trocar a base image)
- Alteracao nos arquivos copiados (ex: mudanca no `package.json`)
- Alteracao explicita em qualquer layer anterior

O instrutor mostrou isso na pratica: ao rodar `docker build -t api-rocket:v4 .` sem nenhuma alteracao, todas as etapas apareceram como "CACHED". Ao trocar para Alpine e rodar `docker build -t api-rocket:v5 .`, o Docker precisou fazer pull da nova imagem e rebuildar tudo.

## Fluxo pratico demonstrado

1. Build com imagem existente (v4) → tudo cacheado, instantaneo
2. Troca da base image para Alpine no Dockerfile
3. Build com nova tag (v5) → pull da imagem Alpine + rebuild completo
4. `docker stop` no container antigo
5. `docker run` com a nova versao
6. `docker logs` para verificar que a aplicacao continua funcionando
7. `docker image ls` para comparar tamanhos

## Contexto: proximo passo

O instrutor mencionou que a proxima otimizacao sera **multi-stage builds**, que reduzem ainda mais o tamanho da imagem final separando o ambiente de build do ambiente de runtime.