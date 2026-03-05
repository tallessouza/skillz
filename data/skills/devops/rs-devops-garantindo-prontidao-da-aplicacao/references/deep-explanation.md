# Deep Explanation: Kubernetes Probes — Startup, Liveness e Readiness

## O modelo mental: Pod, Container e o problema de confianca

Um pod executa um ou mais containers. Porem, **nada garante que o container sera inicializado com sucesso**. Esse e o problema fundamental que as probes resolvem.

### O fluxo sem probes (perigoso)

1. Voce faz deploy de uma nova versao
2. O container sobe (ou tenta subir)
3. O Service ja aponta os IPs dos novos pods
4. O pod comeca a receber trafego externo
5. Se a aplicacao nao inicializou → downtime

### O fluxo com probes (seguro)

1. Voce faz deploy de uma nova versao
2. **Startup Probe** verifica se o container inicializou (`/health`)
3. Se nao passou → pod nunca entra no pool de endpoints do Service
4. **Readiness Probe** verifica se a aplicacao esta pronta (`/readyz`)
5. Checa a aplicacao E dependencias externas (banco, cache, etc)
6. So apos passar → IPs dos pods sao adicionados aos endpoints do Service
7. **Liveness Probe** monitora continuamente a cada N segundos
8. Se falha → Kubelet informa o control plane → restart do pod

## A mecanica do Service e Endpoints

O Service nao resolve para o Deployment ou ReplicaSet. Ele resolve diretamente para os **pods** via label selector. Quando voce roda `kubectl describe svc`, ve os endpoints — que sao os IPs individuais de cada pod.

### Demonstracao do instrutor

O instrutor mostrou que ao mudar a label no Service selector (ex: de `api-app-ts` para `api-app`), o `describe` mostra zero endpoints — porque nenhum pod faz match. Ao corrigir a label, os IPs voltam.

**Implicacao para probes:** Se um pod nao passa na readiness probe, seu IP **nao aparece** nos endpoints do Service. Portanto, nunca recebe trafego.

## Self-healing: o que realmente acontece

Quando o liveness probe falha:
1. O **Kubelet** (no node) detecta a falha
2. Kubelet envia informacao para o **control plane**
3. Control plane ordena **restart do pod**
4. Pod reinicia e passa novamente por startup → readiness → liveness

### Limitacao importante (insight do instrutor)

> "Quer dizer que isso vai resolver o seu problema? Nao. Inclusive, na maioria das vezes, nao vai resolver."

O self-healing via restart e um **paliativo**. O valor real esta em:
- **Prevenir impacto ao usuario** (pod problematico nao recebe trafego)
- **Gerar sinais para observabilidade** (CrashLoopBackOff, restart counts)
- **Comprar tempo** para acao manual antes que o cliente perceba

A conexao direta e com o modulo de observabilidade: probes + alarmes = resposta proativa.

## Stateless vs Stateful

O instrutor enfatiza que o contexto e de aplicacoes **stateless (efemeras)**. Nesse caso, o restart e barato e seguro — nao ha estado para perder. Para aplicacoes stateful, a estrategia de recovery e diferente e mais complexa.

## A diferenca entre /health e /readyz

- `/health` — verifica se a **aplicacao em si** esta funcionando (usado por startup e liveness)
- `/readyz` — verifica se a aplicacao esta **pronta para receber trafego**, incluindo dependencias externas como banco de dados, cache, filas, etc.

Um container pode estar "vivo" (health OK) mas nao "pronto" (readyz falha porque o banco esta fora). Essa distincao e critica.