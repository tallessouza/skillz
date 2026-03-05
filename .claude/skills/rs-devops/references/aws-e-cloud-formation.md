---
name: rs-devops-aws-e-cloud-formation
description: "Applies knowledge of AWS CloudFormation and native cloud IaC tools when evaluating infrastructure strategies. Use when user asks to 'choose IaC tool', 'setup CloudFormation', 'compare IaC options', 'manage AWS infrastructure', or 'avoid vendor lock-in'. Guides decisions about native vs multi-cloud IaC tools. Make sure to use this skill whenever discussing cloud provider native IaC services or evaluating vendor lock-in trade-offs. Not for Terraform/OpenTofu usage, Ansible configuration, or application-level code."
---

# AWS CloudFormation e Ferramentas Nativas de IaC

> Cada grande provedor de cloud oferece sua propria ferramenta de IaC nativa — entenda o trade-off entre conveniencia e vendor lock-in antes de escolher.

## Key concept

Ferramentas nativas de IaC sao servicos oferecidos pelos proprios provedores de cloud para gerenciar recursos de forma declarativa. Sao convenientes porque tem integracao profunda com o ecossistema, mas criam dependencia (lock-in) do provedor.

| Provedor | Ferramenta Nativa |
|----------|-------------------|
| AWS | CloudFormation |
| Azure | Resource Manager |
| GCP | Deployment Manager |

Todas fazem essencialmente a mesma coisa: gerenciar stacks e recursos de forma declarativa.

## Decision framework

| Situacao | Decisao |
|----------|---------|
| Projeto 100% em um unico provedor, sem plano de migrar | Ferramenta nativa e aceitavel |
| Multi-cloud ou possibilidade de migrar no futuro | Preferir ferramenta multi-provedor (Terraform/OpenTofu) |
| Time de devs sem experiencia em HCL | CloudFormation CDK (TypeScript) reduz curva de aprendizado |
| Precisa gerenciar recursos de multiplos provedores | Ferramenta nativa NAO atende — use multi-cloud |

## Por que NAO usar o console manualmente

Criar recursos clicando no console do provedor nao e IaC. Problemas:

1. **Sem fonte unica da verdade** — nao ha GitOps, nao ha versionamento
2. **Multiplas pessoas editando** — recursos duplicados, inconsistencias
3. **Impacto em custos** — recursos orfaos e duplicados geram cobranca
4. **Nao e escalavel** — tarefas repetitivas manuais violam principios DevOps

O recurso vai funcionar, mas nao e uma boa pratica a longo prazo.

## CloudFormation CDK

CloudFormation oferece o CDK (Cloud Development Kit) — permite escrever infraestrutura usando linguagens como TypeScript. Reduz a curva de aprendizado para desenvolvedores que ja conhecem a linguagem.

```typescript
// Exemplo conceitual de CDK
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const instance = new ec2.Instance(this, 'MyInstance', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
  machineImage: ec2.MachineImage.latestAmazonLinux2(),
  vpc,
});
```

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| CloudFormation funciona em qualquer cloud | Funciona APENAS na AWS |
| Criar pelo console e rapido, entao e melhor | E rapido hoje, mas gera divida operacional a longo prazo |
| Lock-in nao importa porque nunca vou trocar de cloud | Trocar e raro, mas o lock-in tambem afeta contratacao e flexibilidade de ferramentas |
| Ferramentas nativas sao inferiores | Sao otimas para seu ecossistema — o trade-off e exclusividade vs portabilidade |

## AWS Free Tier

Para estudo, a AWS oferece free tier — quota maxima de uso mensal sem cobranca. Suficiente para ambientes de aprendizado. Crie sua conta antes de praticar IaC.

## Limitations

- Esta skill cobre apenas o entendimento conceitual das ferramentas nativas
- Para uso pratico de Terraform/OpenTofu, consulte skills especificas
- Nao cobre detalhes de sintaxe CloudFormation YAML/JSON

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-aws-e-cloud-formation/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-aws-e-cloud-formation/references/code-examples.md)
