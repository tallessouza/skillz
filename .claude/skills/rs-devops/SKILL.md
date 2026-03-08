---
name: rs-devops
description: "Enforces DevOps best practices when configuring Docker containers, building CI/CD pipelines, managing Kubernetes clusters, writing Terraform infrastructure-as-code, implementing service mesh with Istio, or setting up observability with Grafana/Prometheus/OpenTelemetry. Make sure to use this skill whenever deploying applications to Kubernetes, writing Dockerfiles, creating GitHub Actions workflows, provisioning cloud infrastructure with Terraform, configuring Istio routing or mTLS, or instrumenting applications for metrics, logs, and traces. Not for frontend development, React components, or application business logic."
---

# DevOps — Fluxo de Decisões

> Cada decisão de DevOps segue: automatize o que é repetitivo, observe o que é crítico, e use infraestrutura como código para tudo que é provisionável.

> **Caminho rápido para deploy de app Node.js:**
> Docker → K8s Deployment + Service → GitHub Actions CI/CD → Observabilidade básica
> [estrutura-de-um-dockerfile](references/estrutura-de-um-dockerfile.md) → [criando-um-deployment](references/criando-um-deployment.md) → [configurando-nosso-primeiro-workflow](references/configurando-nosso-primeiro-workflow.md) → [configurando-aplicacao-com-otel](references/configurando-aplicacao-com-otel.md)

---

## Estou começando com DevOps ou preciso entender a cultura?

### Entender o que é DevOps e por que existe
Quando escolher: Primeiro contato, convencer equipe/gestão, entender o "porquê"
- [qual-e-a-ideia-do-dev-ops](references/qual-e-a-ideia-do-dev-ops.md) — O que é DevOps como cultura (não ferramenta)
- [contexto-de-um-mundo-sem-dev-ops](references/contexto-de-um-mundo-sem-dev-ops.md) — O problema que DevOps resolve
- [conhecendo-as-tres-maneiras](references/conhecendo-as-tres-maneiras.md) — Flow, Feedback, Continuous Learning
- [adotando-a-cultura-dev-ops](references/adotando-a-cultura-dev-ops.md) — Framework CALMS na prática
- [sindrome-da-pessoa-heroi](references/sindrome-da-pessoa-heroi.md) — Anti-pattern organizacional

### Entender DevOps no dia-a-dia
Quando escolher: Já entende a cultura, quer aplicar no cotidiano
- [dev-ops-no-dia-a-dia-e-sre](references/dev-ops-no-dia-a-dia-e-sre.md) — DevOps vs SRE na prática
- [entregando-valor](references/entregando-valor.md) — Foco em entrega contínua de valor
- [focando-no-valor-e-errando-rapido](references/focando-no-valor-e-errando-rapido.md) — Fail fast, learn fast
- [metrificando-e-descentralizando-conhecimento](references/metrificando-e-descentralizando-conhecimento.md) — Métricas e knowledge sharing

### Escolher ferramentas
Quando escolher: Já entende a cultura, precisa montar o toolchain
- [ferramentas-populares](references/ferramentas-populares.md) — Panorama de ferramentas DevOps
- [ferramentas-4](references/ferramentas-4.md) — Ferramentas por categoria
- [um-rapido-overview-acerca-de-ferramentas-externas](references/um-rapido-overview-acerca-de-ferramentas-externas.md) — Ferramentas externas ao ecossistema

---

## Preciso containerizar minha aplicação?

### Entender containers primeiro
Quando escolher: Nunca usou Docker, precisa entender o conceito
- [entrando-em-conceitos-basicos](references/entrando-em-conceitos-basicos.md) — Conceitos básicos de containers
- [containers-docker-e-lxc](references/containers-docker-e-lxc.md) — O que são containers (Docker vs LXC)
- [open-container-initiative](references/open-container-initiative.md) — Padrão OCI e portabilidade
- [principios-de-isolamento](references/principios-de-isolamento.md) — Namespaces, cgroups, isolamento
- [arquivos-e-containers](references/arquivos-e-containers.md) — Filesystem de containers
- [entendendo-mais-sobre-o-docker](references/entendendo-mais-sobre-o-docker.md) — Docker engine e arquitetura
- [principais-formas-de-trabalhar-com-container](references/principais-formas-de-trabalhar-com-container.md) — CLI, Compose, orquestração

### Criar meu primeiro container
Quando escolher: Entende containers, quer rodar a primeira app
- [entendendo-sobre-uma-imagem-base](references/entendendo-sobre-uma-imagem-base.md) — Escolhendo imagem base
- [estrutura-de-um-dockerfile](references/estrutura-de-um-dockerfile.md) — Anatomia de um Dockerfile
- [conteinerizando-a-nossa-aplicacao](references/conteinerizando-a-nossa-aplicacao.md) — Containerizar app existente
- [rodando-nosso-container](references/rodando-nosso-container.md) — docker run e flags
- [entendendo-problemas-da-tag-latest](references/entendendo-problemas-da-tag-latest.md) — Por que não usar :latest

#### Preciso otimizar a imagem?

##### Multi-stage build
Quando escolher: Imagem muito grande, separar build de runtime
- [criando-multiplos-estagios](references/criando-multiplos-estagios.md) — Multi-stage builds
- [adicionando-o-alpine-na-nossa-imagem](references/adicionando-o-alpine-na-nossa-imagem.md) — Usando Alpine como base
- [alpine-e-stretch](references/alpine-e-stretch.md) — Alpine vs Debian Stretch
- [comparando-imagens](references/comparando-imagens.md) — Comparando tamanhos de imagem
- [melhorias-e-otimizacoes-na-nossa-imagem](references/melhorias-e-otimizacoes-na-nossa-imagem.md) — Otimizações avançadas
- [ultimas-correcoes-no-dockerfile](references/ultimas-correcoes-no-dockerfile.md) — Correções para produção

### Preciso de múltiplos containers?
Quando escolher: App + banco, app + cache, microserviços locais
- [rodando-multiplos-containers](references/rodando-multiplos-containers.md) — Vários containers simultâneos
- [comunicacao-entre-containers](references/comunicacao-entre-containers.md) — Comunicação inter-container
- [gerenciando-redes](references/gerenciando-redes.md) — Docker networks
- [camada-de-abstracao](references/camada-de-abstracao.md) — Abstração de rede no Docker
- [declarando-multiplos-containers](references/declarando-multiplos-containers.md) — Docker Compose
- [configurando-back-end](references/configurando-back-end.md) — Backend em Docker Compose

### Preciso de volumes (dados persistentes)?
Quando escolher: Banco de dados, uploads, logs persistentes
- [entendendo-sobre-volumes](references/entendendo-sobre-volumes.md) — Conceito de volumes Docker
- [persistindo-informacoes-nos-volumes](references/persistindo-informacoes-nos-volumes.md) — Persistência na prática

### Preciso publicar minha imagem?
Quando escolher: Deploy em produção, compartilhar imagem com equipe
- [enviando-a-nossa-imagem-pro-repositorio](references/enviando-a-nossa-imagem-pro-repositorio.md) — Push para registry
- [conhecendo-o-min-io](references/conhecendo-o-min-io.md) — MinIO como storage S3-compatible

---

## Preciso orquestrar containers em produção?

### Entender Kubernetes primeiro
Quando escolher: Nunca usou K8s, precisa entender se faz sentido
- [o-que-e-kubernetes](references/o-que-e-kubernetes.md) — O que é e quando usar K8s
- [quais-problemas-resolve](references/quais-problemas-resolve.md) — Problemas que K8s resolve
- [problemas-que-resolve-e-beneficios](references/problemas-que-resolve-e-beneficios.md) — Benefícios concretos
- [estrutura-dentro-do-kubernetes](references/estrutura-dentro-do-kubernetes.md) — Arquitetura interna
- [principais-componentes](references/principais-componentes.md) — Control plane e data plane
- [consigo-rodar-no-kubernetes-como-seria](references/consigo-rodar-no-kubernetes-como-seria.md) — Viabilidade para meu caso

### Criar e configurar um cluster
Quando escolher: Decidiu usar K8s, precisa do primeiro cluster
- [como-executar-um-cluster-kubernetes](references/como-executar-um-cluster-kubernetes.md) — Opções para rodar K8s
- [configurando-e-criando-nosso-primeiro-cluster](references/configurando-e-criando-nosso-primeiro-cluster.md) — Primeiro cluster com Kind
- [configurando-nosso-cluster-kubernetes](references/configurando-nosso-cluster-kubernetes.md) — Configuração do cluster
- [configurando-cluster-com-multiplos-nos](references/configurando-cluster-com-multiplos-nos.md) — Multi-node cluster
- [reconfigurando-o-nosso-cluster](references/reconfigurando-o-nosso-cluster.md) — Reconfiguração de cluster

### Fazer deploy da minha aplicação

#### Qual objeto usar?

##### Pod direto (aprendizado)
Quando escolher: Apenas para aprender, NUNCA em produção
- [subindo-o-nosso-primeiro-container-no-k-8-s](references/subindo-o-nosso-primeiro-container-no-k-8-s.md) — Primeiro pod
- [acessando-container-dentro-do-cluster](references/acessando-container-dentro-do-cluster.md) — Acessar container no pod
- [criando-os-objetos-do-kubernetes](references/criando-os-objetos-do-kubernetes.md) — Criar objetos via YAML

##### ReplicaSet
Quando escolher: Precisa de réplicas mas sem rolling update
- [criando-um-replica-set](references/criando-um-replica-set.md) — Criar ReplicaSet
- [problemas-de-um-replica-set](references/problemas-de-um-replica-set.md) — Limitações do ReplicaSet

##### Deployment (recomendado)
Quando escolher: Produção, rolling updates, rollback
- [criando-um-deployment](references/criando-um-deployment.md) — Criar Deployment
- [criando-uma-nova-versao-da-nossa-aplicacao](references/criando-uma-nova-versao-da-nossa-aplicacao.md) — Atualizar versão
- [criando-nova-tag-e-controlando-rollback-da-aplicacao](references/criando-nova-tag-e-controlando-rollback-da-aplicacao.md) — Tags e rollback
- [criando-service-e-explorando-image-pull-policy](references/criando-service-e-explorando-image-pull-policy.md) — Service + imagePullPolicy
- [deployando-a-nossa-primeira-aplicacao](references/deployando-a-nossa-primeira-aplicacao.md) — Deploy completo

### Como expor minha aplicação?
Quando escolher: App está rodando, precisa acessar de fora do cluster
- [acessando-pods](references/acessando-pods.md) — Services e acesso a pods
- [valor-dos-manifestos-ceclarativos-e-namespaces](references/valor-dos-manifestos-ceclarativos-e-namespaces.md) — Manifestos declarativos e namespaces

### Como configurar a aplicação no cluster?

#### Variáveis de ambiente e configuração
- [explorando-variavel-de-ambiente-na-aplicacao](references/explorando-variavel-de-ambiente-na-aplicacao.md) — Env vars em pods
- [entendendo-sobre-o-config-map](references/entendendo-sobre-o-config-map.md) — ConfigMaps
- [explorando-o-objeto-secret](references/explorando-o-objeto-secret.md) — Secrets
- [melhorando-gerenciamento-de-envs](references/melhorando-gerenciamento-de-envs.md) — Boas práticas de env management
- [ajustando-o-yaml](references/ajustando-o-yaml.md) — Ajustes em manifests YAML
- [refatorando-a-aplicacao-e-entendendo-mais-sobre-o-command](references/refatorando-a-aplicacao-e-entendendo-mais-sobre-o-command.md) — Command e args no pod

#### Preciso de armazenamento persistente?
- [volumes-e-storage-class](references/volumes-e-storage-class.md) — Visão geral de volumes K8s
- [armazenamento-de-volumes](references/armazenamento-de-volumes.md) — Tipos de armazenamento
- [persistent-volume](references/persistent-volume.md) — PersistentVolume (PV)
- [persistent-volume-claim](references/persistent-volume-claim.md) — PersistentVolumeClaim (PVC)
- [criando-o-storage-class](references/criando-o-storage-class.md) — StorageClass
- [configurando-o-storage](references/configurando-o-storage.md) — Configuração de storage
- [reservando-o-espaco-com-o-pv](references/reservando-o-espaco-com-o-pv.md) — Reserva de espaço
- [criando-o-pvc](references/criando-o-pvc.md) — Criar PVC
- [associando-o-pvc-na-nossa-aplicacao](references/associando-o-pvc-na-nossa-aplicacao.md) — Montar PVC no pod

#### Qual estratégia de deploy usar?

##### Rolling Update (padrão)
Quando escolher: Zero downtime, atualização gradual
- [trabalhando-com-estrategias-de-deploy](references/trabalhando-com-estrategias-de-deploy.md) — Estratégias de deploy

##### Recreate
Quando escolher: Downtime aceitável, simplicidade
- [entendendo-o-recreate](references/entendendo-o-recreate.md) — Estratégia Recreate

##### Canary (via Istio)
Quando escolher: Validar versão nova com % do tráfego
- [entendendo-e-configurando-o-canary-deployment](references/entendendo-e-configurando-o-canary-deployment.md) — Canary com Istio
> Cross-ref: [Service Mesh / Istio](#preciso-gerenciar-comunicação-entre-serviços)

#### Como deletar recursos?
- [deletando-recursos](references/deletando-recursos.md) — kubectl delete e cleanup

---

## Como garantir que minha aplicação está saudável?

### Entender Probes e Self-Healing
Quando escolher: App em K8s, precisa de health checks
- [o-que-sao-probes-e-self-healing](references/o-que-sao-probes-e-self-healing.md) — Conceito de probes
- [garantindo-prontidao-da-aplicacao](references/garantindo-prontidao-da-aplicacao.md) — Probes na prática

#### Qual tipo de probe usar?

##### Startup Probe
Quando escolher: App demora para inicializar (JVM, migrations)
- [startup](references/startup.md) — Startup probe

##### Liveness Probe
Quando escolher: Detectar app travada, forçar restart
- [liveness](references/liveness.md) — Liveness probe

##### Readiness Probe
Quando escolher: Evitar tráfego para pod não pronto
- [readiness](references/readiness.md) — Readiness probe

### Preciso escalar minha aplicação?

#### Entender escalabilidade
- [o-que-e-escala](references/o-que-e-escala.md) — Conceito de escala
- [conhecendo-a-escala-vertical](references/conhecendo-a-escala-vertical.md) — Escala vertical (mais recursos)
- [explorando-a-escala-horizontal](references/explorando-a-escala-horizontal.md) — Escala horizontal (mais réplicas)
- [alterando-recursos-e-replicas-da-aplicacao](references/alterando-recursos-e-replicas-da-aplicacao.md) — Configurar resources e réplicas

#### Autoscaling com HPA
Quando escolher: Escala automática baseada em métricas
- [como-o-metrics-server-funciona](references/como-o-metrics-server-funciona.md) — Metrics Server
- [adicionando-o-metrics-server-no-nosso-cluster](references/adicionando-o-metrics-server-no-nosso-cluster.md) — Instalar Metrics Server
- [explorando-a-v-1-do-hpa](references/explorando-a-v-1-do-hpa.md) — HPA v1 (básico)
- [criando-o-hpa-utilizando-a-v-2](references/criando-o-hpa-utilizando-a-v-2.md) — HPA v2 (múltiplas métricas)
- [definindo-tempo-de-reacao-para-escalonar-a-quantidade-de-replicas](references/definindo-tempo-de-reacao-para-escalonar-a-quantidade-de-replicas.md) — Cooldown e stabilization

#### Testar sob carga
- [estressando-a-nossa-aplicacao](references/estressando-a-nossa-aplicacao.md) — Stress testing
- [explorando-mais-cenarios-de-estresse](references/explorando-mais-cenarios-de-estresse.md) — Cenários avançados de estresse

---

## Preciso gerenciar comunicação entre serviços?

### Entender Service Mesh
Quando escolher: Múltiplos serviços, precisa de observabilidade/segurança inter-serviço
- [conhecendo-service-mesh](references/conhecendo-service-mesh.md) — O que é Service Mesh
- [o-que-e-um-sidecar](references/o-que-e-um-sidecar.md) — Pattern Sidecar proxy
- [envoy](references/envoy.md) — Envoy proxy (data plane)

### Instalar e configurar Istio
Quando escolher: Decidiu usar service mesh, Istio é a escolha
- [instalando-o-istio-e-primeiras-configuracoes](references/instalando-o-istio-e-primeiras-configuracoes.md) — Instalação do Istio
- [explorando-a-arquitetura-do-istio](references/explorando-a-arquitetura-do-istio.md) — Arquitetura completa
- [control-plane-e-data-plane-dentro-do-istio](references/control-plane-e-data-plane-dentro-do-istio.md) — Control plane vs data plane
- [injetando-o-istio-no-nosso-deployment](references/injetando-o-istio-no-nosso-deployment.md) — Injetar sidecar no deployment
- [adicionando-o-kiali](references/adicionando-o-kiali.md) — Kiali dashboard

### Configurar roteamento de tráfego

#### Gateway e Virtual Service
- [primeiros-testes-e-conhecendo-o-conceito-de-gateway](references/primeiros-testes-e-conhecendo-o-conceito-de-gateway.md) — Istio Gateway
- [configurando-o-virtual-service](references/configurando-o-virtual-service.md) — Virtual Service
- [configurando-o-vs-e-waypoint](references/configurando-o-vs-e-waypoint.md) — VS + Waypoint (Ambient mode)
- [definindo-roteamento](references/definindo-roteamento.md) — Regras de roteamento
- [definindo-regras-de-roteamento](references/definindo-regras-de-roteamento.md) — Regras avançadas
- [configurando-rotas-na-aplicacao](references/configurando-rotas-na-aplicacao.md) — Rotas na aplicação

#### Destination Rule
- [criando-o-nosso-primeiro-destination-rule](references/criando-o-nosso-primeiro-destination-rule.md) — Destination Rule
- [realizando-os-primeiros-testes](references/realizando-os-primeiros-testes.md) — Testando routing
- [realizando-mais-alguns-testes](references/realizando-mais-alguns-testes.md) — Testes avançados

### Implementar resiliência

#### Circuit Breaker
Quando escolher: Proteger contra cascading failures
- [configurando-circuit-breaker](references/configurando-circuit-breaker.md) — Circuit breaker com Istio

#### Retry e Timeout
Quando escolher: Lidar com falhas transitórias
- [configurando-retry-e-timeout](references/configurando-retry-e-timeout.md) — Retry e timeout policies

#### Fault Injection (teste)
Quando escolher: Testar resiliência injetando falhas
- [injetando-falha-nas-aplicacoes](references/injetando-falha-nas-aplicacoes.md) — Fault injection

### Segurança inter-serviço (mTLS)
Quando escolher: Criptografia service-to-service
- [o-que-e-e-qual-problema-resolve](references/o-que-e-e-qual-problema-resolve.md) — mTLS conceito e problema
- [configurando-permissoes](references/configurando-permissoes.md) — Authorization policies
- [adicionando-configuracao-por-namespace](references/adicionando-configuracao-por-namespace.md) — mTLS por namespace
- [adicionando-configuracao-por-cluster-e-consideracoes-finais](references/adicionando-configuracao-por-cluster-e-consideracoes-finais.md) — mTLS cluster-wide

---

## Preciso observar o que acontece em produção?

### Entender observabilidade
Quando escolher: Primeiro contato com observabilidade
- [o-que-e-observabilidade](references/o-que-e-observabilidade.md) — O que é e por que importa
- [entendendo-os-quatro-sinais-principais-da-aplicacao](references/entendendo-os-quatro-sinais-principais-da-aplicacao.md) — 4 golden signals
- [conhecendo-a-stack-lgtm](references/conhecendo-a-stack-lgtm.md) — Stack Loki + Grafana + Tempo + Mimir
- [e-o-monitoramento](references/e-o-monitoramento.md) — Monitoramento vs observabilidade
- [contexto-inicial-e-problema](references/contexto-inicial-e-problema.md) — Contexto e motivação
- [entendendo-o-problema](references/entendendo-o-problema.md) — Problemas sem observabilidade
- [esboco-do-problema](references/esboco-do-problema.md) — Definindo o problema

### Qual pilar preciso implementar?

#### Métricas (números ao longo do tempo)
Quando escolher: Monitorar performance, SLIs/SLOs, alertas
- [metricas](references/metricas.md) — Conceito de métricas
- [configurando-o-prometheus](references/configurando-o-prometheus.md) — Setup Prometheus
- [entendendo-o-prom-ql](references/entendendo-o-prom-ql.md) — PromQL queries
- [histogramas](references/histogramas.md) — Histogramas e percentis
- [criando-metricas-customizadas](references/criando-metricas-customizadas.md) — Métricas de negócio
- [dashboars-com-metricas-customizadas](references/dashboars-com-metricas-customizadas.md) — Dashboards custom
- [debugando-algumas-metricas-auto-instrumentadas](references/debugando-algumas-metricas-auto-instrumentadas.md) — Debug de métricas auto-instrumentadas

#### Logs (eventos textuais)
Quando escolher: Debug, auditoria, correlação com traces
- [logs](references/logs.md) — Conceito de logs
- [logando-informacoes-da-aplicacao](references/logando-informacoes-da-aplicacao.md) — Logging na aplicação
- [configurando-o-loki](references/configurando-o-loki.md) — Setup Loki
- [configurando-o-loki-1](references/configurando-o-loki-1.md) — Configuração avançada Loki
- [debugando-o-envio-de-logs](references/debugando-o-envio-de-logs.md) — Debug de envio de logs
- [corrigindo-alarme-do-loki](references/corrigindo-alarme-do-loki.md) — Corrigindo alertas Loki
- [logs-e-acompanhamento](references/logs-e-acompanhamento.md) — Logs e acompanhamento

#### Traces (fluxo entre serviços)
Quando escolher: Microserviços, debug de latência distribuída
- [traces](references/traces.md) — Conceito de traces
- [configurando-tracer-basico](references/configurando-tracer-basico.md) — Tracer básico
- [rapida-configuracao-no-fluxo-de-tracer](references/rapida-configuracao-no-fluxo-de-tracer.md) — Config rápida de tracer
- [grafana-tempo](references/grafana-tempo.md) — Grafana Tempo setup
- [analisando-os-traces-distribuidos](references/analisando-os-traces-distribuidos.md) — Analisando traces distribuídos
- [analisando-os-traces-e-metricas-da-aplicacao](references/analisando-os-traces-e-metricas-da-aplicacao.md) — Traces + métricas correlacionados
- [configurando-chamadas-distribuidas-na-nossa-nova-aplicacao](references/configurando-chamadas-distribuidas-na-nossa-nova-aplicacao.md) — Tracing distribuído multi-app

### Como instrumentar com OpenTelemetry?
Quando escolher: Instrumentação vendor-neutral, padrão CNCF
- [e-o-open-telemetry](references/e-o-open-telemetry.md) — O que é OpenTelemetry
- [configurando-aplicacao-com-otel](references/configurando-aplicacao-com-otel.md) — Setup OTel na aplicação
- [configurando-o-collector-do-otel](references/configurando-o-collector-do-otel.md) — OTel Collector
- [configurando-o-service-do-otel](references/configurando-o-service-do-otel.md) — Service do OTel no K8s
- [alterando-configuracoes-de-portas-e-collector-do-otel](references/alterando-configuracoes-de-portas-e-collector-do-otel.md) — Portas e config do collector
- [instrumentando-uma-nova-aplicacao](references/instrumentando-uma-nova-aplicacao.md) — Instrumentar nova app
- [alternativas-na-camada-da-aplicacao](references/alternativas-na-camada-da-aplicacao.md) — Alternativas de instrumentação

### Como visualizar com Grafana?
Quando escolher: Precisa de dashboards, alertas visuais
- [criando-dashboards-de-acompanhamento](references/criando-dashboards-de-acompanhamento.md) — Criar dashboards
- [trabalhando-com-multiplos-datasources](references/trabalhando-com-multiplos-datasources.md) — Múltiplos datasources
- [datasources](references/datasources.md) — Configurar datasources

### Como configurar alertas?
Quando escolher: Precisa ser notificado de problemas
- [configurando-alarmes](references/configurando-alarmes.md) — Alertas no Grafana
- [entendendo-melhor-o-grafana-oncall](references/entendendo-melhor-o-grafana-oncall.md) — Grafana OnCall
- [corrigindo-problemas-da-integracao](references/corrigindo-problemas-da-integracao.md) — Debug de integrações

### Setup completo do ambiente de observabilidade
Quando escolher: Montar stack completa do zero
- [configurando-ambiente-6](references/configurando-ambiente-6.md) — Setup do ambiente
- [configurando-componentes-faltantes](references/configurando-componentes-faltantes.md) — Componentes complementares
- [configurando-o-features](references/configurando-o-features.md) — Feature flags do stack
- [configurando-vs-code](references/configurando-vs-code.md) — VS Code para observabilidade

---

## Preciso provisionar infraestrutura como código?

### Entender IaC
Quando escolher: Primeiro contato com infraestrutura como código
- [overview](references/overview.md) — IaC: por que declarativo e versionado
- [aws-e-cloud-formation](references/aws-e-cloud-formation.md) — AWS CloudFormation vs Terraform
- [git-ops](references/git-ops.md) — GitOps: infra declarada em Git

### Qual ferramenta de IaC usar?

#### Terraform (HCL)
Quando escolher: Multi-cloud, ecossistema maduro, HCL
- [terraform-cdk-e-hcl](references/terraform-cdk-e-hcl.md) — Terraform CDK vs HCL
- [cli-do-terraform](references/cli-do-terraform.md) — Terraform CLI (init, plan, apply, destroy)
- [documentacao-providers-e-terra-cloud](references/documentacao-providers-e-terra-cloud.md) — Docs, providers, Terraform Cloud

##### Qual cloud provider?

###### AWS
- [conhecendo-e-configurando-provider](references/conhecendo-e-configurando-provider.md) — Provider AWS setup
- [criando-nosso-primeiro-recurso](references/criando-nosso-primeiro-recurso.md) — Primeiro recurso AWS
- [criando-nosso-primeiro-recurso-1](references/criando-nosso-primeiro-recurso-1.md) — Recursos AWS (continuação)
- [criando-nosso-primeiro-recurso-2](references/criando-nosso-primeiro-recurso-2.md) — Recursos AWS (avançado)
- [criando-bucket-s-3](references/criando-bucket-s-3.md) — S3 bucket
- [explorando-outras-maneiras-de-criar-o-bucket](references/explorando-outras-maneiras-de-criar-o-bucket.md) — S3 alternativo
- [habilitando-o-versionamento](references/habilitando-o-versionamento.md) — S3 versionamento
- [configurando-sso-na-aws](references/configurando-sso-na-aws.md) — AWS SSO

###### GCP
- [conhecendo-e-configurando-provider-1](references/conhecendo-e-configurando-provider-1.md) — Provider GCP setup

##### Como gerenciar estado?
- [uma-breve-introducao-sobre-estado](references/uma-breve-introducao-sobre-estado.md) — Conceito de state
- [mantendo-o-estado-na-nuvem](references/mantendo-o-estado-na-nuvem.md) — Remote state (S3)
- [dinamica-e-backup-do-estado](references/dinamica-e-backup-do-estado.md) — State locking e backup
- [remote-state-e-boas-praticas](references/remote-state-e-boas-praticas.md) — Boas práticas de state

##### Como organizar com variáveis e outputs?
- [variaveis](references/variaveis.md) — Variables (input)
- [outputs](references/outputs.md) — Outputs
- [datasources](references/datasources.md) — Data sources
- [configurando-o-gitignore-e-tfvars](references/configurando-o-gitignore-e-tfvars.md) — .gitignore e .tfvars
- [workspaces](references/workspaces.md) — Workspaces (multi-env)

##### Como modularizar?
Quando escolher: Reutilizar infra, múltiplos ambientes
- [o-que-sao-modulos](references/o-que-sao-modulos.md) — Conceito de módulos
- [configurando-modulo-externo](references/configurando-modulo-externo.md) — Módulos externos
- [modularizando-o-s-3](references/modularizando-o-s-3.md) — Módulo S3
- [modularizando-o-cloudfront](references/modularizando-o-cloudfront.md) — Módulo CloudFront
- [criando-recursos-do-novo-modulo](references/criando-recursos-do-novo-modulo.md) — Recursos em módulos
- [criando-recursos-utilizando-iac](references/criando-recursos-utilizando-iac.md) — IaC na prática

##### Como provisionar recursos em batch?
- [iniciando-configuracao](references/iniciando-configuracao.md) — Config inicial de projeto Terraform
- [criando-nosso-primeiro-repositorio](references/criando-nosso-primeiro-repositorio.md) — Repositório Terraform

#### Pulumi
Quando escolher: IaC com linguagem de programação (TS, Python, Go)
- [pulumi](references/pulumi.md) — Pulumi como alternativa

#### CloudFormation
Quando escolher: AWS-only, integração nativa
- [aws-e-cloud-formation](references/aws-e-cloud-formation.md) — CloudFormation overview
> Cross-ref: AWS provider acima para Terraform como alternativa

---

## Preciso automatizar build, teste e deploy?

### Entender CI/CD
Quando escolher: Primeiro contato com integração/entrega contínua
- [continuous-delivery](references/continuous-delivery.md) — Continuous Delivery
- [introducao-ao-gerenciamento-do-fluxo](references/introducao-ao-gerenciamento-do-fluxo.md) — Gerenciamento de fluxo
- [entendendo-o-problema](references/entendendo-o-problema.md) — Problema sem CI/CD

### Qual ferramenta de CI/CD usar?

#### GitHub Actions
Quando escolher: Repo no GitHub, setup rápido, YAML workflows
- [git-actions](references/git-actions.md) — GitHub Actions intro
- [configurando-nosso-primeiro-workflow](references/configurando-nosso-primeiro-workflow.md) — Primeiro workflow
- [entendendo-sobre-os-triggers](references/entendendo-sobre-os-triggers.md) — Triggers (on push, PR, schedule)
- [entendendo-os-principais-triggers](references/entendendo-os-principais-triggers.md) — Triggers avançados

##### Como estruturar o pipeline?
- [criando-repo-e-estruturando-pipeline](references/criando-repo-e-estruturando-pipeline.md) — Estrutura de pipeline
- [adicionando-step-de-build](references/adicionando-step-de-build.md) — Step de build
- [configurando-estrutura-12](references/configurando-estrutura-12.md) — Semantic release e estrutura
- [rodando-pipeline-pela-1-a-vez](references/rodando-pipeline-pela-1-a-vez.md) — Primeira execução
- [rodando-pipeline](references/rodando-pipeline.md) — Pipeline em execução
- [ajustando-e-testando-o-fluxo](references/ajustando-e-testando-o-fluxo.md) — Ajustes e testes do fluxo
- [boas-praticas-em-pipelines-no-geral](references/boas-praticas-em-pipelines-no-geral.md) — Boas práticas gerais

##### Como configurar permissões AWS?
Quando escolher: Deploy para AWS via GitHub Actions
- [configurando-roles](references/configurando-roles.md) — IAM Roles para CI/CD
- [criando-permissoes-dentro-da-role](references/criando-permissoes-dentro-da-role.md) — Permissões na role

##### Como fazer deploy para AWS?
- [migrando-pro-ecr](references/migrando-pro-ecr.md) — Push para ECR
- [escolhendo-servico-pra-rodar-a-nossa-aplicacao](references/escolhendo-servico-pra-rodar-a-nossa-aplicacao.md) — Escolha de serviço (ECS, App Runner, EKS)
- [configurando-servico-que-vai-rodar-o-container](references/configurando-servico-que-vai-rodar-o-container.md) — Configurar serviço
- [deployando-nossa-aplicacao](references/deployando-nossa-aplicacao.md) — Deploy final
- [automatizando-tudo](references/automatizando-tudo.md) — Automação completa

### GitOps
Quando escolher: Infra e app declarados em Git, reconciliação automática
- [git-ops](references/git-ops.md) — GitOps principles
> Cross-ref: [Terraform](#terraform-hcl) para IaC declarativa

---

## Decisões transversais

### Como organizar o projeto para DevOps?
- [problemas-e-proximos-passos](references/problemas-e-proximos-passos.md) — Problemas comuns e próximos passos
- [fechamento-do-modulo-e-ultimos-ajustes](references/fechamento-do-modulo-e-ultimos-ajustes.md) — Ajustes finais
- [mais-algumas-configuracoes](references/mais-algumas-configuracoes.md) — Configurações adicionais
- [um-breve-overview](references/um-breve-overview.md) — Overview geral

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante (Docker, K8s, Terraform, CI/CD)
- **Fase 4 (Validação)** → Siga "CI/CD pipelines" + "Observabilidade"

## Cross-References — Decision Coverage

Quando este router não cobre uma decisão, delegue para:

| Decisão | Delegue para | Motivo |
|---------|-------------|--------|
| D1_RUNTIME (Node.js) | [rs-node-js](../rs-node-js/SKILL.md) | Runtime, streams, HTTP module |
| D1_ARCHITECTURE (DDD/SOLID) | [rs-clean-code](../rs-clean-code/SKILL.md) | Clean Architecture premissa |
| D3_DATA_LAYER (Prisma/Knex) | [rs-node-js](../rs-node-js/SKILL.md) | ORM, query builder |
| D3_AUTH (JWT/OAuth) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Auth app-level |
| D3_TESTING (Jest/Playwright) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes unit + E2E |
| DX_QUALITY (clean code) | [rs-clean-code](../rs-clean-code/SKILL.md) | Premissa de escrita |
