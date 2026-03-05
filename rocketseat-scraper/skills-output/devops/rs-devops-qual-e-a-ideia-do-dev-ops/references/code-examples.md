# Code Examples: Cultura DevOps — Qual e a Ideia

## Nota sobre esta aula

Esta aula e conceitual/cultural e nao contem exemplos de codigo. Os exemplos abaixo sao frameworks de diagnostico que operacionalizam os conceitos ensinados.

## Framework de diagnostico organizacional

### Checklist de avaliacao (baseado nos 5 diagnosticos)

```yaml
# devops-culture-diagnostic.yaml
organization: "Nome da Empresa"
date: "2026-01-15"
evaluated_by: "Nome"

diagnostics:
  segmentation:
    description: "Segmentacao entre dev e ops"
    signals:
      - "Dev entrega build sem contexto de onde roda"
      - "Ops nao entende o codigo que esta publicando"
      - "Blame cycle quando deploy falha"
      - "Tarefas simples levam semanas/meses para publicar"
    severity: null  # critical | high | medium | low
    evidence: ""
    
  knowledge_centralization:
    description: "Centralizacao de conhecimento"
    signals:
      - "Apenas uma pessoa sabe fazer deploy"
      - "Conhecimento de infra nao e documentado"
      - "Dev nao tem acesso a logs de producao"
      - "Onboarding de novos membros e lento"
    severity: null
    evidence: ""
    
  lack_of_feedback:
    description: "Falta de feedback constante"
    signals:
      - "Nao existem retrospectivas"
      - "Nao ha metricas de deploy (frequencia, lead time, MTTR)"
      - "Times nao sabem onde precisam melhorar"
    severity: null
    evidence: ""
    
  no_continuous_learning:
    description: "Ausencia de aprendizado continuo"
    signals:
      - "Nao ha documentacao tecnica compartilhada"
      - "Cross-training nao existe"
      - "Mesmos erros se repetem"
    severity: null
    evidence: ""
    
  lack_of_automation:
    description: "Falta de automatizacao (toil)"
    signals:
      - "Deploy manual"
      - "Testes manuais repetitivos"
      - "Configuracao manual de ambientes"
      - "Tarefas que crescem em tempo com o passar das semanas"
    severity: null
    evidence: ""

overall_assessment: ""
priority_actions: []
```

### Exemplo de mapeamento de toil

```markdown
# Toil Inventory

| Tarefa | Frequencia | Tempo atual | Tendencia | Automatizavel? | Prioridade |
|--------|-----------|-------------|-----------|----------------|------------|
| Deploy manual para staging | 3x/semana | 15 min | Estavel | Sim (CI/CD) | Alta |
| Rodar testes de integracao | Diaria | 10 min | Crescendo | Sim (CI) | Alta |
| Configurar ambiente para novo dev | Mensal | 4 horas | Estavel | Sim (Docker/scripts) | Media |
| Verificar logs de erro | Diaria | 20 min | Crescendo | Sim (alertas) | Alta |
| Backup manual do banco | Semanal | 5 min | Estavel | Sim (cron) | Media |

## Calculo de impacto (referencia ao livro SRE do Google)
# Se tarefa leva 10 min/dia e cresce 10 min/semana:
# Semana 1: 50 min/semana
# Semana 4: 200 min/semana (3.3 horas)
# Semana 8: 400 min/semana (6.6 horas)
# Conclusao: automatizar AGORA economiza dias no proximo mes
```

### Mapeamento de pipeline de entrega

```markdown
# Value Delivery Pipeline

## Sem cultura DevOps (diagnostico tipico)

Developer --> [build local] --> "ta pronto" --> Ops --> [tenta deploy] --> ???
                                                          |
                                                          +--> Funciona --> Cliente recebe valor
                                                          |
                                                          +--> Falha --> Blame cycle --> Atraso (dias/semanas/meses)

## Com cultura DevOps (objetivo)

Developer --> [commit] --> [CI automatico] --> [testes] --> [CD automatico] --> [deploy] --> Cliente
     ^                                                                              |
     |                                                                              |
     +--- feedback (metricas, logs, alertas) <--------------------------------------+
```