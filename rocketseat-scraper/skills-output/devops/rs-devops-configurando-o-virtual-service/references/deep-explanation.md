# Deep Explanation: Configurando o Virtual Service

## O que e um Virtual Service

O Virtual Service e um CRD (Custom Resource Definition) do Istio que estende a API do Kubernetes. Ele cria um "servico virtual" — um conjunto de regras de roteamento que funciona numa camada acima do Service padrao do Kubernetes.

### Relacao com o Service do Kubernetes

Ponto critico enfatizado pelo instrutor: **o VirtualService NAO substitui o Service do Kubernetes**. Sao coisas diferentes que coexistem:

- **Service (K8s):** Resolve o DNS interno do cluster, sabe qual aplicacao atender
- **VirtualService (Istio):** Adiciona regras de roteamento inteligente sobre o Service, sem mexer na aplicacao

O VirtualService referencia o host do Service para saber para onde rotear. Ele trabalha "acima" do Service.

## Por que abstrair para infraestrutura

O instrutor destaca que funcionalidades como timeout, retry, traffic splitting e injecao de falha poderiam ficar na camada da aplicacao, mas ao mover para o VirtualService (camada de infraestrutura):

- **Escala o gerenciamento** — regras centralizadas, nao espalhadas em cada microservico
- **Nao precisa mexer na aplicacao** — roteamento inteligente sem deploy de codigo
- **Desacoplamento** — a aplicacao faz o que sabe (logica de negocio), a infra faz roteamento

## CRD e a API do Istio

O Istio funciona como CRD — ele estende as funcionalidades basilares do Kubernetes. Isso significa que escrevemos manifestos com a mesma estrutura (apiVersion, kind, metadata, spec), mas usando APIs do Istio como `networking.istio.io/v1`.

Dentro do Lens (ou qualquer ferramenta de gerenciamento K8s), os recursos do Istio aparecem em "Custom Resources" → "Networking" do Istio.

## O problema dos subsets

O instrutor demonstra um problema real: ao aplicar o VirtualService com subsets (`v1`, `v2`) sem ter criado o DestinationRule, o Kiali reporta dois alertas:

1. **Host not found** — o DNS pode nao resolver dependendo do formato
2. **Subset not found** — nao existe DestinationRule definindo o que sao `v1` e `v2`

Isso e importante porque o VirtualService e o DestinationRule sao complementares:
- **VirtualService** = COMO rotear (regras, pesos, matches)
- **DestinationRule** = PARA ONDE rotear (define os subsets via labels nos pods)

## Subset vs Image Tag

O instrutor faz questao de frisar: o nome do subset (ex: `v1`) **nao tem relacao direta** com a tag da imagem do container. E apenas um identificador. A associacao real entre subset e pods e feita via labels no DestinationRule.

## Funcionalidades do VirtualService

Capacidades mencionadas pelo instrutor:

| Funcionalidade | Descricao |
|----------------|-----------|
| **Traffic Shaping/Splitting** | Dividir trafego entre versoes (ex: 80/20) |
| **Canary Deployment** | Enviar % pequena para nova versao |
| **Teste A/B** | Variantes para usuarios diferentes |
| **Roteamento por conteudo** | Match de rotas (ex: /a rewrite para /b) |
| **Injecao de falha** | Simular erros para testar resiliencia |
| **Timeout** | Configurar timeout nas requisicoes |
| **Retry** | Configurar politicas de retry |
| **Hash consistente** | "Grudar" requisicoes de um client (mencionado para aula futura) |

## Ferramentas de debug

- **Kiali** — interface web do Istio que mostra config, alertas e grafos de trafego
- **Lens** — visualiza Custom Resources incluindo VirtualServices
- **kubectl** — `kubectl get virtualservice -n namespace` para listar