# Code Examples: Configurando Alarmes no Grafana

## Exemplo 1: Contact Point — Email

Configuracao de contact point via UI:

```
Alerting → Contact Points → New Contact Point

Name: email-time-engenharia
Type: Email
Addresses: time-engenharia@empresa.com
SMTP Settings:
  Host: smtp.empresa.com:587
  User: alertas@empresa.com
  Password: ***
```

## Exemplo 2: Contact Point — Telegram

```
Alerting → Contact Points → New Contact Point

Name: telegram-oncall
Type: Telegram
Bot API Token: 123456:ABC-DEF...
Chat ID: -1001234567890
```

## Exemplo 3: Contact Point — Slack

```
Alerting → Contact Points → New Contact Point

Name: slack-time1
Type: Slack
Webhook URL: https://hooks.slack.com/services/T00/B00/XXXX
```

## Exemplo 4: Notification Policy com Roteamento por Labels

```
Default Policy:
  Contact Point: grafana-default-email
  
  Nested Policy 1:
    Matching Label: squad = time1
    Contact Point: slack-time1
    
  Nested Policy 2:
    Matching Label: squad = time2
    Contact Point: telegram-time2
    
  Nested Policy 3:
    Matching Label: bu = financeiro
    Contact Point: email-financeiro
```

## Exemplo 5: Alert Rule — Metrica de Sucesso

```
Alert Rule Configuration:
  Name: Erros App A
  
  Query:
    Data Source: Prometheus
    Metric: http_requests_total{service="app-a", status!~"2.."}
    Range: 5m
    
  Condition:
    Reduce: Last
    Threshold: Is Above 0
    
  Labels:
    squad: time1
    
  Evaluation:
    Folder: Alertas Producao
    Group: time1
    Interval: 1m (testes) / 5m (producao)
    
  Annotations:
    Summary: Estamos com baixo sucesso no servico App A
    Runbook URL: https://docs.empresa.com/runbooks/app-a-erros
```

## Exemplo 6: Alert Rule Criada a Partir de Dashboard

```
1. Abra o dashboard desejado
2. Clique no painel com a metrica
3. Selecione "Create Alert" (icone de sino ou menu)
4. O Grafana preenche automaticamente:
   - Data source
   - Query
   - Range (ATENCAO: ajuste para 5m, pode vir com 6h)
5. Configure:
   - Condition: Last, Is Above, 0
   - Labels: squad: time1
   - Evaluation Group e Interval
   - Mensagem e Runbook URL
6. Salve
```

## Exemplo 7: Estados do Alerta (Ciclo Observado)

```
t=0:   Regra criada, evaluation interval = 1m
t=1m:  Primeira avaliacao → condicao TRUE → Estado: PENDING
t=2m:  Segunda avaliacao → condicao TRUE → Estado: FIRING ← notificacao enviada
t=3m:  Condicao resolvida → Estado: NORMAL ← alerta fechado

Se condicao nunca for TRUE:
t=1m:  Avaliacao → condicao FALSE → Estado: NORMAL (permanece)
```

## Exemplo 8: Estrutura de Labels para Organizacao

```yaml
# Labels recomendadas para roteamento
labels:
  squad: time1          # Time responsavel
  bu: engenharia        # Business Unit
  servico: app-a        # Servico monitorado
  ambiente: producao    # Ambiente
  severidade: critica   # Nivel de urgencia
```

## Exemplo 9: Troubleshooting — Erro com Loki

```
Problema: Ao criar alert rule com data source Loki,
          erro de tipo com ranges longos

Causa: O tipo de dado retornado por queries Loki com
       ranges extensos pode ser incompativel com o
       sistema de alertas

Solucao: 
  1. Reduza o range da query
  2. Consulte a documentacao do Grafana para alertas com Loki
  3. Metricas (Prometheus/Mimir) nao tem esse problema
```