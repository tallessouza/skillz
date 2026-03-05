---
name: rs-clean-code-clean-code-no-back-end
description: "Enforces the separation between Clean Code and architectural patterns (Clean Architecture, DDD, SOLID) when writing backend code. Use when user asks to 'refactor backend', 'apply clean architecture', 'structure my API', 'organize backend code', or discusses SOLID principles. Clarifies that clean code is independent of architecture and that testability is the true measure of code cleanliness. Make sure to use this skill whenever backend architecture discussions arise or when someone conflates clean code with complex patterns. Not for frontend component architecture, UI patterns, or actual Clean Architecture implementation guidance."
---

# Clean Code no Back-end

> Codigo limpo nao depende de arquitetura — testabilidade e o verdadeiro indicador de limpeza do codigo.

## Rules

1. **Separe Clean Code de Clean Architecture/DDD/SOLID** — sao conceitos independentes, porque voce pode ter codigo limpo sem aplicar nenhuma arquitetura avancada
2. **Use testabilidade como bussola** — se voce consegue escrever testes simples e alterar codigo sem quebrar a suite de testes, seu codigo esta limpo
3. **Nao force arquitetura onde nao precisa** — 95% das empresas nao aplicam Clean Architecture ou DDD; frameworks opinados (Nest, Adonis, Laravel) ja trazem estrutura propria
4. **Arquitetura nao e separacao de pastas** — design de software nao tem nada a ver com nomenclatura de pastas ou onde cada arquivo fica
5. **Nao use canhao para matar formiga** — escolha a complexidade arquitetural proporcional ao problema
6. **Entenda o porque das regras** — seguir regras sem entender o motivo nao produz codigo limpo, produz cargo cult

## How to write

### Backend limpo SEM arquitetura complexa

```typescript
// Codigo limpo: funcoes pequenas, nomes claros, testavel
// Nao precisa de Clean Architecture para isso
export async function createUser(input: CreateUserInput) {
  const existingUser = await usersRepository.findByEmail(input.email)
  if (existingUser) {
    throw new ConflictError('Email already in use')
  }

  const hashedPassword = await hashPassword(input.password)
  return usersRepository.create({ ...input, password: hashedPassword })
}
```

### Teste como indicador de limpeza

```typescript
// Se o teste e simples de escrever, o codigo esta limpo
test('should not create user with duplicate email', async () => {
  await createUser({ email: 'test@mail.com', password: '123', name: 'Test' })

  await expect(
    createUser({ email: 'test@mail.com', password: '456', name: 'Other' })
  ).rejects.toThrow(ConflictError)
})
```

## Example

**Before (confundindo arquitetura com codigo limpo):**
```typescript
// 6 camadas de abstracoes desnecessarias para um CRUD simples
// UserController -> UserService -> UserUseCase -> UserRepository -> UserMapper -> UserEntity
// Cada camada com interface, implementacao, e factory
// Resultado: 12 arquivos para salvar um usuario
```

**After (codigo limpo sem over-engineering):**
```typescript
// Direto, testavel, sem abstrações desnecessarias
export async function createUser(input: CreateUserInput) {
  const hashedPassword = await hashPassword(input.password)
  return db.user.create({ data: { ...input, password: hashedPassword } })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Usando framework opinado (Nest, Laravel, Adonis) | Siga a estrutura do framework, aplique Clean Code nos detalhes (nomes, funcoes pequenas, testes) |
| Backend simples/CRUD | Nao introduza Clean Architecture ou DDD — aplique os principios basicos de Clean Code |
| Suite de testes quebrando com qualquer alteracao | Sinal de codigo acoplado — refatore para desacoplar, nao para "aplicar arquitetura" |
| Alguem pede "aplicar SOLID no frontend" | 99.9% dos casos nao se aplica — frameworks frontend tem suas proprias opinoes |
| Projeto complexo com microservicos | Ai sim considere patterns como Ports & Adapters, mas com razao clara |

## Anti-patterns

| Never do | Do instead |
|----------|------------|
| Criar 6 camadas de abstracao para um CRUD | Codigo direto e testavel, adicione camadas quando a complexidade justificar |
| Achar que separar pastas = arquitetura | Foque em como o codigo se comunica, nao onde os arquivos ficam |
| Aplicar Clean Architecture em TODO projeto | Escolha a arquitetura proporcional ao problema |
| Seguir regras SOLID sem saber o porque | Entenda o principio por tras, aplique quando faz sentido |
| Achar que precisa de DDD para ter codigo limpo | Clean Code e independente — comece pelos basicos |
| Copiar arquitetura do Nubank para seu projeto | Cada empresa/contexto tem necessidades diferentes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-clean-code-no-back-end/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-clean-code-no-back-end/references/code-examples.md)
