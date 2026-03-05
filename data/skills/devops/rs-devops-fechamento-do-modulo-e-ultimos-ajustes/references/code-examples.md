# Code Examples: Docker Push Otimizado com All-Tags

## Exemplo 1: Pipeline antes da otimizacao (duplicado)

```yaml
# .github/workflows/deploy.yml - ANTES (problema)
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to registry
        run: echo "${{ secrets.REGISTRY_PASSWORD }}" | docker login -u "${{ secrets.REGISTRY_USER }}" --password-stdin

      - name: Build
        run: docker build -t ${{ secrets.REGISTRY }}/app:${{ github.sha }} .

      # PROBLEMA: push duplicado
      - name: Push version tag
        run: docker push ${{ secrets.REGISTRY }}/app:${{ github.sha }}

      - name: Tag latest
        run: docker tag ${{ secrets.REGISTRY }}/app:${{ github.sha }} ${{ secrets.REGISTRY }}/app:latest

      # PROBLEMA: segundo push desnecessario
      - name: Push latest
        run: docker push ${{ secrets.REGISTRY }}/app:latest
```

## Exemplo 2: Pipeline otimizado (--all-tags)

```yaml
# .github/workflows/deploy.yml - DEPOIS (otimizado)
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to registry
        run: echo "${{ secrets.REGISTRY_PASSWORD }}" | docker login -u "${{ secrets.REGISTRY_USER }}" --password-stdin

      - name: Build image
        run: docker build -t ${{ secrets.REGISTRY }}/app:${{ github.sha }} .

      - name: Tag as latest
        run: docker tag ${{ secrets.REGISTRY }}/app:${{ github.sha }} ${{ secrets.REGISTRY }}/app:latest

      # Um unico push para todas as tags
      - name: Push all tags
        run: docker push ${{ secrets.REGISTRY }}/app --all-tags
```

## Exemplo 3: Com release automatica

```yaml
# Pipeline com release bot que gera tags semanticas
name: Release and Deploy

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  release:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.release.outputs.tag }}
    steps:
      - id: release
        uses: release-drafter/release-drafter@v5
        # Bot adiciona label de release no PR e comentario

  build-and-push:
    needs: release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build
        run: docker build -t ${{ secrets.REGISTRY }}/app:${{ needs.release.outputs.version }} .

      - name: Tag latest
        run: docker tag ${{ secrets.REGISTRY }}/app:${{ needs.release.outputs.version }} ${{ secrets.REGISTRY }}/app:latest

      - name: Push all tags
        run: docker push ${{ secrets.REGISTRY }}/app --all-tags

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AppRunner
        run: |
          aws apprunner update-service \
            --service-arn ${{ secrets.APPRUNNER_ARN }} \
            --source-configuration '{"ImageRepository":{"ImageIdentifier":"${{ secrets.REGISTRY }}/app:latest"}}'
```

## Exemplo 4: Git workflow do instrutor

```bash
# Fluxo de trabalho no Git mostrado na aula
git checkout -b fix/ci-variables
# ... faz alteracoes no pipeline ...
git add .
git commit -m "fix: ci variables"
git push origin fix/ci-variables

# Cria PR, faz merge na main
# Pipeline roda automaticamente
# Release bot cria tag e adiciona label no PR
# Deleta branch apos merge para manter historico limpo
```