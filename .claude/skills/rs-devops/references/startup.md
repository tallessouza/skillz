---
name: rs-devops-startup
description: "Applies Kubernetes startupProbe configuration to verify container initialization before other probes activate. Use when user asks to 'configure startup probe', 'check if container started', 'fix restart loop', 'add health check', or 'configure /healthz endpoint'. Enforces httpGet probe type, explicit failureThreshold, successThreshold of 1, and /healthz suffix convention. Make sure to use this skill whenever adding startup probes to Kubernetes deployment manifests or debugging container restart loops. Not for readinessProbe or livenessProbe configuration (see dedicated skills)."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-probes
  tags: [kubernetes, startup-probe, healthz, self-healing, probes, health-check, httpget]
---

# Kubernetes Startup Probe

> Configure startupProbe em cada container para verificar se a aplicacao subiu antes de qualquer outra probe atuar.

## Rules

1. **startupProbe fica no nivel do container** — dentro de `spec.template.spec.containers[].startupProbe`, porque probes sao por container, nao por Pod
2. **Use httpGet para checar rota GET** — probes batem em endpoints do container, entao a rota deve existir e responder 200, porque 404 causa restart infinito
3. **Defina failureThreshold** — numero inteiro de falhas toleradas antes de considerar que o container nao subiu, porque sem isso o Kubernetes usa defaults que podem nao refletir sua aplicacao
4. **successThreshold deve ser 1** — basta um sucesso para confirmar que subiu, porque a logica e invertida em relacao a failure (precisa de pelo menos 1)
5. **timeoutSeconds define tempo maximo por tentativa** — nao e quantidade de timeouts, e o tempo maximo em segundos que cada check pode levar
6. **periodSeconds define o intervalo entre checks** — a cada N segundos o Kubernetes executa a probe, e dentro desse periodo aplica as regras de failure/success/timeout
7. **Use sufixo Z nas rotas de health** — `/healthz`, `/readyz` evitam colisao de path com rotas da aplicacao, porque e um padrao do ecossistema Kubernetes

## How to write

### startupProbe basico

```yaml
spec:
  template:
    spec:
      containers:
        - name: app
          image: app:v6
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /healthz
              port: 3000
            failureThreshold: 3
            successThreshold: 1
            timeoutSeconds: 1
            periodSeconds: 10
```

### Recapitulando a semantica

```yaml
# A cada 10 segundos (periodSeconds):
#   - Faz GET em /healthz na porta 3000
#   - Tolera ate 3 falhas (failureThreshold)
#   - Precisa de pelo menos 1 sucesso (successThreshold)
#   - Cada tentativa tem no maximo 1s (timeoutSeconds)
# Se falhar alem do threshold: container e restartado (self-healing)
```

## Example

**Before (sem probe — sem verificacao de subida):**

```yaml
containers:
  - name: api
    image: api:v5
    ports:
      - containerPort: 3000
```

**After (com startupProbe configurado):**

```yaml
containers:
  - name: api
    image: api:v6
    ports:
      - containerPort: 3000
    startupProbe:
      httpGet:
        path: /healthz
        port: 3000
      failureThreshold: 3
      successThreshold: 1
      timeoutSeconds: 1
      periodSeconds: 10
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Aplicacao leve (Node, Go) | `timeoutSeconds: 1`, `periodSeconds: 10` |
| Aplicacao pesada (Java, .NET) | Aumentar `timeoutSeconds` e `failureThreshold` |
| Rota de health ainda nao existe | Criar rota GET que retorna 200 antes de configurar probe |
| Porta do container duplicada no manifesto | Tolerar ate templatizar com Helm/Kustomize |
| Container restarting infinitamente | Verificar se a rota da probe existe e retorna 200 (erro 404 = restart loop) |
| Multiplos containers no Pod | Configurar startupProbe individualmente em cada container |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Probe apontando para rota inexistente | Confirmar que a rota existe e retorna 200 |
| Omitir `failureThreshold` | Definir explicitamente quantas falhas tolera |
| `successThreshold` maior que 1 em startupProbe | Usar `successThreshold: 1` (um sucesso ja confirma subida) |
| Usar POST na probe | Usar GET (probes usam httpGet, padrao HTTP para leitura) |
| Confundir startupProbe com readinessProbe | startupProbe = subiu? readinessProbe = pronto para receber trafego? |
| Rota `/health` sem sufixo | Usar `/healthz` para evitar colisao de paths |


## Troubleshooting

### Container restarting infinitamente com startup probe
**Symptom:** Pod mostra alto numero de RESTARTS, eventos mostram "startup probe failed: HTTP probe failed with status code 404"
**Cause:** A rota configurada na probe (ex: /healthz) nao existe na aplicacao ou retorna 404
**Fix:** Confirme que a rota existe na aplicacao e retorna status 200 antes de configurar a probe

### Aplicacao lenta causa restart por timeout
**Symptom:** Container reinicia durante startup mesmo com aplicacao funcional
**Cause:** `timeoutSeconds` ou `failureThreshold` muito baixos para o tempo real de inicializacao da aplicacao
**Fix:** Aumente `failureThreshold` e `timeoutSeconds` — para apps Java/Spring, use failureThreshold: 30 e timeoutSeconds: 5

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

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

---

# Code Examples: Kubernetes Startup Probe

## Rotas de health na aplicacao (Node.js)

As rotas que a probe vai checar devem existir na aplicacao:

```javascript
// Rota de health (para startupProbe)
app.get('/healthz', (req, res) => {
  console.log('Chequei a saúde da aplicação')
  return res.status(200).send()
})

// Rota de readiness (para readinessProbe)
app.get('/readyz', (req, res) => {
  console.log('Chequei a prontidão da aplicação')
  return res.status(200).send()
})
```

## Manifesto completo do Deployment com startupProbe

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 6
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: app
          image: app:v6
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /healthz
              port: 3000
            failureThreshold: 3
            successThreshold: 1
            timeoutSeconds: 1
            periodSeconds: 10
```

## Cenario de erro: rota inexistente

Se a imagem nao tem a rota `/healthz`:

```yaml
# ERRADO: imagem v5 nao tem /healthz
containers:
  - name: app
    image: app:v5  # <-- nao tem as rotas de health
    startupProbe:
      httpGet:
        path: /healthz  # <-- vai retornar 404
        port: 3000
      failureThreshold: 3
      successThreshold: 1
      timeoutSeconds: 1
      periodSeconds: 10
```

Resultado nos eventos do Kubernetes:

```
Warning  Unhealthy  startup probe failed: HTTP probe failed with status code 404
```

O container entra em loop de restart infinito. A correcao e usar a imagem correta:

```yaml
# CORRETO: imagem v6 tem /healthz e /readyz
containers:
  - name: app
    image: app:v6  # <-- tem as rotas de health
    startupProbe:
      httpGet:
        path: /healthz  # <-- vai retornar 200
        port: 3000
```

## Aplicando o manifesto

```bash
# Aplicar o deployment
kubectl apply -f deployment.yaml

# Acompanhar o status dos pods
kubectl get pods -w

# Ver eventos (para diagnosticar falhas de probe)
kubectl describe pod <pod-name>

# Ver logs do container
kubectl logs <pod-name>
```

## Variacao: aplicacao com startup lento (Java/Spring Boot)

```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30    # Tolera mais falhas (startup lento)
  successThreshold: 1
  timeoutSeconds: 5        # Mais tempo por tentativa
  periodSeconds: 10
  # Total: ate 30 * 10 = 300 segundos (5 min) para subir
```

## Variacao: probe com TCP em vez de HTTP

```yaml
# Para aplicacoes que nao tem endpoint HTTP de health
startupProbe:
  tcpSocket:
    port: 3000
  failureThreshold: 3
  successThreshold: 1
  timeoutSeconds: 1
  periodSeconds: 10
```

## Build e push da imagem (fluxo completo)

```bash
# Build da nova versao com as rotas de health
docker build -t app:v6 .

# Push para o registry
docker push app:v6

# Atualizar o manifesto e aplicar
kubectl apply -f deployment.yaml
```
