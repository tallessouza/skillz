# Code Examples: AWS CloudFormation e Ferramentas Nativas de IaC

## Exemplo de template CloudFormation (YAML)

Este e o formato nativo do CloudFormation — declarativo em YAML:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Exemplo basico de EC2 com CloudFormation

Resources:
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t2.micro
      ImageId: ami-0abcdef1234567890
      Tags:
        - Key: Name
          Value: MinhaInstancia
```

### O que acontece aqui:
- `AWSTemplateFormatVersion` — versao do template (sempre '2010-09-09')
- `Resources` — secao onde voce declara os recursos
- `Type: AWS::EC2::Instance` — tipo do recurso AWS
- `Properties` — configuracoes do recurso (tipo de instancia, AMI, tags)

## Exemplo equivalente com CDK (TypeScript)

O CDK mencionado pelo instrutor permite escrever a mesma infraestrutura em TypeScript:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class MinhaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Criar VPC (necessaria para a instancia)
    const vpc = new ec2.Vpc(this, 'MinhaVPC', {
      maxAzs: 2,
    });

    // Criar instancia EC2 — equivalente ao YAML acima
    const instance = new ec2.Instance(this, 'MinhaInstancia', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpc,
    });
  }
}
```

### Vantagem do CDK sobre YAML puro:
- Autocompletar no editor (TypeScript tipado)
- Reutilizacao de logica com funcoes e classes
- Testes unitarios na infraestrutura
- Familiar para desenvolvedores

## Comparacao: Console vs IaC

### Criando via console (o que o instrutor diz para NAO fazer):

```
1. Abrir console AWS → EC2
2. Clicar "Launch Instance"
3. Selecionar AMI manualmente
4. Escolher tipo de instancia
5. Configurar security groups clicando
6. Clicar "Launch"
```

**Problemas:** nada versionado, nao reproduzivel, nao auditavel.

### Criando via CloudFormation CLI:

```bash
# Criar stack a partir do template
aws cloudformation create-stack \
  --stack-name minha-stack \
  --template-body file://template.yaml

# Verificar status
aws cloudformation describe-stacks \
  --stack-name minha-stack

# Atualizar stack (modificou o YAML)
aws cloudformation update-stack \
  --stack-name minha-stack \
  --template-body file://template.yaml

# Deletar stack (remove TODOS os recursos)
aws cloudformation delete-stack \
  --stack-name minha-stack
```

### Criando via CDK CLI:

```bash
# Inicializar projeto CDK
cdk init app --language typescript

# Sintetizar template (CDK → CloudFormation YAML)
cdk synth

# Deploy da stack
cdk deploy

# Diff (ver mudancas antes de aplicar)
cdk diff

# Destruir stack
cdk destroy
```

## Equivalencias entre provedores

### AWS CloudFormation:
```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t2.micro
```

### Azure Resource Manager (ARM):
```json
{
  "resources": [{
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "2021-03-01",
    "name": "myVM",
    "properties": {
      "hardwareProfile": {
        "vmSize": "Standard_B1s"
      }
    }
  }]
}
```

### GCP Deployment Manager:
```yaml
resources:
- name: my-instance
  type: compute.v1.instance
  properties:
    zone: us-central1-a
    machineType: zones/us-central1-a/machineTypes/f1-micro
```

Todas declaram a mesma coisa (uma VM), mas em formatos incompativeis entre si — esse e o lock-in que o instrutor menciona.