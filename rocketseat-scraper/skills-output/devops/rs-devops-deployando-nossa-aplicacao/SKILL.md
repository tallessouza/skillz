---
name: rs-devops-deployando-nossa-aplicacao
description: "Applies AWS AppRunner deployment patterns in CI/CD pipelines using GitHub Actions. Use when user asks to 'deploy to AppRunner', 'configure CD pipeline', 'setup continuous deployment', 'deploy container to AWS', or 'add deploy step to GitHub Actions'. Covers service configuration, image references via step outputs, IAM role ARNs, memory/CPU constraints, and common deployment errors. Make sure to use this skill whenever configuring AppRunner deployments or troubleshooting CD pipeline failures. Not for ECS, EKS, Lambda, or non-container deployments."
---

# Deploy com AWS AppRunner via CI/CD

> Configure o step de deploy no GitHub Actions usando a action `aws-labs/amazon-apprunner-deploy` com referencia dinamica de imagem via outputs de steps anteriores.

## Rules

1. **Use a action oficial aws-labs/amazon-apprunner-deploy** — porque e mantida pela AWS e abstrai a complexidade da API do AppRunner
2. **Referencie imagens via outputs de steps, nunca hardcode a tag** — `steps.build-docker-img.outputs.img` porque a tag muda a cada commit (SHA-based)
3. **Defina CPU e memoria em valores aceitos pelo AppRunner** — 1 vCPU exige minimo 2 GB RAM, porque combinacoes invalidas causam falha silenciosa no deploy
4. **Armazene ARNs de roles como secrets** — `secrets.APPRUNNER_ROLE_ARN` porque expor ARNs no codigo e risco de seguranca
5. **Trate operacoes em progresso** — AppRunner rejeita deploy se outro esta rodando (status `operation in progress`), porque nao ha fila automatica
6. **Verifique logs do AppRunner apos deploy** — a action pode reportar sucesso mesmo com a aplicacao falhando ao iniciar, porque o deploy do container != aplicacao saudavel

## How to write

### Step de deploy no workflow

```yaml
- name: deploy-to-apprunner
  uses: aws-labs/amazon-apprunner-deploy@main
  with:
    service: rocketseat-api
    access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}
    region: us-east-1
    cpu: 1
    memory: 2
    port: 3000
    image: ${{ steps.build-docker-img.outputs.img }}
```

### Gerar output de imagem no step de build

```yaml
- name: Build Docker Image
  id: build-docker-img
  run: |
    IMG=${{ steps.login-ecr.outputs.registry }}/${{ env.REPO_NAME }}:${{ steps.generate-tag.outputs.tag }}
    docker build -t $IMG .
    docker push $IMG
    echo "img=$IMG" >> $GITHUB_OUTPUT
```

### Gerar tag baseada no SHA do commit

```yaml
- name: Generate Tag
  id: generate-tag
  run: |
    SHA=$(echo $GITHUB_SHA | head -c 7)
    echo "tag=$SHA" >> $GITHUB_OUTPUT
```

## Example

**Before (tag hardcoded, sem outputs):**
```yaml
- name: deploy
  uses: aws-labs/amazon-apprunner-deploy@main
  with:
    service: my-app
    image: 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
    memory: 1
    cpu: 1
```

**After (tag dinamica, memoria correta, role em secret):**
```yaml
- name: Generate Tag
  id: generate-tag
  run: echo "tag=$(echo $GITHUB_SHA | head -c 7)" >> $GITHUB_OUTPUT

- name: Build Docker Image
  id: build-docker-img
  run: |
    IMG=${{ steps.login-ecr.outputs.registry }}/my-app:${{ steps.generate-tag.outputs.tag }}
    docker build -t $IMG .
    docker push $IMG
    echo "img=$IMG" >> $GITHUB_OUTPUT

- name: deploy-to-apprunner
  uses: aws-labs/amazon-apprunner-deploy@main
  with:
    service: my-app
    access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}
    region: us-east-1
    cpu: 1
    memory: 2
    port: 3000
    image: ${{ steps.build-docker-img.outputs.img }}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Primeiro deploy do servico | Espere mais tempo — AppRunner cria o servico + provisiona rede |
| Deploy falha com "operation in progress" | Aguarde o deploy anterior finalizar antes de re-executar |
| Action reporta sucesso mas app nao responde | Verifique logs do AppRunner — deploy do container != app saudavel |
| Precisa de dominio customizado | Configure via Route 53 apontando para o dominio gerado |
| App precisa de banco de dados | Configure a connection string como variavel de ambiente no AppRunner, nao use hostname de container local |
| Combinacao CPU/memoria invalida | Consulte a tabela de configuracoes validas do AppRunner |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `image: repo/app:latest` | `image: ${{ steps.build-docker-img.outputs.img }}` |
| `access-role-arn: arn:aws:iam::...` hardcoded | `access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}` |
| `memory: 1` com `cpu: 1` | `memory: 2` com `cpu: 1` (minimo aceito) |
| Hostname `mysql` de docker-compose em producao | Connection string real do banco gerenciado |
| Ignorar falha no CD e assumir que CI OK = tudo OK | Verificar logs do AppRunner independentemente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
