# Deep Explanation: Acessando Container Dentro do Cluster

## Por que Pods nao sao acessiveis externamente por padrao?

O instrutor explica que cada Pod no Kubernetes recebe seu proprio IP interno (ex: 10.x.x.x). Esse IP e acessivel **somente dentro do cluster**. Isso e uma decisao arquitetural do Kubernetes — o Pod vive em uma rede isolada.

Para acessar de fora do cluster, voce precisa de uma "camada de network" — que sera abordada em aulas futuras (Services, Ingress, etc.). Sem essa camada, a unica opcao e o **port-forward**, que cria um tunel temporario da sua maquina local ate o Pod.

## O que e Port-Forward?

Port-forward e um mecanismo que:
1. Reserva uma porta na sua maquina local (ex: 8080)
2. Redireciona todo trafego dessa porta para a porta do container dentro do cluster (ex: 80)
3. Funciona enquanto o comando estiver rodando E o Pod existir

O instrutor demonstra isso de duas formas:
- **Via Lens (GUI):** Clicando no container, vendo a `containerPort` definida no manifesto, e configurando o forward com um clique
- **Via CLI:** `kubectl port-forward pod/nginx 8081:80 -n primeira-app`

## A importancia do Namespace

O instrutor enfatiza que se voce nao passar o `-n <namespace>`, o kubectl procura no namespace `default`. Se o Pod foi criado em outro namespace (como `primeira-app`), o comando simplesmente nao encontra o recurso.

## Ciclo de vida: Delete e Recreate

Uma demonstracao importante do instrutor:
1. Deletou o Pod com `kubectl delete pod nginx -n primeira-app`
2. O port-forward que estava rodando quebrou com erro NOT FOUND
3. Recriou o Pod com `kubectl apply -f <manifesto>`
4. Pod voltou a funcionar normalmente

Isso demonstra a natureza declarativa do Kubernetes — o manifesto YAML e a fonte de verdade, e voce pode recriar recursos a qualquer momento.

## Metrics API

O instrutor mostra `kubectl top pods` para ver consumo de CPU e memoria, mas o comando retorna "not available" porque o Metrics API (metrics-server) nao esta instalado no cluster. No Lens, isso aparece como "NA" nos graficos de recursos. Esse e um componente adicional que precisa ser configurado separadamente.

## Limitacoes do Port-Forward

O instrutor menciona que existem "problemas" com essa abordagem que serao endereçados nas proximas aulas. Implicitamente:
- Port-forward e temporario (morre com o terminal)
- Nao e escalavel (um tunel por Pod)
- Nao serve para producao
- A solucao correta envolve Services e outros recursos de networking do Kubernetes