# Code Examples: Criando Primeiro Recurso GCP com Terraform

## Exemplo completo do provider + recurso

```hcl
# providers.tf
provider "google" {
  project = "craft-stock"
  region  = "us-central1"
}

# main.tf
resource "google_compute_instance" "skillz_vm" {
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

## Comandos executados na aula (em ordem)

```bash
# 1. Planificar (verificar sintaxe e operacoes)
terraform plan

# 2. Aplicar (criar recursos de fato)
terraform apply -auto-approve
# Resultado: Erro 403 Service Disabled (API nao ativada)

# 3. [No GCP Console] Ativar Compute Engine API (~2 min)

# 4. Autenticar via gcloud
gcloud auth application-default login
# Abre browser → login SSO → gera tokens JSON

# 5. Aplicar novamente (agora com API ativa + auth)
terraform apply -auto-approve
# Resultado: Recurso criado em ~42 segundos

# 6. Verificar no console GCP (F5 na pagina de instancias)

# 7. Planejar destruicao
terraform plan -destroy

# 8. Destruir recursos
terraform apply -destroy
```

## Fluxo de erros e resolucao

### Erro 1: API nao ativada

```
Error: googleapi: Error 403: ..., serviceDisabled
Reason: SERVICE_DISABLED
```

**Resolucao:**
```
GCP Console → Buscar servico → Ativar API → Aguardar ~2 min
```

### Erro 2: Token invalido / nao autenticado

```
Error: googleapi: Error 403: Request had insufficient authentication scopes.
```

**Resolucao:**
```bash
gcloud auth application-default login
```

## Variacao: Zone no provider vs. no recurso

```hcl
# Opcao 1: Zone no recurso (mais explicito)
resource "google_compute_instance" "vm" {
  zone = "us-central1-a"
  # ...
}

# Opcao 2: Zone no provider (aplica a todos)
provider "google" {
  project = "craft-stock"
  region  = "us-central1"
  zone    = "us-central1-a"
}

resource "google_compute_instance" "vm" {
  # zone herdada do provider
  # ...
}
```

## Verificando o state gerado

```bash
# Apos apply, o state local e criado:
cat terraform.tfstate

# Contem: boot_disk, network_interface, atributos computados
# Pode ser usado para configurar outputs:
```

```hcl
output "instance_ip" {
  value = google_compute_instance.skillz_vm.network_interface[0].network_ip
}
```