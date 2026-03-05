# Deep Explanation: Custom useFormState Hook

## Por que criar um hook customizado ao inves de usar useActionState?

O instrutor explica que a logica que se escreve manualmente com useState + useTransition + handler eh exatamente o que o React faz por baixo dos panos com useActionState. Criar um hook proprio da controle total sobre o comportamento, evita depender de APIs experimentais ou instáveis do React, e permite customizar o default state.

## O problema do conflito de nomes

O React possui um hook chamado `useFormState` (que foi posteriormente renomeado para `useActionState`). Quando voce cria um hook com o mesmo nome, o autocomplete do editor pode importar o do React ao inves do seu. O instrutor enfatiza varias vezes: "cuidado, nao importa o do React, vamos usar o nosso proprio useFormState."

## Por que `as const` eh essencial

Sem `as const`, quando voce retorna `[formState, handleSubmit, isPending]`, o TypeScript infere como:

```typescript
(FormState | ((event: FormEvent) => Promise<void>) | boolean)[]
```

Isso significa que qualquer posicao do array pode ser qualquer um dos tres tipos. Com `as const`, o TypeScript entende que eh uma tupla:

```typescript
readonly [FormState, (event: FormEvent) => Promise<void>, boolean]
```

O instrutor explica: "quando eu quero retornar um array que sempre vai seguir a mesma ordem nos itens, eu tenho que botar o `as const`, falar que ele eh constante."

## A decisao de tornar initialState opcional

O instrutor mostra que na maioria dos formularios o estado inicial eh sempre o mesmo: `{ success: null, message: null, errors: null }`. Tornar o parametro opcional evita repetir essa estrutura em cada formulario. Ele menciona que poderia colocar o default de outra forma (como parametro default na funcao), mas prefere o pattern com fallback interno por clareza.

## O padrao de consistencia com useActionState

A ordem dos parametros e do retorno foi deliberadamente mantida igual ao useActionState do React:
- **Parametros:** `(action, initialState)`
- **Retorno:** `[state, handler, isPending]`

Isso facilita a migracao futura e reduz a curva de aprendizado para quem ja conhece a API do React.

## Generic para inferencia de tipos

O hook usa um generic `<TState>` que conecta tres pontos:
1. O retorno da action (`Promise<TState>`)
2. O initialState (`TState`)
3. O formState retornado (`TState`)

Isso garante que se a action retorna `{ success: boolean, message: string }`, o initialState e o formState vao ter exatamente o mesmo tipo, sem casts manuais.