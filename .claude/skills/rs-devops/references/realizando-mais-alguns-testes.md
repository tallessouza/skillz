---
name: rs-devops-realizando-mais-alguns-testes
description: "Applies Istio traffic verification patterns when validating service mesh routing rules. Use when user asks to 'verify istio routing', 'test canary deployment', 'validate traffic split', 'debug service mesh routing', or 'use kiali for traffic analysis'. Enforces multi-layer verification (graph, workload, logs, negative testing). Make sure to use this skill whenever validating Istio routing rules in production. Not for application code, Docker configuration, or Terraform."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-traffic-verification
  tags: [istio, kiali, traffic, routing, ambient-mode, waypoint, service-mesh, verification]
---

# Verificacao de Trafego em Service Mesh com Istio Ambient Mode

> Ao validar regras de roteamento em Service Mesh, verifique fisicamente o trafego em multiplas camadas: graph, workload, logs e endpoints.

## Rules

1. **Use Versioned App Graph no Kiali** — selecione "Versioned app graph" no dropdown, porque outros modos (Service, Workload) nao mostram a quebra por versao dos deployments
2. **Teste contra o servico, nao contra o gateway** — envie carga direto no Service (`svc`), porque o Waypoint intercepta o trafego dentro do namespace como se fosse um sidecar
3. **Valide ausencia de trafego na versao errada** — alem de confirmar trafego na versao correta, confirme ZERO trafego na versao que nao deveria receber, porque ausencia de evidencia nao e evidencia de ausencia
4. **Verifique o Waypoint como intermediario** — no Kiali, clique em Workloads e confirme que o Waypoint aparece no caminho do trafego, porque se ele nao estiver interceptando, as regras de roteamento nao serao aplicadas
5. **Confira logs do pod** — valide que os logs do pod correspondem a versao esperada, porque e a confirmacao definitiva alem da visualizacao do graph
6. **Mantenha configuracoes declarativas** — nunca deixe operacoes feitas via CLI imperativo sem converter para arquivos YAML declarativos, porque comandos imperativos nao escalam e nao sao reproduziveis

## How to verify

### Teste de carga com roteamento por versao

```bash
# Teste direto no servico (Waypoint intercepta automaticamente)
# Para validar que apenas V2 recebe trafego:
kubectl exec -it deploy/fortio -- fortio load \
  -c 5 -qps 10 -t 30s \
  http://app-service-mesh.default.svc.cluster.local:8080

# Para validar V1 isoladamente (ajuste o VirtualService antes):
kubectl exec -it deploy/fortio -- fortio load \
  -c 5 -qps 10 -t 30s \
  http://app-service-mesh.default.svc.cluster.local:8080
```

### Verificacao no Kiali

```
1. Abra Kiali → Graph → Dropdown: "Versioned app graph"
2. Confirme trafego fluindo: Waypoint → App V2 (ou V1 conforme regra)
3. Clique em Workloads → Waypoint → veja requisicoes passando
4. Clique na versao que NAO deveria receber → confirme zero trafego
5. Verifique Logs tab no workload para confirmacao definitiva
```

### Debug quando trafego nao respeita regras

```bash
# 1. Verificar se Waypoint esta no namespace
kubectl get pods -n <namespace> | grep waypoint

# 2. Verificar VirtualService aplicado
kubectl get virtualservice -n <namespace> -o yaml

# 3. Verificar DestinationRule
kubectl get destinationrule -n <namespace> -o yaml

# 4. Checar logs do Waypoint
kubectl logs deploy/waypoint -n <namespace>
```

## Example

**Cenario: VirtualService roteia 100% para V2, mas V1 recebe trafego**

**Diagnostico:**
```
1. Kiali → Workloads → Waypoint NAO aparece no path
   → Waypoint nao esta interceptando
2. Verificar label do namespace:
   kubectl get ns default --show-labels
   → Falta: istio.io/dataplane-mode=ambient
3. Aplicar label:
   kubectl label namespace default istio.io/dataplane-mode=ambient
4. Re-testar → Waypoint agora aparece → V1 com zero trafego ✓
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Graph nao mostra versoes separadas | Trocar para "Versioned app graph" no dropdown |
| Waypoint nao aparece no path do trafego | Verificar label `istio.io/dataplane-mode=ambient` no namespace |
| Kiali nao renderiza graph corretamente | Ajustar janela de tempo (ultimo 1-2 min), considerar usar Grafana |
| Fez config via `istioctl` ou `kubectl` imperativo | Converter para YAML declarativo antes de prosseguir |
| Precisa validar regra de roteamento | Testar AMBAS versoes: confirmar trafego na correta E zero na incorreta |
| Logs do pod mostram versao errada | Verificar se DestinationRule tem subsets corretos com labels matching |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Testar apenas a versao que DEVE receber trafego | Testar ambas: confirmar presenca E ausencia |
| Confiar apenas no graph do Kiali | Complementar com logs do pod e do Waypoint |
| Deixar configs imperativas sem arquivo YAML | Converter todo comando imperativo para manifesto declarativo |
| Usar "Service graph" para debug de versoes | Usar "Versioned app graph" para ver quebra por versao |
| Bater no Gateway para testar roteamento interno | Bater direto no Service (Waypoint intercepta no namespace) |
| Debugar sem verificar se Waypoint esta no caminho | Sempre confirmar Waypoint como intermediario no Kiali Workloads |

## Troubleshooting

### Kiali nao mostra versoes separadas no graph
**Symptom:** Graph do Kiali mostra aplicacao como bloco unico sem separacao V1/V2
**Cause:** Modo de visualizacao errado selecionado no dropdown (App graph ou Service graph em vez de Versioned app graph)
**Fix:** Selecionar "Versioned app graph" no dropdown do Kiali Graph para ver a quebra por versao dos deployments

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Verificacao de Trafego em Service Mesh

## Como o Waypoint intercepta trafego no Ambient Mode

O instrutor demonstra um ponto fundamental: no Ambient Mode do Istio, o Waypoint proxy funciona como um interceptador de trafego dentro do namespace, similar ao papel do sidecar no modo tradicional, mas sem injetar um container em cada pod.

Quando voce envia trafego para um Service (`app-service-mesh.svc`), o Waypoint intercepta automaticamente e aplica as regras do VirtualService. Isso significa que:
- Voce NAO precisa apontar para o Waypoint diretamente
- O trafego e redirecionado transparentemente
- As regras de roteamento (ex: 100% V2) sao aplicadas pelo Waypoint

O instrutor enfatiza: "A gente nao esta fazendo nenhum tipo de teste no Waypoint. A gente esta passando no App Service Mesh SVC. Porem, o nosso Waypoint esta interceptando o trafego e ele esta mandando requisicao somente para o App Service Mesh V2."

## Modos de visualizacao no Kiali

O instrutor comecou com uma falha de visualizacao porque estava no modo errado do Kiali. Existem varios modos:

- **App graph**: mostra aplicacoes agrupadas (nao mostra versoes)
- **Service graph**: mostra servicos (nao mostra versoes)
- **Workload graph**: mostra workloads individuais
- **Versioned app graph**: mostra aplicacoes COM quebra por versao — este e o modo correto para validar roteamento por versao

A licao: quando voce tem deployments com multiplas versoes (V1, V2), APENAS o "Versioned app graph" vai mostrar a separacao de trafego entre elas.

## Validacao em multiplas camadas

O instrutor demonstra uma abordagem de verificacao em camadas:

1. **Graph visual**: ver o fluxo no Kiali (rapido, mas nem sempre confiavel — ele mesmo teve problemas de renderizacao)
2. **Workload details**: clicar no Waypoint para ver requisicoes passando
3. **Endpoint details**: clicar no workload especifico para ver detalhamento
4. **Logs do pod**: confirmacao definitiva — os logs da aplicacao mostram apenas requests da versao correta
5. **Teste negativo**: clicar na versao que NAO deveria receber e confirmar ZERO trafego

## Por que declarativo > imperativo

O instrutor faz um ponto importante no final: ao longo do modulo, varias configuracoes foram feitas via comandos imperativos (ex: `kubectl label namespace`). Isso nao escala porque:

- Comandos imperativos nao ficam registrados em arquivos versionaveis
- Nao e possivel reproduzir o ambiente facilmente
- Labels de namespace (como `istio.io/dataplane-mode=ambient` ou `istio.io/use-waypoint`) precisam estar em manifesto YAML
- A organizacao declarativa facilita a escalabilidade e a manutencao

## Kiali vs Grafana no dia a dia

O instrutor faz um disclaimer importante: "No dia a dia o uso do Kiali acaba nao sendo tao comum. A gente vai trabalhar com o Grafana, que vai centralizar tanto metricas do Istio quanto metricas da propria aplicacao."

Kiali e otimo para:
- Debug visual de roteamento
- Entender como o trafego flui
- Aprendizado e exploracao

Grafana e preferido no dia a dia para:
- Metricas centralizadas
- Dashboards operacionais
- Alertas e monitoramento continuo

## Ambient Mode vs Sidecar: mesmos conceitos, mesma validacao

O instrutor menciona que os exemplos de roteamento avancado no Ambient Mode produzem os mesmos resultados que no modo Sidecar. A diferenca e arquitetural (sem sidecar container), mas as regras de VirtualService, DestinationRule e a validacao seguem a mesma logica.

---

# Code Examples: Verificacao de Trafego em Service Mesh

## Teste de carga direto no servico

O instrutor roda testes de carga batendo diretamente no Service, nao no Gateway:

```bash
# Teste para validar roteamento para V2
# O Waypoint intercepta automaticamente no namespace
kubectl exec -it deploy/fortio -- fortio load \
  -c 5 -qps 10 -t 30s \
  http://app-service-mesh.default.svc.cluster.local:8080
```

**Por que direto no Service?** Porque o objetivo e testar se o Waypoint intercepta corretamente dentro do namespace. Se voce bater no Gateway, o trafego passa por outra camada e voce nao isola o comportamento do Waypoint.

## Verificacao no Kiali passo a passo

### Selecionar modo correto do graph

```
Kiali UI → Graph → Dropdown no topo
  ❌ App graph (nao mostra versoes)
  ❌ Service graph (nao mostra versoes)
  ❌ Workload graph (nao mostra versoes agrupadas)
  ✅ Versioned app graph (mostra V1 e V2 separados)
```

### Verificar Waypoint via Workloads

```
Kiali UI → Workloads → waypoint
  → Aba "Traffic": mostra requisicoes passando pelo Waypoint
  → Servicos conectados ao Waypoint visiveis
  → Confirmar que trafego sai do Waypoint para a versao correta
```

### Verificar ausencia de trafego

```
Kiali UI → Workloads → app-service-mesh-v1
  → Ajustar timeframe: "Last 2 min"
  → Resultado esperado: ZERO trafego (quando regra manda tudo para V2)

Kiali UI → Workloads → app-service-mesh-v2
  → Resultado esperado: TODO trafego visivel
```

### Verificar logs via Kiali

```
Kiali UI → Workloads → app-service-mesh-v2 → Logs tab
  → Apenas logs com marcacao "V2" devem aparecer
  → Se aparecer log de "V1", a regra nao esta funcionando
```

## Exemplo de VirtualService para roteamento por versao

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: default
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 100
```

## Exemplo de DestinationRule com subsets

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
  namespace: default
spec:
  host: app-service-mesh
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Conversao de imperativo para declarativo

### Imperativo (nao escala):

```bash
# Labels no namespace via comando
kubectl label namespace default istio.io/dataplane-mode=ambient
kubectl label namespace default istio.io/use-waypoint=waypoint
```

### Declarativo (correto):

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: default
  labels:
    istio.io/dataplane-mode: ambient
    istio.io/use-waypoint: waypoint
```

## Checklist de debug quando roteamento falha

```bash
# 1. Namespace tem label de Ambient Mode?
kubectl get ns default --show-labels | grep dataplane-mode

# 2. Waypoint esta rodando?
kubectl get pods -n default | grep waypoint

# 3. VirtualService esta aplicado?
kubectl get vs -n default

# 4. DestinationRule tem subsets corretos?
kubectl get dr -n default -o yaml

# 5. Pods tem labels de versao corretas?
kubectl get pods -n default --show-labels | grep version

# 6. Logs do Waypoint mostram interceptacao?
kubectl logs deploy/waypoint -n default --tail=50
```
