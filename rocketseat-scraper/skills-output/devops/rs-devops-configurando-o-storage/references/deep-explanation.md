# Deep Explanation: Configurando Storage com MinIO MC Client

## O que e o MC (MinIO Client)

O MC e um client de linha de comando para o MinIO que segue a mesma logica de comandos de filesystem Unix. Os comandos sao intencionalmente familiares:

- `mc cp` — copiar arquivos (como `cp`)
- `mc cat` — ler conteudo (como `cat`)
- `mc ls` — listar (como `ls`)
- `mc mv` — mover (como `mv`)
- `mc rm` — remover (como `rm`)
- `mc mb` — make bucket (criar bucket)
- `mc rb` — remove bucket (remover bucket)
- `mc alias` — gerenciar conexoes

Essa familiaridade e proposital: quem trabalha com AWS S3 CLI vai se sentir em casa, porque a semantica e praticamente identica.

## Por que o alias e critico

O MC nao tem contexto proprio. Diferente de um CLI que le um arquivo de configuracao persistente, o MC dentro de um container Docker efemero comeca do zero. Sem alias configurado, ele literalmente nao sabe para onde enviar os comandos.

O alias funciona como um "bookmark" que mapeia:
- Um nome amigavel (`minio`)
- Um endpoint (`http://minio:9000`)
- Credenciais de acesso (access key + secret key)

**Armadilha real da aula:** o instrutor primeiro tentou criar buckets SEM configurar o alias. O MC executou sem erros aparentes mas o bucket simplesmente nao foi criado. Isso e uma falha silenciosa — um dos piores tipos de bug em infraestrutura.

## O problema do restart: always

O instrutor demonstrou ao vivo como `restart: always` causa um loop infinito em containers efemeros:

1. Container sobe
2. Executa entrypoint
3. Chega no `exit 0`
4. Docker ve que o container parou
5. `restart: always` manda subir de novo
6. Volta ao passo 1 — loop infinito

A solucao e simplesmente nao usar restart policy. O container e descartavel por design — ele existe apenas para executar os comandos de setup e morrer.

## depends_on nao e health check

O instrutor fez questao de frisar: `depends_on` no Docker Compose apenas garante que o container MinIO FOI INICIADO, nao que esta SAUDAVEL ou PRONTO para receber conexoes.

Na pratica, isso significa que o container MC pode tentar conectar antes do MinIO estar pronto. Para producao, seria necessario implementar um health check ou um retry loop no entrypoint.

## Diagnostico via docker logs

Quando o bucket nao apareceu na interface do MinIO, o processo de investigacao foi:

1. `docker ps` — verificar se container ainda esta rodando
2. `docker ps -a` — ver containers que ja morreram (exit)
3. `docker logs mc` — ler output do container MC
4. Analisar mensagens de erro (credenciais, URL)

Os logs revelaram que o MC reclamou das credenciais e da URL — sinais claros de que o alias estava mal configurado.

## Credenciais: access key vs root password

No MinIO, as credenciais do alias MC precisam corresponder exatamente ao `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD` definidos no container MinIO. O access key e o root user, o secret key e o root password.

Se voce criar credenciais separadas, precisaria usar o mecanismo de volumes para persistir — sem volume, dropar e recriar o container perde as credenciais e nada funciona.

## DNS interno do Docker

Containers na mesma rede Docker Compose se resolvem pelo nome do servico. Entao se o servico MinIO se chama `minio` no compose, o host e `minio`, nao `localhost` nem o IP.

Usar `localhost:9000` dentro de um container tenta conectar na propria interface de rede do container MC, nao no MinIO.