# Code Examples: Criando o Dockerfile

## Exemplo principal da aula

### Dockerfile completo

```dockerfile
# 1. Imagem base: Node 18 com Alpine Linux (leve e seguro)
FROM node:18-alpine3.20

# 2. Diretorio de trabalho dentro da imagem
#    Criado automaticamente se nao existir
WORKDIR /usr/src/app

# 3. Copia todos os arquivos do projeto para o WORKDIR
COPY . .

# 4. Instala dependencias a partir do package.json
RUN npm install

# 5. Compila TypeScript para JavaScript (gera pasta dist/)
RUN npm run build

# 6. Expoe a porta que a aplicacao usa (deve corresponder ao server.ts)
EXPOSE 3333

# 7. Comando executado quando o container inicia
CMD ["npm", "start"]
```

### Contexto: package.json referenciado

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts"
  }
}
```

### Contexto: server.ts referenciado

```typescript
// A porta aqui DEVE corresponder ao EXPOSE no Dockerfile
app.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

## .dockerignore (complementar ao Dockerfile)

```
node_modules
dist
.git
.gitignore
.env
*.md
```

## Variacoes

### Com separacao de COPY para otimizar cache

```dockerfile
FROM node:18-alpine3.20

WORKDIR /usr/src/app

# Copia package.json primeiro (muda com menos frequencia)
COPY package.json package-lock.json ./

# Instala dependencias (layer cacheada se package.json nao mudou)
RUN npm install

# Depois copia o resto do codigo
COPY . .

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
```

> Esta variacao nao foi mostrada na aula, mas e uma evolucao natural: ao copiar `package.json` separadamente, o Docker cacheia a layer do `npm install` enquanto so o codigo-fonte mudar.

### Para aplicacao sem TypeScript (JavaScript puro)

```dockerfile
FROM node:18-alpine3.20

WORKDIR /usr/src/app

COPY . .

RUN npm install

# Sem build step — JS roda direto
EXPOSE 3333

CMD ["npm", "start"]
```

### Usando porta diferente

```dockerfile
FROM node:18-alpine3.20

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

# Ajuste a porta para corresponder ao seu server.ts
EXPOSE 4000

CMD ["npm", "start"]
```

## Comandos Docker mencionados indiretamente

```bash
# Construir a imagem a partir do Dockerfile
docker build -t minha-app .

# Executar o container expondo a porta
docker run -p 3333:3333 minha-app

# Verificar containers rodando
docker ps
```