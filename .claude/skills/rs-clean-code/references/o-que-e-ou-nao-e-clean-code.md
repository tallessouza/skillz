---
name: rs-clean-code-o-que-e-ou-nao-e
description: "Applies Clean Code mental model when user asks to 'refactor code', 'improve code quality', 'clean up code', 'make code readable', or 'review code'. Enforces the four pillars: legibilidade, manutenibilidade, previsibilidade, confianca. Guards against confusing Clean Code with folder structure, small code, architecture patterns, or performance. Make sure to use this skill whenever discussing code quality or reviewing pull requests. Not for architecture decisions, performance optimization, or folder organization."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: fundamentos
  tags: [clean-code, readability, maintainability, predictability, reliability, code-quality]
---

# O que e ou nao e Clean Code

> Clean Code se sustenta em quatro pilares: legibilidade, manutenibilidade, previsibilidade e confianca — nao em tamanho de codigo, estrutura de pastas ou arquitetura.

## Os Quatro Pilares

1. **Legibilidade** — codigo de facil leitura. Facil leitura nao significa codigo simples. Um codigo complexo pode ser legivel se uma pessoa com conhecimento tecnico adequado consegue abri-lo e le-lo.

2. **Manutenibilidade** — codigo de facil manutencao. Se alguem consegue ler o codigo mas nao consegue adicionar funcionalidade ou dar manutencao, o codigo nao e limpo.

3. **Previsibilidade** — ao alterar o codigo, o desenvolvedor consegue prever o impacto das mudancas.

4. **Confianca (Reliability)** — o desenvolvedor tem confianca de que suas alteracoes nao vao quebrar comportamentos existentes.

**Teste:** se uma pessoa com conhecimento tecnico consegue ler, realizar manutencao com confianca e previsibilidade, o codigo e limpo.

## O que Clean Code NAO e

| Confusao comum | Por que nao e Clean Code |
|----------------|--------------------------|
| Manual/livro/teoria | Clean Code se forma com anos de pratica, autocritica e trabalho em time — nao nasce da leitura de um livro |
| Estrutura de pastas | Um dev de 10 anos com todos os arquivos numa pasta escreve codigo mais limpo que um dev de 1 ano com estrutura perfeita de pastas |
| Codigo pequeno | Codigo maior pode ser mais legivel e manutenivel. Reduzir linhas nao e Clean Code |
| Arquitetura/Design (Clean Architecture, DDD, Ports & Adapters) | Essas praticas podem ajudar, mas nao sao pre-requisito nem sinonimo de codigo limpo |
| Performance | Codigo rapido ou lento nao tem relacao com Clean Code |

## Heuristics

| Situacao | Aplique |
|----------|---------|
| Revisando PR ou refatorando | Avalie pelos 4 pilares, nao por tamanho |
| Pasta com 20-100 arquivos | Normal. Projeto cresce. Nao separe em subpastas so por ansiedade |
| Tentando reduzir linhas | Pare. Pergunte: ficou mais legivel e manutenivel? |
| Aplicando arquitetura "limpa" | Arquitetura e Clean Code sao coisas separadas |
| Codigo complexo mas legivel | Complexidade nao e sujeira. Ilegibilidade e |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Confundir codigo curto com codigo limpo | Avalie legibilidade e manutenibilidade, independente do tamanho |
| Criar subpastas para reduzir arquivos por pasta | Deixe crescer se a nomenclatura dos arquivos e clara |
| Exigir Clean Architecture para ter "codigo limpo" | Aplique os 4 pilares em qualquer arquitetura |
| Esperar que teoria sozinha produza codigo limpo | Pratique, escreva muito codigo ruim, aplique autocritica constante |
| Avaliar qualidade pelo numero de linhas | Avalie pela capacidade de outro dev ler e manter com confianca |

## Troubleshooting

### Confundir codigo curto com codigo limpo
**Symptom:** Desenvolvedor refatora reduzindo linhas e acredita que o codigo ficou "mais limpo"
**Cause:** Associacao errada entre tamanho do codigo e qualidade — codigo menor nao e necessariamente mais legivel ou manutenivel
**Fix:** Avalie pelos 4 pilares (legibilidade, manutenibilidade, previsibilidade, confianca) em vez de contar linhas. Codigo maior pode ser mais limpo se for mais facil de ler e manter

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-o-que-e-ou-nao-e-clean-code/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-o-que-e-ou-nao-e-clean-code/references/code-examples.md)
