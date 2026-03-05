# Code Examples: Configurando Servico do Container

## Exemplo 1: Role do AppRunner (completa)

```hcl
resource "aws_iam_role" "app_runner_role" {
  name = "AppRunnerRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::policy/AmazonEC2ContainerRegistryReadOnly"
  ]

  tags = {
    Project = var.project_name
  }
}
```

### Explicacao linha a linha:
- `assume_role_policy`: Define que o servico AppRunner pode assumir esta role
- `Principal.Service = "build.apprunner.amazonaws.com"`: O AppRunner precisa de acesso de build para baixar imagens
- `managed_policy_arns`: Associa a policy ReadOnly do ECR — AppRunner so precisa LER imagens
- `tags`: Boa pratica sempre incluir tags para rastreabilidade

## Exemplo 2: Inline Policy com multiplos statements

```hcl
inline_policy {
  name = "ecr-app-permission"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "Statement1"
        Effect   = "Allow"
        Action   = "ecr:*"
        Resource = "*"
      },
      {
        Sid      = "Statement2"
        Effect   = "Allow"
        Action   = "apprunner:*"
        Resource = "*"
      },
      {
        Sid      = "Statement3"
        Effect   = "Allow"
        Action   = [
          "iam:PassRole",
          "iam:CreateServiceLinkedRole"
        ]
        Resource = "*"
      }
    ]
  })
}
```

### Pontos criticos:
- Cada `Sid` DEVE ser unico — duplicar causa erro 400 no apply
- `Action` aceita string unica ou array de strings
- Statement3 usa array porque tem duas actions distintas

## Exemplo 3: Referencia — ci.yaml assume role

```yaml
# No GitHub Actions, o pipeline assume roles diferentes em momentos diferentes
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.ECR_ROLE_ARN }}  # Role do ECR para push
    aws-region: us-east-1

# Depois, para deploy no AppRunner, assumiria outra role:
- name: Configure AppRunner Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.APP_RUNNER_ROLE_ARN }}  # Role do AppRunner
    aws-region: us-east-1
```

## Exemplo 4: Pegando o boilerplate da AWS (processo manual)

O instrutor mostrou como pegar a estrutura base do Custom Trust Policy:

1. Ir em IAM > Roles > Create Role
2. Selecionar "Custom Trust Policy"
3. Copiar a estrutura JSON base:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {},
      "Action": ""
    }
  ]
}
```

4. Usar como base no Terraform, substituindo pelos valores corretos
5. Usar `jsonencode()` para converter o objeto HCL em JSON

## Exemplo 5: Encontrando a managed policy ARN

Para encontrar o nome exato da managed policy:

1. IAM > Create Role > AWS Service (EC2) > Next
2. Buscar por "AmazonEC2ContainerRegistryReadOnly"
3. Copiar o nome exato
4. Montar a ARN: `arn:aws:iam::policy/AmazonEC2ContainerRegistryReadOnly`

## Fluxo completo de execucao Terraform

```bash
# 1. Verificar o que sera criado/alterado
terraform plan

# 2. Aplicar (com auto-approve para agilizar)
terraform apply -auto-approve

# 3. Se erro 400 (SID duplicado, por exemplo):
#    - Corrigir o codigo
#    - Rodar plan novamente
#    - Rodar apply novamente

# 4. Verificar no console AWS:
#    IAM > Roles > AppRunnerRole > Trust relationships
#    IAM > Roles > ECRRole > Inline policies > ecr-app-permission
```