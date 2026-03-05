---
name: rs-devops-logs-e-acompanhamento
description: "Applies AppRunner logging, metrics monitoring, and CI/CD pipeline stabilization practices when deploying containers to AWS. Use when user asks to 'monitor AppRunner', 'check deploy logs', 'wait for deploy', 'configure CI/CD pipeline stability', or 'add health check wait'. Covers waitForServiceStability, CloudWatch logs, metrics (2XX/4XX/5XX), and pipeline output steps. Make sure to use this skill whenever configuring AppRunner deploys or debugging deploy pipeline timing issues. Not for local Docker development, Kubernetes, or non-AWS container orchestration."
---

# Logs e Acompanhamento no AppRunner

> Ao deployar no AppRunner, configure a pipeline para aguardar estabilizacao do servico e utilize logs e metricas built-in para visibilidade completa.

## Rules

1. **Sempre configure waitForServiceStability** — sem isso a pipeline reporta sucesso antes do deploy concluir, porque o GitHub Actions encerra ao iniciar o deploy, nao ao confirmar que funcionou
2. **Acompanhe logs via AppRunner e CloudWatch** — AppRunner fornece event logs (tempo de subida, artefato deployado) e application logs (stdout do container), ambos espelhados no CloudWatch
3. **Monitore metricas HTTP built-in** — 2XX (sucesso), 4XX (client error), 5XX (server error), latencia e instancias ativas estao disponiveis sem configuracao adicional
4. **Exporte a URL do servico como output da pipeline** — use steps outputs para disponibilizar a URL do AppRunner como check visivel no GitHub Actions
5. **Tagueie imagens com commit hash E latest** — use `docker tag` para manter rastreabilidade (commit hash) e conveniencia (latest) no ECR
6. **Nao deixe secrets hardcoded no CI** — mova credenciais e configuracoes sensiveis para GitHub Secrets

## Steps

### Step 1: Configurar espera pela estabilizacao

No arquivo `ci.yml`, adicione a flag de espera na action do AppRunner:

```yaml
- name: Deploy to AppRunner
  id: deployAppRunner
  uses: awslabs/amazon-app-runner-deploy@main
  with:
    service: skillz-api
    image: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/skillz-api:${{ github.sha }}
    access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}
    region: us-east-1
    waitForServiceStabilitySeconds: 180
```

O valor de 180 segundos (3 min) e suficiente para a maioria das aplicacoes. Ajuste conforme o tempo de boot da sua aplicacao.

### Step 2: Adicionar step de verificacao com URL

```yaml
- name: AppRunner Check
  run: |
    echo "AppRunner running at: ${{ steps.deployAppRunner.outputs.service-url }}"
```

### Step 3: Otimizar tags Docker no pipeline

```yaml
- name: Build Docker Image
  run: docker build -t $ECR_REGISTRY/skillz-api:${{ github.sha }} .

- name: Push Docker Image
  run: docker push $ECR_REGISTRY/skillz-api:${{ github.sha }}

- name: Tag as latest
  run: docker tag $ECR_REGISTRY/skillz-api:${{ github.sha }} $ECR_REGISTRY/skillz-api:latest

- name: Push latest tag
  run: docker push $ECR_REGISTRY/skillz-api:latest
```

Otimizacao possivel: usar `docker push --all-tags` para enviar todas as tags em um unico comando.

## Verificacao

### Onde encontrar logs no AppRunner

| Tipo | Localizacao | Conteudo |
|------|------------|----------|
| Event logs | AppRunner Console > Service > Logs | Tempo de subida, artefato deployado, health check status |
| Application logs | AppRunner Console > Service > Logs > Application | stdout/stderr do container (ex: logs do NestJS logger) |
| CloudWatch | CloudWatch > Log Groups | Mesmo conteudo, com queries avancadas |

### Metricas disponiveis sem configuracao

| Metrica | O que mostra |
|---------|-------------|
| 2XX count | Requisicoes bem-sucedidas |
| 4XX count | Erros de cliente (rotas inexistentes, etc) |
| 5XX count | Erros de servidor |
| Latencia | Tempo de resposta |
| Active instances | Instancias rodando |

## Heuristics

| Situacao | Acao |
|----------|------|
| Pipeline reporta sucesso mas app retorna 404 | Falta `waitForServiceStabilitySeconds` — pipeline encerrou antes do deploy concluir |
| Deploy em "operation in progress" | Aguarde ou use "Rerun all jobs" no GitHub Actions — nao precisa de novo commit |
| Precisa de dominio customizado | Configure Custom Domain no AppRunner ou aponte via Route 53 |
| Quer rastrear qual commit esta deployado | Compare a tag da imagem no ECR com o commit hash |
| Timeout de 180s nao e suficiente | Aumente o valor — aplicacoes maiores podem levar mais tempo no health check |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Ignorar que pipeline deu sucesso sem verificar o deploy real | Configure `waitForServiceStabilitySeconds` para travar a pipeline ate confirmacao |
| Deixar secrets (tokens, credenciais) hardcoded no `ci.yml` | Use GitHub Secrets e referencie com `${{ secrets.NOME }}` |
| Fazer dois `docker push` separados (hash + latest) | Use `docker push --all-tags` em um unico comando |
| Assumir que o servico esta no ar so porque o health check iniciou | Aguarde a mensagem "routing traffic to application" nos logs |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-logs-e-acompanhamento/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-logs-e-acompanhamento/references/code-examples.md)
