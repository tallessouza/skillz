# Deep Explanation: Usando Type (Type Alias) em TypeScript

## Por que type alias existe?

O instrutor explica que `type` (também chamado de **type alias**) serve para criar **tipagens customizadas** — quando o dado não é uma string simples, nem um number, mas uma estrutura composta com propriedades específicas.

A analogia implícita: assim como você define a estrutura de uma tabela no banco de dados (colunas e tipos), o `type` define a "forma" dos dados que trafegam no seu código.

## Type vs Interface — quando usar cada um

O instrutor menciona que type cria tipos personalizados "assim como interfaces". A diferença fundamental:

- **`type`** suporta unions (`|`), intersections (`&`), tipos primitivos, tuplas e tipos computados
- **`interface`** suporta `extends` e declaration merging (múltiplas declarações se fundem)

**Regra prática do instrutor:** quando precisa de union de tipos (como `Product[] | null`), use `type`. Para objetos que serão estendidos, use `interface`.

## A mecânica do type

### Sintaxe
```typescript
type NomeDoTipo = {
  propriedade: tipo,
  outraPropriedade: outroTipo
}
```

O instrutor destaca:
1. A palavra-chave `type`
2. O nome com **primeira letra maiúscula** (boa prática, e o editor muda a cor para diferenciar)
3. O sinal de `=` (diferente de interface que não usa `=`)
4. Chaves com as propriedades dentro

### Ícone diferente no editor
O instrutor nota que o símbolo de um type no VS Code é visualmente diferente do de uma interface — isso ajuda a identificar rapidamente o que é cada coisa.

## Union Types — a mágica do pipe (`|`)

O conceito mais poderoso demonstrado é a **união de tipos**. O instrutor cria o cenário:

> "Pode ser que não encontre ninguém, pode ser que não retorne ninguém"

Isso justifica `Product[] | null` — a resposta de uma consulta ao banco pode retornar uma lista de produtos OU pode ser nula.

O operador `|` (pipe) é chamado de "operador de união" e permite que uma variável aceite **mais de um tipo**.

## Composição e reutilização

O instrutor demonstra um padrão importante: usar um type existente (`Product`) dentro de outro type (`SelectResponse = Product[] | null`). Isso:

1. Evita duplicação da definição
2. Mantém consistência — se `Product` mudar, `SelectResponse` reflete automaticamente
3. Permite construir tipos complexos a partir de tipos simples

## Validação automática do TypeScript

O instrutor mostra que ao chamar `newProduct()`:
- Se passar `id` como texto, TypeScript reclama que precisa ser número
- Se esquecer a propriedade `name`, TypeScript avisa que está faltando

Esse é o valor central: **erros são detectados antes da execução**, no momento da escrita do código.

## Edge cases

### Array de types
`Product[]` transforma um type de objeto único em um array. É equivalente a `Array<Product>`.

### Null vs Undefined
O instrutor usa `null` explicitamente no union type. Em TypeScript com `strictNullChecks` (padrão no modo strict), `null` e `undefined` são tipos distintos e precisam ser declarados explicitamente.

### Type não pode ser estendido com `extends`
Diferente de interface, você não pode fazer `type B extends A`. Para composição de types, use intersection: `type B = A & { novaPropriedade: string }`.