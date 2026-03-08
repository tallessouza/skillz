---
name: rs-devops-rodando-pipeline-pela-1-a-vez
description: "Applies first-time Terraform pipeline execution with AWS IAM permissions and GitHub secrets sanitization. Use when user asks to 'run terraform pipeline first time', 'fix IAM permissions', 'configure GitHub secrets', 'setup OIDC for AWS', or 'handle 409 resource conflict'. Enforces incremental IAM policy, secrets vs variables separation, and state migration strategy. Make sure to use this skill whenever setting up Terraform pipelines with AWS OIDC or troubleshooting IAM permission errors in CI/CD. Not for established pipelines, non-AWS providers, or application CI/CD."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-pipeline
  tags: [terraform, pipeline, iam, github-actions, secrets, oidc, inline-policy, aws]
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


## Troubleshooting

### Terraform apply falha com 409 Resource Already Exists
**Symptom:** Pipeline passa no plan mas falha no apply com erro de recurso duplicado
**Cause:** Estado local nao conhece recursos criados manualmente ou por outro state
**Fix:** Migre estado para backend remoto (S3) ou use `terraform import` para importar recursos existentes

### Access Denied (403) no pipeline
**Symptom:** Pipeline falha com erro de permissao ao tentar criar/modificar recursos AWS
**Cause:** TF role nao tem inline policy suficiente para os recursos necessarios
**Fix:** Adicione statements correspondentes na inline policy do TF role para os recursos faltantes

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Rodando Pipeline pela 1a Vez

## Por que inline policy e nao managed policy?

O instrutor usa inline policies porque estao diretamente atreladas a role — quando a role e deletada, a policy vai junto. Para roles de automacao como o TF role, isso e mais seguro que managed policies que podem ficar orfas.

## Principio de menor privilegio incremental

O instrutor enfatiza: "a boa pratica e que seja liberado de acordo com os recursos que voce tenha." Isso significa:
- Comece com ZERO permissoes
- Adicione apenas o que o Terraform precisa AGORA (ECR + IAM)
- Quando adicionar S3, expanda a policy
- Nunca comece com `*` em tudo

A abordagem e copiar a inline policy de uma role similar (SR role) e adaptar, removendo statements desnecessarios. No caso, o Statement 3 foi removido porque nao era relevante para o TF role naquele momento.

## O problema do estado (409 - Resource Already Exists)

Quando o Terraform roda `apply` sem conhecer recursos existentes (estado vazio), ele tenta CRIAR tudo do zero. Se os recursos ja existem na AWS (criados manualmente ou por outro state), a AWS retorna 400/409.

Solucoes possiveis:
1. **terraform import** — importar recurso existente no estado
2. **Migrar estado para S3** — centralizar o state file (abordado na proxima aula)
3. **Criar em outra regiao** — funciona mas nao e solucao real (apenas demonstracao)

O instrutor menciona que mudar a regiao (ex: `us-east-1` em vez de `us-east-2`) faria os recursos serem criados porque nao existem la. Isso ilustra que recursos AWS sao regionais.

## Secrets vs Variables no GitHub Actions

O instrutor faz uma distincao clara:
- **Secrets:** Valores que NUNCA devem aparecer em logs. GitHub Actions mascara automaticamente (`***`). Usar para: ARNs, regioes (podem revelar infraestrutura), credentials.
- **Variables:** Valores que podem ser publicos. Aparecem em logs normalmente. Usar para: versoes de ferramentas, flags de configuracao.

A sintaxe difere: `secrets.NOME` vs `vars.NOME`.

## Fluxo completo da pipeline neste ponto

```
git push
  → GitHub Actions trigger
    → Assume TF role via OIDC
      → terraform init
        → terraform fmt (validacao de formato)
          → terraform plan (preview)
            → terraform apply --auto-approve
              → ERRO 409 (recursos existem, estado nao conhece)
```

O pipeline funciona ate o apply. O problema nao e de permissao (resolvido com inline policy) nem de segredos (resolvido com secrets/vars), mas de ESTADO — que sera resolvido com S3 backend.

## Autocomplete de secrets no VS Code

O instrutor menciona que o autocomplete de secrets no workflow YAML vem de uma extensao do VS Code que conecta na conta GitHub e lista secrets/variables disponiveis. Isso nao e funcionalidade nativa.

---

# Code Examples: Rodando Pipeline pela 1a Vez

## Inline Policy completa para TF Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRFullAccess",
      "Effect": "Allow",
      "Action": "ecr:*",
      "Resource": "*"
    },
    {
      "Sid": "IAMFullAccess",
      "Effect": "Allow",
      "Action": "iam:*",
      "Resource": "*"
    }
  ]
}
```

Nota: O instrutor comeca com dois statements (ECR e IAM) e planeja adicionar S3 na proxima aula.

## Aplicacao da inline policy via Terraform

```bash
# Validar o que sera alterado
terraform plan

# Aplicar (modifica o TF role adicionando inline policy)
terraform apply --auto-approve
```

Output esperado: `Apply complete! Resources: 0 added, 1 changed, 0 destroyed.`

## Configuracao de Secrets no GitHub

### Via UI
Settings → Secrets and variables → Actions → New repository secret

| Name | Value |
|------|-------|
| `AWS_REGION` | `us-east-2` |
| `ROLE_ASSUME` | `arn:aws:iam::123456789:role/tf-role` |

### Via CLI (alternativa)
```bash
gh secret set AWS_REGION --body "us-east-2"
gh secret set ROLE_ASSUME --body "arn:aws:iam::123456789:role/tf-role"
```

## Configuracao de Variables no GitHub

### Via UI
Settings → Secrets and variables → Actions → Variables → New repository variable

| Name | Value |
|------|-------|
| `TF_VERSION` | `1.8.4` |

### Via CLI
```bash
gh variable set TF_VERSION --body "1.8.4"
```

## Workflow YAML antes (inseguro)

```yaml
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/tf-role
          aws-region: us-east-2

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.8.4
```

Problemas: ARN hardcoded, regiao hardcoded, versao hardcoded.

## Workflow YAML depois (sanitizado)

```yaml
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.ROLE_ASSUME }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ vars.TF_VERSION }}
```

## Erro esperado no apply (409)

```
Error: creating ECR Repository (my-repo): RepositoryAlreadyExistsException:
The repository with name 'my-repo' already exists in the registry with id '123456789'
```

Este erro indica que o estado Terraform nao conhece o recurso existente. Solucao: migrar estado para S3 backend (proxima aula).

## Comandos git para testar pipeline

```bash
# Apos adicionar inline policy
git add .
git commit -m "add new permissions"
git push

# Apos sanitizar secrets
git add .
git commit -m "add secrets"
git push
```

## Verificacao no console AWS

1. IAM → Roles → TF Role
2. Permissions → Inline policies
3. Verificar `tf-permission` presente
4. Clicar para ver JSON e confirmar statements
