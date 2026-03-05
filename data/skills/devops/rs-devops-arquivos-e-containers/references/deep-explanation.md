# Deep Explanation: Arquivos e Containers

## Por que containers sao efemeros?

O instrutor começa contextualizando o cenário **sem containers**: em um servidor Linux tradicional, é comum ter uma pastinha de `assets` onde uploads são salvos, ou um arquivo de log que vai crescendo. Nesse modelo, tudo funciona porque o servidor é persistente — ele não é destruído e recriado frequentemente.

Quando migramos para containers, a mentalidade muda completamente. O container é **efêmero por design**. A imagem Docker é construída uma vez (build), e cada `docker run` cria uma instância nova. Qualquer coisa criada dentro do container que não faça parte do build original **deixa de existir** quando o container é destruído.

## A armadilha do docker stop vs docker run

O instrutor demonstra uma nuance importante que confunde muitos iniciantes:

1. **`docker stop` + `docker start`**: O container é pausado e retomado. O filesystem temporário **é preservado**. Arquivos criados manualmente ainda existem.

2. **`docker stop` + `docker run`**: Um container **novo** é criado. O filesystem é resetado para o estado da imagem. Arquivos criados manualmente **são perdidos**.

A confusão acontece porque ao testar com stop/start, o desenvolvedor pensa que os dados estão seguros. Mas em produção, containers são destruídos e recriados constantemente — por deploy, por crash, por scaling.

## Separação de responsabilidade

O instrutor enfatiza que a migração para containers é também uma oportunidade de adotar boas práticas de separação:

- **Uploads** → Bucket online (S3, Azure Blob Storage, etc.)
- **Logs** → Sistema de observabilidade (Datadog, Grafana, ELK, etc.)
- **Dados de aplicação** → Banco de dados externo

Isso não é apenas uma questão técnica — é uma questão de **arquitetura**. A aplicação não deve depender do filesystem local do container para nada que precise persistir.

## O comando docker exec

O instrutor apresenta `docker exec -it <container_id> bash` como forma de "entrar" no container e ver os arquivos. Pontos importantes:

- O `-it` roda no modo interativo (interactive + tty)
- O `bash` é o shell que será executado dentro do container
- O diretório inicial é o `WORKDIR` definido no Dockerfile
- Todos os arquivos copiados durante o build estão lá
- Arquivos desnecessários também estão (oportunidade para melhorar o `.dockerignore`)

## Quando volumes são necessários

O instrutor finaliza explicando que, mesmo com as boas práticas de separação, existem casos legítimos onde a aplicação **precisa** de estado persistente dentro do container. Para esses casos, existem os **volumes Docker**, que serão abordados na próxima aula.

Volumes são a ponte entre a efemeridade do container e a necessidade de persistência de dados.