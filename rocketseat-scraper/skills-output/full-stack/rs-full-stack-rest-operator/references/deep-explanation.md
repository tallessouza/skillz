# Deep Explanation: Rest Operator em Componentes React

## O problema que o rest operator resolve

Quando criamos componentes wrapper em React (um componente `Button` que renderiza um `<button>`, por exemplo), precisamos repassar propriedades do componente pai para o elemento nativo. A abordagem ingênua é listar cada propriedade explicitamente:

```tsx
function Button({ onClick, disabled, type, className, children }) {
  return <button onClick={onClick} disabled={disabled} type={type} className={className}>{children}</button>
}
```

Isso tem dois problemas graves:

1. **Manutenção infinita** — um `<button>` HTML tem dezenas de propriedades válidas (`aria-label`, `form`, `formAction`, `tabIndex`, etc.). Listar todas é impraticável.
2. **Funcionalidade perdida silenciosamente** — se o consumidor passa `disabled` mas o wrapper não desestrutura `disabled`, o botão simplesmente não desabilita. Nenhum erro é lançado. O bug é silencioso.

## Como o rest operator funciona

O rest operator (`...`) na desestruturação captura **todas as propriedades que não foram explicitamente extraídas** em um novo objeto:

```tsx
const props = { variant: 'primary', onClick: handleClick, disabled: true }
const { variant, ...rest } = props
// variant = 'primary'
// rest = { onClick: handleClick, disabled: true }
```

Quando espalhamos `{...rest}` no JSX, cada propriedade do objeto `rest` é aplicada individualmente ao elemento:

```tsx
<button {...rest} />
// Equivale a: <button onClick={handleClick} disabled={true} />
```

## A analogia do instrutor

O instrutor demonstra isso de forma prática: ao remover o `onClick` explícito, o botão "perde a função" — o alert não aparece mais. Isso mostra o problema silencioso de não repassar props. Ao adicionar `...rest`, **todas** as propriedades voltam a funcionar de uma vez.

O instrutor enfatiza: "Olha a porrada de propriedades que aparece, tudo que um botão tem" — ao usar autocomplete no componente que estende `ComponentProps<'button'>`, o desenvolvedor vê todas as props nativas disponíveis. Isso é o poder da combinação rest operator + tipagem estendida.

## Padrão: extrair customizadas, repassar nativas

A regra geral é:

1. **Props que você criou** (variant, size, isLoading) → extraia explicitamente
2. **Props do elemento HTML nativo** (onClick, disabled, className) → capture com `...rest` e repasse

```tsx
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

function Button({ variant = 'primary', isLoading = false, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? 'Carregando...' : rest.children}
    </button>
  )
}
```

## Quando interceptar uma prop

Às vezes você precisa usar uma prop nativa E repassá-la. Por exemplo, `className` — você quer adicionar sua classe mas também aceitar classes externas:

```tsx
function Button({ variant, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className ?? ''}`}
      {...rest}
    />
  )
}
```

Neste caso, `className` é extraída explicitamente para manipulação, mas o restante continua sendo repassado via `...rest`.

## Edge cases

- **Ordem importa no spread**: `{...rest}` antes de `className={}` faz a prop explícita sobrescrever. `className={}` antes de `{...rest}` permite que o consumidor sobrescreva. Escolha conscientemente.
- **ref forwarding**: Para componentes que precisam receber `ref`, use `React.forwardRef` junto com rest operator.
- **Performance**: O spread operator cria um novo objeto a cada render, mas isso é negligível e o React já lida bem com isso.