# Code Examples: Criando Recursos com Modulos Externos

## Exemplo 1: Modulo SQS completo da aula

```hcl
module "sqs" {
  source  = "terraform-aws-modules/sqs/aws"

  name       = "RocketseatSQS"
  create_dlq = true

  tags = {
    Environment = "production"
  }
}
```

Resultado do `terraform plan`: **4 recursos detectados**
1. `aws_sqs_queue` (DLQ) — `RocketseatSQS-dlq`
2. `aws_sqs_queue` (fila principal) — `RocketseatSQS`
3. `aws_sqs_queue_redrive_allow_policy` (permissao)
4. `aws_sqs_queue_redrive_policy` (politica)

## Exemplo 2: Workflow completo de terminal

```bash
# Apos adicionar o modulo no .tf
terraform init
# => Downloading terraform-aws-modules/sqs/aws...
# => Terraform has been successfully initialized!

terraform plan
# => Plan: 4 to add, 0 to change, 0 to destroy.

terraform apply -auto-approve
# => aws_sqs_queue.dlq: Creating...
# => aws_sqs_queue.this: Creating...
# => aws_sqs_queue_redrive_allow_policy.this: Creating...
# => aws_sqs_queue_redrive_policy.this: Creating...
# => Apply complete! Resources: 4 added, 0 changed, 0 destroyed.
```

## Exemplo 3: Equivalente sem modulo (recursos raw)

```hcl
# 1. DLQ (criada primeiro)
resource "aws_sqs_queue" "dlq" {
  name = "RocketseatSQS-dlq"
}

# 2. Fila principal (referencia a DLQ)
resource "aws_sqs_queue" "main" {
  name       = "RocketseatSQS"
  fifo_queue = false

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })
}

# 3. Permissao de redrive
resource "aws_sqs_queue_redrive_allow_policy" "dlq_allow" {
  queue_url = aws_sqs_queue.dlq.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue"
    sourceQueueArns   = [aws_sqs_queue.main.arn]
  })
}
```

## Exemplo 4: Remocao de recursos

```bash
# Apos remover o bloco module {} do arquivo .tf
terraform init
terraform plan
# => Plan: 0 to add, 0 to change, 4 to destroy.

terraform apply -auto-approve
# => Destroying... aws_sqs_queue_redrive_policy
# => Destroying... aws_sqs_queue_redrive_allow_policy
# => Destroying... aws_sqs_queue (main)
# => Destroying... aws_sqs_queue (dlq)
# => Destroy complete! Resources: 4 destroyed.
```

## Exemplo 5: Modulo com output (mencionado mas nao implementado na aula)

```hcl
module "sqs" {
  source     = "terraform-aws-modules/sqs/aws"
  name       = "RocketseatSQS"
  create_dlq = true
}

output "queue_url" {
  value = module.sqs.queue_url
}

output "dlq_url" {
  value = module.sqs.dead_letter_queue_url
}
```

## Exemplo 6: Modulo com FIFO (variacao)

```hcl
module "sqs_fifo" {
  source     = "terraform-aws-modules/sqs/aws"
  name       = "RocketseatSQS.fifo"
  fifo_queue = true
  create_dlq = true
}
```