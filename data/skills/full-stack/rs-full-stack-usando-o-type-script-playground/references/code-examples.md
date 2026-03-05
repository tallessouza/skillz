# Code Examples: TypeScript Playground

## Exemplo 1: Hello TypeScript (do instrutor)

O exemplo mais basico mostrado na aula:

```typescript
console.log("Hello TypeScript")
```

**Para executar:**
1. Apagar o codigo de exemplo que o Playground traz por padrao
2. Digitar o codigo acima
3. Clicar em "Run"
4. Ver o resultado na aba "Logs": `"Hello TypeScript"`

## Exemplo 2: Variavel tipada

```typescript
const message: string = "Hello TypeScript"
console.log(message)
```

**O que observar no Playground:**
- Lado esquerdo: o codigo TypeScript com a anotacao `: string`
- Lado direito (aba .JS): o JavaScript gerado sem a anotacao de tipo
- Aba Logs (apos Run): o valor `"Hello TypeScript"`

## Exemplo 3: Erro de tipo (para testar aba Errors)

```typescript
const age: number = "vinte"
//    ^^^ Type 'string' is not assignable to type 'number'
```

**O que observar:**
- O editor sublinha `"vinte"` em vermelho
- A aba "Errors" lista o erro com descricao completa
- O JS ainda e gerado (TypeScript transpila mesmo com erros por padrao)

## Exemplo 4: Funcao com tipos

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`
}

console.log(greet("TypeScript"))
```

**O que observar:**
- Hover sobre `greet` mostra a assinatura completa
- Aba .JS mostra a funcao sem anotacoes de tipo
- Aba Logs mostra: `"Hello, TypeScript!"`

## Exemplo 5: Verificando saida JavaScript

```typescript
enum Color {
  Red,
  Green,
  Blue
}

const favorite: Color = Color.Green
console.log(favorite)
```

**O que observar:**
- Aba .JS revela como o enum e transpilado (objeto JavaScript)
- Aba Logs mostra `1` (o valor numerico de `Green`)
- Util para entender que TypeScript e "apenas" JavaScript com tipos