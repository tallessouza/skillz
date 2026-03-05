---
name: rs-devops-realizando-mais-alguns-testes
description: "Applies Service Mesh traffic verification and debugging techniques when working with Istio Ambient Mode, Waypoint proxies, and Kiali visualization. Use when user asks to 'debug service mesh', 'verify traffic routing', 'test istio rules', 'check waypoint proxy', or 'visualize mesh traffic'. Covers Kiali graph modes, Waypoint interception validation, load testing for routing rules, and log-based verification. Make sure to use this skill whenever debugging or validating Istio traffic routing in Kubernetes. Not for Istio installation, sidecar injection setup, or Grafana/Prometheus configuration."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
