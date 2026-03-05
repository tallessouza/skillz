# Deep Explanation: Diferença entre Type e Interface

## O que o instrutor quis dizer

A mensagem central e: **nao existe regra de bolo**. A escolha entre `type` e `interface` depende do contexto. O importante e conhecer as capacidades exclusivas de cada um para decidir com propriedade.

## As 3 diferencas fundamentais

### 1. Declaracao

- `interface Product { ... }` — sem sinal de igual
- `type Product = { ... }` — com sinal de igual

Isso parece cosmético, mas reflete uma diferença conceitual: interface *declara uma forma*, type *atribui um alias*.

### 2. Declaration Merging (so interface)

Quando o TypeScript encontra duas interfaces com o mesmo nome, ele **unifica** automaticamente. Isso e usado extensivamente por bibliotecas (ex: Express, React) para permitir que consumidores adicionem propriedades.

```typescript
interface Product {
    id: number
    name: string
}

interface Product {
    quantity: number
}

// Product agora tem: id, name, quantity
// E como se voce tivesse escrito tudo junto
```

Com `type`, isso gera erro: `Duplicate identifier`. O TypeScript trata types como constantes — uma vez definido, nao pode ser redefinido.

### 3. Alias de primitivos (so type)

```typescript
type UserId = string     // OK
type Price = number      // OK

interface X extends string {} // ERRO: cannot extend primitive
```

Interfaces foram projetadas para descrever **formas de objetos**. Types sao mais flexiveis e permitem alias de qualquer tipo, incluindo primitivos, unions e tuples.

## Quando o mercado usa cada um

O instrutor observa que **no mercado e muito mais comum ver interfaces**, tanto em aplicacoes comerciais quanto na comunidade. Porem, ele pessoalmente prefere `type` por achar mais semantico.

### Regra pratica

| Precisa de... | Use |
|---------------|-----|
| Declaration merging | `interface` |
| Alias de primitivo | `type` |
| Union type (`A \| B`) | `type` |
| Tuple type | `type` |
| Hierarquia de objetos | `interface extends` |
| Composicao ad-hoc | `type` com `&` |
| Qualquer outro caso | Convencao do time |

## Edge cases importantes

### Intersecao vs Extends — comportamento diferente com conflitos

```typescript
// Com interface extends: ERRO em compilacao se tipos conflitam
interface A { x: number }
interface B extends A { x: string } // Error!

// Com type intersecao: resulta em `never` silenciosamente
type A = { x: number }
type B = A & { x: string } // x vira `never` — nao da erro, mas quebra em runtime
```

Isso e uma armadilha. `extends` e mais seguro para heranca porque falha ruidosamente.

### Performance de compilacao

O TypeScript team ja mencionou que interfaces podem ser ligeiramente mais performaticas em projetos grandes porque sao cached por nome. Types com intersecoes complexas podem ser reavaliados repetidamente.

## Convencao de prefixo I

O instrutor usa `IProduct` e `TProduct` para diferenciar no exemplo, mas deixa claro que e apenas para fins didaticos. No mercado, o prefixo `I` e controverso:

- **A favor:** facilita identificar visualmente que e uma interface
- **Contra:** o TypeScript official style guide nao recomenda; e considerado heranca de C#