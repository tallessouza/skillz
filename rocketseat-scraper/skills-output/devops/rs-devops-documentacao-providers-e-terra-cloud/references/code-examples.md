# Code Examples: Documentacao, Providers e TerraCloud

## Provider Configuration — AWS

Configuracao basica de provider AWS conforme mostrado na documentacao:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
```

## Multiplos Providers

O instrutor mencionou que e possivel ter mais de um provider:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "azurerm" {
  features {}
}
```

## Resource — S3 Bucket

Exemplo de resource conforme a documentacao do provider AWS:

```hcl
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-application-bucket"

  tags = {
    Name        = "My Application Bucket"
    Environment = "production"
  }
}
```

Nota: a nomenclatura muda de `provider` para `resource`. O primeiro argumento (`"aws_s3_bucket"`) e o tipo do recurso. O segundo (`"my_bucket"`) e o alias usado no ciclo de vida do Terraform.

## Module — Security Group

Usando module pre-pronto do Registry:

```hcl
module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "5.0.0"

  name        = "my-app-sg"
  description = "Security group for my application"
  vpc_id      = module.vpc.vpc_id

  ingress_rules       = ["https-443-tcp", "http-80-tcp"]
  ingress_cidr_blocks = ["0.0.0.0/0"]

  egress_rules = ["all-all"]
}
```

## Module — EKS

Exemplo de module complexo com submódulos:

```hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.0.0"

  cluster_name    = "my-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    default = {
      min_size     = 1
      max_size     = 3
      desired_size = 2

      instance_types = ["t3.medium"]
    }
  }
}
```

## Fluxo completo: Provider → Resource → Module

```hcl
# 1. Provider — conexao com AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 2. Module — VPC completa (abstrai complexidade)
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "production-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
}

# 3. Resource — recurso especifico
resource "aws_s3_bucket" "app_assets" {
  bucket = "production-app-assets"

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
```