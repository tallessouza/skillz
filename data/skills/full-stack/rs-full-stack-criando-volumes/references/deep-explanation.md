# Deep Explanation: Docker Volumes — Persistencia de Dados

## Por que volumes existem

O problema fundamental: containers sao efemeros. Quando voce recria um container, todo o sistema de arquivos interno e destruido e recriado do zero a partir da imagem. Se voce roda um banco de dados dentro de um container e o container morre ou precisa ser recriado, todos os dados vao junto.

Volumes resolvem isso **separando os dados do container**. O instrutor usa a palavra-chave: "os dados estao isolados, estao separados ali em um volume". Isso significa que o ciclo de vida dos dados e independente do ciclo de vida do container.

## Analogia do instrutor

Pense no container como um apartamento alugado e o volume como um cofre no banco. Se voce muda de apartamento (recria o container), seus objetos de valor continuam seguros no cofre (volume). O apartamento e temporario, o cofre e permanente.

## Ciclo de vida de um volume

```
docker volume create → volume existe no host
docker run -v volume:/path → container monta o volume
docker stop → container para, volume permanece
docker rm → container removido, volume permanece
docker run -v volume:/path → NOVO container, MESMOS dados
```

O volume so e removido com `docker volume rm` explicito. Isso e intencional — protege contra perda acidental.

## O que `-v` faz internamente

Quando voce executa:
```bash
docker run -v api-volume:/usr/src/app -p 3333:3333 -d api
```

O Docker:
1. Encontra o volume `api-volume` no host
2. Monta o diretorio fisico do volume (Mountpoint) no caminho `/usr/src/app` dentro do container
3. Qualquer escrita em `/usr/src/app` dentro do container vai parar no volume no host
4. Qualquer dado que ja existia no volume aparece em `/usr/src/app`

## Por que o caminho deve corresponder ao WORKDIR

O instrutor destaca: "Lembra que aqui a gente colocou dentro do Dockerfile aqui o nosso WORKDIR". O WORKDIR define onde a aplicacao opera dentro do container. Se voce monta o volume em um caminho diferente, a aplicacao escreve em um lugar e o volume esta em outro — dados nao sao persistidos.

## Volumes nomeados vs anonimos

- **Nomeado** (`docker volume create api-volume`): voce controla, identifica, reutiliza
- **Anonimo** (Docker cria automaticamente): recebe um hash como nome, dificil de gerenciar

O instrutor enfatiza: "o volume nao tem um ID, a gente vai chamar o volume pelo proprio nome que a gente deu". Isso reforeca que volumes nomeados sao a pratica correta.

## Inspecao como verificacao

O instrutor mostra dois momentos de `docker container inspect`:
1. **Antes**: `Mounts: []` — nenhum volume montado
2. **Depois**: `Mounts` mostra o volume com Name, Source e Destination

Isso nao e apenas demonstracao — e uma pratica de verificacao. Sempre inspecione apos montar para confirmar que o mapeamento esta correto.

## Comandos-chave demonstrados na aula

| Comando | Proposito |
|---------|-----------|
| `docker ps` | Listar containers em execucao |
| `docker container inspect <id>` | Ver detalhes do container (incluindo Mounts) |
| `docker volume create <nome>` | Criar volume nomeado |
| `docker volume inspect <nome>` | Ver detalhes do volume (Mountpoint, data criacao) |
| `docker stop <id>` | Parar container |
| `docker run -v <volume>:<path> -p <porta>:<porta> -d <imagem>` | Rodar container com volume |