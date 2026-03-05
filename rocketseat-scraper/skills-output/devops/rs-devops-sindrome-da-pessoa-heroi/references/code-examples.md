# Code Examples: Síndrome da Pessoa Herói

Esta aula é conceitual (cultura DevOps), sem exemplos de código no transcript. Abaixo estão artefatos práticos que operacionalizam os conceitos ensinados.

## Checklist de detecção de Pessoa Herói

```markdown
## Hero Person Detection Checklist

### Per-flow analysis
- [ ] Quem é chamado quando este fluxo quebra?
- [ ] Mais de uma pessoa consegue resolver problemas neste fluxo?
- [ ] Existe documentação atualizada deste fluxo?
- [ ] Um membro novo conseguiria operar este fluxo sozinho?
- [ ] Este fluxo já causou bloqueio por ausência de alguém?

### Per-person analysis
- [ ] Esta pessoa é a única referência para algum fluxo crítico?
- [ ] O time chama esta pessoa por padrão ao invés de investigar primeiro?
- [ ] Se esta pessoa sair amanhã, algum fluxo fica sem dono?
```

## Template de mapeamento de bus factor

```yaml
# bus-factor-map.yaml
flows:
  - name: "Fluxo de deploy legado"
    criticality: high
    knowledgeable_people:
      - name: "João"
        level: expert  # único que conhece profundamente
      - name: "Maria"
        level: basic   # sabe o conceito mas nunca operou
    bus_factor: 1  # apenas 1 pessoa consegue resolver
    documentation: none
    action_plan: "Pair-solving na próxima ocorrência + documentação"
    deadline: "2026-03-15"

  - name: "Pipeline CI/CD principal"
    criticality: high
    knowledgeable_people:
      - name: "Ana"
        level: expert
      - name: "Carlos"
        level: intermediate
      - name: "Pedro"
        level: intermediate
    bus_factor: 3
    documentation: complete
    action_plan: null  # saudável
```

## Template de plano de desconcentração

```markdown
## Plano de Desconcentração de Conhecimento

### Fluxo: {nome do fluxo}
**Herói atual:** {nome}
**Bus factor:** {número}
**Criticidade:** {alta/média/baixa}

### Ações
1. [ ] Agendar sessão de pair-solving com {herói} e {pessoa 2}
2. [ ] Documentar o fluxo durante a sessão
3. [ ] {pessoa 2} resolver próxima ocorrência com suporte do {herói}
4. [ ] {pessoa 2} resolver sozinho(a) com documentação disponível
5. [ ] Revisar bus factor após 30 dias

### Métricas de sucesso
- Bus factor >= 2
- Documentação criada e revisada
- Pelo menos 1 resolução sem o herói
```