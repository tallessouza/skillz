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