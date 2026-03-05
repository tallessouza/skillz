---
name: rs-csharp-maui-problema-automapper
description: "Enforces NuGet package version pinning and isolation patterns in .NET projects. Use when user asks to 'pin a package version', 'fix NuGet version', 'lock dependency', 'prevent package update', or 'isolate third-party library'. Applies version range syntax with bracket/parenthesis notation and repository pattern for library isolation. Make sure to use this skill whenever managing .NET dependencies or discussing library replacement strategies. Not for general C# coding, MAUI UI, or application logic."
---

# Controle de Versoes NuGet e Isolamento de Dependencias

> Fixe versoes de pacotes NuGet com sintaxe de intervalos e isole bibliotecas externas atras de abstracoes para facilitar substituicoes futuras.

## Rules

1. **Nunca deixe versoes de pacotes flutuantes quando ha risco de breaking changes** — use sintaxe de intervalo no .csproj, porque atualizacoes automaticas podem introduzir licencas pagas ou breaking changes silenciosas
2. **Isole bibliotecas externas atras de interfaces e camadas** — repositorios, services, adapters, porque trocar uma dependencia deve afetar apenas uma camada, nunca regras de negocio
3. **Nunca exponha DbContext ou SDK externo diretamente para regras de negocio** — use repositorios que devolvem entidades/valores simples, porque a regra de negocio nao precisa saber qual ORM ou banco esta por tras
4. **Mantenha pacotes atualizados dentro do intervalo seguro** — correcoes de seguranca chegam em versoes menores (patch), porque fixar uma versao exata ignora patches criticos
5. **Antes de remover uma biblioteca, avalie: mapeamento manual vs biblioteca alternativa** — substituicao por biblioteca alternativa e geralmente melhor que mapeamento manual, porque reduz boilerplate sem criar dependencia do mesmo vendor

## How to write

### Fixar versao com intervalo no .csproj

```xml
<!-- Aceita qualquer versao >= 14.0.0 e < 15.0.0 -->
<PackageReference Include="AutoMapper" Version="[14.0.0, 15.0.0)" />
```

### Fixar versao exata (menos recomendado)

```xml
<!-- Apenas 14.0.0, ignora patches de seguranca -->
<PackageReference Include="AutoMapper" Version="[14.0.0]" />
```

### Repositorio isolando ORM/SDK

```csharp
// A regra de negocio chama o repositorio, nunca o DbContext
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<List<User>> GetAllAsync();
}

// Implementacao isolada na camada de infraestrutura
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;

    public UserRepository(AppDbContext dbContext) => _dbContext = dbContext;

    public async Task<User?> GetByIdAsync(Guid id)
        => await _dbContext.Users.FindAsync(id);

    public async Task<List<User>> GetAllAsync()
        => await _dbContext.Users.ToListAsync();
}
```

## Example

**Before (versao flutuante, exposta a atualizacao indesejada):**

```xml
<PackageReference Include="AutoMapper" Version="14.0.0" />
```

**After (intervalo seguro, bloqueia versao paga):**

```xml
<PackageReference Include="AutoMapper" Version="[14.0.0, 15.0.0)" />
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Biblioteca ficou paga a partir de versao X | Use `[ultima_free, versao_paga)` no .csproj |
| Quer fixar versao exata temporariamente | Use `[X.Y.Z]` mas planeje migrar para intervalo |
| Biblioteca externa usada em regras de negocio | Extraia para interface + camada de infraestrutura |
| Precisa trocar banco de dados ou ORM | Altere apenas a implementacao do repositorio |
| Visual Studio sobrescreve sintaxe de intervalo ao atualizar | Reaplique manualmente no .csproj apos update |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `Version="14.0.0"` (flutuante) | `Version="[14.0.0, 15.0.0)"` (intervalo) |
| UseCase acessando DbContext direto | UseCase chama IRepository |
| Expor SDK do MongoDB na regra de negocio | Repositorio encapsula SDK e devolve entidades |
| Atualizar todos pacotes sem verificar | Verificar changelogs e licencas antes de update |
| Mapeamento manual em 50 entidades | Usar biblioteca alternativa gratuita |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
