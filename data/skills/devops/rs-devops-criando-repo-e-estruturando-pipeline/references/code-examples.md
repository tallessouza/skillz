# Code Examples: Pipeline CI/CD para Infraestrutura Terraform

## 1. Gitignore completo para Terraform

```gitignore
# Terraform state files
*.tfstate
*.tfstate.backup

# Terraform variables (equivalente ao .env)
*.tfvars

# Terraform internal directory
.terraform/

# Terraform lock file
.terraform.lock.hcl
```

## 2. Pipeline completa (ci.yaml)

```yaml
name: ci

on:
  push:
    branches:
      - main

jobs:
  run-terraform:
    name: Run Terraform
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: us-east-2
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.8.4

      - name: Run Terraform Init
        run: terraform init

      - name: Run Terraform Format
        run: terraform fmt -check

      - name: Run Terraform Plan
        run: terraform plan

      - name: Run Terraform Apply
        run: terraform apply -auto-approve
```

## 3. Variacao: com variaveis Terraform

```yaml
      - name: Run Terraform Plan
        run: terraform plan
        env:
          TF_VAR_db_password: ${{ secrets.DB_PASSWORD }}
          TF_VAR_api_key: ${{ secrets.API_KEY }}

      - name: Run Terraform Apply
        run: terraform apply -auto-approve
        env:
          TF_VAR_db_password: ${{ secrets.DB_PASSWORD }}
          TF_VAR_api_key: ${{ secrets.API_KEY }}
```

## 4. Comandos git para setup inicial

```bash
# Inicializar repositorio
git init

# Verificar o que sera enviado
git status

# Commit inicial
git add .
git commit -m "first commit"

# Configurar branch e remote
git branch -M main
git remote add origin git@github.com:user/repo.git
git push -u origin main

# Apos criar pipeline
git add .
git commit -m "configure terraform pipeline"
git push
```

## 5. Estrutura de pastas do projeto

```
projeto-iac/
├── .github/
│   └── workflows/
│       └── ci.yaml          # Pipeline CI/CD
├── .gitignore               # Exclui tfstate, tfvars, .terraform
├── main.tf                  # Configuracao principal
├── variables.tf             # Definicao de variaveis (se houver)
└── outputs.tf               # Outputs (se houver)
```