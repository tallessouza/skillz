# Deep Explanation: Subindo Containers no Kubernetes

## Hierarquia de objetos no Kubernetes

O instrutor apresenta uma "escada" de objetos dentro de Workloads no Kubernetes:
- **Pod** — menor unidade, onde o container de fato roda
- **Deployment** — controlador que gerencia pods
- **DaemonSet** — garante um pod por node
- **StatefulSet** — para aplicacoes com estado
- **ReplicaSet** — garante N replicas de um pod
- **ReplicationController** — versao legada do ReplicaSet
- **CronJob/Job** — execucoes pontuais ou agendadas

O pod e a base de tudo. Dentro de um pod e que o container e executado. Exemplo pratico: o CoreDNS que roda dentro do cluster e um pod com um container dentro.

## Por que o Kubernetes exige containers

Dentro de um cluster Kubernetes, nao e possivel rodar o "executavel" da aplicacao diretamente. O que se executa e a **imagem de container** da aplicacao. Pre-requisito: a aplicacao precisa estar containerizada.

## Container Registry e Docker Hub

O Kubernetes, por padrao, busca imagens no Docker Hub. Se a imagem for privada (registry corporativo), e necessario configurar credenciais no cluster via `imagePullSecrets`. O Docker Hub e o registry publico mais utilizado.

## Imperativo vs Declarativo

Este e um tema que permeia todo o Kubernetes:

- **Imperativo**: comandos diretos no terminal (`kubectl run`). Rapido para testes, mas sem rastreabilidade.
- **Declarativo**: manifests YAML aplicados com `kubectl apply`. Permite versionamento no Git, auditoria e reproducibilidade.

O instrutor enfatiza: "a recomendada sempre e utilizar o declarativo para ter todo o laco" — referindo-se ao ciclo completo de versionamento e rastreabilidade.

## Por que tags importam

A analogia do instrutor: a tag da imagem e "muito parecida com a tag do commit" no Git. Voce tem uma hash, um versionamento. Sem tag, o Kubernetes baixa `latest`, que pode mudar a qualquer momento e quebrar deployments de forma imprevisivel.

## Natureza efemera do pod

O instrutor destaca dois problemas criticos de um pod criado imperativamente sem controlador:

1. **Sem versionamento** — o comando foi executado no terminal, nao esta em nenhum arquivo
2. **Sem controlador** — se o pod falhar, ninguem o recria. O pod e "100% descartavel" por natureza

Controladores como Deployment e ReplicaSet resolvem o segundo problema garantindo que o pod seja recriado automaticamente.

## Fluxo interno do Kubernetes ao criar um pod

Os eventos mostrados pelo instrutor revelam a sequencia:
1. **Pull** — download da imagem (equivalente a `docker pull`, mas o K8s e agnostico ao runtime)
2. **Created** — container criado
3. **Started** — container iniciado e em execucao

O Kubernetes nao usa Docker diretamente; ele e agnostico ao container runtime (pode usar containerd, CRI-O, etc.).

## Namespace default

O instrutor criou o pod no namespace `default` propositalmente como anti-exemplo. Aplicacoes nao devem rodar no namespace default porque:
- Dificulta organizacao e isolamento
- Complica politicas de RBAC
- Mistura workloads de diferentes propositos