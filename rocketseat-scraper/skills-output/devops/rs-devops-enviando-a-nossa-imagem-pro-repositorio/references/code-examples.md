# Code Examples: Enviando Imagem Docker para o Repositorio

## Pipeline completa do arquivo CI

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login into the container registry
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: yarn install

      - name: Run tests
        run: yarn test

      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }} .

      - name: Push image
        run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }}
```

## Step de login isolado

```yaml
- name: Login into the container registry
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

## Build com tag completa (username/repo:sha)

```yaml
- name: Build Docker image
  run: docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }} .
```

## Push da imagem

```yaml
- name: Push image
  run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }}
```

## Alternativa: build sem username + docker tag

```yaml
- name: Build Docker image
  run: docker build -t rocketseat-ci-api:${{ github.sha }} .

- name: Tag image with registry prefix
  run: docker tag rocketseat-ci-api:${{ github.sha }} ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }}

- name: Push image
  run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }}
```

## Configuracao de secrets via GitHub CLI

```bash
# Alternativa ao UI: configurar secrets via CLI
gh secret set DOCKERHUB_USERNAME --body "seu-username"
gh secret set DOCKERHUB_TOKEN --body "dckr_pat_xxxxx"
```

## Verificar imagem apos push

```bash
# Pull da imagem para verificar
docker pull danielrodrigues/rocketseat-ci-api:abc123def

# Verificar tags disponiveis (via Docker Hub API)
curl -s "https://hub.docker.com/v2/repositories/danielrodrigues/rocketseat-ci-api/tags" | jq '.results[].name'
```

## Login em registries alternativos (referencia)

```yaml
# AWS ECR (modulo 5)
- name: Login to Amazon ECR
  uses: aws-actions/amazon-ecr-login@v2

# Google Cloud
- name: Login to GCR
  uses: docker/login-action@v3
  with:
    registry: gcr.io
    username: _json_key
    password: ${{ secrets.GCP_SA_KEY }}
```