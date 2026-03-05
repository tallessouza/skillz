# Code Examples: Terraform Provider GCP

## Exemplo 1: Estrutura de pastas por provedor

```bash
# Criar repositorio separado para GCP
mkdir primeiro-projeto-iac-gcp
cd primeiro-projeto-iac-gcp

# Criar arquivos base
touch providers.tf main.tf
```

## Exemplo 2: providers.tf completo

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.17.0"
    }
  }
}

provider "google" {
  project = "skillz-438714"
  region  = "us-central1"
}
```

### Variacao: com zona no provider (recurso zonal fixo)

```hcl
provider "google" {
  project = "skillz-438714"
  region  = "us-central1"
  zone    = "us-central1-a"  # Todos os recursos serao zona A
}
```

## Exemplo 3: main.tf — Google Compute Instance

```hcl
resource "google_compute_instance" "vm" {
  name         = "skillz-vm"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
  }
}
```

## Exemplo 4: Inicializacao

```bash
# Apos configurar providers.tf e main.tf
terraform init

# Output esperado:
# Initializing provider plugins...
# - Finding hashicorp/google versions matching "5.17.0"...
# - Installing hashicorp/google v5.17.0...
# Terraform has been successfully initialized!
```

## Exemplo 5: Comparacao AWS vs GCP — provider block

```hcl
# AWS
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

# GCP
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.17.0"
    }
  }
}

provider "google" {
  project = "meu-projeto-id"  # GCP exige projeto
  region  = "us-central1"
}
```

## Exemplo 6: Variacao com variables (mencionado mas nao implementado na aula)

```hcl
# variables.tf
variable "project_id" {
  description = "ID do projeto GCP"
  type        = string
}

variable "region" {
  description = "Regiao GCP"
  type        = string
  default     = "us-central1"
}

variable "vm_name" {
  description = "Nome da VM"
  type        = string
  default     = "skillz-vm"
}

variable "machine_type" {
  description = "Tipo da maquina"
  type        = string
  default     = "e2-micro"
}
```

```hcl
# terraform.tfvars
project_id   = "skillz-438714"
region       = "us-central1"
vm_name      = "skillz-vm"
machine_type = "e2-micro"
```

```hcl
# providers.tf com variaveis
provider "google" {
  project = var.project_id
  region  = var.region
}
```

## Referencia: Terraform Registry

- Provider Google: `registry.terraform.io/providers/hashicorp/google`
- Documentacao: clicar em "Documentation" no registry
- Recurso Compute Instance: buscar "google_compute_instance" na documentacao
- Use Provider: botao "Use Provider" mostra o bloco required_providers