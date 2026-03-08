---
name: rs-devops-pulumi
description: "Applies Pulumi IaC evaluation criteria when choosing between infrastructure-as-code tools. Use when user asks to 'compare terraform vs pulumi', 'use pulumi', 'choose IaC tool', 'multi-cloud infrastructure', or 'infrastructure with typescript/python'. Provides decision framework for Pulumi adoption vs alternatives. Make sure to use this skill whenever evaluating IaC tooling. Not for Terraform implementation, application code, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: iac-tooling
  tags: [pulumi, iac, multi-cloud, typescript, python, terraform, infrastructure]
---

# Pulumi — Infrastructure as Code Multi-Cloud

> Pulumi permite definir infraestrutura usando linguagens de programacao reais (TypeScript, Python, Go, C#, Java, YAML) com suporte nativo a multiplas clouds.

## Key concept

Pulumi segue a mesma linha do AWS CDK — usar linguagens de programacao ao inves de DSLs proprietarias para definir infraestrutura. A diferenca fundamental: Pulumi nao tem lock-in com nenhum provedor de cloud. Suporta AWS, Azure, Google Cloud, DigitalOcean, Alibaba Cloud, DataDog e dezenas de outros providers.

O codigo de infraestrutura vai para um repositorio Git dedicado. Para criar/recriar recursos, basta deployar o projeto de infra — se alguem deletar recursos manualmente no console, rodar o Pulumi novamente recria tudo.

## Decision framework

| Situacao | Recomendacao |
|----------|-------------|
| Projeto individual, open source suficiente | Pulumi Free (Always Free, 1 membro, recursos ilimitados) |
| Time de desenvolvimento | Plano Team ou Enterprise (Free nao suporta times) |
| Ja usa Python/TypeScript no projeto | Usar mesma linguagem no Pulumi — curva de aprendizado menor |
| Precisa de multi-cloud | Pulumi e forte candidato (suporte nativo) |
| Popularidade e ecossistema sao prioridade | Terraform domina o mercado — considerar antes do Pulumi |
| Gerenciamento granular de recursos especificos | Avaliar limitacoes do Pulumi antes de adotar |

## How to think about it

### Escolha de linguagem

Pulumi suporta TypeScript, Python, Go, C#, Java e YAML. A estrategia ideal: usar a mesma linguagem dos projetos da equipe. Se o time trabalha com Python, lançar o IaC tambem em Python reduz a curva de aprendizado significativamente.

### Replicacao de ambientes

Um dos maiores valores do IaC: criar ambientes identicos (dev/staging/prod). Seguindo o Twelve-Factor App, ambientes devem ser o mais parecidos possivel. Com Pulumi, cria-se o declarativo uma vez e replica conforme necessidade — sem recriar manualmente no console.

### Setup basico

1. Instalar CLI do Pulumi (macOS, Windows, Linux)
2. Escolher linguagem (TypeScript, Python, YAML, etc.)
3. Exportar credentials do provider (ex: AWS access key + secret key)
4. Criar projeto: `pulumi new aws-typescript` (ou `aws-python`, `aws-yaml`, etc.)
5. Definir recursos no codigo
6. Deploy: `pulumi up`

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Pulumi e totalmente gratuito | Free so para uso individual (1 membro). Times precisam de plano pago |
| Pulumi e igual ao Terraform | Pulumi usa linguagens reais, Terraform usa HCL (DSL propria) |
| Qualquer IaC tool funciona igual com qualquer cloud | Pulumi precisa de configuracao de conexao (credentials) por provider |
| CDK e Pulumi sao a mesma coisa | CDK tem lock-in com AWS, Pulumi e multi-cloud |

## Landscape de ferramentas IaC

| Ferramenta | Caracteristica principal |
|-----------|------------------------|
| **Pulumi** | Multi-cloud, linguagens reais, open source core |
| **AWS CDK** | Linguagens reais, lock-in AWS |
| **Terraform** | HCL, multi-cloud, mais popular do mercado |
| **Ansible** | Configuracao de servidores, mais antigo |
| **Chef/Puppet** | Pioneiros do IaC, gerenciamento de configuracao |

## Limitations

- Plano gratuito limitado a 1 membro — inviavel para times sem pagar
- Menor popularidade que Terraform — menos recursos da comunidade, menos vagas pedem Pulumi
- Alguns recursos especificos de cloud podem ter limitacoes de gerenciamento
- Requer configuracao explicita de credentials para cada provider

## Troubleshooting

### Pulumi up falha com erro de credenciais
**Symptom:** `pulumi up` retorna erro de autenticacao ao tentar criar recursos no provider
**Cause:** Variáveis de ambiente AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY nao exportadas ou com valores incorretos
**Fix:** Exportar credenciais corretamente com `export AWS_ACCESS_KEY_ID=<key>` e `export AWS_SECRET_ACCESS_KEY=<secret>` antes de rodar `pulumi up`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Pulumi — IaC Multi-Cloud

## Por que o instrutor nao escolheu Pulumi para o curso

O instrutor explicitamente menciona dois motivos para nao adotar Pulumi no curso:

1. **Problemas de gerenciamento** — dentro de alguns recursos especificos que serao utilizados no curso, Pulumi apresenta limitacoes
2. **Limitacao no plano individual** — para uso em time (contexto educacional), o Free tier nao seria suficiente
3. **Popularidade** — existe uma ferramenta que "domina o mercado" (Terraform, apresentada na aula seguinte), e faz mais sentido ensinar a mais adotada

## A analogia CDK vs Pulumi

O instrutor posiciona Pulumi como estando "na mesma linha do CDK" — ambos permitem usar linguagens de programacao reais ao inves de DSLs. A diferenca critica: CDK e vinculado a AWS, Pulumi suporta multiplas clouds nativamente.

## Curva de aprendizado vs curva de adocao

O instrutor faz uma distincao interessante: ao usar a mesma linguagem do projeto (ex: Python), a **curva de aprendizado** e menor (voce ja sabe a linguagem). Porem, a **curva de adocao** pode ser ate maior — porque adotar uma nova ferramenta de IaC envolve mais do que saber a linguagem (configuracao, integracao com CI/CD, workflows do time, etc.).

## O valor do declarativo para replicacao

O instrutor destaca que um dos maiores problemas resolvidos pelo IaC e a replicacao de ambientes. Cita o Twelve-Factor App como referencia: ambientes dev e prod devem ser o mais parecidos possivel. O fluxo:

1. Cria o declarativo uma vez
2. Replica para quantos ambientes precisar
3. Se alguem deletar recursos no console manualmente, basta rodar o Pulumi novamente

Isso contrasta com a abordagem "imperativa" de clicar no console da cloud, que e irreproduzivel e propensa a erro.

## Ferramentas historicas mencionadas

O instrutor menciona Ansible, Chef e Puppet como ferramentas mais antigas que implementaram IaC no mercado. Sugere estudar para entender o conceito historico, mas nao as aborda no curso por serem de uma geracao anterior.

## Multi-cloud como diferencial

A demonstracao no site do Pulumi mostra o suporte a dezenas de providers: AWS, Azure, Google Cloud, Alibaba Cloud, DigitalOcean, DataDog, Aquasec, Aviatrix, entre outros. Cada provider tem exemplos em todas as linguagens suportadas.

---

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
