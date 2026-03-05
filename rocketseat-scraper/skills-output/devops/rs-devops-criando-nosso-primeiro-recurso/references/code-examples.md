# Code Examples: Ciclo de Vida de Recursos Terraform na AWS

## Exemplo 1: Recurso minimo (bucket S3)

O bucket S3 tem apenas um campo obrigatorio: `bucket` (o nome).

```hcl
resource "aws_s3_bucket" "s3_bucket" {
  bucket = "rocketseat-bucket-iac"
}
```

Nota: `"aws_s3_bucket"` e o tipo do recurso (vem da documentacao do provider AWS). `"s3_bucket"` e o alias — um apelido interno do Terraform para referenciar esse recurso no projeto.

## Exemplo 2: Recurso com tags (boa pratica)

```hcl
resource "aws_s3_bucket" "s3_bucket" {
  bucket = "rocketseat-bucket-iac"

  tags = {
    Name = "primeiro-bucket"
    iac  = "true"
  }
}
```

As tags sao um mapa chave-valor. `iac = "true"` indica que o recurso e gerenciado por Infrastructure as Code.

## Exemplo 3: Provider com regiao explicita

```hcl
# providers.tf
provider "aws" {
  region  = "us-east-2"
  profile = "meu-sso-profile"
}
```

Se a regiao ja esta no SSO/variaveis de ambiente, nao precisa declarar `region` aqui. Mas se quiser sobrescrever, e neste bloco que se faz.

## Fluxo completo de comandos

### Criacao
```bash
# 1. Validar estrutura
terraform validate
# Success! The configuration is valid.

# 2. Planificar
terraform plan
# aws_s3_bucket.s3_bucket will be created
# Plan: 1 to add, 0 to change, 0 to destroy.

# 3. Aplicar
terraform apply
# Enter a value: yes
# aws_s3_bucket.s3_bucket: Creating...
# aws_s3_bucket.s3_bucket: Creation complete after 5s
# Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

### Edicao (adicionar tags)
```bash
terraform plan
# aws_s3_bucket.s3_bucket will be updated in-place
# + tags = { "Name" = "primeiro-bucket", "iac" = "true" }
# Plan: 0 to add, 1 to change, 0 to destroy.

terraform apply --auto-approve
# Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

### Destruicao
```bash
# Planificar destruicao
terraform plan --destroy
# aws_s3_bucket.s3_bucket will be destroyed
# Plan: 0 to add, 0 to change, 1 to destroy.

# Duas formas de destruir:
terraform destroy
# ou
terraform apply --destroy
```

### Recriacao apos destroy
```bash
terraform plan
# aws_s3_bucket.s3_bucket will be created (detecta que nao existe mais)
# Plan: 1 to add, 0 to change, 0 to destroy.

terraform apply --auto-approve
# Recria com todas as tags definidas no HCL
```

## Estrutura de arquivos do projeto

```
primeiro-projeto-iac/
├── providers.tf    # Configuracao do provider AWS
└── main.tf         # Recursos (bucket S3, etc.)
```

## Autenticacao SSO (contexto)

```bash
# Primeira vez ou reconfiguracao:
aws configure sso

# Uso diario (sessao ja configurada):
aws sso login
```