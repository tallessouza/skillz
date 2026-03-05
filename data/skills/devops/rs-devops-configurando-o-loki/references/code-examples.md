# Code Examples: Configurando o Loki

## Docker Compose completo da aula

```yaml
services:
  loki:
    image: grafana/loki:latest
    container_name: loki
    restart: always
    ports:
      - "3100:3100"
      - "7946:7946"
      - "9095:9095"

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - loki
    volumes:
      - ./provisioning:/etc/grafana/provisioning
```

## Data source YAML provisioning

```yaml
# provisioning/datasources/datasources.yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: false
    editable: false
    version: 1
    uid: loki
```

## Comandos Docker utilizados na aula

```bash
# Subir os servicos
docker-compose up

# Verificar containers rodando
docker ps

# Ver logs do Grafana
docker logs grafana

# Ver logs do Loki
docker logs loki

# Derrubar tudo (para recriar com nova config)
docker-compose down

# Subir novamente
docker-compose up
```

## Verificacao de funcionamento

```bash
# Testar se Loki esta acessivel (do host)
curl http://localhost:3100/ready

# Acessar metricas do Loki
curl http://localhost:3100/metrics
```

## Variacao: porta customizada no host

```yaml
# Se 3100 ja esta em uso na sua maquina
ports:
  - "3001:3100"   # Host:Container — container SEMPRE 3100
```

Neste caso, a URL do data source continua `http://loki:3100` porque a comunicacao interna Docker usa a porta do container.

## Variacao: com autenticacao

```yaml
datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: false
    editable: false
    basicAuth: true
    basicAuthUser: admin
    secureJsonData:
      basicAuthPassword: senha-segura
```

## Diagnostico: data source com type errado

Sinais de que o `type` esta incorreto:
1. Data source aparece sem icone/logo no Grafana
2. Mensagem "plugin not found" nos logs
3. Data source nao aparece no Explorer
4. Type mostra "undefined" na listagem

Correcao: sempre `type: loki` (lowercase), recriar containers com `docker-compose down && docker-compose up`.