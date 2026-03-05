# Code Examples: Modularizando o CloudFront

## Exemplo completo passo a passo

### 1. Estrutura de diretórios

```
.
├── main.tf                    # Orquestrador — declara módulos
└── modules/
    ├── s3/
    │   ├── main.tf            # Resource aws_s3_bucket
    │   ├── variables.tf       # Variáveis do S3
    │   └── outputs.tf         # Exporta bucket_id e bucket_domain_name
    └── cloudfront/
        ├── main.tf            # Resource aws_cloudfront_distribution
        └── variables.tf       # Recebe origin_id e bucket_domain_name
```

### 2. modules/s3/outputs.tf

```hcl
output "bucket_domain_name" {
  value       = aws_s3_bucket.bucket.bucket_domain_name
  description = "Domain name do bucket S3"
}

output "bucket_id" {
  value       = aws_s3_bucket.bucket.id
  description = "ID do bucket S3"
}
```

### 3. modules/cloudfront/variables.tf

```hcl
variable "origin_id" {
  type        = string
  description = "ID da origin S3"
}

variable "bucket_domain_name" {
  type        = string
  description = "Domínio do S3"
}
```

### 4. modules/cloudfront/main.tf

```hcl
resource "aws_cloudfront_distribution" "cloudfront" {
  enabled = true

  origin {
    origin_id   = var.origin_id
    domain_name = var.bucket_domain_name
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.origin_id
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### 5. main.tf (raiz)

```hcl
module "s3" {
  source = "./modules/s3"
}

module "cloudfront" {
  source             = "./modules/cloudfront"
  origin_id          = module.s3.bucket_id
  bucket_domain_name = module.s3.bucket_domain_name
  depends_on         = [module.s3]
}
```

### 6. Comandos de execução

```bash
# Inicializar (obrigatório ao adicionar novo módulo)
terraform init

# Validar plano de execução
terraform plan

# Aplicar (após validação)
terraform apply -auto-approve
```

## Erros comuns encontrados durante a aula

### Erro 1: Origin ID vazio

```
Error: origin_id cannot be empty
```

**Causa:** `origin_id` e `domain_name` estavam vazios no resource.
**Solução:** Declarar variables e passar valores via `var.origin_id`.

### Erro 2: Variáveis não declaradas no módulo

```
Error: Unsupported argument
  An argument named "origin_id" is not expected here.
```

**Causa:** Tentou passar variáveis no bloco `module` sem declará-las em `variables.tf` do módulo.
**Solução:** Criar as declarações `variable` correspondentes.

## Referência do recurso usado

Documentação oficial: [aws_cloudfront_distribution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution)

O instrutor navega até: Provider → AWS → Documentation → CloudFront → AWS CloudFront Distribution.