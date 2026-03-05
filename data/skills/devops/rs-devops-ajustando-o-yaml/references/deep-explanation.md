# Deep Explanation: Ajustando o YAML

## Por que declarativo e nao imperativo

Quando voce configura recursos via linha de comando (`kubectl label`, `kubectl create`), essas configuracoes existem apenas no cluster. Se voce deletar o cluster e recriar, precisa lembrar de todos os comandos que rodou. Com YAML declarativo, basta `kubectl apply -f` e tudo volta ao estado desejado.

O instrutor demonstra isso ao perceber que as labels do namespace (ambient mode e waypoint) foram configuradas via `kubectl label` — algo que nao e reproduzivel. A solucao e criar um arquivo `app-ns.yaml` que contem o namespace com todas as labels necessarias.

## Gateway API vs recursos nativos do Kubernetes

Um ponto importante destacado na aula: o Gateway API **nao e um recurso nativo** do Kubernetes. E um CRD (Custom Resource Definition) que precisa ser instalado. O comando inicial do Istio instala esses CRDs, mas eles pertencem a API `gateway.networking.k8s.io`, nao ao Istio diretamente.

Isso significa que mesmo fora do Istio, voce poderia usar Gateway API com outros provedores (Kong, etc). O Gateway API funciona como um ingress na camada de borda da aplicacao.

Para ver CRDs instalados: `kubectl get crd` — lista todas as APIs customizadas do cluster.

## Waypoint como interceptador

O waypoint e literalmente um pod no cluster. Diferente do sidecar (que roda grudado no container da aplicacao), o waypoint e um ponto central no namespace que intercepta trafego.

Vantagens do ambient mode sobre sidecar:
- **Performance na subida** — sua aplicacao nao precisa esperar o sidecar subir
- **Menos ponto de falha** — nao tem sidecar que pode falhar junto com a app
- **Ponto central** — um waypoint resolve para todo o namespace

O log do waypoint (`envoy proxy is ready`) e identico ao do sidecar — ambos usam Envoy por baixo.

## Extraindo YAML do cluster

Tecnica util ensinada: quando voce cria um recurso via CLI e quer converter para declarativo:

1. `kubectl get <recurso> <nome> -n <namespace> -o yaml`
2. Copie o output
3. Remova: `status`, `managedFields`, `resourceVersion`, `uid`, `creationTimestamp`, campos gerados pelo cluster
4. Mantenha apenas: `apiVersion`, `kind`, `metadata` (name, namespace, labels) e `spec`

## Separacao infra vs app

O instrutor inicialmente colocou o gateway na pasta da aplicacao (`k8s/`), mas depois moveu para `infra/` porque:
- O namespace e uma divisao logica do cluster (infra)
- O gateway waypoint atende o namespace inteiro, nao uma app especifica
- Se fosse um gateway especifico de uma app, ai sim ficaria em `k8s/`

## Relacao entre Gateway e Virtual Service

Mencionado como disclaimer: voce pode linkar um Gateway com Virtual Service usando a flag `gateways` dentro do Virtual Service. Porem, com waypoint isso nao e necessario — o waypoint resolve o problema de roteamento internamente.

Para camada de borda (ingress externo), voce usaria ferramentas como Kong ou outro gateway, que serao vistos em modulos mais avancados.

## Consistencia de nomes

O nome do waypoint deve ser o mesmo em dois lugares:
1. No `metadata.name` do Gateway YAML
2. No label `istio.io/use-waypoint` do Namespace YAML

Se os nomes divergirem, o namespace nao consegue encontrar o waypoint.