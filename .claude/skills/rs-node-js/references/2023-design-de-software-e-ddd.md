---
name: 2023-design-de-software-e-ddd
description: "Introduces Domain-Driven Design methodology: domain understanding before code, ubiquitous language from domain experts, and separation of design from architecture. Use when user asks to 'apply DDD', 'model the domain', 'use ubiquitous language', or 'start a greenfield project with proper design'. Make sure to use this skill whenever beginning domain modeling, naming entities, or deciding whether to apply DDD patterns to a project. Not for code architecture patterns (Clean Architecture, MVC), database design, or framework selection."
category: coding-lens
tags: [ddd, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: design-de-software
  tags: [ddd, domain-driven-design, linguagem-ubiqua, domain-experts, typescript]
---

# Design de Software e DDD

> Antes de escrever codigo, traduza o problema real do cliente em uma linguagem de dominio que todas as partes entendam.

## Rules

1. **DDD nao e sobre codigo** — DDD e uma metodologia de design de software que ensina a converter problemas reais em software, porque a maioria do processo acontece antes de qualquer linha de codigo
2. **Domine o dominio antes de implementar** — converse com domain experts antes de definir entidades, banco de dados ou frameworks, porque o programador nao e o expert de dominio (a menos que desenvolva software para si mesmo)
3. **Use linguagem ubiqua** — todas as entidades e casos de uso devem usar a nomenclatura que o domain expert usa, nao a que o programador inventou, porque `cliente` != `usuario` dependendo do contexto de negocio
4. **Design != Arquitetura** — Design de Software (como traduzir o problema em software) e independente de Arquitetura de Software (Clean Architecture, MVC, pastas), porque voce pode ter DDD com qualquer arquitetura ou nenhuma
5. **Artefatos devem ser legiveis por nao-programadores** — o que voce produz com DDD (codigo, diagramas, docs) deve ser consumivel por qualquer pessoa envolvida no projeto, porque o codigo tambem faz parte da linguagem ubiqua
6. **Nao pule para frameworks e banco de dados** — resista ao impulso de definir ferramental antes de entender o problema, porque da concepcao ate a primeira linha de codigo pode (e deve) demorar

## Key Concepts

### Dominio
Area de entendimento onde todas as pessoas envolvidas na construcao do software compartilham conhecimentos semelhantes. Tudo no DDD gira em volta do dominio.

### Domain Experts
Pessoas que entendem a fundo a problematica que o software resolve. O atendente no balcao da agencia de viagens, o barbeiro no salao — sao eles que conhecem as entidades reais do negocio.

### Linguagem Ubiqua
Linguagem universal criada a partir de conversas com domain experts. Garante que programadores e stakeholders usem os mesmos termos para as mesmas coisas.

## Decision Framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Inicio de projeto greenfield | Conversas com domain experts antes de qualquer codigo |
| Entidade chamada "usuario" genericamente | Pergunte ao domain expert como ele chama essa pessoa no dia a dia |
| Impulso de escolher framework/banco primeiro | Pare. Entenda o dominio primeiro |
| Confusao entre DDD e Clean Architecture | Lembre: DDD = design (o que modelar), Clean Arch = arquitetura (como estruturar codigo) |
| Artefato que so programador entende | Reescreva usando linguagem ubiqua |

## Example

**Before (programador no piloto automatico):**
```typescript
// Sistema para barbearia
interface User {
  id: string
  name: string
  role: 'admin' | 'user'
}

function createUser(data: CreateUserDTO) { ... }
function getUsers() { ... }
```

**After (com DDD e linguagem ubiqua aplicados):**
```typescript
// Sistema para barbearia — entidades vindas de conversa com o barbeiro
interface Cliente {
  id: string
  name: string
  phone: string
}

interface Barbeiro {
  id: string
  name: string
  specialties: string[]
}

interface Atendente {
  id: string
  name: string
}

function agendarCorte(cliente: Cliente, barbeiro: Barbeiro) { ... }
function listarClientesDodia(barbeiro: Barbeiro) { ... }
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Chamar tudo de `User` sem consultar domain expert | Use a nomenclatura do negocio: `Cliente`, `Barbeiro`, `Fornecedor` |
| Comecar pelo banco de dados e framework | Comece pela conversa com domain experts |
| Tratar DDD como sinonimo de Clean Architecture | Entenda que sao conceitos independentes e complementares |
| Pular a etapa de design e ir direto pro codigo | Invista tempo em entender o dominio — da concepcao ao codigo pode demorar |
| Criar artefatos que so devs entendem | Produza documentacao legivel por qualquer stakeholder |

## Heuristics

| Situacao | Faca |
|----------|------|
| Voce e dev E domain expert (software para si) | Pode pular conversa, mas documente as decisoes de dominio |
| Multiplos domain experts com termos diferentes | Alinhe um vocabulario unico (linguagem ubiqua) |
| Projeto ja existente sem DDD | Comece mapeando a linguagem ubiqua do dominio atual |
| Quer usar DDD + Clean Architecture juntos | Pode! Sao complementares, nao excludentes |
| Projeto simples com dominio obvio | DDD ainda ajuda — ao menos defina entidades com nomes do negocio |

## Troubleshooting

### Entidades nao refletem a linguagem do negocio
**Symptom:** Entidades chamadas `User`, `Item`, `Data` sem contexto de dominio
**Cause:** Modelagem feita sem conversar com domain experts, usando termos genericos de programador
**Fix:** Converse com domain experts e renomeie entidades usando a linguagem ubiqua do negocio (ex: `Cliente`, `Barbeiro`, `Fornecedor`)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
