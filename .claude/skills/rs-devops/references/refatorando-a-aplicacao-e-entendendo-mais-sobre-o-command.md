---
name: rs-devops-refatorando-aplicacao-command
description: "Applies Kubernetes probe timing and exec command patterns when configuring health checks. Use when user asks to 'fix probe timing', 'use exec command in probe', 'configure initialDelaySeconds', 'debug CrashLoopBackOff from probes', or 'choose between httpGet and exec probe'. Enforces proper delay margins and handler selection. Make sure to use this skill whenever fine-tuning Kubernetes probe configuration. Not for application logic, Docker configuration, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-probe-config
  tags: [kubernetes, probes, exec, command, initialDelaySeconds, rolling-update, health-check]
---

# Kubernetes Probes: Configuracao e Command Exec

> Configure probes com margens seguras de tempo e use command exec quando verificacoes customizadas sao necessarias.

## Rules

1. **initialDelaySeconds com margem** — se a aplicacao demora X segundos para subir, configure `initialDelaySeconds` um pouco acima de X, porque valores abaixo causam falsos negativos e restarts desnecessarios
2. **Nao e obrigatorio usar as tres probes** — use apenas as que fazem sentido para o caso; uma unica probe (startup, readiness ou liveness) ja funciona, porque o Kubernetes aceita qualquer combinacao
3. **MaxSurge so age apos probes validarem** — durante rolling updates, novos pods so recebem trafego depois que todas as probes configuradas passam, porque o Kubernetes espera validacao antes de prosseguir o rollout
4. **Command exec para verificacoes customizadas** — use `exec.command` quando httpGet nao cobre o cenario de saude, porque scripts shell podem verificar dependencias externas, arquivos, ou estados internos
5. **Nao misture httpGet e exec na mesma probe** — o Kubernetes rejeita manifesto com mais de um tipo de check na mesma probe, porque cada probe aceita exatamente um handler
6. **Script deve existir na imagem** — ao usar exec com shell script, garanta que o arquivo existe no container, porque o pod entra em CrashLoopBackOff se o script nao for encontrado

## How to write

### Probe com httpGet (padrao)

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Probe com exec command

```yaml
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - /app/check.sh
  initialDelaySeconds: 10
```

### Apenas uma probe (caso simples)

```yaml
# Valido: usar somente startupProbe
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
```

## Example

**Before (aplicacao instavel com restarts):**
```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 2    # muito curto, app demora 8s
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 2
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 2
```

**After (com margens adequadas):**
```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10   # margem acima dos 8s de boot
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Tempo de boot conhecido e fixo (ex: 30s) | `initialDelaySeconds: 35` (margem pequena) |
| Tempo de boot variavel/aproximado | `initialDelaySeconds` bem acima do estimado |
| Verificacao requer logica customizada | Use `exec.command` com shell script |
| Aplicacao simples com endpoint /health | Use `httpGet` apenas |
| Nao precisa distinguir readiness de liveness | Use apenas uma probe |
| Rolling update com MaxSurge | Lembre que probes devem passar antes do rollout continuar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `httpGet` e `exec` na mesma probe | Escolha um: `httpGet` OU `exec` |
| `initialDelaySeconds: 0` para app que demora | Valor acima do tempo real de boot |
| Script em `exec` que nao existe na imagem | Garanta o script no Dockerfile (COPY) |
| Tres probes identicas sem necessidade | Apenas as probes que agregam valor |
| `initialDelaySeconds` menor que boot time | Margem de seguranca acima do boot time |

## Troubleshooting

### Pod entra em CrashLoopBackOff ao usar exec probe com script
**Symptom:** Pod falha repetidamente com erro "exec: not found" ou "no such file or directory"
**Cause:** Script referenciado no exec.command nao existe na imagem do container
**Fix:** Garantir que o Dockerfile copia o script (`COPY check.sh /app/check.sh`) e define permissao de execucao (`RUN chmod +x /app/check.sh`)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Refatorando a Aplicacao e Entendendo o Command

## Contexto do problema

O instrutor mostra uma aplicacao em estado caotico — multiplos restarts, varias replicas tentando segurar mas sem sucesso. Isso ilustra o cenario real: probes mal configuradas ou aplicacao com bugs levam a CrashLoopBackOff, e escalar replicas nao resolve o problema fundamental.

A licao central: **escalar uma aplicacao quebrada nao conserta nada**. O caminho correto e corrigir o problema na raiz (remover timeouts artificiais, corrigir o health service) e so entao fazer o redeploy.

## Margem no initialDelaySeconds

O instrutor enfatiza: se voce sabe que a aplicacao demora X segundos, coloque um valor **um pouco acima**. A razao e que:

- Valores incertos (boot time variavel) devem ter margem generosa
- Valores certos (timeout fixo de 30s) podem ter margem menor
- Pecar pra mais e melhor que pecar pra menos — um delay maior so atrasa o primeiro check, enquanto um delay menor causa restarts falsos

Analogia pratica: se o onibus chega as 8h mas as vezes atrasa 5 min, voce chega as 7:50, nao as 8:01.

## MaxSurge e probes

Ponto critico que o instrutor ressalta: durante rolling updates, o MaxSurge (quantos pods extras podem existir durante o deploy) so tem efeito **depois** que as probes validam os novos pods. Isso significa:

- Se as tres probes estao configuradas, todas precisam passar
- Se uma probe falha, o rollout fica travado ate resolver
- O Kubernetes nao continua a cadencia de substituicao ate ter sucesso

## Flexibilidade: nao precisa das tres probes

O instrutor deixa claro que usar startup + readiness + liveness e boa pratica, mas **nao e obrigatorio**. Voce pode:

- Usar apenas startupProbe para casos simples
- Usar apenas livenessProbe se so quer restart automatico
- Usar apenas readinessProbe se so quer controlar trafego
- Qualquer combinacao que faca sentido para o contexto

## Command exec: alternativa ao httpGet

O instrutor apresenta o `exec.command` como alternativa ao `httpGet` nas probes. O caso de uso:

- Aplicacoes com verificacoes especificas que um endpoint HTTP nao cobre
- Scripts shell que checam dependencias, arquivos, estados internos
- Formato: `/bin/sh -c /caminho/do/script.sh`

Restricao importante: o Kubernetes **nao aceita** dois tipos de handler na mesma probe (httpGet + exec). Cada probe aceita exatamente um.

O script deve existir na imagem do container. Se nao existir, o pod falha com erro "not found" e entra em CrashLoopBackOff — exatamente o que o instrutor demonstra ao aplicar um manifesto referenciando `check.sh` que nao existe.

## Quando usar exec vs httpGet

- **httpGet**: maioria dos casos, aplicacao expoe endpoint de saude
- **exec**: verificacoes de sanidade que vao alem do HTTP (checar arquivo, processo, conexao com DB via script)
- E possivel usar exec para startup (verificacao pesada) e httpGet para readiness/liveness (verificacao leve)

---

# Code Examples: Probes e Command no Kubernetes

## 1. Manifesto completo com httpGet (versao estavel)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:v9
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
```

## 2. Probe com exec command

```yaml
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - /app/check.sh
  initialDelaySeconds: 10
```

O script `check.sh` dentro do container:

```bash
#!/bin/sh
# Exemplo: verificar se um arquivo de lock existe
if [ -f /tmp/app-ready.lock ]; then
  exit 0  # saudavel
else
  exit 1  # nao saudavel
fi
```

## 3. Combinacao: exec no startup, httpGet no restante

```yaml
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - /app/startup-check.sh
  initialDelaySeconds: 10
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

## 4. Apenas uma probe (caso minimo)

```yaml
# Somente startup — valido e aceito pelo Kubernetes
containers:
  - name: my-app
    image: my-app:v9
    startupProbe:
      httpGet:
        path: /health
        port: 3000
      initialDelaySeconds: 10
```

## 5. Erro demonstrado: script inexistente

```yaml
# Isso causa erro porque check.sh nao existe na imagem
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - check.sh
```

Erro resultante no pod:
```
OCI runtime exec failed: exec failed: unable to start container process:
exec: "/bin/sh": stat check.sh: no such file or directory
```

Solucao: garantir que o Dockerfile copia o script:

```dockerfile
COPY check.sh /app/check.sh
RUN chmod +x /app/check.sh
```

## 6. Docker build e push (workflow do instrutor)

```bash
# Build da nova versao corrigida
docker build -t my-app:v9 .

# Push para registry
docker push my-app:v9

# Aplicar manifesto atualizado
kubectl apply -f deployment.yaml
```

## 7. Verificar estado dos pods apos apply

```bash
# Ver pods e restarts
kubectl get pods

# Ver eventos do pod (util para debug de probes)
kubectl describe pod <pod-name>

# Ver logs do container
kubectl logs <pod-name>
```
