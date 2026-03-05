---
name: rs-angular-exemplo-2-sistema-de-rh
description: "Applies Domain-Driven Design decomposition to Angular feature-based architecture using an HR system as reference. Use when user asks to 'organize an Angular app', 'split features', 'create domains', 'structure HR system', or 'apply DDD to Angular'. Demonstrates mapping business requirements to domains to features with entities. Make sure to use this skill whenever structuring a multi-domain Angular application. Not for individual component creation, styling, or Angular API details."
---

# DDD na Pratica: Sistema de RH em Angular

> Decomponha requisitos de negocio em dominios, mapeie entidades, e transforme cada dominio em uma feature Angular independente.

## Processo de Decomposicao

1. **Liste todos os requisitos do sistema** — antes de criar qualquer pasta ou componente, porque a estrutura nasce dos requisitos, nao de suposicoes
2. **Agrupe requisitos por responsabilidade** — funcionalidades que mudam juntas pertencem ao mesmo dominio
3. **Identifique entidades de cada dominio** — cada dominio tem seus proprios modelos de dados
4. **Mapeie dominio → feature Angular** — um dominio = uma feature = uma rota base

## Exemplo: Sistema de Gestao de RH

### Requisitos originais

- Calcular salario, impostos, beneficios e gerar pagamento mensal
- Gerenciar vagas, candidatos, processos seletivos e entrevistas
- Acompanhar desempenho dos funcionarios, metas e feedbacks

### Dominios identificados

| Dominio | Responsabilidades | Entidades | Feature Angular |
|---------|-------------------|-----------|-----------------|
| Folha de Pagamento | Calcular salarios, impostos, beneficios, gerar pagamento | Funcionario (dados salariais), Lancamento, Beneficio, Desconto | `/payroll` |
| Recrutamento | Gerenciar vagas, candidatos, processos seletivos, entrevistas | Vaga, Candidato, EtapaProcesso, Entrevista | `/recruitment` |
| Performance | Acompanhar desempenho, metas, feedbacks | Avaliacao, Meta, Feedback, Competencia | `/performance` |

### Estrutura resultante

```
src/app/
├── features/
│   ├── payroll/          # Componentes apenas desta feature
│   ├── recruitment/      # Componentes apenas desta feature
│   └── performance/      # Componentes apenas desta feature
├── core/                 # Servicos essenciais compartilhados
└── shared/               # Componentes reutilizaveis entre features
```

## Heuristicas

| Situacao | Acao |
|----------|------|
| Requisito muda sozinho sem afetar outros | E um dominio separado |
| Duas funcionalidades compartilham entidades | Provavelmente mesmo dominio |
| Componente usado em multiplas features | Move para `shared/` |
| Servico essencial (auth, http) | Move para `core/` |
| Duvida se e um ou dois dominios | Comece junto, separe quando a complexidade exigir |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Uma pasta `components/` com tudo misturado | Uma pasta por feature/dominio |
| Componente de payroll importando direto de recruitment | Comunique via `core/` ou `shared/` |
| Criar features por tipo (pages/, forms/, tables/) | Criar features por dominio de negocio (payroll/, recruitment/) |
| Definir estrutura antes de entender requisitos | Listar requisitos → agrupar → so depois criar pastas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
