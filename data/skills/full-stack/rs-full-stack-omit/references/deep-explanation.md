# Deep Explanation: Omit

## O que e o Omit

`Omit<Type, Keys>` e um utility type nativo do TypeScript que cria um novo tipo a partir de um existente, removendo as propriedades especificadas em `Keys`. E o inverso do `Pick` — enquanto Pick seleciona quais campos manter, Omit seleciona quais campos remover.

## Por que usar

O instrutor enfatiza o conceito de **reaproveitamento de tipagem**. Em vez de criar interfaces novas manualmente (duplicando campos), voce deriva tipos a partir de um tipo base. Isso garante que:

- Mudancas no tipo original propagam automaticamente
- Nao ha risco de divergencia entre tipos relacionados
- O codigo expressa a relacao entre os tipos (BookSummary e um Book sem X)

## Sintaxe do union para multiplas exclusoes

O operador `|` (pipe) dentro do segundo parametro do Omit cria uma **union de string literals**. Isso nao e um OR logico — e a sintaxe do TypeScript para dizer "estas chaves":

```typescript
Omit<Book, "description" | "pages">
// Equivale a: pegue Book, remova as chaves "description" e "pages"
```

O instrutor destaca que o aluno precisa usar "aquela barra invertida" (pipe `|`) para separar multiplas propriedades.

## Quando Omit vs Pick

- **Omit**: quando voce quer QUASE tudo do tipo original (exclui poucos)
- **Pick**: quando voce quer apenas ALGUNS campos (inclui poucos)

Regra pratica: se voce esta excluindo mais da metade dos campos, Pick provavelmente expressa melhor a intencao.

## Edge cases

### Omit com chaves que nao existem
TypeScript NAO reclama se voce omitir uma chave que nao existe no tipo:
```typescript
type X = Omit<Book, "nonexistent"> // Compila sem erro, tipo = Book completo
```
Isso pode esconder bugs. Use `satisfies` ou tipos auxiliares para garantir seguranca.

### Omit com tipos indexados
Se o tipo tem index signature, Omit pode ter comportamento inesperado:
```typescript
interface Flexible {
  [key: string]: any
  id: number
}
type WithoutId = Omit<Flexible, "id"> // Ainda aceita qualquer string key
```

### Omit e readonly/optional
Omit preserva os modificadores `readonly` e `?` das propriedades que permanecem.