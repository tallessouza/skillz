# Code Examples: Configurando Back-end do Terraform com S3

## Exemplo completo da aula

### Arquivo terraform com backend S3

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "skillz-iac"
    key    = "state/terraform.tfstate"
    region = "us-east-2"
  }
}

provider "aws" {
  region = "us-east-2"
}
```

### Estrutura resultante no S3

```
skillz-iac/          # bucket
└── state/               # diretorio criado pelo key
    └── terraform.tfstate # arquivo de estado
```

## Migracao local → S3

### Comando e output esperado

```bash
$ terraform init

Initializing the backend...
Backend configuration changed!

Terraform has detected that the configuration specified for the backend
has changed. Terraform will now check for existing state in the backends.

Do you want to copy existing state to the new backend?
  Pre-existing state was found while migrating the previous "local" backend
  to the newly configured "s3" backend. No existing state was found in the
  newly configured "s3" backend. Do you want to copy this state to the new
  "s3" backend? Enter "yes" to copy and "no" to start with an empty state.

  Enter a value: yes

Successfully configured the backend "s3"! Terraform will automatically
use this backend unless the backend configuration changes.
```

## IAM Policy — Statement adicional para S3

### No contexto de IAM role para pipeline (tfrole)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TerraformEC2",
      "Effect": "Allow",
      "Action": [
        "ec2:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "TerraformS3State",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::skillz-iac",
        "arn:aws:s3:::skillz-iac/*"
      ]
    }
  ]
}
```

## Variacoes comuns

### Multiplos ambientes no mesmo bucket

```hcl
# dev
backend "s3" {
  bucket = "empresa-terraform-state"
  key    = "dev/terraform.tfstate"
  region = "us-east-2"
}

# staging
backend "s3" {
  bucket = "empresa-terraform-state"
  key    = "staging/terraform.tfstate"
  region = "us-east-2"
}

# production
backend "s3" {
  bucket = "empresa-terraform-state"
  key    = "production/terraform.tfstate"
  region = "us-east-2"
}
```

### Com DynamoDB locking (evolucao natural)

```hcl
backend "s3" {
  bucket         = "skillz-iac"
  key            = "state/terraform.tfstate"
  region         = "us-east-2"
  dynamodb_table = "terraform-locks"
  encrypt        = true
}
```

### Backend partial configuration (para CI/CD flexivel)

```hcl
# main.tf — sem valores hardcoded
backend "s3" {}
```

```bash
# No pipeline, passa valores via CLI
terraform init \
  -backend-config="bucket=skillz-iac" \
  -backend-config="key=state/terraform.tfstate" \
  -backend-config="region=us-east-2"
```