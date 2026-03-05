# Deep Explanation: Canary Deployment com Istio

## As 4 Estrategias de Deploy no Kubernetes

### 1. Rolling Update (padrao do Kubernetes)
Deploy cadenciado: sobe um pod novo, mata um antigo, repete ate completar. Configurado via `maxSurge` e `maxUnavailable`. Nao tem downtime, mas tambem nao tem mecanismo de teste — se o trafego for muito alto, problemas na nova versao impactam usuarios imediatamente.

### 2. Recreate
Mata todos os pods antes de subir os novos. Tem downtime. Parece ruim, mas faz sentido para:
- Apps assincronas sem conexao direta com fluxo sincrono do usuario
- Jobs de processamento
- Cenarios onde consistencia importa mais que disponibilidade

### 3. Blue-Green (Red-Black na Netflix)
- App 1 recebe 100% do trafego
- App 2 sobe com 0% de trafego (como um pre-prod/preview)
- Voce testa a App 2 isoladamente
- Se OK, faz a "promocao": App 1 vai para 0%, App 2 para 100%
- A virada em si usa rolling update internamente

Insight do instrutor: "Aqui a gente tem uma camada de seguranca muito legal, porque voce vai ter duas aplicacoes rodando, so que somente a aplicacao antiga recebe trafego."

### 4. Canary Deployment (deploy gradual)
- App 1 com 95%, App 2 com 5%
- Acompanha metricas (AppDex, error rate)
- Se problemas aparecem: volta App 2 para 0%
- Impacto muito baixo em caso de erro
- Pode segmentar por faixa de usuario, localidade, etc.

## O Problema da Consistencia de Sessao

O instrutor destaca um ponto critico: sem sticky session, um usuario pode bater na V1 em uma requisicao e na V2 na proxima. Em deploys com breaking changes, isso causa experiencia estranha — o usuario ve a interface mudar aleatoriamente entre versoes.

Analogia: "Pense comigo, se for ali algum deploy muito grande, algo ali que tenha um breaking change, a nivel de experiencia do usuario... pode ser um problema se ele bater aleatoriamente na V1 e na proxima requisicao ele bater na V2."

### Solucao: ConsistentHash

No Istio, "sticky session" se chama ConsistentHash. Configurado no DestinationRule via `trafficPolicy.loadBalancer.consistentHash`.

Opcoes de chave:
- `httpCookie` — via sessao do usuario (recomendado para producao)
- `httpHeaderName` — via header da requisicao
- `useSourceIp` — via IP de origem
- `httpQueryParameterName` — via query param (bom para testes, ruim para producao)

## Istio NAO e ferramenta principal para Canary

Ponto importante do instrutor: "Se voce quiser trabalhar com Canary Deployment, nao e o Istio que vai ser a principal ferramenta pra voce resolver isso." Istio oferece canary como uma opcao, mas ferramentas dedicadas sao mais robustas:

- **Argo Rollouts** — suporta Blue-Green e Canary com automacao avancada
- **Flagger** — especifico para estrategias de deploy que o Kubernetes nao traz nativamente

## AB Testing com Match

Diferente do canary baseado em peso (aleatorio), o match-based routing permite controle deterministico:
- Requisicao com `testeAB=true` vai para V2
- Sem o parametro, vai para V1
- Respeita hierarquia: match especifico tem prioridade

O instrutor recomenda usar cookie ou header em vez de query parameter em producao, porque "nao e legal voce deixar isso na mao do seu cliente."

## Limitacao do Teste de Carga para Validar Sticky Session

O instrutor demonstrou que testes com Fortio usando multiplas threads nao validam bem o ConsistentHash, porque cada thread abre uma conexao diferente. A validacao mais eficaz e via chamadas entre servicos dentro do cluster, que e inclusive mais alinhado com o caso de uso real de service mesh.