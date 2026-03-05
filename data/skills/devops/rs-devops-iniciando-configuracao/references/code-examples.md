# Code Examples: Pipeline CI/CD — Docker Hub → AWS ECR

## Pipeline Completa (estado final esperado)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

permissions:
  id-token: write   # Necessario para OIDC
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: yarn install --frozen-lockfile

      - name: Run Tests
        run: yarn test

      - name: Generate Tag
        id: generate-tag
        run: |
          SHA=$(echo $GITHUB_SHA | head -c7)
          echo "tag=sha-$SHA" >> $GITHUB_OUTPUT

      # --- BLOCO AWS (substituindo Docker Hub) ---

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-2

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and Push Docker Image
        env:
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          REPOSITORY: minha-aplicacao
          IMAGE_TAG: ${{ steps.generate-tag.outputs.tag }}
        run: |
          docker build -t $REGISTRY/$REPOSITORY:$IMAGE_TAG .
          docker push $REGISTRY/$REPOSITORY:$IMAGE_TAG

      # Deploy AppRunner (proximo passo)
```

## Antes: Pipeline com Docker Hub

```yaml
# Steps que foram REMOVIDOS/COMENTADOS:

- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Build and Push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: usuario/app:latest
```

Esses steps sao especificos do Docker Hub e nao funcionam com ECR.

## Depois: Pipeline com ECR (apenas os steps novos)

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: us-east-2

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2

- name: Build and Push Docker Image
  env:
    REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    REPOSITORY: nome-do-repo
    IMAGE_TAG: ${{ steps.generate-tag.outputs.tag }}
  run: |
    docker build -t $REGISTRY/$REPOSITORY:$IMAGE_TAG .
    docker push $REGISTRY/$REPOSITORY:$IMAGE_TAG
```

## Terraform (recursos necessarios — estrutura basica)

```hcl
# Identity Provider para GitHub OIDC
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# IAM Role para GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:org/repo:*"
        }
      }
    }]
  })
}

# Policy para acesso ao ECR
resource "aws_iam_role_policy_attachment" "ecr_access" {
  role       = aws_iam_role.github_actions.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
}

# ECR Repository
resource "aws_ecr_repository" "app" {
  name                 = "minha-aplicacao"
  image_tag_mutability = "MUTABLE"
}
```

## Permissao OIDC no Workflow

Ponto critico: o workflow YAML precisa declarar permissao para gerar o token OIDC:

```yaml
permissions:
  id-token: write   # Sem isso, OIDC nao funciona
  contents: read
```

Sem essa declaracao, o step `configure-aws-credentials` falha silenciosamente.