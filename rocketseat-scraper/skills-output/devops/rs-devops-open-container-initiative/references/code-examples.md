# Code Examples: Open Container Initiative (OCI)

## Verificando conformidade OCI na prática

### Inspecionar imagem OCI

```bash
# Verificar manifest de uma imagem (formato OCI)
docker manifest inspect alpine:latest

# Output mostra mediaType OCI
# "mediaType": "application/vnd.oci.image.manifest.v1+json"
```

### Multi-platform build (portabilidade OCI)

```dockerfile
# Dockerfile que segue princípios OCI de portabilidade
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```bash
# Build multi-arch (OCI-compliant)
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .
```

### Verificando runtime OCI (runc)

```bash
# Verificar qual runtime o Docker está usando
docker info | grep -i runtime
# Default Runtime: runc

# Verificar versão do runc
runc --version
# runc version 1.1.x
# spec: 1.0.2-dev  ← OCI runtime spec version
```

### Usando ferramentas OCI alternativas ao Docker

```bash
# Podman — interface alternativa, mesma OCI spec
podman build -t myapp:latest .
podman run -d -p 3000:3000 myapp:latest

# Mesmo Dockerfile, mesmo resultado — porque ambos seguem OCI

# skopeo — inspecionar imagens sem pull
skopeo inspect docker://docker.io/library/alpine:latest

# crane — manipular imagens OCI
crane manifest alpine:latest
```

### Container agnóstico — sem dependência de vendor

```dockerfile
# CORRETO: agnóstico, funciona em qualquer runtime OCI
FROM alpine:3.19
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s CMD curl -f http://localhost:8080/health || exit 1
CMD ["./myapp"]

# EVITAR: dependência de feature específica de vendor
# (exemplo: Docker-specific SHELL instruction em contextos que precisam de portabilidade máxima)
```

### OCI image layout no filesystem

```bash
# Exportar imagem como OCI layout
docker save myapp:latest -o myapp.tar
mkdir myapp-oci && tar -xf myapp.tar -C myapp-oci

# Estrutura OCI:
# myapp-oci/
# ├── blobs/
# │   └── sha256/
# │       ├── abc123...  (config)
# │       ├── def456...  (layer)
# │       └── ghi789...  (manifest)
# ├── index.json         (entry point)
# └── oci-layout         (version marker)
```

### Verificação de conformidade

```bash
# Usar oci-image-tool para validar conformidade
# (ferramenta do projeto OCI)
oci-image-tool validate myapp-oci/

# Ou usar container-structure-test do Google
container-structure-test test --image myapp:latest --config test-config.yaml
```