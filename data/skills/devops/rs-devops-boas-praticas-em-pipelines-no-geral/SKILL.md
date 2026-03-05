---
name: rs-devops-boas-praticas-pipelines
description: "Enforces best practices for CI/CD pipeline security by extracting hardcoded secrets and variables in GitHub Actions workflows. Use when user asks to 'create a pipeline', 'write a GitHub Actions workflow', 'configure CI/CD', 'setup deployment', or 'review pipeline security'. Applies rules: no hardcoded credentials, roles as secrets, regions as secrets, service names as variables, uppercase naming for vars. Make sure to use this skill whenever generating or reviewing CI/CD pipeline YAML files. Not for application code secrets management, .env files, or Docker configuration."
---

# Boas Praticas em Pipelines CI/CD

> Nunca deixe informacoes sensiveis ou valores reutilizaveis hardcoded em pipelines — extraia para secrets e variaveis.

## Rules

1. **Roles e credenciais sao sempre secrets** — `secrets.AWS_LOGIN_ROLE` nao `arn:aws:iam::123456:role/...` hardcoded, porque contem o numero da conta AWS e permissoes
2. **Regioes sao secrets** — `secrets.AWS_REGION` nao `us-east-2` hardcoded, porque sao reutilizadas em multiplos jobs e expoe infraestrutura
3. **Nomes de servico sao variaveis** — `vars.SERVICE_NAME` nao `skillz-api` hardcoded, porque mudam entre ambientes mas nao sao sensiveis
4. **Sempre uppercase para nomes** — `AWS_LOGIN_ROLE`, `SERVICE_NAME`, nao `awsLoginRole`, porque segue convencao de constantes e facilita identificacao
5. **Limpe secrets obsoletas** — remova tokens e credenciais que nao sao mais utilizados (ex: migrou de DockerHub para ECR, delete DOCKERHUB_TOKEN)
6. **Mantenha coerencia entre IAC e CI/CD** — se o modulo de IAC usa variaveis, o pipeline tambem deve usar, porque inconsistencia gera drift

## How to write

### Referenciando secrets no workflow

```yaml
env:
  AWS_LOGIN_ROLE: ${{ secrets.AWS_LOGIN_ROLE }}
  AWS_REGION: ${{ secrets.AWS_REGION }}
  AWS_APPRUNNER_ROLE: ${{ secrets.AWS_APPRUNNER_ROLE }}
```

### Referenciando variaveis (nao-sensiveis)

```yaml
env:
  SERVICE_NAME: ${{ vars.SERVICE_NAME }}
```

### Classificacao: secret vs variable

```yaml
# SECRETS (contém dados sensíveis):
# - ARN de roles (contém account ID)
# - Tokens de API (GH_TOKEN, etc)
# - Regiões (expõem infraestrutura)

# VARIABLES (valores reutilizáveis, não-sensíveis):
# - Nome do serviço
# - Nome do ambiente (staging, production)
# - Flags de configuração
```

## Example

**Before (valores hardcoded no pipeline):**

```yaml
- name: Configure AWS
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions
    aws-region: us-east-2

- name: Deploy
  run: |
    aws apprunner create-service \
      --service-name skillz-api \
      --source-configuration roleArn=arn:aws:iam::123456789:role/apprunner
```

**After (com secrets e variaveis extraidas):**

```yaml
- name: Configure AWS
  with:
    role-to-assume: ${{ secrets.AWS_LOGIN_ROLE }}
    aws-region: ${{ secrets.AWS_REGION }}

- name: Deploy
  run: |
    aws apprunner create-service \
      --service-name ${{ vars.SERVICE_NAME }} \
      --source-configuration roleArn=${{ secrets.AWS_APPRUNNER_ROLE }}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Valor contem account ID, ARN, ou token | Secret |
| Valor e regiao AWS | Secret |
| Valor e nome de servico ou ambiente | Variable |
| Migrou de provedor (ex: DockerHub → ECR) | Delete secrets antigas |
| Mesmo valor usado em multiplos jobs | Extraia para env no nivel do workflow |
| Pipeline de IAC ja usa variaveis | Pipeline de CI/CD deve espelhar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `role-to-assume: arn:aws:iam::123:role/x` | `role-to-assume: ${{ secrets.AWS_LOGIN_ROLE }}` |
| `aws-region: us-east-2` | `aws-region: ${{ secrets.AWS_REGION }}` |
| `--service-name skillz-api` | `--service-name ${{ vars.SERVICE_NAME }}` |
| Secrets antigas de provedores abandonados | Delete e mantenha repositorio limpo |
| `servicename` (lowercase) | `SERVICE_NAME` (uppercase como constante) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
