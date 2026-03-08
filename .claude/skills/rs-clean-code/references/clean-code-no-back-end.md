---
name: rs-clean-code-clean-code-no-back-end
description: "Enforces separation between Clean Code fundamentals and architectural patterns (Clean Architecture, DDD, SOLID) when writing backend code. Use when user asks to 'refactor backend', 'apply clean architecture', 'structure my API', 'organize backend code', or conflates clean code with complex patterns. Clarifies that testability is the true measure of code cleanliness — Testability-First Pattern. Make sure to use this skill whenever backend architecture discussions arise. Not for frontend patterns (use rs-clean-code-componentes-puros), SOLID implementation (use rs-clean-code-exemplo-pratico-de-solid), or DDD modeling (use rs-clean-code-exemplo-pratico-de-ddd)."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: clean-code-back-end
  tags: [backend, architecture, testability, clean-code, over-engineering]
---

# Clean Code no Back-end

> Codigo limpo nao depende de arquitetura — testabilidade e o verdadeiro indicador de limpeza do codigo.

## Rules

1. **Separe Clean Code de Clean Architecture/DDD/SOLID** — sao conceitos independentes, porque voce pode ter codigo limpo sem aplicar nenhuma arquitetura avancada
2. **Use testabilidade como bussola** — se voce consegue escrever testes simples e alterar codigo sem quebrar a suite de testes, seu codigo esta limpo, porque testes medem desacoplamento real
3. **Nao force arquitetura onde nao precisa** — 95% das empresas nao aplicam Clean Architecture ou DDD, porque frameworks opinados (Nest, Adonis, Laravel) ja trazem estrutura propria
4. **Arquitetura nao e separacao de pastas** — design de software nao tem relacao com nomenclatura de pastas, porque reorganizar pastas nao melhora a comunicacao entre componentes
5. **Escolha complexidade proporcional ao problema** — 12 arquivos para salvar um usuario e over-engineering, porque a arquitetura deve servir ao problema, nao ao ego
6. **Entenda o porque das regras** — seguir regras sem entender o motivo produz cargo cult, porque copia sem compreensao gera codigo pior do que codigo sem padroes

## How to write

### Testability-First Pattern

```typescript
// Codigo limpo: funcoes pequenas, nomes claros, testavel
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
test('should not create user with duplicate email', async () => {
  await createUser({ email: 'test@mail.com', password: '123', name: 'Test' })
  await expect(
    createUser({ email: 'test@mail.com', password: '456', name: 'Other' })
  ).rejects.toThrow(ConflictError)
})
```

## Example

**Before (over-engineering para CRUD simples):**
```
UserController -> UserService -> UserUseCase -> UserRepository -> UserMapper -> UserEntity
// 12 arquivos para salvar um usuario. Isso NAO e codigo limpo — e over-engineering.
```

**After (codigo limpo sem over-engineering):**
```typescript
export async function createUser(input: CreateUserInput) {
  const hashedPassword = await hashPassword(input.password)
  return db.user.create({ data: { ...input, password: hashedPassword } })
}
// 1 arquivo. Testavel. Limpo. Proporcional.
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Usando framework opinado (Nest, Laravel) | Siga a estrutura do framework, aplique Clean Code nos detalhes |
| Backend simples/CRUD | Nao introduza Clean Architecture ou DDD |
| Suite de testes quebrando com qualquer alteracao | Refatore para desacoplar, nao para "aplicar arquitetura" |
| Alguem pede "aplicar SOLID no frontend" | 99.9% dos casos nao se aplica |
| Projeto complexo com microservicos | Considere patterns arquiteturais, com razao clara |

## Anti-patterns

| Never do | Do instead |
|----------|------------|
| Criar 6 camadas para um CRUD | Codigo direto e testavel |
| Achar que separar pastas = arquitetura | Foque em como o codigo se comunica |
| Aplicar Clean Architecture em TODO projeto | Proporcional ao problema |
| Seguir SOLID sem saber o porque | Entenda o principio, aplique quando faz sentido |
| Copiar arquitetura de empresa grande | Cada contexto tem necessidades diferentes |

## Troubleshooting

### Dev acha que precisa de DDD para ter codigo limpo
**Symptom:** Tenta aplicar bounded contexts e aggregates num CRUD simples
**Cause:** Confusao entre Clean Code (fundamentos) e DDD (modelagem de dominio complexo)
**Fix:** Comece pelos basicos: nomes claros, funcoes pequenas, testes. DDD e para quando o dominio justifica.

### Testes quebrando com qualquer alteracao
**Symptom:** Alterar uma feature quebra 15 testes nao relacionados
**Cause:** Codigo acoplado — nao e falta de arquitetura, e dependencias mal gerenciadas
**Fix:** Desacople com interfaces simples no ponto necessario, nao em TODOS os pontos.

## Deep reference library

- [deep-explanation.md](../../../data/skills/clean-code/rs-clean-code-clean-code-no-back-end/references/deep-explanation.md) — A grande confusao do mercado, cargo cult, por que 95% das empresas nao usam
- [code-examples.md](../../../data/skills/clean-code/rs-clean-code-clean-code-no-back-end/references/code-examples.md) — NestJS limpo, testabilidade como indicador, over-engineering vs simplicidade
