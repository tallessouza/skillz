---
name: rs-devops-arquivos-e-containers
description: "Enforces Docker container ephemeral storage awareness and volume best practices when writing Dockerfiles, docker-compose files, or container orchestration code. Use when user asks to 'create a Dockerfile', 'setup Docker', 'persist data in containers', 'handle file uploads in Docker', or 'configure container storage'. Applies rules: never store persistent data inside containers without volumes, separate storage responsibility from application, use external services for uploads/logs. Make sure to use this skill whenever designing containerized applications that handle files, logs, or uploads. Not for Kubernetes-specific storage classes, cloud-native object storage configuration, or non-Docker container runtimes."
---

# Arquivos e Containers — Efemeridade Docker

> Containers sao efemeros: tudo que nao faz parte do build da imagem sera destruido quando o container for recriado.

## Rules

1. **Nunca armazene dados persistentes dentro do container sem volume** — arquivos criados em runtime (uploads, logs, cache) desaparecem ao recriar o container, porque a imagem e efemera por design
2. **Separe responsabilidade de storage da aplicacao** — uploads devem ir para buckets externos (S3, Blob Storage), logs devem ir para sistemas de observabilidade, porque acoplar storage ao container viola o principio de efemeridade
3. **Distinga stop de destroy** — `docker stop` preserva o filesystem do container, mas `docker run` cria um container novo e perde tudo, porque sao operacoes fundamentalmente diferentes
4. **Use volumes para estado necessario** — quando a aplicacao precisa de estado persistente no container, declare volumes explicitos, porque e a unica forma de sobreviver a recriacao
5. **Otimize o .dockerignore** — arquivos desnecessarios copiados para dentro do container sao desperdicio, porque aumentam o tamanho da imagem sem necessidade

## How to write

### Dockerfile com workdir correto
```dockerfile
# O WORKDIR define o ponto de montagem dos arquivos da aplicacao
WORKDIR /usr/app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

### Docker commands para inspecionar container
```bash
# Ver arquivos dentro do container em execucao
docker exec -it <container_id> bash

# Dentro do container, verificar arquivos
ls
ls src/

# Criar arquivo (sera perdido ao recriar container)
touch src/file.log
```

### Ciclo de vida do container
```bash
# STOP: preserva filesystem temporario
docker stop <container_id>
docker start <container_id>
# arquivo criado manualmente AINDA EXISTE

# RUN (novo container): perde tudo
docker stop <container_id>
docker run -d -p 3000:3000 minha-imagem
# arquivo criado manualmente NAO EXISTE MAIS
```

## Example

**Before (aplicacao acoplada ao filesystem do container):**
```typescript
// Upload salvo dentro do container — sera perdido
app.post('/upload', async (req, res) => {
  const file = req.file
  fs.writeFileSync(`./uploads/${file.name}`, file.buffer)
  res.json({ path: `./uploads/${file.name}` })
})
```

**After (storage externo, container efemero):**
```typescript
// Upload enviado para bucket externo — persiste independente do container
app.post('/upload', async (req, res) => {
  const file = req.file
  const url = await s3Client.upload({
    Bucket: 'my-uploads',
    Key: file.name,
    Body: file.buffer,
  })
  res.json({ url })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Aplicacao faz upload de arquivos | Envie para bucket externo (S3, Blob Storage) |
| Aplicacao gera logs em arquivo | Use sistema de observabilidade externo |
| Aplicacao precisa de cache local | Use volume Docker ou Redis externo |
| Arquivo faz parte do build (codigo, configs) | Copie via Dockerfile normalmente |
| Arquivo e gerado em runtime e precisa persistir | Declare volume explicito |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `touch /app/data.log` dentro do container sem volume | Volume mount: `-v ./data:/app/data` |
| `fs.writeFileSync('./uploads/file.pdf')` sem storage externo | `s3.upload()` ou volume persistente |
| Confiar que `docker stop` + `docker start` preserva dados para sempre | Usar volumes para qualquer dado que precisa sobreviver |
| Copiar arquivos desnecessarios na imagem | Configurar `.dockerignore` adequadamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-arquivos-e-containers/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-arquivos-e-containers/references/code-examples.md)
