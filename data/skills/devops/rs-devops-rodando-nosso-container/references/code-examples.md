# Code Examples: Rodando Containers Docker

## Exemplo 1: Primeiro container (modo interativo)

```bash
# Comando executado pelo instrutor
docker run --rm -p 3000:3000 api-skillz
```

**Resultado:** Aplicacao starta e exibe logs no terminal. Console fica preso.

**Teste de funcionamento (em outra aba):**
```bash
curl http://localhost:3000
# Retorna: hello world
```

## Exemplo 2: Verificar containers em execucao

```bash
docker ps
```

**Output tipico:**
```
CONTAINER ID   IMAGE        COMMAND          CREATED        STATUS    PORTS                    NAMES
abc123def456   api-skillz   "yarn run start" 2 minutes ago  Up 2 min  0.0.0.0:3000->3000/tcp   random_name
```

**Campos importantes:**
- `CONTAINER ID`: hash abreviada do container
- `IMAGE`: imagem base
- `COMMAND`: comando de entrada (definido no CMD/ENTRYPOINT)
- `STATUS`: Up/Down + tempo
- `PORTS`: mapeamento HOST->CONTAINER
- `NAMES`: nome auto-gerado (ou definido com `--name`)

## Exemplo 3: Parar container com --rm

```bash
# Para o container
docker stop abc123def456

# Tenta reiniciar — FALHA porque --rm deletou o container
docker start abc123def456
# Error: No such container: abc123def456
```

## Exemplo 4: Container em background sem --rm

```bash
# -d: detached | sem --rm | porta diferente para demonstrar
docker run -d -p 3001:3000 api-skillz
# Output: hash completa do container (ex: 7a8b9c0d1e2f...)
```

**Verificacao:**
```bash
docker ps
# Mostra container rodando na porta 3001

curl http://localhost:3001
# Retorna: hello world
```

## Exemplo 5: Stop e Start (sem --rm)

```bash
# Parar
docker stop CONTAINER_ID

# Verificar que parou
curl http://localhost:3001
# Connection refused

# Reiniciar
docker start CONTAINER_ID

# Verificar que voltou
curl http://localhost:3001
# hello world — funciona!
```

## Exemplo 6: Ver logs de container em background

```bash
docker logs CONTAINER_ID
```

**Output mostra historico completo:**
```
# Primeira execucao (timestamp 11:16)
Server running on port 3000

# Apos docker stop + docker start (timestamp 11:54)
Server running on port 3000
```

## Exemplo 7: Inspecionar camadas da imagem

```bash
docker history api-skillz
```

**Output mostra cada instrucao do Dockerfile com tamanho:**
```
IMAGE          CREATED        CREATED BY                                      SIZE
...            ...            RUN yarn install                                ~400MB
...            ...            COPY . .                                        ~225MB
```

## Exemplo 8: Nomear container explicitamente

```bash
docker run -d --name minha-api -p 3000:3000 api-skillz

# Agora pode usar o nome ao inves do ID
docker stop minha-api
docker start minha-api
docker logs minha-api
```

## Resumo de flags do docker run

| Flag | Significado | Quando usar |
|------|-------------|-------------|
| `--rm` | Deleta container ao parar | Testes rapidos, CI/CD |
| `-p HOST:CONTAINER` | Mapeia porta | Sempre que precisar acessar |
| `-d` | Executa em background | Quando nao precisa ver logs em tempo real |
| `--name NOME` | Nomeia o container | Quando quer referenciar por nome |