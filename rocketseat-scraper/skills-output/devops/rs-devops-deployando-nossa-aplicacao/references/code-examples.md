# Code Examples: Deploy com AWS AppRunner via CI/CD

## Workflow completo (CI + CD)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

env:
  REPO_NAME: rocketseat-api

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    permissions:
      id-token: write   # Necessario para OIDC
      contents: read

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Generate Tag
        id: generate-tag
        run: |
          SHA=$(echo $GITHUB_SHA | head -c 7)
          echo "tag=$SHA" >> $GITHUB_OUTPUT

      - name: Build Docker Image
        id: build-docker-img
        run: |
          IMG=${{ steps.login-ecr.outputs.registry }}/${{ env.REPO_NAME }}:${{ steps.generate-tag.outputs.tag }}
          docker build -t $IMG .
          docker push $IMG
          echo "img=$IMG" >> $GITHUB_OUTPUT

      - name: Deploy to AppRunner
        uses: aws-labs/amazon-apprunner-deploy@main
        with:
          service: rocketseat-api
          access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}
          region: us-east-1
          cpu: 1
          memory: 2
          port: 3000
          image: ${{ steps.build-docker-img.outputs.img }}
```

## Padrao de output entre steps

### Gerando output simples
```yaml
- name: Generate Tag
  id: generate-tag
  run: |
    SHA=$(echo $GITHUB_SHA | head -c 7)
    echo "tag=$SHA" >> $GITHUB_OUTPUT
```

### Consumindo output de outro step
```yaml
- name: Use Tag
  run: echo "A tag e ${{ steps.generate-tag.outputs.tag }}"
```

### Compondo outputs de multiplos steps
```yaml
- name: Build Image
  id: build-docker-img
  run: |
    # Combina registry (do login-ecr) + repo name + tag (do generate-tag)
    IMG=${{ steps.login-ecr.outputs.registry }}/${{ env.REPO_NAME }}:${{ steps.generate-tag.outputs.tag }}
    docker build -t $IMG .
    docker push $IMG
    echo "img=$IMG" >> $GITHUB_OUTPUT
```

## Estrutura da URI da imagem ECR

```
{account-id}.dkr.ecr.{region}.amazonaws.com/{repo-name}:{tag}
|_____________________________________________| |________| |___|
         registry (output do login-ecr)         repo name   tag
                                               (env var)  (SHA)
```

Exemplo concreto:
```
123456789012.dkr.ecr.us-east-1.amazonaws.com/rocketseat-api:a2b3c4d
```

## Parametros do AppRunner Deploy Action

```yaml
with:
  # Nome do servico (criado automaticamente no primeiro deploy)
  service: rocketseat-api

  # ARN da role que permite AppRunner puxar imagem do ECR
  access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}

  # Regiao AWS
  region: us-east-1

  # Recursos (combinacoes validas: 1vCPU/2GB, 2vCPU/3-4GB, 4vCPU/8-12GB)
  cpu: 1
  memory: 2

  # Porta que a aplicacao expoe (deve bater com EXPOSE do Dockerfile)
  port: 3000

  # URI completa da imagem no ECR
  image: ${{ steps.build-docker-img.outputs.img }}
```

## Tratando roles como secrets

```yaml
# Em Settings > Secrets and Variables > Actions, crie:
# APPRUNNER_ROLE_ARN = arn:aws:iam::123456789012:role/apprunner-role

- name: Deploy to AppRunner
  uses: aws-labs/amazon-apprunner-deploy@main
  with:
    access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}
    # ... demais parametros
```

## Erro comum: hostname de container em producao

```typescript
// docker-compose.yml — funciona local
// O hostname "mysql" resolve para o container do MySQL
DATABASE_URL=mysql://user:pass@mysql:3306/mydb

// AppRunner — NAO funciona
// Nao existe container "mysql" no ambiente do AppRunner
// Use o endpoint real do banco gerenciado (RDS, PlanetScale, etc)
DATABASE_URL=mysql://user:pass@my-rds-instance.abc123.us-east-1.rds.amazonaws.com:3306/mydb
```

## Prevenir deploy durante operacao em progresso

```yaml
# Opcao 1: Limitar concorrencia do workflow
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false  # Espera o anterior terminar

# Opcao 2: Verificar status antes de deployar
- name: Check AppRunner Status
  run: |
    STATUS=$(aws apprunner describe-service --service-arn $SERVICE_ARN --query 'Service.Status' --output text)
    if [ "$STATUS" != "RUNNING" ]; then
      echo "Service not ready: $STATUS"
      exit 1
    fi
```