# Code Examples: Estendendo Propriedades de Elementos HTML

## Exemplo 1: Button básico (da aula)

### Antes — props manuais

```typescript
type ButtonProps = {
  name: string
  onClick: () => void
}

function Button({ name, onClick }: ButtonProps) {
  return <button onClick={onClick}>{name}</button>
}

// Uso
<Button name="Criar" onClick={() => alert("Criado!")} />

// PROBLEMA: e se quiser disabled? className? type="submit"?
// Teria que adicionar cada um manualmente ao tipo
```

### Depois — props estendidas

```typescript
type ButtonProps = React.ComponentProps<"button"> & {
  name: string
}

function Button({ name, onClick, ...rest }: ButtonProps) {
  return (
    <button onClick={onClick} {...rest}>
      {name}
    </button>
  )
}

// Uso — agora aceita QUALQUER prop nativa
<Button name="Criar" onClick={() => alert("Criado!")} />
<Button name="Salvar" disabled={isLoading} className="btn-primary" />
<Button name="Enviar" type="submit" aria-label="Enviar formulário" />
```

## Exemplo 2: Input com label

```typescript
type InputProps = React.ComponentProps<"input"> & {
  label: string
}

function Input({ label, ...rest }: InputProps) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  )
}

// Uso
<Input label="Email" type="email" placeholder="Digite seu email" required />
<Input label="Senha" type="password" minLength={8} />
```

## Exemplo 3: Link com indicador externo

```typescript
type LinkProps = React.ComponentProps<"a"> & {
  isExternal?: boolean
}

function Link({ isExternal, children, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
      {isExternal && " ↗"}
    </a>
  )
}

// Uso
<Link href="/about">Sobre</Link>
<Link href="https://example.com" isExternal>Exemplo</Link>
```

## Exemplo 4: Card com variantes

```typescript
type CardProps = React.ComponentProps<"div"> & {
  variant: "default" | "highlighted"
}

function Card({ variant, className, children, ...rest }: CardProps) {
  return (
    <div
      className={`card card-${variant} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  )
}

// Uso
<Card variant="highlighted" onClick={() => selectCard(id)}>
  <h2>Título</h2>
  <p>Conteúdo</p>
</Card>
```

## Exemplo 5: Omitindo props nativas

Quando o componente wrapper precisa controlar uma prop nativa internamente:

```typescript
// Omite "type" porque o componente sempre será submit
type SubmitButtonProps = Omit<React.ComponentProps<"button">, "type"> & {
  label: string
}

function SubmitButton({ label, ...rest }: SubmitButtonProps) {
  return (
    <button type="submit" {...rest}>
      {label}
    </button>
  )
}

// Uso — não permite alterar type
<SubmitButton label="Enviar" disabled={!isValid} />
```

## Exemplo 6: Com forwardRef

Quando o componente pai precisa acessar a ref do elemento nativo:

```typescript
import { forwardRef } from "react"

type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  name: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ name, ...rest }, ref) => {
    return (
      <button ref={ref} {...rest}>
        {name}
      </button>
    )
  }
)

// Uso com ref
const buttonRef = useRef<HTMLButtonElement>(null)
<Button ref={buttonRef} name="Focar" onClick={() => buttonRef.current?.focus()} />
```

## Padrão spread vs. desestruturação explícita

### Spread (recomendado para maioria dos casos)

```typescript
function Button({ name, ...rest }: ButtonProps) {
  return <button {...rest}>{name}</button>
}
```

### Desestruturação explícita (quando precisa manipular props)

```typescript
function Button({ name, onClick, className, ...rest }: ButtonProps) {
  return (
    <button
      onClick={(e) => {
        console.log("Clicked")
        onClick?.(e)
      }}
      className={`custom-btn ${className ?? ""}`}
      {...rest}
    >
      {name}
    </button>
  )
}
```