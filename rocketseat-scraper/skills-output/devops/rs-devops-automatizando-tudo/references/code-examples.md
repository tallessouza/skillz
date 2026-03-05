# Code Examples: Automacao no CALMS

## Nota sobre esta aula

Esta aula e conceitual — faz parte do framework CALMS como ferramenta de diagnostico. O instrutor nao apresenta codigo diretamente, mas descreve estruturas e fluxos que podem ser representados em codigo.

## Pipeline de CI/CD — Estrutura basica mencionada

O instrutor lista as etapas que devem ser automatizadas:

```yaml
# .github/workflows/ci-cd.yml (exemplo pratico do conceito)
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # 1. Instalacao de dependencias (mencionado pelo instrutor)
      - uses: actions/checkout@v4
      - run: npm install

      # 2. Testes automatizados (mencionado como critico)
      - run: npm test

      # 3. Build da aplicacao (mencionado pelo instrutor)
      - run: npm run build

      # 4. Deploy / CD (mencionado como etapa final)
      - run: ./deploy.sh
```

## GitOps / IaC — Recurso SQS como exemplo

O instrutor usa SQS como exemplo concreto de recurso que deveria estar em IaC:

```hcl
# Exemplo do conceito descrito: recurso no Git, nao no console
# infra/sqs.tf

resource "aws_sqs_queue" "orders_queue" {
  name                      = "orders-processing"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 345600  # 4 dias
  visibility_timeout_seconds = 30

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"  # Indica que e gerenciado por IaC
  }
}
```

### O anti-pattern descrito pelo instrutor

```
# O que o instrutor diz que NAO deve ser feito:
# 1. Abrir console da AWS
# 2. Ir em SQS > Create Queue
# 3. Preencher formulario manualmente
# 4. Criar

# Problemas concretos mencionados:
# - Outro dev pode criar recurso duplicado (sem visibilidade)
# - Outro dev pode alterar configuracao sem revisao
# - Nao ha historico de mudancas
# - Nao ha code review
```

## Kubernetes e Container Registries — tambem mencionados

O instrutor cita que clusters Kubernetes e container registries tambem devem seguir o mesmo principio:

```hcl
# infra/eks.tf — cluster Kubernetes no Git
resource "aws_eks_cluster" "main" {
  name     = "production-cluster"
  role_arn = aws_iam_role.eks.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}

# infra/ecr.tf — container registry no Git
resource "aws_ecr_repository" "app" {
  name                 = "my-application"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
```

## Fluxo GitOps completo (baseado na descricao do instrutor)

```
Developer                   Git (SCM)                    Cloud (AWS/Azure/GCP)
    │                          │                              │
    ├── Quer criar SQS ───────>│                              │
    │                          │                              │
    │   Cria arquivo .tf       │                              │
    │   Abre Pull Request ────>│                              │
    │                          │                              │
    │   Code Review ──────────>│                              │
    │   (mecanismo de revisao  │                              │
    │    mencionado pelo       │                              │
    │    instrutor)            │                              │
    │                          │                              │
    │   Merge ────────────────>│── Pipeline aplica ──────────>│
    │                          │   terraform apply            │
    │                          │                              │
    │                          │<── Estado sincronizado ──────│
    │                          │                              │
    │   Quer VER o recurso ───────────────────────────────────>│
    │   (console read-only)    │                              │
```

## Checklist de diagnostico de automacao

Baseado no que o instrutor descreve como processo de avaliacao:

```markdown
## Diagnostico de Automacao — Template

### Processos da equipe
| Processo | Frequencia | Tempo gasto | Repetitivo? | Candidato? |
|----------|-----------|-------------|-------------|------------|
| Deploy manual | 3x/semana | 30min | Sim | Sim |
| Teste manual pre-deploy | 3x/semana | 1h | Sim | Sim |
| Criar recurso no console | 2x/mes | 15min | Sim | Sim |
| Rodar script de correcao no banco | 1x/dia | 10min | Sim | Sim |

### Pipeline de entrega
- [ ] Instalacao de dependencias automatizada
- [ ] Testes automatizados no pipeline
- [ ] Build automatizado
- [ ] Deploy automatizado (CD)

### GitOps / IaC
- [ ] Recursos de nuvem mapeados em codigo
- [ ] Versionados no Git
- [ ] Alteracoes passam por code review
- [ ] Console usado apenas como read-only
```