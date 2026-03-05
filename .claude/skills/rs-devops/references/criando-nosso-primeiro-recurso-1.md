---
name: rs-devops-criando-primeiro-recurso-gcp
description: "Applies Terraform workflow for creating first GCP resources, including API activation and gcloud authentication. Use when user asks to 'create GCP instance with Terraform', 'deploy to Google Cloud', 'terraform apply GCP', 'fix GCP 403 error', or 'enable GCP API'. Covers plan/apply cycle, service activation, gcloud auth, and destroy cleanup. Make sure to use this skill whenever provisioning GCP infrastructure with Terraform. Not for AWS, Azure, or non-Terraform GCP provisioning."
---

# Criando Primeiro Recurso GCP com Terraform

> Antes de criar qualquer recurso GCP com Terraform, ative a API do servico e autentique via gcloud CLI.

## Rules

1. **Sempre ative a API do servico antes de provisionar** — `Compute Engine API`, `Kubernetes Engine API`, etc., porque o GCP retorna `403 Service Disabled` se a API nao estiver ativa
2. **Autentique com gcloud antes do apply** — `gcloud auth application-default login` gera o JSON de tokens, porque sem isso o Terraform recebe `403 Forbidden` por token invalido
3. **Sempre rode plan antes de apply** — `terraform plan` valida sintaxe e mostra operacoes sem executar, porque erros de configuracao sao mais baratos de corrigir antes do apply
4. **Zone e obrigatoria para instancias** — defina no recurso ou no provider, porque sem ela o recurso nao sera criado
5. **Destrua recursos de teste imediatamente** — `terraform apply -destroy` apos validar, porque recursos GCP geram custo mesmo ociosos
6. **Delete recursos antes de desativar APIs** — nao e possivel desabilitar uma API com recursos ativos nela

## Workflow

### Step 1: Ativar API do servico no GCP Console

```
GCP Console → Buscar "Compute Engine" → Clicar no servico → Ativar API
```

Demora ~2 minutos. Necessario ter faturamento configurado (free tier aceito).

### Step 2: Autenticar via gcloud CLI

```bash
# Instalar gcloud CLI (seguir docs oficiais para seu OS)
# Depois, gerar tokens de autenticacao:
gcloud auth application-default login
```

Abre o browser para login SSO Google. Gera JSON com tokens no disco local.

### Step 3: Terraform Plan

```bash
terraform plan
```

Valida sintaxe, mostra operacoes planejadas (create/update/destroy). Nao modifica estado.

### Step 4: Terraform Apply

```bash
terraform apply -auto-approve
```

Cria os recursos de fato. Gera/atualiza o state local (`terraform.tfstate`).

### Step 5: Cleanup (recursos de teste)

```bash
terraform plan -destroy   # visualizar o que sera destruido
terraform apply -destroy  # destruir recursos
```

## Error handling

| Erro | Causa | Solucao |
|------|-------|---------|
| `403 Service Disabled` | API do servico nao ativada | Ativar API no GCP Console |
| `403 Forbidden` (token) | gcloud nao autenticado | `gcloud auth application-default login` |
| Zone obrigatoria ausente | Nem recurso nem provider definem zone | Adicionar `zone` no recurso ou no bloco provider |

## Example

**Recurso basico GCP Compute Engine:**

```hcl
provider "google" {
  project = "craft-stock"
  region  = "us-central1"
}

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

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro recurso de um servico GCP | Ative a API antes de tudo |
| Erro 403 no apply | Verifique: API ativa? gcloud autenticado? |
| Recurso criado para teste | Destrua imediatamente com `terraform apply -destroy` |
| Precisa de outputs do recurso | Configure `output` blocks — estrutura identica a AWS/Azure |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-criando-nosso-primeiro-recurso-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-criando-nosso-primeiro-recurso-1/references/code-examples.md)
