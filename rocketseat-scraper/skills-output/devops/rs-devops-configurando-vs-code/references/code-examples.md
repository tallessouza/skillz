# Code Examples: Configurando VSCode para Terraform

## Arquivo de teste para verificar syntax highlighting

O instrutor criou um arquivo `module.tf` como exemplo para testar o highlighting. Ao escrever blocos HCL, o VSCode deve colorir as keywords corretamente.

### Exemplo basico — Resource block

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "web-server"
  }
}
```

Com a extensao correta instalada:
- `resource` aparece como keyword (cor distinta)
- `"aws_instance"` aparece como string (tipo do recurso)
- `"web"` aparece como string (nome logico)
- `ami`, `instance_type`, `tags` aparecem como atributos

### Exemplo — Module block

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "my-vpc"
  cidr = "10.0.0.0/16"
}
```

### Exemplo — Variable e Output

```hcl
variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

output "instance_ip" {
  description = "Public IP of the instance"
  value       = aws_instance.web.public_ip
}
```

### Verificacao visual

Apos instalar a extensao, abra qualquer um destes arquivos e confirme:
1. Keywords (`resource`, `module`, `variable`, `output`) tem cor propria
2. Strings entre aspas tem cor distinta
3. Atributos (`ami`, `source`, `type`) sao reconhecidos
4. O icone do Terraform aparece na aba do arquivo