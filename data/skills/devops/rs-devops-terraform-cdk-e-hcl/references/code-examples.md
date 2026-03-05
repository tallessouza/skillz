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