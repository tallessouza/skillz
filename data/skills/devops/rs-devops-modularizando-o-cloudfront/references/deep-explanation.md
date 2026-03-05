# Deep Explanation: Modularizando o CloudFront

## Por que modularizar o CloudFront separado do S3?

O instrutor destaca que o S3 é "bem simples, bem simples mesmo", mas o CloudFront "não é tão simples assim" — tem muitas opções de configuração. Separar em módulos permite:

1. **Isolamento de complexidade** — cada módulo encapsula sua própria complexidade
2. **Reuso independente** — o módulo S3 pode ser usado sem CloudFront e vice-versa
3. **Ordem de criação controlada** — `depends_on` garante que o S3 exista antes do CloudFront

## O fluxo de dados entre módulos

O conceito central é o **pipeline de dados entre módulos Terraform**:

```
S3 module (produtor)          Main.tf (orquestrador)         CloudFront module (consumidor)
─────────────────────         ─────────────────────          ────────────────────────────────
outputs.tf:                   module "cloudfront" {          variables.tf:
  bucket_id          ──────►    origin_id = module.s3.       variable "origin_id" {}
  bucket_domain_name ──────►      bucket_id                  variable "bucket_domain_name" {}
                                bucket_domain_name =         
                                  module.s3.                 main.tf:
                                  bucket_domain_name           var.origin_id
                              depends_on = [module.s3]         var.bucket_domain_name
                              }
```

O instrutor explica que existem duas formas de pegar informações de recursos:
1. **Data source** — consulta recursos existentes na AWS
2. **Referência direta ao recurso** — `aws_s3_bucket.bucket.id` (usado na aula por ser mais simples quando os recursos estão na mesma estrutura)

## O conceito de dependência (depends_on)

O instrutor enfatiza: "essa criação aqui do CloudFront ela só vai acontecer necessariamente depois de tudo que acontecer aqui, de tudo que rolar dentro do s3, do módulo do s3 terminando aqui, aí se inicia CloudFront."

Sem `depends_on`, o Terraform poderia tentar criar ambos em paralelo, resultando em erro porque o CloudFront precisa do bucket já existente para configurar a origin.

## Abordagem incremental (configuração mínima)

O instrutor segue uma filosofia de configuração mínima:
- Começa com `main.tf` + `variables.tf` apenas
- Não cria `outputs.tf` no CloudFront porque ninguém consome seus valores ainda
- Adiciona arquivos conforme necessidade: "conforme necessidade também nós criamos outros arquivos"

## Ciclo de validação

O fluxo de trabalho demonstrado:
1. `terraform init` — registrar novo módulo
2. `terraform plan` — ver erros (variáveis faltando)
3. Corrigir variáveis
4. `terraform plan` — validar novamente
5. `terraform apply -auto-approve` — criar recursos

O instrutor mostra que o plan é útil para descobrir erros incrementalmente: primeiro viu que origin_id não pode ser vazio, depois que as variáveis não estavam declaradas no módulo.

## Tempo de criação

O instrutor menciona que o CloudFront demora "pelo menos uns três minutos" para ser deployado, diferente do S3 que foi criado em 4 segundos. O Terraform aguarda o deploy completo antes de finalizar, porque "pode ser que dê algum erro ainda."

## Verificação no Console AWS

Após o apply, o instrutor verifica no console:
- S3: bucket "Skillz IAC Staging" criado
- CloudFront: distribuição sendo deployada, com Origin conectada ao bucket S3
- Origin Name e Origin Domain corretamente configurados
- Type identificado como S3