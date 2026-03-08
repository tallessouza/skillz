# Deep Explanation: Estendendo Propriedades de Elementos HTML

## O problema que isso resolve

Elementos HTML nativos possuem dezenas (às vezes centenas) de propriedades. Um `<button>`, por exemplo, tem: `onClick`, `onMouseEnter`, `onFocus`, `disabled`, `type`, `className`, `style`, `aria-label`, `tabIndex`, e muitas outras.

Quando criamos um componente React que encapsula um `<button>`, precisamos que esse componente aceite todas essas propriedades — caso contrário, quem usar o componente perde acesso a funcionalidades nativas.

### A abordagem ingênua (e por que falha)

```typescript
type ButtonProps = {
  name: string
  onClick: () => void
}
```

Isso funciona para `onClick`, mas e `disabled`? E `className`? E `aria-label`? Cada vez que alguém precisar de uma nova prop nativa, teria que voltar ao componente e adicioná-la manualmente. Isso é:

1. **Trabalhoso** — dezenas de props para declarar
2. **Incompleto** — sempre faltará alguma prop que alguém precisa
3. **Propenso a erros** — a tipagem manual pode divergir da tipagem real do elemento

## A solução: `React.ComponentProps`

O React exporta tipos utilitários que representam todas as props de cada elemento HTML nativo. O mais direto é `React.ComponentProps<"element">`.

```typescript
type ButtonProps = React.ComponentProps<"button"> & {
  name: string
}
```

O `&` (intersection type) combina todas as props nativas do button com as props customizadas. Resultado: o componente aceita TUDO que um `<button>` nativo aceita, mais a prop `name`.

## Analogia do instrutor

O instrutor demonstra abrindo o autocomplete (`Ctrl+Space`) em um `<button>` nativo — a lista de propriedades é enorme. "Imagina pegar uma por uma e ficar repassando aqui? Ficaria muito gigante, trabalhoso."

A extensão de tipo é como dizer: "meu componente é um button com superpoderes" — ele tem tudo que um button tem, mais o que eu adicionar.

## O erro sutil: aceitar mas não repassar

Um ponto crítico demonstrado na aula: após adicionar `React.ComponentProps<"button">` ao tipo, o TypeScript para de reclamar no componente pai — ele aceita `onClick`. **Porém, o onClick ainda não funciona** até que o componente filho efetivamente repasse a prop para o elemento nativo.

```typescript
// TIPO aceita onClick, mas o componente IGNORA
function Button({ name }: ButtonProps) {
  return <button>{name}</button> // onClick perdido!
}

// CORRETO: repassa onClick para o elemento
function Button({ name, onClick }: ButtonProps) {
  return <button onClick={onClick}>{name}</button>
}
```

O instrutor destaca isso ao mostrar que, mesmo após ajustar o tipo, o clique "ainda não funciona" — só funciona após repassar a prop.

## Variantes do utilitário de tipos

| Utilitário | Quando usar |
|-----------|-------------|
| `React.ComponentProps<"button">` | Componente simples sem ref |
| `React.ComponentPropsWithRef<"button">` | Componente que precisa aceitar `ref` |
| `React.ComponentPropsWithoutRef<"button">` | Explicitamente sem ref |

## Aplicabilidade universal

O instrutor enfatiza: "isso vai se aplicar a outros elementos HTML também". O padrão é idêntico para `<input>`, `<div>`, `<a>`, `<select>`, etc.:

```typescript
type InputProps = React.ComponentProps<"input"> & { label: string }
type LinkProps = React.ComponentProps<"a"> & { isExternal: boolean }
type CardProps = React.ComponentProps<"div"> & { variant: "primary" | "secondary" }
```

## Spread pattern para repassar todas as props

Em vez de desestruturar cada prop individualmente, use spread para repassar tudo automaticamente:

```typescript
function Button({ name, ...rest }: ButtonProps) {
  return <button {...rest}>{name}</button>
}
```

Isso garante que qualquer prop nativa (onClick, disabled, className, aria-*) seja repassada sem necessidade de listá-las explicitamente.