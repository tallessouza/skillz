---
name: rs-devops
description: "Enforces DevOps best practices when configuring Docker containers, building CI/CD pipelines, managing Kubernetes clusters, writing Terraform infrastructure-as-code, implementing service mesh with Istio, or setting up observability with Grafana/Prometheus/OpenTelemetry. Make sure to use this skill whenever deploying applications to Kubernetes, writing Dockerfiles, creating GitHub Actions workflows, provisioning cloud infrastructure with Terraform, configuring Istio routing or mTLS, or instrumenting applications for metrics, logs, and traces. Not for frontend development, React components, or application business logic."
---

# DevOps — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 223 skills organizadas em 8 domínios.

## Decision Tree

```
O que você está fazendo com DevOps?
│
├─ Cultura / fundamentos DevOps?
│  ├─ O que é DevOps → [qual-e-a-ideia-do-dev-ops.md](references/qual-e-a-ideia-do-dev-ops.md)
│  ├─ Três maneiras → [conhecendo-as-tres-maneiras.md](references/conhecendo-as-tres-maneiras.md)
│  ├─ CALMS framework → [adotando-a-cultura-dev-ops.md](references/adotando-a-cultura-dev-ops.md)
│  └─ SRE → [dev-ops-no-dia-a-dia-e-sre.md](references/dev-ops-no-dia-a-dia-e-sre.md)
│
├─ Docker / containers?
│  ├─ Conceitos Docker → [containers-docker-e-lxc.md](references/containers-docker-e-lxc.md)
│  ├─ Estrutura de Dockerfile → [estrutura-de-um-dockerfile.md](references/estrutura-de-um-dockerfile.md)
│  ├─ Multi-stage build → [criando-multiplos-estagios.md](references/criando-multiplos-estagios.md)
│  ├─ Otimização de imagens → [comparando-imagens.md](references/comparando-imagens.md)
│  ├─ Volumes → [entendendo-sobre-volumes.md](references/entendendo-sobre-volumes.md)
│  ├─ Networking → [camada-de-abstracao.md](references/camada-de-abstracao.md)
│  ├─ Docker Compose → [declarando-multiplos-containers.md](references/declarando-multiplos-containers.md)
│  └─ Correções para produção → [ultimas-correcoes-no-dockerfile.md](references/ultimas-correcoes-no-dockerfile.md)
│
├─ Kubernetes core?
│  ├─ O que é K8s → [o-que-e-kubernetes.md](references/o-que-e-kubernetes.md)
│  ├─ Arquitetura do cluster → [principais-componentes.md](references/principais-componentes.md)
│  ├─ Criando cluster (Kind) → [configurando-e-criando-nosso-primeiro-cluster.md](references/configurando-e-criando-nosso-primeiro-cluster.md)
│  ├─ Deployment → [criando-um-deployment.md](references/criando-um-deployment.md)
│  ├─ Services → [acessando-pods.md](references/acessando-pods.md)
│  ├─ ConfigMaps → [entendendo-sobre-o-config-map.md](references/entendendo-sobre-o-config-map.md)
│  ├─ Secrets → [explorando-o-objeto-secret.md](references/explorando-o-objeto-secret.md)
│  ├─ PV/PVC/StorageClass → [volumes-e-storage-class.md](references/volumes-e-storage-class.md)
│  ├─ Deploy strategies → [trabalhando-com-estrategias-de-deploy.md](references/trabalhando-com-estrategias-de-deploy.md)
│  └─ Manifestos declarativos → [valor-dos-manifestos-ceclarativos-e-namespaces.md](references/valor-dos-manifestos-ceclarativos-e-namespaces.md)
│
├─ Kubernetes scaling / probes?
│  ├─ HPA autoscaling → [criando-o-hpa-utilizando-a-v-2.md](references/criando-o-hpa-utilizando-a-v-2.md)
│  ├─ Probes (startup/liveness/readiness) → [garantindo-prontidao-da-aplicacao.md](references/garantindo-prontidao-da-aplicacao.md)
│  ├─ Metrics server → [como-o-metrics-server-funciona.md](references/como-o-metrics-server-funciona.md)
│  └─ Stress testing → [estressando-a-nossa-aplicacao.md](references/estressando-a-nossa-aplicacao.md)
│
├─ Service mesh / Istio?
│  ├─ Conceitos service mesh → [conhecendo-service-mesh.md](references/conhecendo-service-mesh.md)
│  ├─ Instalando Istio → [instalando-o-istio-e-primeiras-configuracoes.md](references/instalando-o-istio-e-primeiras-configuracoes.md)
│  ├─ Virtual Service → [configurando-o-virtual-service.md](references/configurando-o-virtual-service.md)
│  ├─ Destination Rule → [criando-o-nosso-primeiro-destination-rule.md](references/criando-o-nosso-primeiro-destination-rule.md)
│  ├─ Canary deployment → [entendendo-e-configurando-o-canary-deployment.md](references/entendendo-e-configurando-o-canary-deployment.md)
│  ├─ Circuit breaker → [configurando-circuit-breaker.md](references/configurando-circuit-breaker.md)
│  ├─ mTLS → [o-que-e-e-qual-problema-resolve.md](references/o-que-e-e-qual-problema-resolve.md)
│  └─ Fault injection → [injetando-falha-nas-aplicacoes.md](references/injetando-falha-nas-aplicacoes.md)
│
├─ Observabilidade?
│  ├─ O que é observabilidade → [o-que-e-observabilidade.md](references/o-que-e-observabilidade.md)
│  ├─ Golden signals → [entendendo-os-quatro-sinais-principais-da-aplicacao.md](references/entendendo-os-quatro-sinais-principais-da-aplicacao.md)
│  ├─ Stack LGTM → [conhecendo-a-stack-lgtm.md](references/conhecendo-a-stack-lgtm.md)
│  ├─ OpenTelemetry setup → [configurando-aplicacao-com-otel.md](references/configurando-aplicacao-com-otel.md)
│  ├─ Prometheus → [configurando-o-prometheus.md](references/configurando-o-prometheus.md)
│  ├─ Grafana dashboards → [criando-dashboards-de-acompanhamento.md](references/criando-dashboards-de-acompanhamento.md)
│  ├─ Loki (logs) → [configurando-o-loki.md](references/configurando-o-loki.md)
│  ├─ Tempo (traces) → [grafana-tempo.md](references/grafana-tempo.md)
│  ├─ Alertas → [configurando-alarmes.md](references/configurando-alarmes.md)
│  └─ Métricas customizadas → [criando-metricas-customizadas.md](references/criando-metricas-customizadas.md)
│
├─ Terraform / IaC?
│  ├─ Overview IaC → [overview.md](references/overview.md)
│  ├─ Terraform CLI → [cli-do-terraform.md](references/cli-do-terraform.md)
│  ├─ Provider AWS → [criando-nosso-primeiro-recurso.md](references/criando-nosso-primeiro-recurso.md)
│  ├─ Provider GCP → [conhecendo-e-configurando-provider.md](references/conhecendo-e-configurando-provider.md)
│  ├─ Provider Azure → [conhecendo-e-configurando-provider-1.md](references/conhecendo-e-configurando-provider-1.md)
│  ├─ State remoto (S3) → [mantendo-o-estado-na-nuvem.md](references/mantendo-o-estado-na-nuvem.md)
│  ├─ Modules → [o-que-sao-modulos.md](references/o-que-sao-modulos.md)
│  ├─ Variables → [variaveis.md](references/variaveis.md)
│  ├─ Outputs → [outputs.md](references/outputs.md)
│  ├─ Data sources → [datasources.md](references/datasources.md)
│  └─ Workspaces → [workspaces.md](references/workspaces.md)
│
└─ CI/CD pipelines?
   ├─ GitHub Actions intro → [git-actions.md](references/git-actions.md)
   ├─ Primeiro workflow → [configurando-nosso-primeiro-workflow.md](references/configurando-nosso-primeiro-workflow.md)
   ├─ Triggers → [entendendo-sobre-os-triggers.md](references/entendendo-sobre-os-triggers.md)
   ├─ Build step → [adicionando-step-de-build.md](references/adicionando-step-de-build.md)
   ├─ Docker → ECR → [migrando-pro-ecr.md](references/migrando-pro-ecr.md)
   ├─ Deploy AppRunner → [deployando-nossa-aplicacao.md](references/deployando-nossa-aplicacao.md)
   ├─ Semantic release → [configurando-estrutura-12.md](references/configurando-estrutura-12.md)
   ├─ IAM roles → [configurando-roles.md](references/configurando-roles.md)
   └─ Boas práticas → [boas-praticas-em-pipelines-no-geral.md](references/boas-praticas-em-pipelines-no-geral.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante (Docker, K8s, Terraform, CI/CD)
- **Fase 4 (Validação)** → Siga "CI/CD pipelines" + "Observabilidade"
