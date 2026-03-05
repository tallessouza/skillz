# Deep Explanation: Estrutura de um Dockerfile

## Ordem logica das instrucoes

O Dockerfile funciona como uma receita de bolo sequencial. Cada instrucao cria uma **layer** na imagem final. A ordem importa tanto para corretude quanto para performance de cache.

### FROM — A base de tudo

O `FROM` busca uma imagem base. No exemplo da aula, `node:18-slim` usa Debian como distro Linux subjacente, com Node.js 18 pre-instalado. O "slim" indica uma versao reduzida (~70MB vs centenas de MB na versao full).

Como a imagem roda sobre Debian, voce tem acesso a `apt-get` para instalar pacotes adicionais. Se fosse Alpine, usaria `apk add`.

### WORKDIR — Diretorio de trabalho

O instrutor enfatiza: **nunca rode no diretorio raiz do SO**. Sem WORKDIR, tudo roda no `/` (root), poluindo o filesystem base.

Detalhe importante: se o diretorio nao existe, o WORKDIR o cria automaticamente em tempo de build. Nao precisa de `RUN mkdir -p /usr/src/app` antes. O instrutor usa `/usr/src/app` como convencao.

### COPY — Da interface para o container

O COPY transfere arquivos do contexto de build (sua maquina/CI) para dentro do container. O instrutor faz duas copias separadas propositalmente:

1. `COPY package.json ./` — primeiro so o manifesto de dependencias
2. `COPY . .` — depois todo o codigo

Isso e uma estrategia de cache: como dependencias mudam menos que codigo, a layer do `RUN yarn` fica cacheada na maioria dos builds.

O ponto (`.`) no destino referencia o WORKDIR atual.

### RUN — Executar comandos durante o build

Qualquer comando que voce rodaria no terminal Linux pode ir no RUN. No caso: `RUN yarn` instala dependencias, `RUN yarn run build` compila a aplicacao.

O instrutor menciona que `yarn` esta disponivel porque vem pre-instalado na imagem base `node:18-slim`. Se precisasse de outro CLI, poderia instalar com `RUN apt-get install -y <pacote>`.

### EXPOSE — Documentar portas

EXPOSE e primariamente documentacional. Ele NAO publica a porta automaticamente (isso e feito no `docker run -p`). Mas e boa pratica porque:
- Documenta a intencao da imagem
- Ferramentas como docker-compose podem usar essa informacao

### CMD vs ENTRYPOINT

O instrutor introduz CMD como "o mais simples" e menciona que ENTRYPOINT sera abordado depois:
- **CMD**: define comando padrao, **substituivel** via CLI (`docker run <image> <outro-comando>`)
- **ENTRYPOINT**: define executavel fixo, **nao substituivel** via CLI

CMD usa sintaxe de array: `CMD ["yarn", "run", "start"]`. Cada elemento da array e um argumento separado.

## O problema do tamanho (1GB)

O instrutor faz questao de mostrar que a imagem resultante tem **1GB**, mesmo partindo de uma base de 70MB. Isso e proposital — serve como motivacao para aulas futuras sobre:
- Multi-stage builds
- `.dockerignore` para excluir arquivos desnecessarios
- Otimizacao de layers
- Uso de lockfiles para instalacao deterministica

A mensagem: **uma imagem Docker de producao deve ser medida em megabytes, nao gigabytes**.

## O ponto no docker build

`docker build -t api-skillz .`

O ponto final referencia o contexto de build (diretorio atual). O Docker procura um arquivo chamado `Dockerfile` (case-sensitive, sem extensao) automaticamente — comportamento similar a um `index.html`.

Se o arquivo tiver outro nome: `docker build -t api-skillz -f MeuDockerfile .`

## Lockfile ausente (proposital)

O instrutor nota que nao copiou o `yarn.lock`, fazendo o `yarn` demorar mais e gerar uma instalacao nao-deterministica. Isso sera corrigido em aulas futuras como otimizacao.