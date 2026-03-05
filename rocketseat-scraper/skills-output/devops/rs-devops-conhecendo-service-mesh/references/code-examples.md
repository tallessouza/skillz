# Code Examples: Service Mesh

## Nota sobre exemplos de codigo

Esta aula e introdutoria e conceitual — o instrutor nao mostrou codigo ou comandos. Ele mencionou que as aulas praticas virao depois ("instalar do zero, criar cluster Kubernetes, colocar aplicacoes para rodar").

No entanto, para ilustrar os conceitos discutidos, seguem exemplos representativos:

## Exemplo conceitual: problema sem Service Mesh

```python
# Servico A — precisa implementar retry, circuit breaker, mTLS
import requests
from tenacity import retry, stop_after_attempt

@retry(stop=stop_after_attempt(3))
def call_service_b():
    return requests.get("https://service-b/api", verify="/certs/ca.pem")
```

```python
# Servico B — MESMA implementacao duplicada
import requests
from tenacity import retry, stop_after_attempt

@retry(stop=stop_after_attempt(3))
def call_service_c():
    return requests.get("https://service-c/api", verify="/certs/ca.pem")
```

```python
# Servico C, D, E... — replica em TODOS os N servicos
# Update na politica de retry? Mexer em TODOS.
```

## Exemplo conceitual: com Service Mesh

```python
# Servico A — codigo limpo, sem preocupacao com infra
import requests

def call_service_b():
    return requests.get("http://service-b/api")  # HTTP simples, sem TLS no codigo
```

```python
# Servico B — mesmo padrao limpo
import requests

def call_service_c():
    return requests.get("http://service-c/api")
```

```yaml
# A malha de servico (infra) cuida de tudo:
# - mTLS automatico entre servicos
# - Retry com backoff configuravel
# - Circuit breaker
# - Observabilidade (metricas, traces)
# - Load balancing
# Configuracao centralizada, nao replicada em N servicos
```

## Arquitetura: sidecar pattern (o que o instrutor chamou de "ao lado da aplicacao")

```
┌─────────── Pod Kubernetes ───────────┐
│                                       │
│  ┌─────────────┐  ┌───────────────┐  │
│  │  Aplicacao   │  │  Sidecar      │  │
│  │  (seu codigo)│◄─►  (Service     │  │
│  │             │  │   Mesh proxy) │  │
│  └─────────────┘  └───────┬───────┘  │
│                           │           │
└───────────────────────────┼───────────┘
                            │
                    ┌───────▼───────┐
                    │  Outro Pod    │
                    │  (com sidecar)│
                    └───────────────┘
```

## Decisao: quando usar Service Mesh

```
if aplicacao == "monolito":
    implementar_no_codigo()  # aceitavel
elif num_servicos < 3:
    avaliar_custo_beneficio()  # provavelmente nao justifica
elif orquestrador == "kubernetes":
    usar_service_mesh()  # caso ideal
elif orquestrador in ["nomad", "ecs"]:
    usar_service_mesh()  # conceito se aplica
elif infraestrutura == "vms_sem_orquestrador":
    possivel_mas_incomum()  # avaliar alternativas
```