# Code Examples: As Três Maneiras do DevOps

## Nota sobre exemplos

Esta aula e conceitual/referencial — nao contem codigo. Os exemplos abaixo sao aplicacoes praticas dos principios em cenarios reais de DevOps.

## Exemplo 1: Diagnostico com as Tres Maneiras

### Checklist de avaliacao organizacional

```yaml
# tres-maneiras-assessment.yaml
assessment:
  date: "2026-02-28"
  team: "Squad Backend"

  primeira_maneira:
    fluxo_dev_ops:
      deploy_frequencia: "diario"  # ideal: diario ou mais
      deploy_automatizado: true
      lead_time_medio: "2h"       # tempo do commit ao deploy
    visibilidade:
      dashboard_existe: true
      metricas_criticas_monitoradas: true
      ciclo_vida_documentado: true
    pessoas_heroi:
      conhecimento_centralizado: false  # true = problema
      bus_factor: 3                     # quantas pessoas podem sair sem parar o time
    automatizacao:
      tarefas_repetitivas_mapeadas: 12
      tarefas_automatizadas: 9
      percentual: 75  # meta: 100%

  segunda_maneira:
    feedback:
      dev_para_ops_loop: true
      ops_para_dev_loop: true
      tempo_medio_feedback: "30min"
    deteccao_erros:
      alertas_proativos: true
      mttr_medio: "15min"  # mean time to recovery
    conhecimento:
      postmortems_regulares: true
      aprendizados_documentados: true

  terceira_maneira:
    aprendizado:
      tempo_dedicado_aprendizado: "4h/semana"
      experimentacao_incentivada: true
    compartilhamento:
      tech_talks_regulares: true
      pair_programming: true
      rotacao_responsabilidades: true
    visao_global:
      correcoes_aplicadas_globalmente: true
      padronizacao_entre_servicos: true

  resultado:
    primeira: "implementada"   # implementada | parcial | nao_implementada
    segunda: "parcial"
    terceira: "parcial"
    proxima_acao: "Melhorar feedback Ops→Dev com alertas automaticos"
```

## Exemplo 2: Implementacao progressiva

### Roteiro de adocao baseado nas Tres Maneiras

```markdown
# Roteiro DevOps — Tres Maneiras

## Fase 1: Primeira Maneira (Meses 1-3)
- [ ] Mapear fluxo atual Dev → Producao (value stream mapping)
- [ ] Identificar gargalos e tarefas de baixo valor/alta complexidade
- [ ] Automatizar build e deploy (CI/CD basico)
- [ ] Criar dashboard de visibilidade (deploys, status, metricas)
- [ ] Documentar ciclo de vida da aplicacao
- [ ] Eliminar dependencias de pessoas-heroi (knowledge sharing sessions)
- [ ] Instrumentar endpoints criticos (latencia, error rate)
- [ ] Reduzir batch size dos deploys

## Fase 2: Segunda Maneira (Meses 3-6)
- [ ] Estabelecer alertas proativos (nao esperar cliente reclamar)
- [ ] Criar canal de feedback Ops → Dev (incidentes viram melhorias)
- [ ] Implementar postmortems blameless apos incidentes
- [ ] Monitoramento: metricas de recuperacao (MTTR)
- [ ] Feedback automatico no PR (testes, linting, security scan)

## Fase 3: Terceira Maneira (Meses 6-12)
- [ ] Reservar tempo para aprendizado (ex: 10% do sprint)
- [ ] Tech talks internas regulares
- [ ] Quando corrigir algo local, avaliar impacto global
- [ ] Experimentacao segura (feature flags, canary deploys)
- [ ] Rotacao de responsabilidades entre Dev e Ops
```

## Exemplo 3: Metricas da Primeira Maneira

```bash
# Exemplo: verificar latencia de endpoint critico
# "Como sei que esta lento? Com metricas, nao com reclamacao de cliente"

# Latencia P95 do endpoint /api/orders nos ultimos 30min
curl -s "http://prometheus:9090/api/v1/query?query=histogram_quantile(0.95,rate(http_request_duration_seconds_bucket{path='/api/orders'}[30m]))"

# Deploy frequency (deploys por dia)
git log --since="7 days ago" --oneline --grep="deploy" | wc -l
# Divide por 7 para media diaria

# Lead time (tempo do commit ao deploy)
# Comparar timestamp do commit com timestamp do deploy
```

## Exemplo 4: Feedback loop da Segunda Maneira

```yaml
# alertmanager config — feedback proativo Ops → Dev
# Em vez de esperar cliente reclamar, detectar e notificar
groups:
  - name: api-health
    rules:
      - alert: EndpointLento
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
          maneira: segunda  # feedback continuo
        annotations:
          summary: "Endpoint {{ $labels.path }} com P95 > 2s"
          acao: "Investigar e otimizar — nao esperar reclamacao"
```