# Code Examples: Infrastructure as Code e GitOps

## Nota sobre esta aula

Esta aula e conceitual — o instrutor nao apresenta codigo especifico de ferramentas. Os exemplos abaixo ilustram os conceitos discutidos com implementacoes praticas.

## Exemplo conceitual: Modo imperativo vs declarativo

### Modo imperativo (o que o IaC substitui)

```
1. Abrir console AWS
2. Navegar ate EC2
3. Clicar "Launch Instance"
4. Selecionar AMI, tipo, rede, seguranca...
5. Clicar "Launch"
6. (Esquecer de documentar)
7. (Esquecer de deletar depois do teste)
```

### Modo declarativo (IaC)

```hcl
# Exemplo conceitual com Terraform (ferramenta sera vista em aulas futuras)
resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name        = "app-server"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
```

O recurso existe em codigo. Para criar: `terraform apply`. Para destruir: `terraform destroy`. Sem recursos esquecidos.

## Estrutura de repositorio GitOps

```
infra-repo/
├── environments/
│   ├── production/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── dev/
│       └── ...
├── modules/
│   ├── networking/
│   ├── compute/
│   └── database/
└── README.md
```

O repositorio e a fonte unica da verdade. O que esta aqui reflete o que esta na nuvem.

## Fluxo GitOps para alteracao de recurso

```
1. Criar branch: git checkout -b feat/increase-ec2-capacity
2. Alterar o codigo de infra (ex: mudar instance_type)
3. Commit + Push
4. Abrir Pull Request
5. Review por outro membro do time
6. Merge apos aprovacao
7. Pipeline aplica a mudanca na nuvem
```

Isso substitui: "vou la no console e mudo rapidinho".

## Recursos mencionados pelo instrutor

O instrutor menciona como exemplos de recursos gerenciaveis via IaC:
- **EC2** — maquinas virtuais na AWS
- **EKS** — Kubernetes gerenciado na AWS
- **Filas** (SQS implicito) — mensageria
- Recursos equivalentes em GCP, Azure, DigitalOcean

## Ciclo de vida completo via IaC

```
CRIAR    → Declarar no codigo → Executar ferramenta → Recurso existe na nuvem
EDITAR   → Alterar no codigo  → PR + Review → Aplicar → Recurso atualizado
REMOVER  → Remover do codigo  → PR + Review → Aplicar → Recurso destruido
```

Cada etapa e rastreavel, reversivel e revisavel.