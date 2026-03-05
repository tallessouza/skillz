# Deep Explanation: TypeScript typeof para Extração de Tipos

## O que typeof faz no sistema de tipos

No TypeScript, `typeof` tem dois contextos:
1. **Runtime (JavaScript):** retorna uma string como `"string"`, `"number"`, `"object"` — operador JavaScript padrão
2. **Type-level (TypeScript):** extrai o tipo estático de uma variável ou valor — este é o foco desta skill

Quando você escreve `const x: typeof y`, está dizendo ao TypeScript: "o tipo de x deve ser exatamente o tipo inferido de y". Não é uma cópia do valor, é uma referência ao tipo.

## Por que isso é útil: propagação automática

O insight principal do instrutor: quando você adiciona um campo na interface (ex: `quantity: number`), **todos os lugares que usam `typeof` daquele valor são automaticamente impactados**. Isso significa:

- Se `product1` ganha um campo `quantity`, `product2: typeof product1` também exige `quantity`
- Não há como esquecer de atualizar — o compilador força

Isso é especialmente poderoso em cenários onde:
- A fonte do tipo está fora do seu controle (bibliotecas, APIs)
- O tipo muda frequentemente durante desenvolvimento
- Você quer um "contrato" que se mantém sincronizado automaticamente

## Cenário real: bibliotecas e APIs

O instrutor destaca que typeof brilha com recursos externos. Exemplo concreto:

```typescript
// Uma biblioteca retorna um objeto tipado
const config = createAppConfig({ theme: "dark", locale: "pt-BR" })

// Em vez de criar manualmente:
// interface AppConfig { theme: string; locale: string } ← frágil, pode ficar desatualizado

// Use typeof:
type AppConfig = typeof config // sempre sincronizado com o retorno real
```

Se a biblioteca adicionar campos ao retorno de `createAppConfig`, seu tipo `AppConfig` reflete automaticamente.

## Quando NÃO usar typeof

- **Quando a interface é sua e bem definida:** se você criou `interface Product`, use `Product` diretamente. typeof de um valor é útil quando o tipo vem implícito, não quando já está explícito.
- **Quando precisa de tipo parcial:** typeof extrai o tipo completo. Se precisa de um subset, combine com `Pick<typeof x, 'field1' | 'field2'>`.
- **Confusão com typeof runtime:** em um `if (typeof x === "string")`, isso é JavaScript runtime, não extração de tipo.

## Conexão com outros recursos TypeScript

- `ReturnType<typeof fn>` — extrai o tipo de retorno de uma função
- `Parameters<typeof fn>` — extrai os tipos dos parâmetros
- `keyof typeof obj` — obtém as chaves de um objeto como union type

Esses utility types frequentemente usam `typeof` como building block.