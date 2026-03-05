# Code Examples: Pulumi

## Exemplo 1: Criar instancia EC2 na AWS (TypeScript)

Demonstrado pelo instrutor navegando na documentacao do Pulumi:

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Buscar AMI Ubuntu (equivalente a escolher imagem no console)
const ubuntu = aws.ec2.getAmi({
    mostRecent: true,
    filters: [
        { name: "name", values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"] },
        { name: "virtualization-type", values: ["hvm"] },
    ],
    owners: ["099720109477"], // Canonical
});

// Criar instancia — tudo que faria manualmente no console, declarado aqui
const server = new aws.ec2.Instance("web-server", {
    ami: ubuntu.then(ami => ami.id),
    instanceType: "t2.micro",
    tags: {
        Name: "my-server",
    },
});

export const publicIp = server.publicIp;
```

**Insight do instrutor:** "Tudo que esta aqui que voce faria de forma imperativa, de forma manual, voce faria aqui no declarativo." A AMI, o tipo de instancia, as tags — tudo que voce clicaria no console esta representado em codigo.

## Exemplo 2: Criar bucket S3 (mencionado brevemente)

```typescript
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const bucketName = bucket.id;
```

## Exemplo 3: Setup inicial do projeto

```bash
# 1. Instalar Pulumi CLI
curl -fsSL https://get.pulumi.com | sh

# 2. Configurar credentials AWS
export AWS_ACCESS_KEY_ID=<your-access-key>
export AWS_SECRET_ACCESS_KEY=<your-secret-key>

# 3. Criar projeto (escolher linguagem)
pulumi new aws-typescript   # TypeScript
pulumi new aws-python       # Python
pulumi new aws-yaml         # YAML
pulumi new aws-javascript   # JavaScript

# 4. Deploy
pulumi up
```

## Opcoes de linguagem por comando

| Comando | Linguagem |
|---------|-----------|
| `pulumi new aws-typescript` | TypeScript |
| `pulumi new aws-python` | Python |
| `pulumi new aws-go` | Go |
| `pulumi new aws-csharp` | C# |
| `pulumi new aws-java` | Java |
| `pulumi new aws-yaml` | YAML |

## Fluxo de replicacao de ambientes

```bash
# Ambiente de desenvolvimento
pulumi stack init dev
pulumi up

# Ambiente de producao (mesmo codigo, stack diferente)
pulumi stack init prod
pulumi up
```

O instrutor destaca: "Ao inves de voce sair criando aqui no console varios servicos, voce cria um declarativo e depois sai replicando conforme a necessidade."