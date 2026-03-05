---
name: rs-devops-automatizando-tudo
description: "Applies DevOps automation principles from CALMS framework when designing CI/CD pipelines, infrastructure as code, or evaluating manual processes. Use when user asks to 'automate deployment', 'setup CI/CD', 'create infrastructure', 'implement GitOps', or 'reduce manual tasks'. Enforces continuous delivery automation and single source of truth via GitOps/IaC. Make sure to use this skill whenever evaluating operational processes or cloud resource management. Not for application code patterns, testing strategies, or monitoring setup."
---

# Automacao no CALMS — Pilar A

> Todo processo repetitivo deve ser automatizado; todo recurso de nuvem deve ter uma fonte unica de verdade no Git.

## Rules

1. **Tudo que pode ser automatizado, deve ser automatizado** — processos repetitivos consomem tempo da equipe e nao escalam no longo prazo, mesmo que levem "so 10 minutinhos"
2. **Entrega continua e obrigatoria** — instalacao de dependencias, testes, build e deploy devem estar em pipeline automatizado, porque deploy manual e um distanciamento da cultura DevOps
3. **Testes devem rodar em tempo de subida** — automatizar testes no pipeline garante velocidade e frequencia de deploys com seguranca
4. **GitOps como fonte unica de verdade** — recursos de nuvem (SQS, Kubernetes, container registries) ficam mapeados no Git, nunca criados manualmente no console
5. **Console da cloud e read-only** — voce entra para visualizar, mas qualquer alteracao passa pelo codigo versionado, porque isso garante revisao, economia e manutenibilidade
6. **Diagnostico e continuo e subjetivo** — cada equipe tem suas necessidades; observe processos do dia a dia e identifique candidatos a automacao

## Decision framework

| Situacao | Acao |
|----------|------|
| Processo repetitivo feito pela equipe | Automatizar — nao escala no longo prazo |
| Deploy manual de aplicacao | Implementar CI/CD pipeline completo |
| Recurso criado direto no console AWS/Azure/GCP | Migrar para IaC com GitOps |
| Testes executados manualmente antes de deploy | Automatizar no pipeline de CI |
| Equipe sem visibilidade dos recursos em nuvem | Mapear tudo no Git como fonte unica de verdade |

## How to evaluate

### Diagnostico de automacao

```
1. Listar processos manuais da equipe
2. Para cada processo, perguntar:
   - E repetitivo?
   - Consome tempo recorrente?
   - Pode ser automatizado?
3. Se sim para os tres → candidato a automacao
4. Priorizar por frequencia e impacto
```

### Pipeline de entrega continua (checklist minimo)

```yaml
pipeline:
  - install_dependencies    # automatizado
  - run_tests               # automatizado (tipos dependem do contexto)
  - build                   # automatizado
  - deploy                  # automatizado via CD
```

### GitOps (fonte unica de verdade)

```
Git (SCM) ←── fonte de verdade
   │
   ├── Recursos de nuvem (SQS, S3, RDS...)
   ├── Cluster Kubernetes
   ├── Container registries
   └── Qualquer infra
   
Console Cloud ←── read-only (visualizacao apenas)
```

## Example

**Before (anti-pattern — sem automacao):**
```
1. Dev termina feature
2. Dev faz build manual na maquina
3. Dev roda testes manualmente
4. Dev acessa console AWS e cria recurso SQS
5. Dev faz deploy manual via SSH
6. Outro dev cria recurso duplicado no console (sem visibilidade)
```

**After (com automacao CALMS):**
```
1. Dev faz push para o Git
2. CI automaticamente: instala deps → roda testes → faz build
3. CD automaticamente: faz deploy
4. Recurso SQS definido em IaC no repositorio
5. Qualquer mudanca de infra passa por code review no Git
6. Console AWS usado apenas para visualizacao
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar recurso direto no console da cloud | Definir em IaC e versionar no Git |
| Deploy manual via SSH/console | Pipeline de CD automatizado |
| Testes manuais antes de cada deploy | Testes automatizados no CI |
| Manter processo repetitivo "porque leva so 10 min" | Automatizar — nao escala no longo prazo |
| Permitir alteracao de infra sem code review | GitOps: toda mudanca passa pelo Git |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
