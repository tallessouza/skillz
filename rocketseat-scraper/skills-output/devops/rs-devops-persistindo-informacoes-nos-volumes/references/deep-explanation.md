# Deep Explanation: Persistencia de Dados com Docker Volumes

## O modelo mental do instrutor

O instrutor demonstra um conceito fundamental que muitos iniciantes em Docker nao compreendem intuitivamente: **o filesystem de um container e efemero**. Quando voce cria um arquivo dentro de um container, esse arquivo vive apenas naquele contexto de execucao. A unica forma de garantir persistencia e atraves de volumes.

## A analogia implicita: volume como HD externo

O volume funciona como um HD externo conectado ao container. Voce pode:
- Desconectar o HD (parar o container sem `-v`)
- Destruir o computador (deletar o container)
- Comprar um computador novo (criar novo container)
- Reconectar o HD (rodar `docker run -v`) e todos os arquivos estarao la

## O experimento demonstrado na aula

O instrutor faz um experimento em 4 etapas para provar o comportamento:

### Etapa 1: Criar arquivo com volume
```bash
docker exec -it <container> bash
touch src/file.log
exit
```
Resultado: arquivo criado dentro do container que tem volume montado.

### Etapa 2: Parar e recriar container COM volume
```bash
docker stop <container>
docker run -v app-volume:/app/src ...
docker exec -it <novo-container> bash
ls src/  # file.log EXISTE
```
Resultado: arquivo persiste porque o volume mantem os dados.

### Etapa 3: Recriar container SEM volume
```bash
docker stop <container>
docker run ...  # sem -v
docker exec -it <novo-container> bash
ls src/  # file.log NAO EXISTE
```
Resultado: arquivo desaparece porque o novo container nao referencia o volume.

### Etapa 4: Volume continua existindo
```bash
docker volume inspect <volume-name>
```
Resultado: mesmo sem nenhum container usando, o volume e seus dados continuam existindo. Se voce criar um novo container apontando para esse volume, o `file.log` volta a aparecer.

## Insight critico: volume != container

O ponto mais importante da aula e que **volumes e containers tem ciclos de vida independentes**:

- Deletar container → volume continua
- Deletar arquivos no container → volume mantem (se o arquivo estava no volume)
- Rodar container sem `-v` → volume existe mas nao esta acessivel
- Rodar container com `-v` novamente → dados voltam a aparecer

## Contexto futuro mencionado

O instrutor menciona que no modulo de orquestracao (modulo 4), volumes serao usados para:
- Rodar bancos de dados com dados persistentes
- Workflows com commit → build → container
- Cenarios mais proximos de producao

## Erro comum que o instrutor destaca

O erro mais perigoso e **esquecer o `-v` ao recriar um container**. Os dados nao sao perdidos (o volume existe), mas o container nao consegue ve-los. Isso causa confusao porque parece que os dados sumiram, quando na verdade so nao estao montados.

## Tags de imagem e ambiente local

O instrutor explica por que sempre usa a mesma tag (`:v3`): no ambiente local, sem pipeline de CI/CD, nao ha rebuild automatico. No dia a dia com pipeline, cada commit gera um build e uma nova tag. Isso e relevante porque em producao, ao atualizar a imagem, o volume deve ser preservado entre versoes.