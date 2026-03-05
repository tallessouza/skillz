# Code Examples: Remote State e Boas Práticas

## Backend S3 configurado

```hcl
terraform {
  backend "s3" {
    bucket = "meu-terraform-state"
    key    = "infra/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Workflow GitHub Actions completo com boas práticas

```yaml
name: Terraform IaC

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Format Check
        run: terraform fmt -check -recursive

      - name: Terraform Plan
        run: terraform plan
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Recurso S3 simples (exemplo da aula)

```hcl
resource "aws_s3_bucket" "s3_test" {
  bucket = "test-pipeline"
}
```

## Fluxo de comandos: criar recurso via pipeline

```bash
# Criar o arquivo de recurso
cat > s3.tf << 'EOF'
resource "aws_s3_bucket" "s3_test" {
  bucket = "test-pipeline"
}
EOF

# Formatar antes de commitar
terraform fmt

# Verificar mudanças
git status

# Commit e push
git add s3.tf
git commit -m "feat: create s3 resource"
git push
```

## Fluxo de comandos: remover recurso via pipeline

```bash
# Deletar o arquivo do recurso
rm s3.tf

# Commit e push (fmt não necessário ao deletar)
git add .
git commit -m "chore: remove s3 resource"
git push
```

## Fluxo de correção quando fmt-check quebra

```bash
# Pipeline quebrou no fmt-check
# Corrigir localmente:
terraform fmt

# Ver o que mudou
git status
# OUTPUT: modified: main.tf (indentação corrigida)

# Commit da correção
git add .
git commit -m "fix: terraform fmt"
git push
```

## Condicional no apply (detalhe)

```yaml
# A condicional é colocada no step do apply
- name: Terraform Apply
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: terraform apply -auto-approve
```

Duas condições verificadas:
- `github.ref == 'refs/heads/main'` — só na branch main
- `github.event_name == 'push'` — só em evento push (não PR open, comment, etc.)

## Verificação do state remoto

Após apply local, verificar que o state no S3 foi atualizado:
- Acesse o bucket S3 no console AWS
- O arquivo `.tfstate` deve ter tamanho atualizado
- Rode `terraform plan` na pipeline — deve mostrar "No changes"