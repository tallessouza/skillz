# Code Examples: Terraform Data Sources

## Exemplo 1: Data source basico para S3 Bucket

Contexto: consultar um bucket S3 ja existente criado pelo proprio Terraform.

```hcl
# datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = "rocketseat-bucket-${terraform.workspace}"
}
```

### Atributos disponiveis apos consulta

```hcl
# Todos estes ficam disponiveis para uso:
data.aws_s3_bucket.bucket.arn
data.aws_s3_bucket.bucket.bucket_domain_name
data.aws_s3_bucket.bucket.bucket_regional_domain_name
data.aws_s3_bucket.bucket.region
data.aws_s3_bucket.bucket.id
data.aws_s3_bucket.bucket.hosted_zone_id
```

## Exemplo 2: Usando atributos do data source em outro resource

```hcl
# datasources.tf
data "aws_s3_bucket" "assets" {
  bucket = "myapp-assets-${terraform.workspace}"
}

# main.tf
resource "aws_s3_bucket_policy" "assets_policy" {
  bucket = data.aws_s3_bucket.assets.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${data.aws_s3_bucket.assets.arn}/*"
      }
    ]
  })
}
```

## Exemplo 3: Data source com output

```hcl
# datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = "rocketseat-bucket-${terraform.workspace}"
}

# outputs.tf
output "bucket_domain_name" {
  value = data.aws_s3_bucket.bucket.bucket_domain_name
}

output "bucket_arn" {
  value = data.aws_s3_bucket.bucket.arn
}
```

## Exemplo 4: Multiplos data sources do mesmo tipo

```hcl
# datasources.tf
data "aws_s3_bucket" "assets" {
  bucket = "myapp-assets-${terraform.workspace}"
}

data "aws_s3_bucket" "logs" {
  bucket = "myapp-logs-${terraform.workspace}"
}

data "aws_s3_bucket" "backups" {
  bucket = "myapp-backups-${terraform.workspace}"
}
```

## Exemplo 5: Data sources de outros tipos de recurso

```hcl
# Consultar VPC existente
data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["main-vpc"]
  }
}

# Consultar AMI mais recente
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Usar em um EC2
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  subnet_id     = data.aws_vpc.main.id
}
```

## Exemplo 6: Resource existente no mesmo projeto vs Data source

```hcl
# Se o bucket foi criado NO MESMO projeto Terraform:
resource "aws_s3_bucket" "assets" {
  bucket = "myapp-assets-${terraform.workspace}"
}

# Pode referenciar diretamente (sem data source):
resource "aws_s3_bucket_policy" "policy" {
  bucket = aws_s3_bucket.assets.id  # referencia direta
}

# Data source so e NECESSARIO quando:
# 1. O recurso foi criado FORA deste projeto Terraform
# 2. O recurso foi criado por outro workspace/state
# 3. Voce quer consultar recurso de outro provider
```