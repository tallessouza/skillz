---
name: rs-devops-configurando-alarmes
description: "Applies Grafana alerting configuration patterns when setting up monitoring alerts, contact points, and notification policies. Use when user asks to 'configure alerts', 'set up Grafana notifications', 'create alert rules', 'configure contact points', or 'set up monitoring alarms'. Covers contact points, notification policies with label routing, alert rules from metrics/logs, and evaluation intervals. Make sure to use this skill whenever configuring Grafana alerting or designing alert architectures. Not for Prometheus Alert Manager plugin setup, dashboard creation, or data source configuration."
---

# Configurando Alarmes no Grafana

> Configure alertas no Grafana seguindo a sequencia: contact point → notification policy → alert rule, com intervalos de avaliacao adequados e roteamento por labels.

## Rules

1. **Configure contact points primeiro** — defina QUEM recebe o alerta antes de criar regras, porque sem destino configurado o alerta dispara mas ninguem ve
2. **Use notification policies para roteamento por labels** — segregue alertas por squad/time/BU usando labels, porque equipes diferentes precisam de canais diferentes
3. **Intervalo de avaliacao entre 1 e 5 minutos** — use 5 minutos como padrao ideal, porque intervalos longos (ex: 3h, 6h) atrasam a deteccao de incidentes
4. **Inclua Runbook URL no alerta** — adicione link da documentacao de resolucao em cada regra, porque quem recebe o alerta precisa saber como agir
5. **Use mensagens descritivas no alerta** — escreva o que esta acontecendo (ex: "Baixo sucesso no servico X"), porque alertas sem contexto geram confusao
6. **Agrupe alertas em folders e groups** — organize regras por time e dominio, porque evaluation groups definem a cadencia de verificacao

## Steps

### Step 1: Configurar Contact Point

Defina o destino das notificacoes antes de qualquer regra.

**Alerting → Contact Points → New Contact Point**

Opcoes disponiveis: Email, Slack, Telegram, Discord, SNS, Webhook, Google Chat, Jira, entre outros.

Cada tipo requer credenciais especificas:
- **Email:** endereco SMTP, servidor de envio
- **Telegram:** API token do bot + chat ID
- **Slack:** webhook URL do canal
- **Webhook:** URL de destino

### Step 2: Configurar Notification Policy

Defina roteamento baseado em labels para direcionar alertas aos times corretos.

**Alerting → Notification Policies**

```yaml
# Estrutura de roteamento
default:
  contact_point: grafana-default-email

nested_policies:
  - label: squad = time1
    contact_point: slack-canal-time1
  - label: squad = time2
    contact_point: telegram-time2
```

Use labels que facam sentido para a organizacao: `squad`, `time`, `bu`, `servico`.

### Step 3: Criar Alert Rule

**Alerting → Alert Rules → New Alert Rule**

1. Nomeie a regra descritivamente (ex: "Erros App A")
2. Escolha a data source: Loki (logs), Prometheus/Mimir (metricas)
3. Configure a query e o intervalo de tempo (5 minutos recomendado)
4. Defina a condicao: `last()` + operador (`is above`, `is below`, `is equal`)
5. Adicione labels para roteamento (ex: `squad: time1`)
6. Configure evaluation group com intervalo de 1-5 minutos
7. Adicione mensagem descritiva e Runbook URL

### Step 4: Verificar Ciclo do Alerta

O alerta passa pelos estados:

```
Normal → Pending → Firing → (resolvido) → Normal
```

- **Normal:** condicao nao atendida
- **Pending:** condicao detectada, aguardando confirmacao no proximo ciclo
- **Firing:** confirmado, notificacao enviada

## Heuristics

| Situacao | Acao |
|----------|------|
| Alerta para time especifico | Crie label `squad` e notification policy dedicada |
| Metrica simples (ex: taxa de sucesso) | Use data source Prometheus/Mimir com `last()` |
| Alerta baseado em logs | Use data source Loki (atencao a queries longas que podem dar erro de tipo) |
| Alerta criado a partir de dashboard | Use o botao "Create Alert" direto do painel — ja preenche a query |
| Intervalo de avaliacao | 5 minutos para producao, 1 minuto so para testes |
| Problemas com queries de log | Consulte a documentacao — erros de tipo sao comuns com ranges longos |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Evaluation interval de 3-6 horas | Interval de 1-5 minutos |
| Criar alert rule sem contact point | Configure contact point primeiro |
| Alerta sem mensagem descritiva | Inclua contexto: "Baixo sucesso no servico X" |
| Alerta sem Runbook URL | Adicione link para documentacao de resolucao |
| Todos os alertas no default policy | Segregue por labels e notification policies por time |
| Ignorar estado Pending | Entenda que Pending e a confirmacao antes do Firing |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-alarmes/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-alarmes/references/code-examples.md)
