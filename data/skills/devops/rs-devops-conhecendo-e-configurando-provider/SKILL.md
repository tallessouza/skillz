---
name: rs-devops-tf-provider-gcp
description: "Applies Terraform GCP provider configuration patterns when writing infrastructure-as-code for Google Cloud Platform. Use when user asks to 'configure GCP provider', 'setup terraform for google cloud', 'create GCP resources', 'provision VM on GCP', or 'multi-cloud terraform'. Enforces project-based organization, separate repositories per provider, and correct provider block structure. Make sure to use this skill whenever generating Terraform code targeting GCP. Not for AWS, Azure, or application-level code."
---

# Terraform Provider — GCP

> Configurar o provider GCP no Terraform com repositorio separado por provedor, projeto vinculado por ID, e organizacao clara entre providers e recursos.

## Rules

1. **Repositorio separado por provedor** — crie um repositorio/pasta por cloud provider (`primeiro-projeto-iac-gcp/`, `primeiro-projeto-iac-azure/`), porque misturar provedores num unico repositorio dificulta modularizacao e gerenciamento mesmo o Terraform suportando multiplos providers
2. **Separe providers.tf de main.tf** — providers.tf configura o provedor, main.tf declara recursos, porque responsabilidade unica facilita manutencao a longo prazo
3. **Use o ID do projeto, nunca o nome** — o ID garante unicidade (`skillz-438714`), o nome pode ser duplicado
4. **Zona no recurso, nao no provider** — deixe o provider com region apenas e defina zone no recurso individual, porque isso da flexibilidade para recursos em zonas diferentes
5. **Sempre consulte o Terraform Registry** — versao do provider e estrutura do recurso mudam frequentemente, valide contra `registry.terraform.io/providers/hashicorp/google`

## How to write

### providers.tf

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
  project = "PROJECT_ID"   # ID do projeto, NAO o nome
  region  = "us-central1"
}
```

### main.tf — Compute Instance

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

## Example

**Before (anti-pattern — tudo misturado, zona no provider):**

```hcl
# main.tf com provider E recurso juntos
terraform {
  required_providers {
    google = { source = "hashicorp/google" }
    aws    = { source = "hashicorp/aws" }
  }
}

provider "google" {
  project = "Skillz"  # nome, nao ID
  region  = "us-central1"
  zone    = "us-central1-a"  # zona fixa no provider
}

resource "google_compute_instance" "vm" {
  name         = "vm"
  machine_type = "e2-micro"
}
```

**After (com esta skill aplicada):**

```hcl
# providers.tf (arquivo separado, repo dedicado ao GCP)
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.17.0"
    }
  }
}

provider "google" {
  project = "skillz-438714"  # ID unico
  region  = "us-central1"
}
```

```hcl
# main.tf (recursos separados)
resource "google_compute_instance" "vm" {
  name         = "skillz-vm"
  machine_type = "e2-micro"
  zone         = "us-central1-a"  # zona definida no recurso

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

## Heuristics

| Situacao | Faca |
|----------|------|
| Multiplos provedores cloud | Repositorio separado por provedor |
| Recurso precisa de zona especifica | Defina `zone` no recurso, nao no provider |
| Precisa do projeto GCP | Use o ID (string alfanumerica), nunca o nome legivel |
| Primeira configuracao | `providers.tf` + `main.tf` + `terraform init` |
| Multi-AZ necessario | Crie recursos em zonas diferentes (a, b, c) no mesmo region |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Um repo com AWS + GCP + Azure juntos | Um repo por provedor |
| `project = "Skillz"` (nome) | `project = "skillz-438714"` (ID) |
| Provider e recurso no mesmo arquivo | `providers.tf` separado de `main.tf` |
| Zona fixa no provider block | Zona declarada em cada recurso |
| Omitir `version` no required_providers | Sempre fixar versao do provider |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
