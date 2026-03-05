# Code Examples: Cloud ou Self-hosted

## Nao ha codigo nesta aula

Esta aula e conceitual/decisional — nao contem exemplos de codigo. O conteudo foca na analise de custo-beneficio entre as opcoes de deployment do n8n.

## Referencia pratica: custos comparativos

### Cenario 1: Projeto pequeno, nao critico

```yaml
# Self-hosted
vps_custo_mensal: 30  # BRL
execucoes: ilimitadas
disponibilidade: ~99% (depende da VPS)
manutencao: propria
conhecimento_necessario:
  - Linux basico
  - Docker
  - SSH

# Cloud (Starter)
cloud_custo_mensal: 150  # BRL
execucoes: 2500
disponibilidade: 99.9%+ (SLA do n8n)
manutencao: zero

# Veredicto: self-hosted (volume baixo, processo nao critico)
```

### Cenario 2: Producao critica, alto volume

```yaml
# Self-hosted com alta disponibilidade
vps_custo_mensal: 200-500  # BRL (servidor robusto)
banco_separado: 100-300     # BRL (RDS ou similar)
monitoramento: 50-100       # BRL
total_estimado: 350-900     # BRL
conhecimento_necessario:
  - Linux avancado
  - Docker/Kubernetes
  - PostgreSQL
  - Monitoramento (Grafana, etc)
  - Backup automatizado

# Cloud (Pro)
cloud_custo_mensal: 313  # BRL
execucoes: 10000
tudo_incluso: true

# Veredicto: cloud (custo similar, zero manutencao)
```

### Cenario 3: Volume muito alto (>40k execucoes)

```yaml
# Self-hosted enterprise
infra_custo_mensal: 500-2000  # BRL (AWS, workers, DB)
equipe_infra: necessaria

# Cloud (Enterprise)
cloud_custo_mensal: 4167  # BRL
execucoes: 40000

# Veredicto: self-hosted SE tiver equipe de infra
# Cloud SE nao tiver equipe e o custo justificar
```