# Code Examples: Grafana OnCall e Gestao de Incidentes

## Estrutura de Escalation Chain (conceitual)

Esta aula e conceitual e nao apresenta codigo direto, mas abaixo estao as configuracoes praticas derivadas dos conceitos ensinados.

### Configuracao de Escalation Chain no Grafana Cloud

```yaml
# Exemplo conceitual de escalation policy
escalation_chain:
  name: "Production Critical"
  steps:
    - step: 1
      action: notify_on_call
      duration: 5m
      channels: [slack_mention, sms]
    - step: 2
      action: notify_on_call
      duration: 10m
      channels: [phone_call]
    - step: 3
      action: notify_team_lead
      duration: 15m
      channels: [phone_call, slack_channel]
```

### Rotacao de Plantao

```yaml
# Exemplo de schedule de on-call
on_call_schedule:
  name: "Backend Team Rotation"
  type: rotation
  rotation_frequency: daily
  participants:
    - name: "Dev 1"
      weekdays: [mon, tue]
    - name: "Dev 2"
      weekdays: [wed, thu]
    - name: "Dev 3"
      weekdays: [fri, sat, sun]
  business_hours:
    start: "09:00"
    end: "18:00"
    timezone: "America/Sao_Paulo"
  after_hours:
    escalation_chain: "After Hours Critical Only"
```

### Classificacao de Severidade com Tempos de Resposta

```yaml
severity_levels:
  - level: SEV0
    name: "Critical - Total Outage"
    description: "Servico completamente indisponivel"
    response_time: 5m
    notification: [phone_call, sms, slack]
    example: "API principal retornando 500 para 100% dos requests"

  - level: SEV1
    name: "High - Major Degradation"
    description: "Degradacao significativa de performance ou funcionalidade"
    response_time: 15m
    notification: [sms, slack]
    example: "Latencia 10x acima do normal, timeout em 30% dos requests"

  - level: SEV2
    name: "Medium - Partial Impact"
    description: "Funcionalidade parcialmente afetada"
    response_time: 1h
    notification: [slack]
    example: "Feature de exportacao falhando para alguns usuarios"

  - level: SEV3
    name: "Low - Minor Issue"
    description: "Impacto minimo, sem urgencia"
    response_time: 4h
    notification: [slack_channel]
    example: "Log de warning aumentando, sem impacto visivel ao usuario"
```

### Metricas de Incidente (conceitual)

```yaml
# Metricas a extrair do sistema de on-call
incident_metrics:
  MTTD:
    name: "Mean Time To Detect"
    description: "Tempo medio entre o inicio do problema e a deteccao pelo alerta"
    target: "< 2 minutos para SEV0"

  MTTA:
    name: "Mean Time To Acknowledge"
    description: "Tempo medio entre o alerta e o ACK do responsavel"
    target: "< 5 minutos para SEV0"

  MTTR:
    name: "Mean Time To Resolve"
    description: "Tempo medio entre a deteccao e a resolucao completa"
    target: "< 30 minutos para SEV0"

  MTBF:
    name: "Mean Time Between Failures"
    description: "Tempo medio entre falhas consecutivas"
    target: "Crescente ao longo do tempo"
```

### Comparacao entre Ferramentas

```
┌─────────────────────┬──────────────┬─────────────┬──────────────┐
│ Feature             │ Grafana Cloud│ PagerDuty   │ Squadcast    │
├─────────────────────┼──────────────┼─────────────┼──────────────┤
│ Plano gratuito      │ Sim          │ Limitado    │ Sim          │
│ Rotacao de plantao  │ Sim          │ Sim         │ Sim          │
│ Escalation chains   │ Sim          │ Sim         │ Sim          │
│ Integra com Grafana │ Nativo       │ Via plugin  │ Via webhook  │
│ SMS/Chamada         │ Sim          │ Sim         │ Sim          │
│ Self-hosted         │ Deprecado    │ Nao         │ Parcial      │
│ Metricas MTTR       │ Sim          │ Sim         │ Sim          │
└─────────────────────┴──────────────┴─────────────┴──────────────┘
```

### Alertmanager → Grafana OnCall (integracao tipica)

```yaml
# alertmanager.yml - exemplo de roteamento para Grafana OnCall
route:
  receiver: 'grafana-oncall'
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'grafana-oncall-critical'
      group_wait: 10s
      repeat_interval: 1h
    - match:
        severity: warning
      receiver: 'grafana-oncall-warning'
      repeat_interval: 4h

receivers:
  - name: 'grafana-oncall-critical'
    webhook_configs:
      - url: 'https://oncall.grafana.net/integrations/v1/alertmanager/YOUR_KEY/'
        send_resolved: true
  - name: 'grafana-oncall-warning'
    webhook_configs:
      - url: 'https://oncall.grafana.net/integrations/v1/alertmanager/YOUR_KEY/'
        send_resolved: true
```