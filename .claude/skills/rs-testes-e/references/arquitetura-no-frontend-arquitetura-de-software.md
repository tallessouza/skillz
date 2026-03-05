---
name: rs-testes-arq-frontend-arq-software
description: "Applies software architecture principles when making frontend design decisions in React/Next.js projects. Use when user asks to 'structure a project', 'organize components', 'choose architecture', 'reduce coupling', or 'apply SOLID in React'. Enforces architecture-restricts-design-restricts-code hierarchy, high cohesion, low coupling, and dependency inversion adapted for functional frontend. Make sure to use this skill whenever structuring frontend projects or discussing architectural trade-offs. Not for backend microservices implementation, DevOps, or infrastructure decisions."
---

# Arquitetura de Software no Frontend

> Arquitetura restringe design, que restringe codigo — toda decisao arquitetural limita as opcoes de design e implementacao disponiveis.

## Conceito central

Arquitetura sao as decisoes dificeis de mudar uma vez implementadas (Martin Fowler). No frontend: escolher React/Next.js e uma decisao arquitetural. Como organizar componentes dentro dele e decisao de design.

## Rules

1. **Tudo e trade-off** — nao existem balas de prata, porque cada decisao arquitetural tem pros e contras que dependem do contexto, equipe, orcamento e tempo
2. **Alta coesao** — agrupe codigo relacionado no mesmo modulo (componente, hook, pagina), porque modulos coesos sao mais faceis de entender e testar
3. **Baixo acoplamento** — minimize dependencias entre modulos, porque acoplamento alto faz mudancas em um modulo quebrarem outros
4. **Inverta dependencias (DIP)** — componentes recebem dependencias via props/parametros em vez de importar diretamente, porque isso permite testar sem mocks e trocar implementacoes
5. **Open/Closed** — modulos abertos para extensao, fechados para modificacao, porque isso evita regressoes ao adicionar funcionalidades
6. **Single Responsibility** — cada modulo tem uma unica razao para mudar, porque responsabilidades misturadas criam acoplamento acidental

## Hierarquia de restricao

```
Arquitetura (Next.js, React)
    └── restringe → Design (patterns, organizacao de codigo)
                        └── restringe → Codigo (implementacao)
```

Decisao arquitetural: escolher Next.js. Voce nao muda facilmente.
Decisao de design: como organizar componentes, hooks, services. Pode mudar com refactor.

## Como aplicar no frontend funcional

### Dependency Inversion com Props

```typescript
// Componente recebe o que precisa — nao importa de onde vem
function UserList({ users, onDelete }: UserListProps) {
  return users.map(user => (
    <UserCard key={user.id} user={user} onDelete={() => onDelete(user.id)} />
  ))
}

// Quem chama decide a implementacao
<UserList users={activeUsers} onDelete={deleteFromAPI} />

// No teste, passa implementacao fake sem mock
<UserList users={fakeUsers} onDelete={vi.fn()} />
```

### Alta Coesao — Agrupar por dominio

```
features/
  users/
    UserList.tsx        # Componente
    useUsers.ts         # Hook com logica
    userService.ts      # Chamadas API
    UserList.test.tsx   # Teste
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Escolhendo framework (React, Vue, Angular) | Decisao arquitetural — avalie trade-offs com cuidado, e dificil mudar |
| Organizando pastas e componentes | Decisao de design — busque alta coesao, agrupe por dominio |
| Componente importa muitas coisas diretamente | Inverta: receba via props, reduza acoplamento |
| Precisando testar componente isolado | Se precisa de mock, considere inverter a dependencia |
| Nao sabe qual padrao usar | Tudo e trade-off — avalie contexto, equipe e prazo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Componente importa fetch/API diretamente | Receba dados e callbacks via props |
| Pasta organizada por tipo (components/, hooks/, utils/) sem relacao | Organize por feature/dominio |
| Acoplamento acidental entre camadas | Cada camada conhece apenas a interface da proxima |
| Ignorar trade-offs e adotar padrao "da moda" | Avalie pros/contras para seu contexto especifico |
| Nenhum padrao consciente de organizacao | Adote um padrao explicitamente — sem decisao ja e uma decisao acidental |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-arquitetura-de-software/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-arquitetura-de-software/references/code-examples.md)
