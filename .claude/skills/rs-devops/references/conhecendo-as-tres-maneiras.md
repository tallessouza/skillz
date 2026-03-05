---
name: rs-devops-conhecendo-as-tres-maneiras
description: "Applies the Three Ways of DevOps framework when diagnosing organizational maturity, planning DevOps adoption, or improving development workflows. Use when user asks to 'implement DevOps', 'improve deployment flow', 'assess team maturity', 'accelerate delivery', or 'improve dev-ops collaboration'. Provides a progressive adoption model: First Way (flow), Second Way (feedback), Third Way (learning). Make sure to use this skill whenever evaluating or planning DevOps culture adoption. Not for container setup, CI/CD pipeline configuration, or specific tool implementation."
---

# As Três Maneiras do DevOps

> Implemente DevOps progressivamente: primeiro acelere o fluxo, depois estabeleca feedback continuo, por fim cultive aprendizado organizacional.

## Contexto

As Tres Maneiras vem do livro "O Projeto Phoenix" (mesmos autores do Manual de DevOps). Cada maneira corresponde a um fluxo na evolucao DevOps. Comece pela primeira e evolua — nao tente implementar tudo de uma vez.

**CALMS diagnostica onde voce esta. As Tres Maneiras guiam a implementacao.**

## Primeira Maneira: Acelerar o Fluxo (Dev → Ops)

> Foco: entregar valor mais rapido, com menos desperdicio.

| Principio | Acao concreta |
|-----------|---------------|
| Proximidade Dev-Ops | Equipes compartilham responsabilidade pelo ciclo de vida da aplicacao |
| Visibilidade | Tornar transparente: o que foi feito, o que esta sendo feito, como chega em producao |
| Nao criar pessoas-heroi | Conhecimento compartilhado — herois viram gargalos para a pessoa e para a organizacao |
| Metricas para otimizar | Diagnosticar problemas com dados, nao com reclamacao de cliente |
| Deploys frequentes | Intervalos curtos geram feedback constante e mentalidade experimental |
| Automatizacao | Toda tarefa repetitiva deve ser automatizada |

### Heuristica de priorizacao

```
SE tarefa e repetitiva → automatize
SE entrega valor baixo E complexidade alta → elimine
SE conhecimento esta centralizado em 1 pessoa → documente e compartilhe
```

## Segunda Maneira: Feedback Continuo (Dev ↔ Ops)

> Foco: comunicacao bidirecional rapida entre Dev e Ops.

| Principio | Acao concreta |
|-----------|---------------|
| Feedback rapido e constante | Loops curtos entre quem desenvolve e quem opera |
| Deteccao de erros proativa | Monitoramento que permite previsao e recuperacao rapida |
| Incorporar conhecimento | Aprendizados do Ops fluem de volta para o Dev |

## Terceira Maneira: Aprendizado e Experimentacao Continua

> Foco: cultura de aprendizado estabelecida como padrao organizacional.

| Principio | Acao concreta |
|-----------|---------------|
| Produtividade via aprendizado | Incentivar aprendizado continuo para que o time traga melhorias |
| Sem centralizacao de conhecimento | Equipe inteira na mesma pagina |
| Problemas locais → melhorias globais | Uma correcao de seguranca em um app deve ser pensada para todo o parque |

## Framework de Decisao

| Situacao | Maneira | Primeira acao |
|----------|---------|---------------|
| Deploys lentos ou manuais | 1a | Automatizar pipeline, reduzir batch size |
| Ops descobre bugs so em producao | 2a | Estabelecer feedback loops, alertas, observabilidade |
| Mesmo problema aparece em multiplos servicos | 3a | Generalizar a solucao, compartilhar conhecimento |
| Pessoa-heroi concentra conhecimento | 1a + 3a | Documentar, pair programming, rotacao |
| Equipe nao sabe o estado da aplicacao | 1a | Dashboards de visibilidade, metricas |
| Time nao experimenta novas abordagens | 3a | Criar espaco seguro para experimentacao |

## Diagnostico com as Tres Maneiras

Use apos implementacao (ex: a cada 6-12 meses) junto com CALMS:

```
Para cada maneira, pergunte:
  1a: "O fluxo Dev→Ops esta rapido e automatizado?"
  2a: "Existe feedback continuo bidirecional?"
  3a: "A organizacao aprende e experimenta sistematicamente?"

CALMS diagnostica O QUE melhorar.
Tres Maneiras guiam COMO implementar.
```

## Anti-patterns

| Erro comum | Correcao |
|------------|----------|
| Tentar implementar as 3 maneiras simultaneamente | Comece pela 1a, evolua progressivamente |
| Medir performance sem metricas (confiar em relato de cliente) | Instrumentar antes de otimizar |
| Criar herois que "resolvem tudo" | Distribuir conhecimento, documentar processos |
| Automatizar sem antes ter visibilidade | Primeiro entenda o fluxo, depois automatize |
| Feedback so em retrospectiva mensal | Feedback deve ser continuo, nao periodico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-conhecendo-as-tres-maneiras/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-conhecendo-as-tres-maneiras/references/code-examples.md)
