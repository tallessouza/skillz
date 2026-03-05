# Code Examples: Deletando Recursos no Terraform

## Exemplo 1: Plan de destroy completo (sem target)

```bash
# Mostra TUDO que seria deletado no modulo
terraform plan -destroy
```

Saida esperada: lista de TODOS os recursos gerenciados, marcados para destruicao.

**Quando usar:** Apenas para verificacao em ambientes de desenvolvimento/staging. Nunca execute o destroy correspondente em producao sem revisar cada recurso.

## Exemplo 2: Plan de destroy escopado

```bash
# Mostra apenas o que seria deletado para o recurso especifico
terraform plan -destroy --target module.s3.aws_s3_bucket.bucket
```

Saida da aula:
```
Plan: 0 to add, 0 to change, 3 to destroy.
# - module.s3.aws_s3_bucket.bucket (o bucket em si)
# - aws_cloudfront_distribution (dependencia - origem aponta para o bucket)
# - aws_s3_bucket_website_configuration (dependencia)
```

**Observacao:** O target foi 1 recurso, mas 3 serao deletados por causa de dependencias transitivas.

## Exemplo 3: Executando o destroy escopado

```bash
# Opcao 1: terraform destroy com target
terraform destroy --target module.s3.aws_s3_bucket.bucket

# Opcao 2: terraform apply -destroy com target
terraform apply -destroy --target module.s3.aws_s3_bucket.bucket
```

Ambos sao equivalentes. A escolha e preferencia pessoal.

## Exemplo 4: Protecao de recurso critico

```hcl
# No arquivo de configuracao do recurso que guarda o tfstate
resource "aws_s3_bucket" "terraform_state" {
  bucket = "minha-empresa-terraform-state"

  lifecycle {
    prevent_destroy = true
  }
}
```

Com isso, qualquer tentativa de destruir esse recurso (seja por `destroy` direto ou por `--target`) resultara em erro do Terraform, protegendo o estado.

## Exemplo 5: Multiplos targets

```bash
# Deletar dois recursos especificos
terraform destroy \
  --target module.s3.aws_s3_bucket.bucket \
  --target module.vpc.aws_subnet.private
```

## Exemplo 6: Sintaxe de endereco para diferentes niveis

```bash
# Recurso na raiz (sem modulo)
terraform destroy --target aws_instance.web_server

# Recurso dentro de modulo
terraform destroy --target module.networking.aws_vpc.main

# Recurso dentro de modulo aninhado
terraform destroy --target module.app.module.database.aws_rds_instance.primary
```

## Fluxo completo recomendado

```bash
# 1. Planejar
terraform plan -destroy --target module.s3.aws_s3_bucket.bucket

# 2. Revisar a saida — quantos recursos serao afetados?
#    Se mais do que o esperado, investigar dependencias

# 3. Executar (mesmo target, copiado do passo 1)
terraform destroy --target module.s3.aws_s3_bucket.bucket

# 4. Verificar estado
terraform state list | grep s3
# Deve retornar vazio se a delecao foi bem-sucedida
```