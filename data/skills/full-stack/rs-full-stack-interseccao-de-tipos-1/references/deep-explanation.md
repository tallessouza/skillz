# Deep Explanation: Intersecção de Tipos

## O que é intersecção de tipos

O operador `&` no TypeScript combina múltiplos tipos em um só. O tipo resultante possui **todas** as propriedades de todos os tipos combinados. É diferente de union (`|`), que aceita **qualquer um** dos tipos.

## Raciocínio do instrutor

O instrutor apresenta um cenário real: `Teacher` e `Student` compartilham `id` e `name`. Sem intersecção, cada type repete essas propriedades. O problema não é só digitação extra — é que quando `Person` ganha um campo novo (ex: `email`), você precisa lembrar de atualizar todos os tipos que deveriam tê-lo.

A estratégia é:
1. Identificar o que é **comum** → colocar no type base (`Person`)
2. Identificar o que é **específico** → colocar no type derivado (`Teacher`, `Student`)
3. Unir com `&` → o tipo resultante tem tudo

## Por que `&` e não `extends`?

- `&` funciona com `type` aliases — mais flexível, pode combinar tipos anônimos, unions, etc.
- `extends` funciona com `interface` — cria uma relação hierárquica formal
- Para composição simples de propriedades, `&` é mais direto e conciso
- Ambos produzem resultado equivalente para casos simples

## O que acontece sem intersecção

O instrutor demonstrou: ao criar `type Teacher = { subjects: string[] }` sem `&` com Person, a variável `teacher` só tem acesso a `subjects`. Os campos `id` e `name` simplesmente não existem no tipo. O TypeScript não advinha que Teacher deveria ter campos de Person.

## Edge cases

### Conflito de tipos na intersecção

```typescript
type A = { value: string }
type B = { value: number }
type C = A & B
// C.value seria string & number = never (impossível satisfazer)
```

Cuidado ao compor tipos que têm campos com o mesmo nome mas tipos diferentes — o resultado é `never` para aquele campo.

### Intersecção com mais de 2 tipos

```typescript
type HasId = { id: number }
type HasName = { name: string }
type HasEmail = { email: string }

type FullPerson = HasId & HasName & HasEmail
// Tem id, name, e email
```

Composição granular é válida e comum em projetos maiores.

### Intersecção vs duplicação — impacto real

Com 10 entidades que compartilham `id`, `name`, `email`, `createdAt`, `updatedAt`:
- **Sem intersecção:** 50 linhas duplicadas (5 campos × 10 tipos)
- **Com intersecção:** 5 linhas no base + 10 linhas de `& { ... }` = 15 linhas
- **Ao adicionar `phone`:** 1 mudança vs 10 mudanças