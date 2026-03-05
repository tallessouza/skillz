# Deep Explanation: Kubernetes Startup Probe

## O que sao Probes no Kubernetes

Probes nao sao objetos do Kubernetes — sao recursos/configuracoes que ficam dentro de `spec.template.spec.containers`. Para cada container declarado, voce pode configurar probes. Elas nao sao obrigatorias, mas sao boa pratica para controle em tres niveis:

1. **Startup** — a aplicacao subiu?
2. **Readiness** — a aplicacao esta pronta para receber trafego?
3. **Liveness** — a aplicacao ainda esta viva?

## Onde o startupProbe fica no manifesto

O startupProbe fica no mesmo nivel de `image`, `ports`, `imagePullPolicy` — dentro de `containers[]`. A identacao e critica: ele esta dentro de `template.spec.containers`, nao no nivel do Pod.

## Como funciona o httpGet

A probe faz uma chamada GET em um endpoint do **container** (nao do servico externo). Por isso a porta e a do container (ex: 3000). A rota deve:

- Ser GET (padrao HTTP para leitura, sem side effects)
- Retornar status 200 para indicar sucesso
- Existir de fato na aplicacao

## Semantica dos parametros

### failureThreshold (default: 3)
Quantas falhas consecutivas o Kubernetes tolera. Se exceder, o container e considerado como "nao subiu" e e restartado.

**Logica:** "Se falhou mais de N vezes, algo esta errado."

### successThreshold (default: 1)
Quantos sucessos consecutivos sao necessarios para considerar que subiu. Para startupProbe, **sempre deve ser 1** — basta confirmar uma vez que subiu.

**Logica invertida em relacao a failure:** "Preciso de pelo menos 1 sucesso."

### timeoutSeconds (default: 1)
Tempo maximo que cada tentativa individual pode levar. Nao e "quantos timeouts tolero" — e o tempo maximo por check. Se a resposta demorar mais que isso, conta como falha.

### periodSeconds (default: 10)
Intervalo entre cada execucao da probe. Todas as regras de failure/success/timeout se aplicam dentro de cada periodo.

### Recapitulacao do instrutor
"A cada 10 segundos, eu vou tolerar ate 3 falhas, eu vou precisar ter ate um sucesso e eu tolero aqui no maximo 1 segundo de timeout."

## Self-healing em acao

Quando a probe falha alem do threshold, o Kubernetes **reinicia o container automaticamente**. Isso e o mecanismo de self-healing.

**Cenario demonstrado na aula:** O instrutor configurou a probe apontando para `/healthz`, mas a imagem (v5) nao tinha essa rota. Resultado:

1. Container subiu normalmente (aplicacao startou, rotas mapeadas)
2. startupProbe bateu em `/healthz` → recebeu 404
3. Kubernetes interpretou como falha
4. Apos exceder failureThreshold → restart do container
5. Container restartou → mesma coisa → **loop infinito de restarts**

**Ponto critico do instrutor:** "A aplicacao ate subiu. So que como voce colocou o startup probe para validar em uma rota que nao existe, para o startup probe, ela nao esta funcionando."

## O ponto positivo do self-healing

Mesmo com o container novo falhando, **a aplicacao nao ficou offline**. Os containers anteriores (replicas existentes) continuaram rodando normalmente. Apenas os novos containers ficaram em loop de restart.

"Nossa aplicacao nao esta offline. A aplicacao anterior nao sofreu alteracao. Temos aqui varios containers rodando as nossas seis replicas, tudo tranquilo, mas as duas que a gente esta tentando subir nao deu certo."

## Convencao do sufixo Z

O `/healthz` e `/readyz` usam o sufixo Z para evitar colisao de path. E um padrao do ecossistema Kubernetes (o proprio API server usa `/healthz`, `/readyz`, `/livez`). Voce pode usar outra nomenclatura, mas o Z e a convencao mais comum.

## Sobre duplicacao de porta no manifesto

A porta aparece tanto em `ports.containerPort` quanto em `startupProbe.httpGet.port`. O instrutor reconhece a duplicacao e menciona que **templatizacao** (Helm, Kustomize) resolve isso concentrando valores em um unico lugar — "uma fonte da verdade". Ate la, se a porta mudar, precisa alterar nos dois lugares.