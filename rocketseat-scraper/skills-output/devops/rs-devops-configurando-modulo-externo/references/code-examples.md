# Code Examples: Módulos Externos do Terraform

## Exemplo principal da aula — SQS com DLQ

Bloco exato demonstrado pelo instrutor:

```hcl
module "sqs" {
  source  = "terraform-aws-modules/sqs/aws"

  name       = "my-queue"
  create_dlq = true

  # redrive_policy = {} # Opcional — política de retentativa

  tags = {
    iac = "true"
  }
}
```

### Campos explicados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `source` | string | Referência ao módulo no Terraform Registry (repositório Git) |
| `name` | string | Nome da fila SQS |
| `create_dlq` | bool | Cria Dead Letter Queue associada |
| `redrive_policy` | object | Política de retentativa (opcional) |
| `tags` | map | Tags de rastreabilidade |

## Comparação: Módulo local vs externo

### Módulo local (aulas anteriores)

```hcl
module "s3" {
  source = "./modules/s3"

  bucket_name = "my-bucket"
}

module "cloudfront" {
  source = "./modules/cloudfront"

  origin_domain = module.s3.bucket_domain
}
```

### Módulo externo (registry)

```hcl
module "sqs" {
  source  = "terraform-aws-modules/sqs/aws"
  version = "4.0.0"  # Boa prática: fixar versão

  name       = "order-processing-queue"
  create_dlq = true

  tags = {
    managed_by  = "iac"
    Environment = "production"
    Service     = "orders"
  }
}
```

## Variações de uso do módulo SQS

### Fila FIFO

```hcl
module "sqs_fifo" {
  source  = "terraform-aws-modules/sqs/aws"

  name       = "order-processing-queue.fifo"
  fifo_queue = true
  create_dlq = true

  tags = {
    managed_by = "iac"
  }
}
```

### Fila com KMS encryption

```hcl
module "sqs_encrypted" {
  source  = "terraform-aws-modules/sqs/aws"

  name                    = "sensitive-data-queue"
  kms_master_key_id       = aws_kms_key.sqs.id
  create_dlq              = true

  tags = {
    managed_by = "iac"
  }
}
```

### Fila com Redrive Policy explícita

```hcl
module "sqs_with_redrive" {
  source  = "terraform-aws-modules/sqs/aws"

  name       = "payment-queue"
  create_dlq = true

  redrive_policy = jsonencode({
    maxReceiveCount = 5  # Após 5 falhas, envia para DLQ
  })

  tags = {
    managed_by = "iac"
  }
}
```

## Fluxo completo: buscar e usar módulo do registry

```bash
# 1. Acesse registry.terraform.io
# 2. Clique em "Modules" (não "Browse Providers")
# 3. Busque o recurso desejado (ex: "SQS")
# 4. Filtre pelo provider (ex: AWS)
# 5. Copie o bloco de provision instructions
# 6. Cole no seu main.tf e ajuste variáveis
# 7. Execute:

terraform init    # Baixa o módulo do registry
terraform plan    # Visualiza recursos a serem criados
terraform apply   # Cria os recursos na AWS
```