# Code Examples: Metodologias de Dados

## Nota

Esta aula e conceitual/metodologica — nao possui exemplos de codigo. Os exemplos abaixo ilustram como aplicar cada metodologia na pratica.

## CRISP-DM — Estrutura de projeto

```
projeto-analise-churn/
├── 01-compreensao-negocio/
│   ├── stakeholders.md          # Quem foi entrevistado
│   ├── hipoteses.md             # Hipoteses levantadas
│   └── premissas.md             # Premissas definidas
├── 02-compreensao-dados/
│   ├── fontes-dados.md          # Quais fontes sao necessarias
│   └── analise-exploratoria.ipynb
├── 03-preparacao-dados/
│   └── limpeza.ipynb
├── 04-modelagem/
│   └── modelo-preditivo.ipynb
├── 05-avaliacao/
│   └── validacao-stakeholders.md
└── 06-implantacao/
    └── deploy-modelo.md
```

## CRISP-DM — Checklist de compreensao de negocio

```markdown
## Compreensao de Negocio — Checklist

- [ ] Qual e a pergunta de negocio?
- [ ] Quem sao os stakeholders envolvidos?
- [ ] Quais areas precisam ser consultadas?
- [ ] Quais hipoteses foram levantadas?
- [ ] Quais premissas foram definidas?
- [ ] Qual o impacto esperado da resposta?
```

## Lean Analytics — Definicao de KPIs

```markdown
## Metricas para acompanhamento de Churn

| Metrica | Formula | Frequencia |
|---------|---------|------------|
| Churn Rate | Clientes perdidos / Total clientes | Mensal |
| MRR Churn | MRR perdido / MRR total | Mensal |
| Net Revenue Retention | (MRR inicio + expansao - churn) / MRR inicio | Mensal |
```

## Selecao de metodologia — Decision tree

```
Preciso responder UMA pergunta de negocio?
├── Sim → CRISP-DM
└── Nao
    ├── Preciso acompanhar metricas continuamente?
    │   ├── Sim → Lean Analytics
    │   └── Nao
    │       ├── Preciso garantir qualidade/governanca de dados?
    │       │   ├── Sim → DataOps
    │       │   └── Nao
    │       │       └── Preciso testar variacoes com usuarios?
    │       │           ├── Sim → AB Testing
    │       │           └── Nao → Avalie o contexto, possivelmente combine
    └── Posso precisar de mais de uma metodologia simultaneamente
```