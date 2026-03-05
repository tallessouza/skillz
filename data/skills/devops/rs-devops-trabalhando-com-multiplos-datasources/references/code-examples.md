# Code Examples: Trabalhando com Múltiplos Datasources

## Estrutura de arquivos completa

```
project/
├── main.tf                    # Declaração dos módulos
├── outputs.tf                 # Outputs do projeto (aparecem no console)
├── modules/
│   ├── cloudfront/
│   │   ├── main.tf            # Resource aws_cloudfront_distribution
│   │   ├── datasources.tf     # Data source do CloudFront
│   │   ├── outputs.tf         # Outputs do módulo CloudFront
│   │   └── variables.tf
│   └── s3/
│       ├── main.tf            # Resource aws_s3_bucket + website config
│       ├── datasources.tf     # Data source do S3
│       ├── outputs.tf         # Outputs do módulo S3
│       └── variables.tf
```

## Datasource CloudFront completo

```hcl
# modules/cloudfront/datasources.tf
data "aws_cloudfront_distribution" "cloudfront" {
  id = aws_cloudfront_distribution.cloudfront.id
}
```

O `id` é obtido dinamicamente do recurso `aws_cloudfront_distribution.cloudfront` que está definido no `main.tf` do mesmo módulo.

## Datasource S3 completo

```hcl
# modules/s3/datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket
}
```

O atributo `bucket` (nome do bucket) é pego diretamente do recurso criado.

## Outputs do módulo CloudFront

```hcl
# modules/cloudfront/outputs.tf
output "cdn_id" {
  value       = data.aws_cloudfront_distribution.cloudfront.id
  sensitive   = false
  description = "ID do CloudFront"
}

output "cdn_domain_name" {
  value       = data.aws_cloudfront_distribution.cloudfront.domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

Note o uso de `data.aws_cloudfront_distribution` — está pegando do **data source**, não do resource diretamente. Ambos funcionariam, mas usar o data source é consistente com o padrão.

## Outputs na raiz do projeto

```hcl
# outputs.tf (raiz)
output "s3_bucket_name" {
  value       = module.s3.bucket_domain_name
  sensitive   = false
  description = "Nome do bucket S3"
}

output "cdn_domain" {
  value       = module.cloudfront.cdn_domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

Estes outputs referenciam `module.<nome_modulo>.<output_do_modulo>`. São eles que aparecem no console ao executar `terraform plan` ou `terraform apply`.

## S3 com Website Configuration e depends_on

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }

  depends_on = [aws_s3_bucket.bucket]
}
```

### Pontos importantes:
- O alias `"bucket"` é usado tanto no `aws_s3_bucket` quanto no `aws_s3_bucket_website_configuration` — isso é válido porque são tipos de recurso diferentes
- O `depends_on` garante que o website config só roda após o bucket existir
- `index.html` e `error.html` são configurações — os arquivos não precisam existir no momento do `apply`
- O `bucket` é passado dinamicamente via `aws_s3_bucket.bucket.bucket`

## Saída do terraform plan

Após configurar outputs na raiz, o `terraform plan` mostra:

```
Changes to Outputs:
  + cdn_domain     = "d1234abcdef.cloudfront.net"
  + s3_bucket_name = "my-bucket.s3.amazonaws.com"
```

Sem outputs na raiz, mesmo com outputs no módulo, **nada aparece no console**.

## Verificando atributos disponíveis

Para descobrir quais atributos um recurso expõe (como `id`, `domain_name`, `bucket`):

1. **terraform.tfstate** — contém todos os atributos após `apply`
2. **Terraform Registry** — documentação oficial do provider lista todos os atributos exportados
3. **terraform state show** — `terraform state show aws_cloudfront_distribution.cloudfront`