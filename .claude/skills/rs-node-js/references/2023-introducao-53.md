---
name: rs-node-js-2023-introducao-53
description: "Applies Node.js SOLID architecture principles when designing backend applications with TypeScript. Use when user asks to 'create an API', 'setup a Node project', 'structure a backend', or 'apply SOLID principles'. Enforces test-first development, dependency inversion, and repository pattern from project inception. Make sure to use this skill whenever starting a new Node.js backend project or discussing architecture decisions. Not for frontend, React, or database-specific queries."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: solid-architecture
  tags: [solid, dependency-inversion, repository-pattern, in-memory-database, factory-pattern, tdd, clean-architecture]
---

# API Node.js com SOLID — Visao Geral Arquitetural

> Todo projeto Node.js profissional comeca com testes desde a primeira funcionalidade e aplica principios SOLID para manutenibilidade.

## Key concept

Um projeto Node.js bem arquitetado nao adiciona testes depois — ele nasce com testes. A inversao de dependencia e o que torna isso possivel: ao desacoplar regras de negocio de implementacoes concretas, testes unitarios se tornam triviais de escrever usando in-memory databases e mocks.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Nova funcionalidade com regras de negocio | Escreva testes unitarios ANTES da implementacao |
| Acesso a banco de dados | Repository Pattern com interface abstrata |
| Dependencia entre camadas | Inversao de dependencia (Dependency Inversion Principle) |
| Criacao de instancias complexas | Factory Pattern |
| Projeto do zero (npm init) | Estruture com SOLID desde o inicio |
| Pipeline de entrega | CI/CD com testes automatizados como gate |

## Pilares do projeto

### 1. Test-first desde o inicio
```
Funcionalidade nova → Teste unitario → Implementacao → Teste e2e
```
Nunca deixe testes para "depois". A primeira regra de negocio ja nasce testada.

### 2. Design Patterns essenciais

| Pattern | Quando usar |
|---------|-------------|
| **Repository Pattern** | Abstrair acesso a dados por tras de interface |
| **In-Memory Database** | Substituir banco real nos testes unitarios |
| **Factory Pattern** | Criar instancias com dependencias injetadas |
| **Dependency Inversion** | Desacoplar camadas para testabilidade |

### 3. Piramide de testes

```
        /  E2E  \        ← Poucos, lentos, fluxo completo
       /----------\
      / Integracao \     ← Medio, componentes juntos
     /--------------\
    / Testes Unitarios \  ← Muitos, rapidos, isolados
```

## How to apply

### Estrutura com inversao de dependencia
```typescript
// Interface (contrato)
interface UsersRepository {
  create(data: CreateUserDTO): Promise<User>
  findByEmail(email: string): Promise<User | null>
}

// Implementacao concreta (producao)
class PrismaUsersRepository implements UsersRepository { ... }

// Implementacao in-memory (testes)
class InMemoryUsersRepository implements UsersRepository { ... }

// Use case recebe a interface, nao a implementacao
class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}
}
```

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Importar banco diretamente no use case | Injetar repository via construtor |
| Adicionar testes so no final | Testar desde a primeira regra de negocio |
| Acoplar regras de negocio ao framework | Isolar use cases em camada propria |
| Testar com banco real em unitarios | Usar in-memory database pattern |
| Deploy sem CI/CD | Integrar testes no pipeline desde o inicio |

## Troubleshooting

### Use case impossivel de testar sem banco de dados
**Symptom:** Testes unitarios exigem conexao com banco real para executar
**Cause:** Use case instancia repositorio concreto internamente em vez de receber por construtor
**Fix:** Aplique inversao de dependencia: crie interface do repositorio, receba via construtor, e use InMemoryRepository nos testes

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
