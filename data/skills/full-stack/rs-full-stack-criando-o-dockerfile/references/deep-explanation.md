# Deep Explanation: Criando o Dockerfile

## A analogia da receita de bolo

O instrutor Rodrigo compara o Dockerfile a uma **receita de bolo**: voce define ingredientes (imagem base) e o passo a passo (comandos) para chegar ao resultado final (container rodando). Cada instrucao no Dockerfile e um "passo" da receita, executado sequencialmente.

## Por que Alpine?

A imagem `node:18-alpine3.20` usa Alpine Linux, uma distribuicao minimalista. Comparada com `node:18` (baseada em Debian), Alpine e:
- ~5x menor em tamanho
- Menos pacotes instalados = menor superficie de ataque
- Suficiente para a maioria das aplicacoes Node.js

A tag `18-alpine3.20` fixa tanto a versao do Node (18) quanto a versao do Alpine (3.20), garantindo reproducibilidade.

## WORKDIR e a estrutura Linux

O instrutor mostra a estrutura de diretorios Linux para explicar o WORKDIR. No Linux:
- `/usr/src/` e um diretorio convencional para codigo-fonte
- `/usr/src/app` e criado automaticamente pelo Docker se nao existir

**Ponto critico:** Independente do sistema operacional do desenvolvedor (Windows, Mac, Linux), a imagem Docker roda Linux. Isso **padroniza o ambiente** — todos trabalham no mesmo sistema.

## COPY . . — O que realmente acontece

O primeiro `.` referencia o diretorio atual do host (onde esta o Dockerfile). O segundo `.` referencia o WORKDIR dentro da imagem. Entao `COPY . .` copia tudo do projeto para `/usr/src/app/`.

**Problema:** se `node_modules/` existir localmente, ela tambem sera copiada. Por isso o instrutor enfatiza a necessidade de excluir essa pasta (via `.dockerignore`) e recriar dentro da imagem com `npm install`.

## RUN vs CMD

- `RUN` executa durante o **build** da imagem (criacao das layers)
- `CMD` define o comando executado quando o **container inicia**

O instrutor mostra duas formas de executar:
- `RUN npm start` — errado para o comando final, porque RUN e para build-time
- `CMD ["npm", "start"]` — correto, formato array (exec form)

## EXPOSE — Documentacao e comunicacao

`EXPOSE 3333` nao publica a porta automaticamente. Ele:
1. Documenta qual porta a aplicacao usa
2. Permite que `docker run -P` mapeie automaticamente
3. Serve como contrato entre quem cria a imagem e quem executa o container

A porta deve corresponder ao que esta no codigo (ex: `server.ts` escutando na porta 3333).

## O fluxo completo Build → Run

1. `FROM` — baixa imagem base com Node.js
2. `WORKDIR` — cria e entra no diretorio de trabalho
3. `COPY` — copia codigo do host para a imagem
4. `RUN npm install` — instala dependencias (cria node_modules dentro da imagem)
5. `RUN npm run build` — compila TypeScript para JavaScript (gera pasta dist/)
6. `EXPOSE` — declara porta de comunicacao
7. `CMD` — define comando de inicializacao do container

Cada instrucao cria uma **layer** no Docker. Layers sao cacheadas — se nada mudou em uma layer, o Docker reutiliza o cache, acelerando rebuilds.