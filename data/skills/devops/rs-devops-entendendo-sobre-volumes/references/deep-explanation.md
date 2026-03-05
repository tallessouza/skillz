# Deep Explanation: Docker Volumes

## Por que containers perdem dados?

O instrutor reforça que containers sao **volateis e efemeros** por padrao. Quando voce cria um arquivo dentro de um container e depois restarta, o arquivo desaparece. Isso acontece porque o filesystem do container e uma camada temporaria — nao ha persistencia nativa.

O volume resolve isso criando um **diretorio externo** que nao tem dependencia com o ciclo de vida do container. E um ponto de montagem apartado.

## Volume vs Container — Separacao clara

Um ponto importante que o instrutor destaca: volume **nao esta fortemente associado** a um container por padrao. Um container nao precisa de volume. Casos de uso que justificam volume:

1. **Uploads/assets** — arquivos enviados por usuarios
2. **Logs** — arquivos de log que precisam sobreviver restarts
3. **Banco de dados** — dados do banco precisam persistir (caso muito frequente)

Fora desses cenarios, container nao precisa de volume.

## Unicidade por nome (sem ID)

Diferente de containers, images e networks que possuem IDs unicos, volumes sao identificados **exclusivamente pelo nome**. Isso e uma diferenca arquitetural importante. Quando voce roda `docker volume inspect`, passa o nome, nao um ID.

## O comando `docker inspect` global

Curiosidade destacada pelo instrutor: voce pode usar `docker inspect primeiro-volume` diretamente, sem especificar `docker volume inspect`. O Docker busca globalmente. Funciona para qualquer recurso (container, volume, network). Porem, se houver ambiguidade de nomes entre tipos, e melhor ser explicito.

## Drivers de volume

O driver padrao e `local`, significando que o volume e armazenado no filesystem do host em `/var/lib/docker/volumes/{nome}/_data`. Para armazenamento remoto (ex: bucket na nuvem), voce configura um driver diferente — mas isso e um topico avancado.

## O `-v` e o WORKDIR

A associacao `-v primeiro-volume:/src/app` cria um link entre o volume e o diretorio de trabalho do container. O path `/src/app` deve corresponder ao WORKDIR definido no Dockerfile. Se seu Dockerfile define `WORKDIR /app`, entao o volume deve montar em `/app`.

O instrutor enfatiza: "tudo que for feito aqui dentro vai ficar no source, e uma vez que voce suba o container novamente, tudo que estiver em data estara disponivel".

## Inspect do container mostra o bind

Quando voce roda `docker container inspect <id>`, a secao `Mounts` mostra:
- **Source**: caminho no host (dentro de `/var/lib/docker/volumes/`)
- **Destination**: caminho dentro do container (o WORKDIR)

Isso confirma que o bind foi feito. Note que `docker volume inspect` NAO mostra quais containers estao usando o volume (diferente de network inspect que mostra containers conectados).

## Comando crescendo — prenuncio do docker-compose

O instrutor nota que o comando `docker run` ja esta ficando "bem gigante" com `-v`, `--network`, `-p`, `-d`, nome e imagem. Isso prepara o terreno para docker-compose, que organiza tudo em um arquivo YAML.