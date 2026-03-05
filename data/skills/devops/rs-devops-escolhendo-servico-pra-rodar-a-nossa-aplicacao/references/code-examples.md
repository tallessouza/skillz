# Code Examples: Escolhendo Servico AWS para Aplicacao Containerizada

## Pipeline CI existente (recapitulacao)

A pipeline CI que ja estava configurada antes desta aula:

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 1. Setup Node
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # 2. Install dependencies
      - run: npm ci

      # 3. Run tests
      - run: npm test

      # 4. Generate tag from commit hash
      - name: Generate tag
        id: tag
        run: |
          SHORT_SHA=$(echo ${{ github.sha }} | cut -c1-7)
          echo "short_sha=$SHORT_SHA" >> $GITHUB_OUTPUT

      # 5. Login to Docker Hub (sera substituido por ECR)
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      # 6-7. Build and push
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            user/app:${{ steps.tag.outputs.short_sha }}
            user/app:latest
```

## Migracao para ECR — Pipeline completa

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-2
  ECR_REPOSITORY: app-name

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npm test

      - name: Generate tag
        id: tag
        run: |
          SHORT_SHA=$(echo ${{ github.sha }} | cut -c1-7)
          echo "short_sha=$SHORT_SHA" >> $GITHUB_OUTPUT

      # ECR login ao inves de Docker Hub
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and Push to ECR
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${{ steps.tag.outputs.short_sha }}
            ${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:latest
```

## Terraform — ECR Repository

```hcl
# ecr.tf
resource "aws_ecr_repository" "app" {
  name                 = "app-name"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}
```

## Terraform — IAM Role para AppRunner

```hcl
# iam.tf
resource "aws_iam_role" "apprunner_ecr_access" {
  name = "apprunner-ecr-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apprunner_ecr" {
  role       = aws_iam_role.apprunner_ecr_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}
```

## Terraform — AppRunner Service

```hcl
# apprunner.tf
resource "aws_apprunner_service" "app" {
  service_name = "app-name"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr_access.arn
    }

    image_repository {
      image_configuration {
        port = "3000"
      }
      image_identifier      = "${aws_ecr_repository.app.repository_url}:latest"
      image_repository_type = "ECR"
    }

    # Auto deploy quando nova imagem chega no ECR
    auto_deployments_enabled = true
  }

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

output "apprunner_url" {
  value = aws_apprunner_service.app.service_url
}
```

## Comparacao de servicos — configuracao minima

### AppRunner (mais simples)
```hcl
# Apenas 1 resource principal
resource "aws_apprunner_service" "app" {
  service_name = "my-app"
  source_configuration {
    image_repository {
      image_identifier      = "${ecr_url}:tag"
      image_repository_type = "ECR"
    }
  }
}
```

### ECS Fargate (medio)
```hcl
# Precisa de: cluster + task definition + service + load balancer + security groups
resource "aws_ecs_cluster" "main" { ... }
resource "aws_ecs_task_definition" "app" { ... }
resource "aws_ecs_service" "app" { ... }
resource "aws_lb" "app" { ... }
resource "aws_security_group" "ecs" { ... }
```

### ECS EC2 (complexo)
```hcl
# Tudo do Fargate + instancias EC2 + auto scaling group + capacity provider
resource "aws_ecs_cluster" "main" { ... }
resource "aws_launch_template" "ecs" { ... }
resource "aws_autoscaling_group" "ecs" { ... }
resource "aws_ecs_capacity_provider" "ec2" { ... }
resource "aws_ecs_task_definition" "app" { ... }
resource "aws_ecs_service" "app" { ... }
```