# Deep Explanation: Instalando o Istio e Primeiras Configuracoes

## Por que usar istioctl ao inves de Helm?

O instrutor enfatiza o uso do `istioctl` como forma primaria de instalacao. Assim como o Kubernetes tem o `kubectl`, o Istio tem sua propria CLI — o istioctl (Istio Control). Essa ferramenta permite interagir diretamente com a API do Istio dentro do cluster, incluindo a propria instalacao. E a forma mais direta e com melhor feedback visual do que esta acontecendo.

## Componentes instalados no perfil default

Quando voce roda `istioctl install` sem parametros, o perfil **default** e usado. Ele instala:

1. **IstioCore** — os recursos base do Istio (CRDs, RBAC, etc.)
2. **Istiod** — o cerebro do Istio. E o control plane que gerencia discovery de servicos, configuracao de proxies e emissao de certificados. Roda como um unico pod no namespace `istio-system`.
3. **Ingress Gateway** — o ponto de entrada do trafego externo para o cluster. Cria um Service do tipo LoadBalancer.

## Namespace istio-system

O instrutor destaca que todos os componentes do Istio rodam no namespace `istio-system`. Isso e criado automaticamente durante a instalacao. E o namespace que voce sempre vai monitorar para verificar saude do service mesh.

## Sobre containers e sidecars

Um ponto importante que o instrutor faz questao de salientar: os pods do Istio em si (Istiod e Ingress Gateway) rodam com **um unico container** cada. Os dois containers (aplicacao + sidecar proxy) so aparecem quando voce deploya uma aplicacao com injecao de sidecar habilitada. Como nenhuma aplicacao foi deployada ainda nesta aula, nao ha dois containers para visualizar.

## Perfis de instalacao

O Istio permite personalizar a instalacao:
- **default** — Istiod + Ingress Gateway (usado na aula)
- **minimal** — apenas Istiod, sem gateways
- **demo** — tudo instalado, bom para experimentacao
- Perfis customizados via `IstioOperator` YAML

O instrutor menciona que como o objetivo e explorar o maximo, a instalacao completa foi escolhida.

## Kubernetes Gateway API

O instrutor menciona que o CRD do Kubernetes Gateway API **nao vem por default no kind**. Isso sera necessario em aulas futuras (quando falar de add-ons), mas por enquanto nao causa problemas. A instalacao sera feita quando o problema se manifestar.

## Lens como ferramenta visual

O instrutor apresenta o Lens como uma "IDE para Kubernetes" — uma opcao grafica para visualizar pods, services, namespaces e logs. Ele menciona que pessoalmente prefere o terminal no dia a dia, mas reconhece o Lens como uma "baita ferramenta". E complementar, nao substitui o kubectl.

## Sidecar Mode vs Ambient Mode

O instrutor menciona brevemente que o curso vai cobrir tanto sidecar mode quanto ambient mode, mas comeca pelo sidecar. A documentacao do Istio tem Getting Started separados para cada modo.

## Dica pratica sobre PATH

Apos fazer o `export PATH`, o instrutor recomenda atualizar todas as abas do terminal. Se o comando `istioctl` nao for encontrado, a causa mais provavel e que o terminal nao foi recarregado. Soluçoes: `source ~/.bashrc`, `source ~/.zshrc`, ou simplesmente fechar e reabrir o terminal.