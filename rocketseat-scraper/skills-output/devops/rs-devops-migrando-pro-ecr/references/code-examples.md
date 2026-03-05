# Code Examples: Migrando pro ECR

## Exemplo 1: Pipeline completa antes da migracao (com resquicios)

O arquivo CI tinha steps misturados de DockerHub e ECR:

```yaml
# Steps que DEVEM SER REMOVIDOS na migracao:

# 1. Login DockerHub (remover)
- name: Login to DockerHub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

# 2. Build and Push DockerHub (remover)
- name: Build and Push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: danielrodrigues/rocket-ci:latest

# 3. Comando antigo hardcoded (remover)
- name: Old Build
  run: |
    docker build -t danielrodrigues/rocket-ci:latest .
    docker push danielrodrigues/rocket-ci:latest
```

## Exemplo 2: Abordagem hardcoded (funciona mas nao e elegante)

```yaml
- name: Build and Push to ECR
  run: |
    docker build -t 123456789.dkr.ecr.us-east-2.amazonaws.com/rocket-ci:$TAG .
    docker push 123456789.dkr.ecr.us-east-2.amazonaws.com/rocket-ci:$TAG
```

Problema: URI hardcoded. Se mudar de regiao ou conta, precisa alterar a pipeline.

## Exemplo 3: Abordagem com env vars (solucao final)

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: us-east-2

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2

- name: Generate Tag
  id: generate-tag
  run: echo "tag=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

- name: Build and Push to ECR
  env:
    REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    TAG: ${{ steps.generate-tag.outputs.tag }}
  run: |
    docker build -t $REGISTRY/rocket-ci:$TAG .
    docker push $REGISTRY/rocket-ci:$TAG
```

### Detalhamento de cada env var:

- `REGISTRY`: vem do output do step `login-ecr`. Valor sera algo como `123456789.dkr.ecr.us-east-2.amazonaws.com`
- `TAG`: vem do output do step `generate-tag`. Valor sera o short SHA do commit (ex: `abc1234`)

### Como o output do login funciona:

```yaml
# O step login-ecr com id permite referenciar seus outputs
- name: Login to Amazon ECR
  id: login-ecr  # <-- este id e usado como steps.login-ecr
  uses: aws-actions/amazon-ecr-login@v2

# Referencia: ${{ steps.login-ecr.outputs.registry }}
# O action amazon-ecr-login expoe o output "registry" automaticamente
# Ele contem o endpoint do ECR baseado nas credenciais e regiao configuradas
```

## Exemplo 4: Verificacao no console AWS

Apos o push bem-sucedido, no console do ECR:

```
ECR > Repositories > rocket-ci > Image tags
  - Tag: abc1234 (short SHA do commit)
  - Pushed: just now
  - Scan status: IN_PROGRESS (vulnerabilities)
  - Size: ~XXX MB
```

O scan de vulnerabilidades roda automaticamente se habilitado no repositorio.

## Exemplo 5: Estrutura para adicionar tag latest (extensao)

O instrutor menciona que por hora so usa a tag do commit. Para adicionar latest:

```yaml
- name: Build and Push to ECR
  env:
    REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    TAG: ${{ steps.generate-tag.outputs.tag }}
  run: |
    docker build -t $REGISTRY/rocket-ci:$TAG -t $REGISTRY/rocket-ci:latest .
    docker push $REGISTRY/rocket-ci:$TAG
    docker push $REGISTRY/rocket-ci:latest
```

## Exemplo 6: Checklist de limpeza pos-migracao

```bash
# 1. No GitHub Settings > Secrets, remover:
#    - DOCKER_USERNAME
#    - DOCKER_PASSWORD

# 2. No arquivo CI, garantir que NAO existe:
#    - docker/login-action referenciando DockerHub
#    - docker/build-push-action referenciando DockerHub
#    - Qualquer referencia a username/image do DockerHub

# 3. Confirmar que EXISTE:
#    - aws-actions/configure-aws-credentials (OIDC)
#    - aws-actions/amazon-ecr-login com id
#    - env vars usando outputs dos steps
```