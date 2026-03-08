---
name: rs-devops-overview
description: "Applies Infrastructure as Code principles when choosing between declarative and imperative approaches for cloud provisioning. Use when user asks to 'provision infrastructure', 'choose IaC approach', 'setup terraform vs scripts', 'version infrastructure', or 'automate cloud resources'. Enforces declarative-first thinking with Git-versioned state. Make sure to use this skill whenever discussing IaC strategy or cloud provisioning approach. Not for application code, Docker containers, or Kubernetes manifests."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: infrastructure-as-code
  tags: [iac, terraform, declarative, imperative, cloud, provisioning, devops]
---

# Infrastructure as Code — Overview e Modelos

> Infraestrutura deve ser representada como estado declarativo versionado, nunca como sequencias de comandos imperativas.

## Key concept

IaC transforma infraestrutura em codigo versionado. O ciclo completo: developer escreve codigo representando recursos → versionamento (Git) → push dispara orquestracao → provedor de cloud cria/edita/deleta recursos. Se ocorre erro (sintaxe, recurso invalido, tag mal escrita), a infra nao e mutabilizada — o estado anterior permanece intacto.

IaC e um pilar da cultura DevOps porque elimina silos: developers, SREs e pessoas de infra trabalham no mesmo codigo, democratizando o conhecimento de infraestrutura.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa provisionar recurso cloud | Modelo declarativo — declare O QUE, nao COMO |
| Recurso tem interdependencias | Declarativo resolve automaticamente a ordem |
| Precisa de historico de mudancas | Estado versionado no Git — cada commit e um snapshot da infra |
| Precisa deletar recursos | Altere o estado (remova do codigo) — o provedor reflete |
| Erro no provisionamento | Infra nao muda — corrija o codigo e re-aplique |
| Ambiente on-premise | IaC tambem funciona, com limitacoes |

## Declarativo vs Imperativo

### Declarativo (preferido para IaC)

- Foca no **O QUE** precisa ser feito
- Declare o recurso e a ferramenta resolve o como
- Gerencia interdependencias automaticamente
- Mantem estados passados (historico de mudancas)
- Facilita delecoes futuras — altere o estado, o provedor reflete
- Exemplo: "Quero um EC2 com capacity X" → ferramenta cria

### Imperativo (evitar para IaC)

- Foca no **COMO** fazer
- Sequencia de comandos executados em ordem
- Exige execucao serial — ordem importa sempre
- Interdependencias sao responsabilidade do autor
- Historico limitado aos comandos executados
- Exemplo: "Execute comando A, depois B, depois C para criar EC2"

## Heuristics

| Situacao | Acao |
|----------|------|
| Escolher abordagem para novo recurso | Sempre declarativo — declare estado desejado |
| Recurso com muitas dependencias | Declarativo — resolve ordem automaticamente |
| Script one-off de emergencia | Imperativo aceitavel, mas documente e migre para declarativo |
| Precisa rastrear mudancas na infra | Git como SCM — cada PR e code review de infraestrutura |
| Multiplos cloud providers | IaC suporta AWS, Azure, GCP, Oracle — mesma abordagem |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|-----------|-------------------|
| Scripts bash sequenciais para provisionar infra | Codigo declarativo versionado (Terraform, CloudFormation) |
| Criar recursos manualmente no console | Declarar no codigo e aplicar via pipeline |
| Ignorar interdependencias entre recursos | Usar modelo declarativo que resolve dependencias |
| Deletar recursos direto no provider | Remover do codigo — estado reflete no provider |
| Infra sem versionamento | Todo codigo IaC no Git com code review |
| Misturar imperativo e declarativo sem criterio | Padronizar em declarativo para toda a infra |

## Troubleshooting

### Terraform apply falha mas infra nao foi alterada
**Symptom:** `terraform apply` retorna erro mas nenhum recurso foi criado ou modificado
**Cause:** Comportamento esperado do modelo declarativo — erros de sintaxe, recurso invalido ou tag mal escrita impedem mutacao do estado
**Fix:** Corrigir o erro indicado no output, rodar `terraform plan` para validar e re-aplicar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Infrastructure as Code — Overview e Modelos

## O ciclo completo do IaC

O instrutor apresenta o fluxo como uma imagem mental clara:

1. **Developers escrevem codigo** — nao necessariamente so devs, tambem SREs e pessoas de infra. A sacada e a aproximacao entre areas: infra, que normalmente fica distante do codigo, se aproxima atraves do IaC.

2. **Versionamento via Git** — o codigo passa por controle de versao. A ferramenta pode ser GitHub, Bitbucket, Azure DevOps, GitLab — nao faz diferenca fundamental. O importante e o fluxo: commit → push → magia acontece.

3. **Orquestracao com cloud provider** — apos o push, uma orquestracao se comunica com o provedor (AWS, Azure, GCP, Oracle). O suporte e abrangente para quase todas as clouds. On-premise tambem e possivel, com limitacoes.

4. **Criacao, edicao e delecao** — o recurso passa pela estrutura de SCM (pull request, code review) e o estado e refletido no provedor. Para delecao, alterar o estado do codigo resulta em delecao no provedor.

5. **Seguranca contra erros** — se ocorre erro (sintaxe, recurso nao encontrado, tag mal escrita), a infra NAO e mutabilizada. Isso gera um alerta para correcao, mas o estado anterior permanece intacto. Isso e uma garantia fundamental do modelo declarativo.

## Por que IaC e um pilar DevOps

O instrutor enfatiza que IaC ajuda a "evitar silos entre areas" — um pilar da cultura DevOps. Quando infra vira codigo, developers podem entender e contribuir para infraestrutura, e pessoas de infra podem usar ferramentas de desenvolvimento (Git, code review, CI/CD). Isso "democratiza o assunto".

## Declarativo: o modelo preferido

### A analogia do estado

O declarativo fala sobre **estado**. Voce declara: "preciso de um EC2". Como isso sera feito? A linguagem/ferramenta resolve. E como programacao declarativa — voce descreve o resultado desejado, nao os passos.

### Interdependencias automaticas

Quando voce cria algo com interdependencias, o modelo declarativo considera isso automaticamente. Voce nao precisa se preocupar com ordem de criacao — a ferramenta analisa o grafo de dependencias e resolve.

### Historico de estados

O instrutor destaca que voce consegue manter estados passados. Exemplo: "eu tinha um EC2 com tal capacidade, agora tenho com capacidade maior/menor, mas no historico sei que em dado momento tinha um tipo de maquina e depois passei a ter outro." Isso e valioso para auditoria e rollback.

### Facilitacao de delecao

Delecoes sao simplificadas porque o estado e refletido no provedor. Se voce altera o estado removendo um recurso, o provedor tambem deleta. Nao precisa saber "como deletar" — apenas altere o estado.

## Imperativo: quando e por que evitar

### Foco no "como"

O imperativo tem sequencias de comandos para criar recursos. Em vez de "quero um EC2", voce tem "execute comando A, depois B, depois C".

### Ordem obrigatoria

O instrutor enfatiza que na maioria (quase totalidade) dos casos, a execucao deve ser serial, em ordem. Com interdependencias, a ordem e responsabilidade do autor — nao da ferramenta.

### Historico limitado

No imperativo, voce tem historico dos comandos executados, mas nao do estado resultante. E uma diferenca sutil mas importante: saber o que foi executado nao e o mesmo que saber o estado atual da infra.

## EC2 como exemplo recorrente

O instrutor usa EC2 (Elastic Computing Cloud) da AWS como exemplo principal. EC2 e um recurso de maquina virtual — sera usado em exemplos praticos ao longo do curso. O curso trabalha primariamente com AWS, com exemplos adicionais de GCP e Azure ao final do modulo.

## Contexto do modulo

Este modulo trabalha mais localmente (similar ao modulo anterior de aplicacao). O modulo seguinte sobre CI/CD vai colocar tudo orientado a pipelines de infraestrutura.

---

# Code Examples: Infrastructure as Code — Overview e Modelos

## Fluxo IaC Completo (Diagrama)

```
Developer/SRE → Escreve codigo IaC
      │
      ▼
  Git (GitHub/GitLab/Bitbucket)
      │
      ├── Commit + Push
      │
      ▼
  Orquestracao (CI/CD Pipeline)
      │
      ├── Valida sintaxe
      ├── Plan (preview de mudancas)
      │
      ▼
  Cloud Provider (AWS/Azure/GCP/Oracle)
      │
      ├── Criacao de recurso
      ├── Edicao de recurso
      └── Delecao de recurso

  Se ERRO → Infra NAO muda → Alerta → Correcao
```

## Modelo Declarativo (Exemplo Conceitual)

```hcl
# Declarativo: EU DECLARO o que quero
# A ferramenta resolve COMO criar

resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name        = "web-server"
    Environment = "production"
  }
}

# Se eu mudar instance_type para "t2.large":
# → Ferramenta detecta diferenca de estado
# → Aplica APENAS a mudanca necessaria
# → Historico mostra: t2.micro → t2.large
```

## Modelo Imperativo (Exemplo Conceitual)

```bash
# Imperativo: EU DIGO como fazer, passo a passo
# Ordem importa — execucao serial obrigatoria

# Passo 1: Criar security group
aws ec2 create-security-group \
  --group-name web-sg \
  --description "Security group for web server"

# Passo 2: Criar key pair (depende de nada, mas ordem importa no script)
aws ec2 create-key-pair \
  --key-name web-key

# Passo 3: Criar instancia (depende de security group e key pair)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name web-key \
  --security-groups web-sg

# Para deletar: sequencia INVERSA de comandos
# Para editar: novos comandos especificos
# Interdependencias: responsabilidade do autor
```

## Comparacao Direta: Criacao + Edicao + Delecao

### Declarativo

```hcl
# CRIAR: declaro o recurso
resource "aws_instance" "app" {
  instance_type = "t2.micro"
}

# EDITAR: mudo o campo → ferramenta detecta e aplica
resource "aws_instance" "app" {
  instance_type = "t2.large"  # mudou de micro para large
}

# DELETAR: removo o bloco → ferramenta detecta e destroi
# (recurso removido do codigo)
```

### Imperativo

```bash
# CRIAR
aws ec2 run-instances --instance-type t2.micro

# EDITAR (preciso saber o ID e o comando especifico)
aws ec2 modify-instance-attribute \
  --instance-id i-1234567890abcdef0 \
  --instance-type t2.large

# DELETAR (preciso saber o ID e o comando especifico)
aws ec2 terminate-instances \
  --instance-ids i-1234567890abcdef0
```

## Seguranca Contra Erros (Declarativo)

```hcl
# Erro de sintaxe — infra NAO muda
resource "aws_instance" "app" {
  instance_type = "t2.micro"
  tags = {
    Name = "app-server"
    # faltou fechar a chave → erro de sintaxe
}

# Resultado:
# Error: Invalid block definition
# → Infra anterior permanece intacta
# → Correcao: fix no codigo → novo push → re-aplica
```

## Interdependencias (Declarativo Resolve Automaticamente)

```hcl
# Declaro VPC, Subnet e EC2
# NAO preciso me preocupar com ordem
# A ferramenta analisa dependencias e cria na ordem correta

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id  # depende da VPC
  cidr_block = "10.0.1.0/24"
}

resource "aws_instance" "app" {
  subnet_id     = aws_subnet.public.id  # depende da subnet
  instance_type = "t2.micro"
}

# Ferramenta resolve: VPC → Subnet → EC2
# Para deletar: EC2 → Subnet → VPC (ordem inversa automatica)
```
