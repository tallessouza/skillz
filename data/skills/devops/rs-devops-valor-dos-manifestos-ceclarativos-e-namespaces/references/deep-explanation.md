# Deep Explanation: Manifestos Declarativos e Namespaces

## Por que namespaces são essenciais

O namespace é uma **divisão lógica** dentro do cluster Kubernetes. Sem namespaces dedicados, tudo fica no `default` e não há nenhuma governança. O instrutor enfatiza que namespaces devem seguir a organização do projeto ou da equipe:

- **Por projeto/API** — cada microserviço ou API tem seu namespace
- **Por domínio/contexto** — alinhado com bounded contexts do time
- **Por equipe** — no sentido organizacional

A criação é simples (`kubectl create namespace <nome>`) mas o impacto organizacional é grande: permite isolamento, controle de acesso (RBAC futuro), e visibilidade clara de quem possui o quê.

## A estrutura do manifesto YAML

As duas primeiras linhas de qualquer manifesto Kubernetes seguem o mesmo padrão:

1. **`apiVersion`** — qual versão da API do Kubernetes usar (ex: `v1`)
2. **`kind`** — qual objeto dessa API criar (ex: `Pod`)

Isso é idêntico à estrutura do Kind (ferramenta de cluster local), porque ambos seguem a convenção declarativa do Kubernetes.

Depois vem:
- **`metadata`** — informações sobre o recurso (nome, labels, annotations)
- **`spec`** — a especificação do que o recurso deve ser

## Resources: requests vs limits

O instrutor destaca que o warning "One or more containers do not have resource limits" aparece mesmo que o manifesto funcione sem resources. A boa prática exige definir ambos:

- **requests** — o mínimo garantido que o scheduler reserva no nó. É o que o Kubernetes usa para decidir em qual nó colocar o pod.
- **limits** — o máximo que o container pode consumir. Se ultrapassar, o Kubernetes intervém (CPU throttling, OOM kill para memória).

### Unidades de CPU

- `1000m` (milicores) = 1 vCPU
- `100m` = 1/10 de uma vCPU
- `200m` = 1/5 de uma vCPU

O instrutor usou um padrão de **limits = 2x requests** como ponto de partida para o nginx, mas ressaltou que cada aplicação terá seu perfil e que valores assertivos impactam diretamente em **custo**.

## Containers no plural

O campo `containers` é um array porque um pod pode ter múltiplos containers. O instrutor esclarece:

- **Comum:** sidecar patterns (proxy, log collector) — um container auxiliar ao lado do principal
- **Incomum:** duas aplicações distintas no mesmo pod — isso quebra o princípio de isolamento

Esse conceito será aprofundado no módulo de service mesh/proxy.

## Pods são efêmeros

O instrutor menciona que pods têm **self-healing** por padrão: se algo falha, o Kubernetes tenta restartar. O campo `RESTARTS` no `kubectl get pods` mostra quantas vezes isso ocorreu. Esse comportamento pode ser customizado em cenários avançados.

## Interface de rede do pod

Cada pod recebe um IP interno (faixa 10.x.x.x), acessível apenas dentro do cluster. Para acesso externo, é necessário configurar Services (tema da próxima aula). O Lens mostra esse IP na interface gráfica do pod.

## kubectl delete — padrão de deleção

Para deletar qualquer recurso: `kubectl delete <tipo> <nome>`. A estrutura é consistente para todos os workloads (Pod, Deployment, Service, etc.).