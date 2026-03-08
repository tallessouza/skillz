---
name: rs-devops-terraform-cdk-e-hcl
description: "Applies Terraform tool selection between HCL and CDK, and introduces the Terraform ecosystem including Registry and providers. Use when user asks to 'choose between CDK and HCL', 'start with Terraform', 'find a Terraform provider', 'understand HCL syntax', or 'compare IaC tools'. Enforces learning HCL first, consulting Terraform Registry, and understanding state concepts before creating resources. Make sure to use this skill whenever evaluating IaC tool choices or bootstrapping a new Terraform project. Not for specific resource creation, state management, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-fundamentals
  tags: [terraform, hcl, cdk, iac, hashicorp, terraform-registry, providers, infrastructure-as-code]
---

# Terraform — CDK vs HCL

> Ao escrever Terraform, use HCL como padrao para entender o que acontece por debaixo dos panos; CDK e uma camada de abstracao que transpila para HCL.

## Key concepts

Terraform e uma ferramenta open source da HashiCorp para automacao de infraestrutura. Diferente do Pulumi (que usa linguagens de programacao nativamente) e do CloudFormation (AWS-only), o Terraform:

1. **Suporta multiplos providers** — AWS, GCP, Azure, Kubernetes, Helm, Digital Ocean, Oracle, Alibaba e centenas mais
2. **Usa HCL por padrao** — HashiCorp Configuration Language, arquivos `.tf`, estrutura similar a JSON mas declarativa
3. **Oferece CDK como opcao** — TypeScript, Python, Java, C#, Go — mas o CDK transpila para HCL antes de executar

## Decision Framework

| Situacao | Escolha | Razao |
|----------|---------|-------|
| Aprendendo Terraform | HCL puro | Entender o que acontece por debaixo dos panos |
| Time ja domina TypeScript/Python e quer produtividade | CDK for Terraform | Aproveita tipagem e IDE support |
| Projeto simples, poucos recursos | HCL puro | Menos overhead, sem build step |
| Projeto complexo com logica condicional pesada | CDK | Loops e condicionais nativos da linguagem |
| Precisa ler/debugar state e plans | HCL puro | CDK adiciona camada de indirection |

## How to Write

### Provider Configuration (HCL)

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
  region = "us-east-1"
}
```

### Terraform Registry

O Terraform Registry (`registry.terraform.io`) funciona como um "Docker Hub para infraestrutura" — contem providers, modules e templates prontos. Sempre consulte o registry antes de escrever um module do zero.

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto Terraform | Comece com HCL puro, migre para CDK se necessario |
| Precisa de um provider | Consulte `registry.terraform.io` primeiro |
| Escrevendo module reutilizavel | HCL — maior compatibilidade no ecossistema |
| CDK gerando HCL estranho | Leia o HCL gerado para debugar, nao o codigo CDK |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Iniciar com CDK sem conhecer HCL | Aprenda HCL primeiro, porque CDK transpila para ele |
| Ignorar o Terraform Registry | Consulte modules existentes antes de criar do zero |
| Misturar CDK e HCL puro no mesmo projeto | Escolha uma abordagem e mantenha consistencia |
| Escrever Terraform sem entender state | Estude o conceito de state antes de criar recursos |

## Verification

- `terraform version` — confirma instalacao
- `terraform init` — inicializa providers e backend
- `terraform plan` — preview antes de aplicar (nunca pule)
- `terraform validate` — valida sintaxe HCL


## Troubleshooting

### terraform init falha com provider nao encontrado
**Symptom:** Erro "Failed to query available provider packages" ou "Could not retrieve the list of available versions"
**Cause:** Nome do provider incorreto no bloco `required_providers` ou sem acesso ao Terraform Registry
**Fix:** Consulte `registry.terraform.io` para confirmar o source correto do provider (ex: `hashicorp/aws`)

### CDK gera HCL inesperado
**Symptom:** Recursos criados pelo CDK nao correspondem ao esperado
**Cause:** Camada de abstracao do CDK adiciona indirection que dificulta debug
**Fix:** Leia o HCL gerado pelo CDK (nao o codigo TypeScript/Python) para entender o que sera realmente executado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Terraform — CDK vs HCL

## Contexto no Ecossistema HashiCorp

O Terraform nao existe isolado. A HashiCorp e pioneira em ferramentas de automacao:

- **Consul** — Service Discovery
- **Vault** — Gerenciamento de segredos
- **Nomad** — Orquestrador de containers (concorrente do Kubernetes)
- **Terraform** — Infrastructure as Code

Essa suite integrada significa que o Terraform se beneficia de integracao nativa com outras ferramentas HashiCorp.

## HCL: A Linguagem Nativa

HCL (HashiCorp Configuration Language) e a linguagem padrao do Terraform. Pontos importantes:

1. **Nao e JSON** — mas lembra JSON visualmente. A estrutura e declarativa com blocos nomeados
2. **Arquivos `.tf`** — todo codigo Terraform puro vive em arquivos com essa extensao
3. **Declarativo** — voce descreve O QUE quer, nao COMO criar. O Terraform resolve a ordem e dependencias

O instrutor enfatiza que a complexidade do Terraform nao esta nos comandos (que sao simples), mas na **escrita do arquivo declarativo**. Ou seja: `terraform apply` e facil; o dificil e escrever o `.tf` correto.

## CDK for Terraform: A Camada de Abstracao

O CDK (Cloud Development Kit) for Terraform permite escrever infraestrutura em linguagens de programacao:

- TypeScript, Python, Java, C#, Go

**Como funciona:** Voce escreve codigo na sua linguagem → CDK **transpila** para HCL → Terraform executa o HCL.

Isso significa que, independente de usar CDK, o HCL e sempre o que roda por baixo. Por isso o instrutor escolhe ensinar HCL puro: para entender o que acontece de verdade.

## Terraform Registry: O "Docker Hub da Infra"

O instrutor faz uma analogia direta: assim como o Docker Hub e um container registry, o Terraform Registry (`registry.terraform.io`) e um "infra registry" com:

- **Providers** — plugins para cada cloud/servico (AWS, GCP, Kubernetes, etc.)
- **Modules** — templates e solucoes semi-prontas reutilizaveis

A amplitude de providers e um diferencial: AWS, Alibaba, Oracle OCI, Kubernetes, Helm, Digital Ocean, e centenas mais. Isso torna o Terraform verdadeiramente multi-cloud, diferente do CloudFormation (AWS-only).

## Comparacao com Outras Ferramentas IaC

| Aspecto | CloudFormation | Pulumi | Terraform |
|---------|---------------|--------|-----------|
| Vendor lock-in | AWS only | Multi-cloud | Multi-cloud |
| Linguagem | YAML/JSON ou CDK | Linguagens nativas | HCL (ou CDK) |
| CDK nativo? | Sim | Sim (e o padrao) | Nao (HCL e padrao) |
| Registry | Nao tem equivalente | Nao tem equivalente | Terraform Registry |
| Mantido por | AWS | Pulumi Inc | HashiCorp + comunidade |

## Carga Cognitiva

O instrutor alerta que Terraform e "bem completo, porem tambem tem uma carga cognitiva". Os conceitos que adicionam complexidade:

1. **State** — o estado da infraestrutura (arquivo `terraform.tfstate`)
2. **Providers** — configuracao de cada cloud
3. **Modules** — reutilizacao e composicao
4. **Workspaces** — ambientes isolados
5. **Estrutura de arquivos** — organizacao dos `.tf`

Cada um desses sera aprofundado em aulas subsequentes.

## Instalacao

Terraform e uma CLI. Instalacao por plataforma:

- **macOS:** `brew install terraform` (via Homebrew)
- **Windows:** download do binario
- **Linux:** package manager ou binario

Verificacao: `terraform version` (instrutor mostra v1.7.x)

---

# Code Examples: Terraform — CDK vs HCL

## Exemplo 1: Provider AWS em HCL (do Terraform Registry)

O instrutor mostra a configuracao basica ao clicar no provider AWS no registry:

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
  region = "us-east-1"
}
```

**Anatomia:**
- `terraform {}` — bloco de configuracao do Terraform em si
- `required_providers` — declara quais providers o projeto usa
- `source` — endereco no registry (`hashicorp/aws`)
- `version` — constraint de versao (boa pratica: sempre fixar)
- `provider "aws" {}` — configuracao especifica do provider

## Exemplo 2: CDK for Terraform (TypeScript)

Equivalente ao HCL acima, usando CDK:

```typescript
import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "aws", {
      region: "us-east-1",
    });
  }
}

const app = new App();
new MyStack(app, "my-stack");
app.synth();
```

**Nota:** Este codigo TypeScript sera **transpilado** para HCL equivalente antes de ser executado pelo Terraform. O HCL gerado e o que realmente importa.

## Exemplo 3: Comandos CLI Basicos

```bash
# Verificar instalacao
terraform version
# Output: Terraform v1.7.x

# Ver comandos disponiveis
terraform

# Fluxo basico (sera detalhado em aulas futuras)
terraform init      # Baixa providers do registry
terraform plan      # Preview das mudancas
terraform apply     # Aplica as mudancas
terraform destroy   # Remove tudo que foi criado
```

## Exemplo 4: Estrutura de Arquivo .tf Minima

```hcl
# main.tf — arquivo principal

terraform {
  required_version = ">= 1.7.0"

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

# Recursos serao adicionados aqui
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

**Observacao do instrutor:** A estrutura lembra JSON mas nao e JSON. Blocos tem tipo, label e corpo entre `{}`. Atributos usam `=` ao inves de `:`.

## Comparacao Visual: HCL vs JSON vs CDK

### HCL (padrao Terraform)
```hcl
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket"
}
```

### JSON (alternativa aceita pelo Terraform)
```json
{
  "resource": {
    "aws_s3_bucket": {
      "my_bucket": {
        "bucket": "my-unique-bucket"
      }
    }
  }
}
```

### CDK TypeScript (transpila para HCL)
```typescript
new S3Bucket(this, "my_bucket", {
  bucket: "my-unique-bucket",
});
```

Os tres produzem o mesmo resultado. HCL e o mais idiomatico e o que a comunidade Terraform usa.
