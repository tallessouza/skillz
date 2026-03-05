# Code Examples: Arquivos e Containers

## 1. Verificando containers em execução

```bash
# Listar containers rodando
docker ps
```

Output esperado: lista com CONTAINER ID, IMAGE, STATUS, PORTS, etc.

## 2. Acessando o filesystem do container

```bash
# Entrar no container em modo interativo
docker exec -it <container_id> bash

# Dentro do container, no WORKDIR definido no Dockerfile
# Ex: /usr/app

# Listar arquivos da aplicação
ls
# Output: dist  node_modules  package.json  src  tsconfig.json  yarn.lock  ...

# Listar arquivos do source
ls src/
# Output: app.controller.ts  app.module.ts  app.service.ts  main.ts
```

## 3. Criando arquivo dentro do container (demonstração de efemeridade)

```bash
# Dentro do container (após docker exec -it)
touch src/file.log

# Verificar que foi criado
ls src/
# Output: app.controller.ts  app.module.ts  app.service.ts  file.log  main.ts

# Sair do container
exit
```

## 4. Teste: stop + start preserva arquivos

```bash
# Parar container
docker stop <container_id>

# Verificar que não há containers rodando
docker ps
# Output: (vazio)

# Reiniciar o MESMO container
docker start <container_id>

# Verificar que está rodando
docker ps

# Ver logs
docker logs <container_id>

# Entrar novamente
docker exec -it <container_id> bash

# Arquivo AINDA EXISTE
ls src/
# Output: ... file.log ...
```

## 5. Teste: novo container PERDE arquivos

```bash
# Parar container atual
docker stop <container_id>

# Criar container NOVO a partir da mesma imagem
docker run -d -p 3000:3000 minha-imagem

# Verificar — foi criado há poucos segundos
docker ps
# Output: CREATED "3 seconds ago"

# Entrar no novo container
docker exec -it <novo_container_id> bash

# Arquivo NÃO EXISTE MAIS
ls src/
# Output: app.controller.ts  app.module.ts  app.service.ts  main.ts
# (sem file.log)
```

## 6. Cenário completo: aplicação NestJS no Docker

### Dockerfile original (da aula)
```dockerfile
FROM node:18-alpine

WORKDIR /usr/app

COPY . .

RUN npm install

CMD ["npm", "run", "start:prod"]
```

### Estrutura de arquivos dentro do container
```
/usr/app/
├── dist/              # Build compilado
├── node_modules/      # Dependências
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── yarn.lock
```

### Observação do instrutor sobre .dockerignore
O instrutor nota que alguns arquivos dentro do container são desnecessários (ex: arquivos de configuração de desenvolvimento). Isso indica que o `.dockerignore` pode ser melhorado:

```dockerignore
# .dockerignore otimizado
node_modules
.git
.gitignore
README.md
.env
.env.*
docker-compose*.yml
Dockerfile
.dockerignore
```