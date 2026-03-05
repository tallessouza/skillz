# Code Examples: N8N vs Zapier vs Make

## Nota importante

Esta aula e conceitual/comparativa — nao contem codigo. Os exemplos abaixo ilustram cenarios praticos de decisao.

## Cenario 1: Calculando custo comparativo

```typescript
// Comparacao de custo mensal por volume de execucoes
interface PlatformCost {
  platform: string
  monthlyCostBRL: number
  tasksPerMonth: number
  costPerTask: number
  selfHosted: boolean
}

function compareCosts(tasksPerMonth: number): PlatformCost[] {
  return [
    {
      platform: 'N8N Community (self-hosted)',
      monthlyCostBRL: 50, // custo estimado de servidor basico
      tasksPerMonth,
      costPerTask: 50 / tasksPerMonth,
      selfHosted: true,
    },
    {
      platform: 'Zapier',
      monthlyCostBRL: tasksPerMonth <= 100 ? 0 : tasksPerMonth <= 10000 ? 704 : 20000,
      tasksPerMonth,
      costPerTask: (tasksPerMonth <= 100 ? 0 : tasksPerMonth <= 10000 ? 704 : 20000) / tasksPerMonth,
      selfHosted: false,
    },
    {
      platform: 'Make',
      monthlyCostBRL: tasksPerMonth * 0.05, // estimativa simplificada
      tasksPerMonth,
      costPerTask: 0.05,
      selfHosted: false,
    },
  ]
}
```

## Cenario 2: Arvore de decisao para escolha de plataforma

```typescript
interface TeamProfile {
  hasTechnicalTeam: boolean
  monthlyBudgetBRL: number
  expectedTasksPerMonth: number
  needsSelfHosting: boolean
  teamSize: number
}

function recommendPlatform(profile: TeamProfile): string {
  // Self-hosting e requisito? Unica opcao e N8N
  if (profile.needsSelfHosting) {
    return 'N8N Community Edition'
  }

  // Equipe nao-tecnica + orcamento disponivel? Zapier
  if (!profile.hasTechnicalTeam && profile.monthlyBudgetBRL > 500) {
    return 'Zapier'
  }

  // Equipe nao-tecnica + orcamento limitado? Make
  if (!profile.hasTechnicalTeam && profile.monthlyBudgetBRL <= 500) {
    return 'Make'
  }

  // Equipe tecnica + alto volume? N8N (economia em escala)
  if (profile.hasTechnicalTeam && profile.expectedTasksPerMonth > 10000) {
    return 'N8N Community Edition (self-hosted)'
  }

  // Equipe tecnica + baixo volume? N8N cloud ou Make
  if (profile.hasTechnicalTeam && profile.expectedTasksPerMonth <= 1000) {
    return 'N8N Cloud ou Make (ambos viáveis)'
  }

  return 'N8N Community Edition'
}
```

## Cenario 3: Checklist de avaliacao antes de escolher

```markdown
## Checklist de Escolha de Plataforma

### Infraestrutura
- [ ] Equipe sabe configurar Docker/servidor?
- [ ] Empresa tem infraestrutura propria (VPS, cloud)?
- [ ] Precisa de controle total sobre dados (compliance)?

### Volume e Custo
- [ ] Estimativa de execucoes mensais: ___________
- [ ] Orcamento mensal para automacao: R$ ___________
- [ ] Fluxos criticos que nao podem falhar: ___________

### Perfil da Equipe
- [ ] Quem vai criar automacoes? (dev / analista / marketing)
- [ ] Nivel tecnico medio da equipe: (alto / medio / baixo)
- [ ] Quantas pessoas vao usar a plataforma: ___________

### Resultado
Se maioria "tecnico + infra propria + alto volume" → N8N
Se maioria "nao-tecnico + sem infra + orcamento ok" → Zapier
Se maioria "misto + visual importante + custo moderado" → Make
```