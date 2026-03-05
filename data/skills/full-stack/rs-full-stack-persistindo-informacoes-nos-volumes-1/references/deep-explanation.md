# Deep Explanation: Persistindo Informações nos Volumes Docker

## Modelo mental: Container vs Volume

O instrutor enfatiza repetidamente que **container e volume sao coisas separadas, com responsabilidades separadas**:

- **Container** = ambiente de execucao da aplicacao. Ele tem o runtime, as dependencias, o codigo. Mas e efemero — quando voce para e recria, o filesystem interno e resetado.
- **Volume** = camada de persistencia. Existe independentemente do container. Pode ser vinculado a qualquer container com `-v`.

### Analogia

Pense no container como um computador descartavel e no volume como um HD externo. Voce pode trocar o computador quantas vezes quiser — enquanto plugar o mesmo HD externo, seus arquivos continuam la.

## O teste do instrutor (passo a passo)

O instrutor demonstra o conceito com um teste pratico em 4 etapas:

### Etapa 1: Criar arquivo COM volume
1. Container rodando com volume vinculado
2. `docker exec -it <id> /bin/sh` para entrar
3. `touch test.txt` para criar arquivo
4. `exit` e `docker stop <id>`

### Etapa 2: Recriar container COM volume
1. `docker run -v meu-volume:/app ...` (mesmo volume)
2. `docker exec -it <novo-id> /bin/sh`
3. `ls` → **test.txt esta la!** O arquivo persistiu

### Etapa 3: Recriar container SEM volume
1. `docker stop <id>`
2. `docker run ...` (sem flag -v)
3. `docker exec -it <id> /bin/sh`
4. `ls` → **test.txt NAO esta!** Porque nao vinculou o volume

### Etapa 4: Recriar container COM volume novamente
1. `docker stop <id>`
2. `docker run -v meu-volume:/app ...`
3. `docker exec -it <id> /bin/sh`
4. `ls` → **test.txt voltou!** O volume manteve os dados o tempo todo

## Insight chave

O fato de rodar sem volume e depois rodar com volume e ver o arquivo de volta prova que:
- O volume existe independentemente do container
- Os dados nunca foram perdidos — apenas nao estavam acessiveis quando o container rodou sem vincular o volume
- Vincular e desvincular volume e uma operacao de montagem, nao de copia

## Edge cases

- **Novo container, mesmo volume**: dados persistem (demonstrado na aula)
- **Mesmo container restartado** (`docker start`): dados do filesystem do container tambem persistem, mas isso e fragil — depende do container nao ser removido
- **`docker rm` do container**: filesystem interno perdido, volume intacto
- **`docker volume rm`**: dados do volume perdidos permanentemente
- **Multiplos containers no mesmo volume**: possivel, mas cuidado com concorrencia de escrita

## Quando o volume NAO e necessario

- Containers puramente stateless (APIs que so processam e respondem)
- Containers de build/CI que geram artefatos copiados para fora
- Containers de teste que nao precisam persistir nada