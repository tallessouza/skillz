---
name: rs-devops-configurando-o-loki
description: "Applies Loki log aggregator setup with Grafana via Docker Compose when user asks to 'configure Loki', 'setup log aggregation', 'add Loki to docker-compose', 'configure Grafana data source', or 'setup observability stack'. Enforces correct Docker Compose declaration, declarative data source provisioning, and type naming conventions. Make sure to use this skill whenever setting up Loki or Grafana log data sources. Not for Prometheus metrics, Tempo traces, or application-level logging code."
---

# Configurando o Loki

> Ao configurar o Loki como agregador de logs, declare tudo via arquivos declarativos — nunca configure data sources apenas pela interface do Grafana.

## Rules

1. **Use a imagem LTS do Loki** — `grafana/loki:latest` ou tag LTS, porque garante estabilidade em producao
2. **Porta padrao e 3100** — mapeie `3100:3100` no container, porque e a porta do ecossistema Grafana e a documentacao assume isso
3. **Declare depends_on no Grafana** — `depends_on: [loki]` garante subida em serial (Loki antes do Grafana), porque o data source precisa estar disponivel
4. **Type sempre em lowercase** — `type: loki` nunca `type: Loki`, porque o Grafana nao reconhece o plugin e o data source fica como "undefined"
5. **Provisione data sources via YAML** — use o arquivo declarativo em `provisioning/datasources/`, porque configuracao pela UI cria dissonancia entre ambientes
6. **Declare editable como false** — `editable: false` forca alteracoes pelo arquivo declarativo, porque evita drift de configuracao entre ambientes

## How to write

### Docker Compose — Servico Loki

```yaml
services:
  loki:
    image: grafana/loki:latest
    container_name: loki
    restart: always
    ports:
      - "3100:3100"
      - "7946:7946"
      - "9095:9095"

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - loki
    volumes:
      - ./provisioning:/etc/grafana/provisioning
```

### Data Source declarativo

```yaml
# provisioning/datasources/datasources.yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki          # LOWERCASE — obrigatorio
    access: proxy
    url: http://loki:3100
    isDefault: false
    editable: false
    version: 1
    uid: loki
```

## Example

**Before (type errado — data source nao reconhecido):**

```yaml
datasources:
  - name: Loki
    type: Loki          # Maiusculo — Grafana nao identifica o plugin
    url: http://localhost:3100
    editable: true
```

**After (configuracao correta):**

```yaml
datasources:
  - name: Loki
    type: loki           # Lowercase — plugin reconhecido
    access: proxy
    url: http://loki:3100  # Nome do servico Docker, nao localhost
    isDefault: false
    editable: false
    version: 1
    uid: loki
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Grafana e Loki na mesma rede Docker | Use `http://loki:3100` (nome do servico) |
| Loki em host separado | Use IP/hostname real com porta 3100 |
| Data source aparece sem logo no Grafana | Verifique se `type` esta em lowercase |
| Data source nao aparece no Explorer | `type` incorreto — corrija e recrie containers |
| Loki com autenticacao | Adicione campos de auth no data source YAML |
| Apenas um data source configurado | Grafana o marca como default automaticamente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `type: Loki` (maiusculo) | `type: loki` (lowercase) |
| `url: http://localhost:3100` dentro do Grafana | `url: http://loki:3100` (DNS do Docker) |
| Configurar data source pela UI do Grafana | Provisionar via YAML declarativo |
| `editable: true` em producao | `editable: false` para forcar IaC |
| Subir Grafana sem `depends_on: [loki]` | Declarar dependencia para subida serial |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-o-loki/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-o-loki/references/code-examples.md)
