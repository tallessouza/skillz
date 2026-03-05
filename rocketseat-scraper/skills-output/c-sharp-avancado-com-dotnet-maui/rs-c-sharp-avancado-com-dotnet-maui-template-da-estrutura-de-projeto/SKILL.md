---
name: rs-csharp-maui-template-estrutura
description: "Applies .NET solution organization pattern with shared projects and separated backend/mobile folders. Use when user asks to 'create a .NET project', 'organize solution structure', 'setup C# project', 'structure .NET MAUI app', or 'configure multi-project solution'. Enforces shared Communication/Exception projects, folder-based pipeline triggers, and same-solution architecture for related contexts. Make sure to use this skill whenever scaffolding .NET solutions with multiple project types (API + mobile/web). Not for single-project setups, non-.NET projects, or CI/CD pipeline syntax."
---

# Estrutura de Projeto .NET com Solution Compartilhada

> Organize projetos .NET relacionados (API + aplicativo) na mesma Solution, separando em pastas backend e shared para compartilhar codigo e habilitar pipelines independentes.

## Rules

1. **Mesma Solution para mesmo contexto** — API e aplicativo que se comunicam ficam na mesma Solution, porque compartilham classes de request/response e evitam duplicacao de codigo
2. **Pasta shared para projetos reutilizaveis** — Communication e Exception ficam em `src/shared/`, porque sao consumidos tanto pelo backend quanto pelo aplicativo
3. **Pasta separada por tipo de deploy** — `src/backend/` e `src/mobile/` (ou `src/web/`), porque pipelines usam o path para decidir o que publicar
4. **Nunca duplique DTOs entre projetos** — se API e app usam o mesmo request/response, compartilhe via projeto Communication referenciado por ambos
5. **Verifique a versao do SDK antes de iniciar** — execute `dotnet --version` para garantir compatibilidade com o template

## How to write

### Estrutura de pastas

```
PlanShare/
├── .github/workflows/       # Pipelines separados por projeto
├── images/                   # Imagens para o README apenas
├── src/
│   ├── backend/
│   │   ├── PlanShare.API/
│   │   ├── PlanShare.Application/
│   │   ├── PlanShare.Domain/
│   │   └── PlanShare.Infrastructure/
│   └── shared/
│       ├── PlanShare.Communication/   # Request/Response classes
│       └── PlanShare.Exception/       # Exceptions compartilhadas
├── PlanShare.sln
├── .gitignore
├── LICENSE
└── README.md
```

### Pipeline com path filter

```yaml
name: Deploy API
on:
  push:
    branches: [master]
    paths:
      - 'src/backend/**'
      - '!src/backend/**/README.md'
```

```yaml
name: Deploy Mobile
on:
  push:
    branches: [master]
    paths:
      - 'src/mobile/**'
      - '!src/mobile/**/README.md'
```

## Example

**Before (projetos separados com codigo duplicado):**
```
API-Solution/
├── API/
├── Application/
├── Communication/    # Classes request/response AQUI
└── Domain/

Mobile-Solution/
├── MobileApp/
└── Communication/    # DUPLICADO - mesmas classes request/response
```

**After (solution compartilhada):**
```
PlanShare.sln
src/
├── backend/
│   ├── API/
│   ├── Application/
│   └── Domain/
├── shared/
│   └── Communication/   # UMA so fonte, referenciada por ambos
└── mobile/
    └── MobileApp/        # Referencia shared/Communication
```

## Heuristics

| Situacao | Acao |
|----------|------|
| API + app no mesmo contexto de negocio | Mesma Solution, pastas separadas |
| Dois produtos totalmente diferentes (veterinaria + financas) | Solutions separadas |
| Times com restricao de acesso ao codigo | Solutions separadas (repositorios distintos) |
| Solution com 100+ projetos ficando lenta | Avaliar se todos pertencem ao mesmo contexto |
| Projeto Blazor (server-side) | Pode compartilhar Exception tambem, diferente de mobile |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Duplicar classes request/response entre API e app | Criar projeto Communication em shared/ |
| Pipeline unico sem path filter | Um pipeline por tipo de deploy com paths especificos |
| Misturar projetos de contextos diferentes na mesma Solution | Uma Solution por contexto de negocio |
| Ignorar verificacao de versao do SDK | Rodar `dotnet --version` antes de abrir o template |
| Colocar imagens do app em `images/` | `images/` e so para o README; assets do app ficam no projeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
