---
name: rs-devops-configurando-roles
description: "Applies AWS IAM Role configuration for GitHub Actions CI/CD pipelines using Terraform. Use when user asks to 'create IAM role', 'connect GitHub to AWS', 'setup OIDC role', 'configure CI/CD permissions', or 'assume role for pipeline'. Follows Web Identity federation pattern with OIDC provider. Make sure to use this skill whenever creating IAM roles for GitHub Actions or configuring trust relationships between Git and AWS. Not for EC2 instance roles, Lambda execution roles, or cross-account roles without OIDC."
---

# Configurando IAM Roles para CI/CD

> Criar uma IAM Role na AWS que permite ao GitHub Actions assumir acesso via Web Identity federation com OIDC.

## Prerequisites

- OIDC Identity Provider ja configurado na AWS (token.actions.githubusercontent.com)
- Terraform instalado e configurado com provider AWS
- Repositorio GitHub com workflow CI/CD que referencia `role-to-assume`

## Conceito

Uma Role serve para dar acesso a um servico, conta ou politica customizada. No contexto CI/CD, a Role usa Web Identity para acesso federado — o GitHub Actions chega na AWS pela rota do token.actions e assume a Role apos autenticacao.

## Steps

### Step 1: Gerar o JSON da Trust Policy via Console (dica)

Usar a interface AWS para gerar o JSON correto, porque escrever na mao e propenso a erro:

1. IAM → Roles → Create Role → Web Identity
2. Selecionar o Identity Provider criado (token.actions.githubusercontent.com)
3. Audience: sts.amazonaws.com
4. Preencher organizacao (username GitHub), repositorio e branch
5. Clicar Next ate gerar o JSON da Trust Policy
6. Copiar o JSON — NAO criar a Role pelo console

### Step 2: Criar o recurso Terraform

```hcl
resource "aws_iam_role" "ecr_role" {
  name = "ecr_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRoleWithWebIdentity"
        Principal = {
          Federated = aws_iam_openid_connect_provider.oidc_git.arn
        }
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = "repo:ORG/REPO:ref:refs/heads/BRANCH"
          }
        }
      }
    ]
  })

  tags = {
    IAC = true
  }
}
```

### Step 3: Aplicar e referenciar no CI

```bash
terraform plan
terraform apply -auto-approve
```

Copiar o ARN da Role e colocar no workflow CI como secret:

```yaml
# .github/workflows/ci.yml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
```

## Restricao de acesso

A Condition no trust policy controla EXATAMENTE quem pode assumir a Role:

| Campo | Exemplo | Efeito |
|-------|---------|--------|
| Organizacao | `EuSouODaniel` | Apenas repos deste owner |
| Repositorio | `SkillzCIAPI` | Apenas este repo |
| Branch | `main` | Pipeline em outra branch da erro de permissao |

Organizacao e obrigatoria. Repositorio e branch sao opcionais — omitir libera acesso mais amplo.

## Error handling

- Se pipeline da erro de permissao: verificar se branch no Condition bate com a branch do workflow
- Se `sts:AssumeRoleWithWebIdentity` falha: verificar se o OIDC Provider existe e o audience e `sts.amazonaws.com`
- Role criada mas sem acesso a recursos: Role precisa de policies adicionais (proximo passo)

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar Role pelo console e nao pelo Terraform | Usar console so para gerar o JSON, criar via IaC |
| Escrever trust policy JSON na mao | Gerar pelo console e copiar |
| Liberar acesso para organizacao inteira sem necessidade | Restringir por repo + branch |
| Colocar ARN da Role hardcoded no workflow | Usar GitHub Secrets |
| Assumir que Role com trust policy ja tem permissoes | Adicionar policies de acesso aos recursos necessarios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-roles/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-roles/references/code-examples.md)
