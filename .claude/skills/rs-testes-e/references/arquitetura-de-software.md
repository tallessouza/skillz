---
name: rs-testes-e-arquitetura-de-software
description: "Applies software architecture principles (SOLID, cohesion, coupling, DIP) when making frontend design decisions in React/Next.js projects. Use when user asks to 'structure a project', 'organize components', 'choose architecture', 'reduce coupling', or 'apply SOLID in React'. Enforces architecture-restricts-design-restricts-code hierarchy and dependency inversion adapted for functional frontend. Make sure to use this skill whenever structuring frontend projects or discussing architectural trade-offs. Not for backend microservices (use rs-node-js), DevOps (use rs-devops), or infrastructure decisions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: fundamentos-arquitetura
  tags: [architecture, solid, dip, cohesion, coupling, react, next-js, frontend]
---

# Arquitetura de Software no Frontend

> Arquitetura restringe design, que restringe codigo — toda decisao arquitetural limita as opcoes de design e implementacao disponiveis.

## Key concept

Arquitetura sao as decisoes dificeis de mudar uma vez implementadas (Martin Fowler). No frontend: escolher React/Next.js e decisao arquitetural. Organizar componentes e decisao de design.

## Rules

1. **Tudo e trade-off** — nao existem balas de prata, porque cada decisao tem pros e contras que dependem do contexto, equipe e tempo
2. **Alta coesao** — agrupe codigo relacionado no mesmo modulo, porque modulos coesos sao mais faceis de entender e testar
3. **Baixo acoplamento** — minimize dependencias entre modulos, porque acoplamento alto faz mudancas cascatearem
4. **Inverta dependencias (DIP)** — componentes recebem dependencias via props, porque permite testar sem mocks e trocar implementacoes
5. **Open/Closed** — modulos abertos para extensao, fechados para modificacao, porque evita regressoes
6. **Single Responsibility** — cada modulo tem uma unica razao para mudar

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Escolhendo framework | Decisao arquitetural — avalie trade-offs com cuidado |
| Organizando pastas e componentes | Decisao de design — busque alta coesao por dominio |
| Componente importa muitas coisas | Inverta: receba via props |
| Precisando testar isolado | Se precisa mock, considere inverter dependencia |

## How to think about it

### Hierarquia de restricao

```
Arquitetura (Next.js, React)
    -> restringe -> Design (patterns, organizacao)
                        -> restringe -> Codigo (implementacao)
```

### Dependency Inversion com Props

```typescript
function UserList({ users, onDelete }: UserListProps) {
  return users.map(user => (
    <UserCard key={user.id} user={user} onDelete={() => onDelete(user.id)} />
  ))
}
// No teste: <UserList users={fakeUsers} onDelete={vi.fn()} />
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Existe arquitetura perfeita | Tudo e trade-off — depende do contexto |
| SOLID so funciona com OOP | DIP e SRP se aplicam perfeitamente a componentes funcionais |
| Organizar por tipo (components/, hooks/) e bom | Organizar por feature/dominio gera mais coesao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Componente importa fetch/API diretamente | Receba dados e callbacks via props |
| Pasta por tipo sem relacao de dominio | Organize por feature/dominio |
| Adotar padrao "da moda" sem avaliar | Avalie pros/contras para seu contexto |

## Troubleshooting

### Componente dificil de testar
**Symptom:** Teste precisa de muitos mocks para funcionar
**Cause:** Componente importa dependencias concretas internamente
**Fix:** Inverter dependencias — receber via props/parametros. Se so precisa de `vi.fn()` na prop, nao precisa de mock de modulo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
