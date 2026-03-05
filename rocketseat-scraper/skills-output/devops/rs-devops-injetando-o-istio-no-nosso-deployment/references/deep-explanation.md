# Deep Explanation: Injetando Istio no Deployment

## Por que label no namespace e nao container manual?

O instrutor demonstra que tecnicamente e possivel adicionar um segundo container no deployment (conceito de sidecar), simplesmente duplicando o bloco `containers` e apontando para a imagem do Istio. Porem, ele explica que isso "nao faz o menor sentido" para service mesh porque:

1. A configuracao do Istio proxy e extremamente complexa — nao e so uma imagem
2. Voce perderia o controle centralizado — cada deployment teria sua propria config
3. O Linkerd (outro service mesh) tambem funciona da mesma forma — via injecao automatica

A abordagem correta usa o **Admission Webhook** do Kubernetes: quando o namespace tem a label `istio-injection=enabled`, o webhook intercepta a criacao de cada pod e injeta automaticamente o sidecar do Istio.

## O conceito de InitContainers

O instrutor mostra que alem do `istio-proxy` (sidecar permanente), existe o `istio-init` que aparece como InitContainer. Este container:
- Inicializa junto com a aplicacao
- Configura as regras de rede (iptables) para redirecionar trafego pelo proxy
- Depois de executar, "morre" — nao consome recursos continuamente
- E um conceito padrao do Kubernetes: InitContainers rodam antes dos containers principais

## Controle por namespace

A grande sacada demonstrada na aula: voce controla QUAIS aplicacoes estao na malha de servico por namespace. O instrutor cria um `app2` namespace sem a label do Istio e mostra que os pods sobem com `1/1` (sem proxy), enquanto no namespace `app` os pods tem `2/2`.

Isso permite:
- Namespace `app` → com Istio (producao, precisa de observabilidade)
- Namespace `app2` → sem Istio (ferramentas internas, nao precisa)

## Service Discovery via selector

O Service do Kubernetes funciona como service discovery: o campo `selector` faz match com as labels dos pods. O instrutor mostra que ao criar o service, os endpoints ja sao encontrados automaticamente — "simplesmente fantastico" nas palavras dele. Quatro replicas servem o mesmo service, e o acesso via port-forward no service distribui entre os pods.

## Ordem importa: label ANTES do deploy

Ponto critico que o instrutor enfatiza: se voce ja fez o deploy e depois rotula o namespace, os pods existentes NAO recebem o sidecar. A injecao acontece apenas no momento da admissao (criacao do pod). Solucao: deletar e recriar.