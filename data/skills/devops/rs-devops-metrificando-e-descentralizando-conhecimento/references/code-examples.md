# Code Examples: Mensuração e Compartilhamento de Conhecimento

Esta aula é conceitual (tipo Reference), sem código direto. Abaixo, exemplos práticos que materializam os conceitos ensinados.

## Exemplo 1: Checklist de Diagnóstico CALMS (M+S)

```yaml
# calms-diagnostic.yaml
# Use para avaliar maturidade DevOps da sua organização

measurement:
  business_metrics:
    - question: "Métricas de acesso/uso estão sendo coletadas?"
      current_state: # preencher
      maturity: # none | basic | advanced
    - question: "Decisões de produto usam dados reais da aplicação?"
      current_state:
      maturity:
    - question: "Métricas negociais são acessíveis para gestão não-técnica?"
      current_state:
      maturity:
    - question: "Features novas têm métricas de sucesso definidas?"
      current_state:
      maturity:

  technical_metrics:
    - question: "Erros são descobertos internamente antes do cliente?"
      current_state:
      maturity:
    - question: "Fluxos críticos têm monitoramento e alertas?"
      current_state:
      maturity:
    - question: "Existe dashboard técnico acessível ao time?"
      current_state:
      maturity:

sharing:
  documentation:
    - question: "Existe mecanismo de documentação atualizado?"
      current_state:
      maturity:
  sync_sharing:
    - question: "Há calls recorrentes para compartilhar aprendizados?"
      current_state:
      maturity:
  incident_process:
    - question: "Existe processo de incidente com post-mortem?"
      current_state:
      maturity:
  hero_syndrome:
    - question: "Algum conhecimento crítico está centralizado em uma pessoa?"
      current_state:
      maturity:
      risk_level: # low | medium | high | critical
```

## Exemplo 2: Estrutura de Métricas em Dois Níveis

```typescript
// Exemplo conceitual de como organizar métricas

interface BusinessMetrics {
  // Métricas que orientam decisões de produto
  pageViews: {
    total: number;
    byPage: Record<string, number>;  // ex: nova aba lançada
    period: 'daily' | 'weekly' | 'monthly';
  };
  featureAdoption: {
    featureName: string;
    usersAccessed: number;
    totalUsers: number;
    adoptionRate: number;  // usersAccessed / totalUsers
  };
  heatmap: {
    // Quais partes da página recebem mais interação
    zones: Array<{ area: string; interactions: number }>;
  };
}

interface TechnicalMetrics {
  // Métricas que garantem confiabilidade
  errors: {
    total: number;
    discoveredInternally: number;   // DEVE ser > discoveredByUsers
    discoveredByUsers: number;       // Ideal: zero
    meanTimeToDetect: number;        // Em minutos
  };
  criticalFlows: {
    flowName: string;
    latencyP95: number;
    availability: number;            // Percentual uptime
    isMonitored: boolean;            // DEVE ser true para fluxos críticos
    hasAlerts: boolean;              // DEVE ser true
  }[];
}
```

## Exemplo 3: Template de Post-Mortem (Mecanismo de Sharing)

```markdown
# Post-Mortem: [Título do Incidente]

**Data:** YYYY-MM-DD
**Severidade:** P1 | P2 | P3
**Descoberto por:** Monitoramento interno | Cliente | Outro

## O que aconteceu
[Descrição objetiva]

## Timeline
- HH:MM - Alerta disparado / Cliente reportou
- HH:MM - Investigação iniciada
- HH:MM - Causa raiz identificada
- HH:MM - Fix aplicado
- HH:MM - Validação completa

## Causa raiz
[Análise técnica]

## O que aprendemos
- [Aprendizado 1]
- [Aprendizado 2]

## Ações para evitar recorrência
- [ ] Ação 1 — Responsável — Prazo
- [ ] Ação 2 — Responsável — Prazo

## Métricas impactadas
- **Negocial:** [ex: X usuários afetados, Y transações perdidas]
- **Técnica:** [ex: uptime caiu para Z%, latência subiu para Wms]
```

## Exemplo 4: Ciclo de Compartilhamento de Conhecimento

```
Sprint N:
  1. Dev implementa feature com nova tecnologia
  2. Feature é monitorada (M) — métricas coletadas
  3. Resultados documentados (S)
  4. Call de compartilhamento (S) — time aprende
  5. Conhecimento descentralizado — dev livre para próximo desafio

Sprint N+1:
  6. Outro dev pode manter/evoluir a feature
  7. Dev original está aprendendo algo novo
  8. Ciclo se repete → produtividade composta
```