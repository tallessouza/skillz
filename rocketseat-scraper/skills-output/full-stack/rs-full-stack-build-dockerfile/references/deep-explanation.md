# Deep Explanation: Docker Build — Construir Imagens Docker

## O fluxo completo do build

Quando voce executa `docker build -t api .`, o Docker realiza uma sequencia de etapas que correspondem exatamente as instrucoes do seu Dockerfile:

1. **Busca a imagem base** — vai ao Docker Hub (docker.io) buscar a imagem especificada no `FROM` (ex: `node:2.18-alpine3.20`)
2. **Cria o diretorio de trabalho** — executa o `WORKDIR` definido
3. **Copia arquivos** — executa o `COPY` para trazer arquivos da maquina host para dentro da imagem
4. **Instala dependencias** — executa comandos como `npm install`
5. **Executa o build** — roda comandos de compilacao se definidos
6. **Nomeia a imagem** — aplica o nome e tag definidos com `-t`

Cada etapa e cacheada. Se voce rodar o build novamente sem alterar nada, o Docker reutiliza o cache e o processo e quase instantaneo.

## Imagem vs Container

Um ponto fundamental que o instrutor destaca: **imagem nao e container**. Apos o build:
- `docker image ls` mostra a imagem criada
- `docker ps` continua vazio — porque nenhum container foi iniciado

A imagem e o "molde". O container e a "instancia em execucao" desse molde. Criar a imagem e apenas o primeiro passo.

## Velocidade vs Virtualizacao

O instrutor enfatiza a velocidade do processo de build com Docker comparado a virtualizacao tradicional. Isso acontece porque:
- Docker usa **layers** compartilhadas entre imagens
- O Alpine Linux e extremamente compacto (a imagem final pode ter ~150MB)
- Nao ha overhead de um sistema operacional completo como em VMs
- O cache de layers evita downloads repetidos

## O flag `-f` e o nome padrao

O Docker, por convencao, procura um arquivo chamado exatamente `Dockerfile` (sem extensao) no diretorio especificado. Quando voce usa `.`, esta dizendo "procure o Dockerfile aqui neste diretorio".

O `-f` so e necessario quando:
- O arquivo tem nome diferente: `Dockerfile.dev`, `Dockerfile.prod`
- O arquivo esta em outro diretorio: `-f ./docker/Dockerfile`

Usar `-f Dockerfile` quando o nome e padrao e redundante e adiciona ruido ao comando.

## Tags como versionamento

A tag `latest` e aplicada automaticamente quando nenhuma tag e especificada. O instrutor explica que tags servem para **versionamento**:

- Voce modifica algo na imagem
- Quer manter a versao anterior disponivel
- Cria um novo build com tag diferente: `api:2.0`
- Agora tem `api:1.0` e `api:2.0` disponiveis

Isso e essencial para rollbacks e para manter ambientes diferentes (staging vs production) com versoes especificas.

## Anatomia do output do build

Ao executar o build, o log mostra cada etapa numerada que corresponde a uma instrucao do Dockerfile. O instrutor destaca que voce pode acompanhar:
- Download da imagem base do docker.io
- Criacao do diretorio de trabalho
- Copia dos arquivos
- Execucao do `npm install`
- Execucao do build da aplicacao
- Nomeacao final da imagem

Esse log e util para debugging quando algo falha — voce sabe exatamente em qual etapa o problema ocorreu.