# Code Examples: Rodando Pipeline pela 1a Vez

## Inline Policy completa para TF Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRFullAccess",
      "Effect": "Allow",
      "Action": "ecr:*",
      "Resource": "*"
    },
    {
      "Sid": "IAMFullAccess",
      "Effect": "Allow",
      "Action": "iam:*",
      "Resource": "*"
    }
  ]
}
```

Nota: O instrutor comeca com dois statements (ECR e IAM) e planeja adicionar S3 na proxima aula.

## Aplicacao da inline policy via Terraform

```bash
# Validar o que sera alterado
terraform plan

# Aplicar (modifica o TF role adicionando inline policy)
terraform apply --auto-approve
```

Output esperado: `Apply complete! Resources: 0 added, 1 changed, 0 destroyed.`

## Configuracao de Secrets no GitHub

### Via UI
Settings → Secrets and variables → Actions → New repository secret

| Name | Value |
|------|-------|
| `AWS_REGION` | `us-east-2` |
| `ROLE_ASSUME` | `arn:aws:iam::123456789:role/tf-role` |

### Via CLI (alternativa)
```bash
gh secret set AWS_REGION --body "us-east-2"
gh secret set ROLE_ASSUME --body "arn:aws:iam::123456789:role/tf-role"
```

## Configuracao de Variables no GitHub

### Via UI
Settings → Secrets and variables → Actions → Variables → New repository variable

| Name | Value |
|------|-------|
| `TF_VERSION` | `1.8.4` |

### Via CLI
```bash
gh variable set TF_VERSION --body "1.8.4"
```

## Workflow YAML antes (inseguro)

```yaml
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/tf-role
          aws-region: us-east-2

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.8.4
```

Problemas: ARN hardcoded, regiao hardcoded, versao hardcoded.

## Workflow YAML depois (sanitizado)

```yaml
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.ROLE_ASSUME }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ vars.TF_VERSION }}
```

## Erro esperado no apply (409)

```
Error: creating ECR Repository (my-repo): RepositoryAlreadyExistsException:
The repository with name 'my-repo' already exists in the registry with id '123456789'
```

Este erro indica que o estado Terraform nao conhece o recurso existente. Solucao: migrar estado para S3 backend (proxima aula).

## Comandos git para testar pipeline

```bash
# Apos adicionar inline policy
git add .
git commit -m "add new permissions"
git push

# Apos sanitizar secrets
git add .
git commit -m "add secrets"
git push
```

## Verificacao no console AWS

1. IAM → Roles → TF Role
2. Permissions → Inline policies
3. Verificar `tf-permission` presente
4. Clicar para ver JSON e confirmar statements