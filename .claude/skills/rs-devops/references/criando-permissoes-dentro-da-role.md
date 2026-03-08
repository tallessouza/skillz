---
name: rs-devops-criando-permissoes-role-ecr
description: "Applies IAM inline policy patterns for ECR access when configuring CI/CD permissions with Terraform. Use when user asks to 'configure ECR permissions', 'create IAM role for ECR', 'setup pipeline permissions', 'fix ECR push errors', or 'terraform ECR role'. Enforces least-privilege inline policies, scan_on_push, and id-token permissions for GitHub Actions OIDC. Make sure to use this skill whenever setting up IAM roles for container registry access. Not for general IAM policies, S3 permissions, or non-ECR registry configurations."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-ecr-permissions
  tags: [terraform, iam, ecr, permissions, github-actions, oidc, inline-policy]
---

# Criando Permissoes na Role para ECR

> Configurar permissoes IAM via Inline Policy no Terraform para acesso ao ECR com principio de menor privilegio.

## Rules

1. **Use Inline Policy, nao Attach Policy** — porque inline permite personalizar exatamente as actions necessarias sem conceder acesso amplo demais
2. **Nunca use Full Access** — `ecr:*` em todos os recursos e acoes eh muito permissivo; use apenas as actions necessarias
3. **Read Only nao serve para CI/CD** — a pipeline precisa enviar imagens, nao apenas ler
4. **Habilite scan_on_push sempre** — porque detecta vulnerabilidades automaticamente a cada push de imagem
5. **Configure id-token permissions na pipeline** — sem `id-token: write`, o OIDC nao consegue assumir a role
6. **Prototipe na console AWS, codifique no Terraform** — use a console para entender a estrutura, depois implemente via IaC

## Steps

### Step 1: Criar Inline Policy na Role

```hcl
resource "aws_iam_role" "ecr_role" {
  name               = "ecr-app-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  inline_policy {
    name = "ECRAppPermission"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Sid    = "Statement1"
          Effect = "Allow"
          Action = [
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:BatchCheckLayerAvailability",
            "ecr:PutImage",
            "ecr:InitiateLayerUpload",
            "ecr:UploadLayerPart",
            "ecr:CompleteLayerUpload",
            "ecr:GetAuthorizationToken"
          ]
          Resource = "*"
        }
      ]
    })
  }
}
```

### Step 2: Criar repositorio ECR

```hcl
resource "aws_ecr_repository" "app" {
  name                 = "skillz-ci"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    ManagedBy = "terraform"
  }
}
```

### Step 3: Adicionar permissions no GitHub Actions

```yaml
permissions:
  id-token: write
  contents: read
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa enviar imagem para ECR | Inline Policy com Get + Put + Upload actions |
| Quer restringir a um repo especifico | Substitua `Resource: "*"` pelo ARN do repositorio |
| Usa tag `latest` | Mantenha `image_tag_mutability = "MUTABLE"` |
| Usa tags versionadas (v1.0.0) | Use `IMMUTABLE` para garantir que tags nao sejam sobrescritas |
| Pipeline falha com erro de id-token | Adicione `permissions: id-token: write` no workflow |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `ecr:*` com `Resource: "*"` (Full Access) | Listar apenas actions necessarias |
| Attach Policy com AmazonEC2ContainerRegistryFullAccess | Inline Policy customizada |
| Esquecer `scan_on_push = true` | Sempre habilitar para seguranca |
| Criar ECR manualmente na console | Criar via Terraform para rastreabilidade |
| Omitir `permissions` no GitHub Actions | Declarar `id-token: write` e `contents: read` |

## Troubleshooting

### Pipeline falha com erro de id-token ao assumir role
**Symptom:** GitHub Actions falha com erro relacionado a `id-token` ou `OIDC` ao tentar assumir a role AWS.
**Cause:** O workflow YAML nao declara `permissions: id-token: write`, impedindo o OIDC de gerar o token necessario.
**Fix:** Adicione `permissions: { id-token: write, contents: read }` no job do workflow que assume a role AWS.

## Verification

- Na AWS Console: Role > Permissions > verificar inline policy presente
- Na AWS Console: ECR > verificar repositorio criado com scan habilitado
- No GitHub Actions: verificar que a action assume a role e loga no ECR com sucesso

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
