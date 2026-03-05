---
name: rs-devops-rodando-pipeline-pela-1a-vez
description: "Applies IAM permission setup and pipeline secrets sanitization when configuring Terraform CI/CD pipelines on AWS. Use when user asks to 'run pipeline', 'fix access denied in CI', 'add IAM inline policy', 'sanitize secrets in GitHub Actions', or 'configure terraform permissions'. Covers inline policy creation, GitHub secrets/variables, and duplicate resource diagnosis. Make sure to use this skill whenever setting up Terraform pipelines or debugging CI/CD permission errors. Not for Terraform state migration, S3 backend configuration, or application-level CI/CD."
---

# Rodando Pipeline pela 1a Vez

> Ao rodar uma pipeline Terraform pela primeira vez, configure permissoes IAM incrementais e sanitize todas as informacoes sensiveis antes de comitar.

## Prerequisites

- AWS IAM com TF role ja criada (trust policy configurada)
- GitHub Actions workflow com OIDC authentication
- Terraform CLI configurado no workflow
- Recursos existentes: IAM, ECR (ou equivalentes)

## Steps

### Step 1: Configurar Inline Policy no TF Role

Copie a inline policy de uma role existente (ex: SR role) e adapte para o TF role, liberando apenas os recursos necessarios.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": "ecr:*",
      "Resource": "*"
    },
    {
      "Sid": "IAMAccess",
      "Effect": "Allow",
      "Action": "iam:*",
      "Resource": "*"
    }
  ]
}
```

Nomeie como `tf-permission`. Expanda os statements a medida que novos recursos forem adicionados.

### Step 2: Aplicar via Terraform

```bash
terraform plan    # Validar alteracoes
terraform apply --auto-approve  # Aplicar inline policy
```

Verificar no console AWS: IAM → TF Role → Inline policies → `tf-permission`.

### Step 3: Sanitizar Secrets no GitHub

Em Settings → Secrets and variables → Actions:

| Tipo | Nome | Valor | Exposto? |
|------|------|-------|----------|
| Secret | `AWS_REGION` | `us-east-2` | Nao |
| Secret | `ROLE_ASSUME` | ARN da role | Nao |
| Variable | `TF_VERSION` | `1.8.4` | Sim (ok) |

### Step 4: Referenciar no Workflow

```yaml
env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  ROLE_ARN: ${{ secrets.ROLE_ASSUME }}
  TF_VERSION: ${{ vars.TF_VERSION }}
```

Regra: informacao sensivel (ARNs, regioes, credentials) → `secrets`. Versoes e configs publicas → `vars`.

### Step 5: Testar Pipeline

```bash
git add .
git commit -m "add secrets and permissions"
git push
```

## Error Handling

- **Access Denied (403):** TF role nao tem inline policy suficiente. Adicione statements para os recursos faltantes.
- **Resource Already Exists (400/409):** Estado local nao conhece recursos criados manualmente. Requer migração de estado (S3 backend) — nao tente recriar com mesmo nome.
- **Regiao diferente:** Recursos sao regionais. Se mudar `us-east-2` para `us-east-1`, recursos serao criados novamente porque nao existem na nova regiao.

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo recurso AWS adicionado ao Terraform | Adicionar statement correspondente na inline policy |
| Informacao sensivel no codigo | Mover para GitHub Secrets imediatamente |
| Versao de ferramenta no workflow | Usar GitHub Variables (nao secret) |
| Erro 409 no apply | Nao recriar — investigar estado e migrar para backend remoto |
| Pipeline passa no plan mas falha no apply | Verificar se recursos ja existem fora do estado |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Dar admin full access ao TF role | Liberar por recurso especifico (ECR, IAM, S3) |
| Hardcode de ARN/regiao no workflow YAML | Usar `secrets.AWS_REGION` e `secrets.ROLE_ASSUME` |
| Hardcode de versao do Terraform | Usar `vars.TF_VERSION` |
| Recriar recurso existente para contornar 409 | Migrar estado para backend remoto (S3) |
| Copiar inline policy sem adaptar | Remover statements desnecessarios, renomear para `tf-permission` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-rodando-pipeline-pela-1-a-vez/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-rodando-pipeline-pela-1-a-vez/references/code-examples.md)
