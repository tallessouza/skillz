# Code Examples: Arquitetura de um Cluster Kubernetes

## Visualizando componentes do cluster

### Verificar nodes do cluster
```bash
# Listar todos os nodes e seus status
kubectl get nodes

# Detalhes de um node especifico (recursos, pods alocados, condicoes)
kubectl describe node <node-name>
```

### Verificar componentes do control plane
```bash
# Verificar pods do sistema (control plane roda como pods no namespace kube-system)
kubectl get pods -n kube-system

# Saida tipica inclui:
# etcd-<master>
# kube-apiserver-<master>
# kube-scheduler-<master>
# kube-controller-manager-<master>
# kube-proxy-<node>  (um por node)
```

### Verificar recursos disponiveis nos nodes
```bash
# Ver capacidade e alocacao de recursos
kubectl describe node <node-name> | grep -A 5 "Allocated resources"

# Ver todos os nodes com uso de recursos
kubectl top nodes
```

### Interagindo com a API Server diretamente
```bash
# Iniciar proxy local para a API
kubectl proxy --port=8080

# Fazer chamada REST direta
curl http://localhost:8080/api/v1/namespaces/default/pods
```

### Verificar saude do etcd (bare metal)
```bash
# Verificar saude do etcd (requer acesso ao node master)
ETCDCTL_API=3 etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  endpoint health

# Backup do etcd (critico em bare metal)
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```

### Verificar kubelet em um node
```bash
# Status do kubelet (executar no proprio node)
systemctl status kubelet

# Logs do kubelet
journalctl -u kubelet -f
```

### Verificar kube-proxy
```bash
# kube-proxy roda como DaemonSet (um por node)
kubectl get daemonset kube-proxy -n kube-system

# Ver regras de rede criadas pelo kube-proxy
kubectl logs -n kube-system -l k8s-app=kube-proxy
```

## Arquitetura visual do cluster

```
┌─────────────────────────────────────────────────────┐
│                   CONTROL PLANE                      │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ API      │  │ kube-        │  │    etcd       │  │
│  │ Server   │  │ scheduler    │  │ (chave-valor) │  │
│  └──────────┘  └──────────────┘  └──────────────┘  │
│                                                      │
│  ┌──────────────────────┐                           │
│  │ controller-manager   │                           │
│  └──────────────────────┘                           │
└─────────────────────┬───────────────────────────────┘
                      │ (comunicacao via kubelet)
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│     NODE 1      │    │     NODE 2      │
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  kubelet    │ │    │ │  kubelet    │ │
│ ├─────────────┤ │    │ ├─────────────┤ │
│ │ kube-proxy  │ │    │ │ kube-proxy  │ │
│ ├─────────────┤ │    │ ├─────────────┤ │
│ │ ┌───┐ ┌───┐│ │    │ │ ┌───┐ ┌───┐│ │
│ │ │Pod│ │Pod││ │    │ │ │Pod│ │Pod││ │
│ │ └───┘ └───┘│ │    │ │ └───┘ └───┘│ │
│ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘
```