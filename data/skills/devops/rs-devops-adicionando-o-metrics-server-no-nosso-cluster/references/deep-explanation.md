# Deep Explanation: Metrics Server em Cluster Kubernetes

## Por que o Metrics Server existe

O Metrics Server é um componente de cluster que coleta métricas de CPU e memória dos pods a cada 10-15 segundos. Ele funciona como uma API interna — você pode consultar métricas diretamente via `kubectl top` ou, mais importante, ele alimenta o HPA (Horizontal Pod Autoscaler) com os dados necessários para decidir quando escalar horizontalmente.

Sem o Metrics Server, o `kubectl top` retorna `<unknown>` e o HPA não tem dados para tomar decisões de escala.

## Princípio GitOps e por que não rodar apply de URL remota

O instrutor enfatiza um ponto arquitetural importante: quando você roda `kubectl apply -f https://url-remota/components.yaml`, você está aplicando algo de forma **imperativa** sem lastro local. Isso fere o princípio GitOps porque:

1. **Sem rastreabilidade** — você não sabe exatamente o que foi aplicado (a URL pode mudar)
2. **Sem versionamento** — seu repositório não reflete o estado real do cluster
3. **Sem controle** — não consegue fazer diff do que mudou entre versões

A solução é simples: `wget` para baixar, renomear para algo descritivo, versionar no repo, e aplicar do arquivo local.

## O problema do TLS em ambiente local

Quando o Metrics Server é instalado, ele tenta se comunicar com o kubelet de cada nó usando TLS. O kubelet apresenta um certificado que o Metrics Server tenta validar contra uma Certificate Authority (CA).

Em clusters locais (Kind, minikube, k3d), não existe uma CA válida configurada. O resultado é um erro nos logs:

```
TLS: failed to verify certificate for IP 172.19.0.5
```

O IP `172.x.x.x` é o IP interno do cluster. A flag `--kubelet-insecure-tls` desabilita essa verificação, permitindo que o Metrics Server funcione em ambiente de desenvolvimento.

**Em produção (EKS, GKE, AKS), certificados válidos existem e essa flag NÃO deve ser usada.**

## Metrics Server como componente de cluster (não de aplicação)

O instrutor destaca que o Metrics Server não pertence a nenhuma aplicação específica — ele é um componente do cluster. Por isso:

- Não se especifica namespace no `kubectl apply` (o manifesto já declara `kube-system` no metadata)
- Ele é "cross-namespace": qualquer namespace consegue ter acesso às métricas
- Ele aparece junto com outros componentes de sistema como `coredns`, `etcd`, `kube-apiserver`

## Como o namespace é definido no metadata

O instrutor mostra um insight sobre declaração de namespace diretamente no manifesto YAML:

```yaml
metadata:
  name: metrics-server
  namespace: kube-system
```

Isso elimina a necessidade de passar `-n` no momento do apply. O mesmo conceito pode ser aplicado para suas próprias aplicações — declarar o namespace no metadata do Deployment garante que o recurso sempre será criado no namespace correto, de forma declarativa.

## Recursos criados pelo Metrics Server

O manifesto cria múltiplos recursos Kubernetes:

1. **ServiceAccount** — identidade do Metrics Server dentro do cluster
2. **ClusterRole** — permissões RBAC (Role-Based Access Control) que definem o que o Metrics Server pode acessar
3. **ClusterRoleBinding** — vincula (bind) a ClusterRole à ServiceAccount
4. **Service** — endpoint interno para consultar métricas
5. **Deployment** — gerencia os pods do Metrics Server
6. **APIService** — registra o Metrics Server como uma API do Kubernetes

O instrutor menciona que ServiceAccount e RBAC serão explorados em aulas futuras, mas o conceito fundamental é: o Metrics Server precisa de permissão para acessar métricas de todos os nós e pods do cluster.

## Estrutura de múltiplos recursos em um único YAML

Todos os recursos acima coexistem no mesmo arquivo YAML, separados por `---`. O instrutor menciona que você poderia alternativamente criar uma pasta `metricserver/` com arquivos separados (`service.yml`, `deployment.yml`, etc.), mas ambas as abordagens funcionam perfeitamente no Kubernetes.

## Coleta de métricas: intervalo e visualização

O Metrics Server coleta métricas a cada 10-15 segundos (configurável via `--metric-resolution`). Após instalação bem-sucedida:

- Colunas que antes mostravam `<unknown>` passam a mostrar valores reais
- `kubectl top po -n <namespace>` mostra CPU em millicores e memória por pod
- Ferramentas visuais como Lens também passam a exibir as métricas

O instrutor demonstra que a aplicação dele estava usando ~0 millicores de CPU e ~80MB de memória — valores baixos esperados para uma aplicação sem tráfego.