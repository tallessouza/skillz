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