# Code Examples: DevOps no Dia a Dia e SRE

Esta aula e conceitual/cultural, sem exemplos de codigo direto. Abaixo estao cenarios praticos que ilustram os principios discutidos.

## Cenario 1: Ciclo sem DevOps vs com DevOps

### Sem DevOps — deploy manual e lento
```
Desenvolvedor termina feature
  → Abre ticket para ops
  → Ops agenda deploy (2-3 dias)
  → Deploy manual em producao
  → Erro detectado 1 semana depois por usuario
  → Ticket de bug aberto
  → Dev investiga (sem logs adequados)
  → Correcao em 3-5 dias
  → Novo ciclo de deploy manual

Tempo total: 2-3 semanas para um ciclo completo
```

### Com DevOps — pipeline automatizado
```
Desenvolvedor termina feature
  → Push para branch
  → CI roda testes automaticamente
  → CD faz deploy automatico para staging
  → Validacao rapida
  → Deploy para producao (automatizado)
  → Observabilidade detecta anomalia em minutos
  → Rollback automatico ou hotfix rapido
  → Correcao deployada no mesmo dia

Tempo total: horas para um ciclo completo
```

## Cenario 2: Validacao de POC

### Sem DevOps
```
Ideia de feature nova
  → 2 semanas para preparar ambiente
  → 1 semana para deploy da POC
  → 2 semanas rodando sem observabilidade adequada
  → Descobre que nao funciona
  → 1 semana para desmontar
  → 1 semana para planejar plano B

Total: ~7 semanas perdidas
```

### Com DevOps/SRE
```
Ideia de feature nova
  → SRE provisiona ambiente em minutos (script automatizado)
  → Deploy da POC via pipeline existente
  → Observabilidade mostra metricas em tempo real
  → Em 2-3 dias ja sabe se funciona
  → Se nao funciona: destroy ambiente, planeja plano B
  → Se funciona: evolui com confianca

Total: ~1 semana para decisao
```

## Cenario 3: Responsabilidades do SRE

```
Tarefas tipicas de um SRE:

1. Automatizacao de deploy
   - Criar pipelines CI/CD
   - Configurar ambientes automaticamente
   - Scripts de provisionamento

2. Observabilidade
   - Configurar monitoramento
   - Criar dashboards
   - Definir alertas

3. Confiabilidade
   - Definir SLOs/SLIs
   - Gerenciar error budgets
   - Planejar capacidade

4. Integracao entre times
   - Facilitar acesso a ferramentas
   - Documentar processos tecnicos
   - Reduzir tarefas penosas (toil)
```

## Cenario 4: Documentacao como organismo vivo

```
Pratica ERRADA:
  Documento criado em Jan/2025
  Nunca mais atualizado
  Equipe nova em Jul/2025 segue documento desatualizado
  Deploy falha porque infraestrutura mudou
  Conhecimento estava na cabeca de quem saiu

Pratica CORRETA (cultura DevOps):
  Documento criado em Jan/2025
  Cada mudanca no processo → atualiza documento
  Review trimestral de documentacao
  Documentacao versionada junto com codigo
  Qualquer pessoa consegue seguir o processo
```