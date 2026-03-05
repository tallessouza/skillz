# Code Examples: Terraform State

## Exemplo 1: Recurso basico que gera estado

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "s3_bucket" {
  bucket = "rocketc-bucket-ac"
}
```

Apos `terraform apply`, o estado gerado contem:

```json
{
  "version": 4,
  "serial": 1,
  "resources": [
    {
      "mode": "managed",
      "type": "aws_s3_bucket",
      "name": "s3_bucket",
      "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
      "instances": [
        {
          "attributes": {
            "bucket": "rocketc-bucket-ac",
            "bucket_domain_name": "rocketc-bucket-ac.s3.amazonaws.com",
            "tags": {}
          }
        }
      ]
    }
  ]
}
```

Note que `bucket_domain_name` nao foi declarado no codigo — foi gerado pelo provedor e armazenado no estado para referencia futura.

## Exemplo 2: Drift detection — tag adicionada pelo console

Estado antes (sem tags):
```json
"tags": {}
```

Alguem adiciona `test=true` pelo console AWS.

```bash
$ terraform plan
# Refreshing state...
# aws_s3_bucket.s3_bucket: Refreshing state...

# aws_s3_bucket.s3_bucket will be updated in-place
~ resource "aws_s3_bucket" "s3_bucket" {
    ~ tags = {
        - "test" = "true" -> null
      }
  }

# Plan: 0 to add, 1 to change, 0 to destroy.
```

```bash
$ terraform apply -auto-approve
# Aplica a remocao da tag — reconcilia com o codigo
```

## Exemplo 3: Adicionando tag via codigo (forma correta)

```hcl
resource "aws_s3_bucket" "s3_bucket" {
  bucket = "rocketc-bucket-ac"

  tags = {
    test = "pro"
  }
}
```

```bash
$ terraform plan
# aws_s3_bucket.s3_bucket will be updated in-place
~ resource "aws_s3_bucket" "s3_bucket" {
    ~ tags = {
        + "test" = "pro"
      }
  }

# Plan: 0 to add, 1 to change, 0 to destroy.
```

```bash
$ terraform apply -auto-approve
# Adiciona a tag na infra E atualiza o estado
```

Apos apply, o estado reflete:
```json
"tags": {
  "test": "pro"
}
```

## Exemplo 4: Drift reverso — tag removida pelo console

Apos o Exemplo 3, alguem remove a tag `test` pelo console.

```bash
$ terraform plan
# aws_s3_bucket.s3_bucket will be updated in-place
~ resource "aws_s3_bucket" "s3_bucket" {
    ~ tags = {
        + "test" = "pro"
      }
  }
```

O Terraform detecta que a tag deveria existir (esta no codigo) e propoe readiciona-la.

## Exemplo 5: .gitignore correto para Terraform

```gitignore
# Terraform state (NUNCA comitar)
*.tfstate
*.tfstate.backup
*.tfstate.*.backup

# Diretorio de trabalho
.terraform/

# Variaveis sensiveis
*.tfvars
!example.tfvars
```

## Exemplo 6: Comandos essenciais de estado

```bash
# Ver estado atual formatado
terraform show

# Listar recursos no estado
terraform state list

# Ver detalhes de um recurso especifico
terraform state show aws_s3_bucket.s3_bucket

# Remover recurso do estado (sem destruir na infra)
terraform state rm aws_s3_bucket.s3_bucket

# Importar recurso existente para o estado
terraform import aws_s3_bucket.s3_bucket rocketc-bucket-ac

# Forcar refresh do estado contra a infra real
terraform refresh
```