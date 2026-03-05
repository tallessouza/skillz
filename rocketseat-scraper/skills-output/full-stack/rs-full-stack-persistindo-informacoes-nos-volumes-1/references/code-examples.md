# Code Examples: Persistindo Informações nos Volumes Docker

## Comandos basicos da aula

### Acessar container em execucao

```bash
# Formato geral
docker exec -it <container-id> /bin/sh

# Se a imagem tem bash disponivel
docker exec -it <container-id> bash

# Nota do instrutor: algumas imagens so tem sh, nao bash
docker exec -it <container-id> /bin/sh
```

### Criar arquivo dentro do container

```bash
# Dentro do container
touch test.txt
ls  # verifica que foi criado
```

### Parar container

```bash
docker stop <container-id>

# Verificar que parou
docker ps  # nao deve aparecer na lista
```

### Rodar container COM volume

```bash
docker run -d -v meu-volume:/app minha-imagem

# Verificar que subiu
docker ps
```

### Rodar container SEM volume

```bash
docker run -d minha-imagem

# Dados do volume NAO estarao acessiveis
```

## Variacoes praticas

### Named volume (recomendado para producao)

```bash
# Criar volume explicitamente
docker volume create dados-app

# Usar em docker run
docker run -d -v dados-app:/app/data minha-imagem

# Inspecionar volume
docker volume inspect dados-app

# Listar todos volumes
docker volume ls
```

### Bind mount (recomendado para desenvolvimento)

```bash
# Monta diretorio local dentro do container
docker run -d -v $(pwd)/data:/app/data minha-imagem

# Alteracoes locais refletem no container e vice-versa
```

### Docker Compose com volume nomeado

```yaml
version: '3.8'

services:
  api:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - app-uploads:/app/uploads
      - app-logs:/app/logs

  database:
    image: postgres:15
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret

volumes:
  app-uploads:
  app-logs:
  pg-data:
```

### Fluxo completo demonstrado na aula

```bash
# 1. Rodar com volume
docker run -d -v meu-vol:/app minha-imagem
# Anotar o ID: abc123

# 2. Entrar e criar arquivo
docker exec -it abc123 /bin/sh
touch test.txt
ls  # test.txt aparece
exit

# 3. Parar e recriar COM volume
docker stop abc123
docker run -d -v meu-vol:/app minha-imagem
# Novo ID: def456

# 4. Verificar persistencia
docker exec -it def456 /bin/sh
ls  # test.txt AINDA ESTA LA
exit

# 5. Parar e recriar SEM volume
docker stop def456
docker run -d minha-imagem
# Novo ID: ghi789

# 6. Verificar que dados sumiram
docker exec -it ghi789 /bin/sh
ls  # test.txt NAO ESTA
exit

# 7. Parar e recriar COM volume novamente
docker stop ghi789
docker run -d -v meu-vol:/app minha-imagem
# Novo ID: jkl012

# 8. Verificar que dados voltaram
docker exec -it jkl012 /bin/sh
ls  # test.txt VOLTOU — volume manteve os dados
exit
```

### Backup de volume

```bash
# Criar backup de um volume para arquivo tar
docker run --rm -v meu-vol:/data -v $(pwd):/backup alpine \
  tar czf /backup/meu-vol-backup.tar.gz -C /data .

# Restaurar backup para volume
docker run --rm -v meu-vol:/data -v $(pwd):/backup alpine \
  tar xzf /backup/meu-vol-backup.tar.gz -C /data
```

### Remover volumes (cuidado!)

```bash
# Remover volume especifico (DADOS PERDIDOS)
docker volume rm meu-vol

# Remover todos volumes nao utilizados
docker volume prune

# Remover container E seu volume anonimo
docker rm -v <container-id>
```