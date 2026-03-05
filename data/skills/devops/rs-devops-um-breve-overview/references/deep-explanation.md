# Deep Explanation: Orquestração de Containers Local

## Por que não instalar o banco no host?

O instrutor demonstra que a aplicação NestJS com TypeORM falha ao tentar conectar com MySQL (`Unable to connect to the database`). A solução "óbvia" seria instalar MySQL na máquina, mas isso viola o princípio fundamental de containers: isolamento. Cada dependência deve rodar em seu próprio container.

## Dockerfile vs docker run direto

O instrutor faz uma distinção importante: Dockerfile é necessário quando você precisa de **instruções extras** além de subir o serviço. Para a aplicação Node, o Dockerfile faz sentido porque precisa copiar código, instalar dependências, buildar e definir entrypoint. Para o MySQL, não há nada extra — só precisa subir o serviço com variáveis de ambiente. Por isso, `docker run` direto é suficiente.

Ele mostra que **poderia** criar um `Dockerfile.mysql` com:
```dockerfile
FROM mysql:8
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=rocketdb
```
Mas isso é redundante quando `-e` no `docker run` resolve.

## A complexidade crescente é intencional

O instrutor aponta explicitamente: "tá meio complexo demais". Rodar `docker run` para a app E `docker run` para o banco, cada um com suas flags, portas e variáveis, é trabalhoso. Isso prepara o terreno para docker-compose, que resolve exatamente esse problema de orquestração declarativa.

## Por que nomear containers é crítico

O `--name mysql` não é cosmético. Quando dois containers precisam se comunicar na mesma rede Docker, o nome do container funciona como hostname DNS. Se a app roda dentro de um container e precisa acessar o banco, ela usa `mysql` como host (não `localhost`). O instrutor enfatiza: "nesse fluxo aqui é importante a definição desse nome".

## Tag latest: por que evitar

O instrutor é direto: "não é recomendado rodar nenhum container com a tag latest". Recomenda usar a hash do commit ou a versão da biblioteca. Isso garante reprodutibilidade — o mesmo comando gera o mesmo resultado em qualquer momento.

## Teste de conectividade: dentro vs fora

O instrutor testa a app **fora do container** conectando ao MySQL que está **dentro do container**. Funciona porque `-p 3306:3306` mapeia a porta do host para o container. Ele antecipa que **dentro do container** o comportamento muda (host não é mais `localhost`, e sim o nome do container), deixando para a próxima aula.

## Validação por quebra proposital

Técnica de debugging demonstrada: o instrutor remove um caractere da config do banco, roda a app, confirma que falha, e restaura. Isso prova que a conexão é real e não um falso positivo.