# Code Examples: Rest Operator em Componentes React

## Exemplo 1: Botão básico (do transcript)

### Sem rest operator (funcionalidade perdida)

```tsx
interface ButtonProps {
  title: string
  onClick?: () => void
}

function Button({ title, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {title}
    </button>
  )
}

// No App.tsx
<Button title="Criar" onClick={() => alert('Criou!')} />
// Funciona, mas...

<Button title="Editar" onClick={() => alert('Editou!')} disabled />
// disabled é IGNORADO silenciosamente — o botão não desabilita
```

### Com rest operator (todas as props funcionam)

```tsx
interface ButtonProps extends React.ComponentProps<'button'> {
  title: string
}

function Button({ title, ...rest }: ButtonProps) {
  return (
    <button {...rest}>
      {title}
    </button>
  )
}

// No App.tsx — todas essas props funcionam automaticamente:
<Button title="Criar" onClick={() => alert('Criou!')} />
<Button title="Editar" onClick={() => alert('Editou!')} disabled />
<Button title="Salvar" type="submit" form="myForm" aria-label="Salvar dados" />
```

## Exemplo 2: Input com label

```tsx
interface InputFieldProps extends React.ComponentProps<'input'> {
  label: string
}

function InputField({ label, ...rest }: InputFieldProps) {
  return (
    <div className="field">
      <label>{label}</label>
      <input {...rest} />
    </div>
  )
}

// Uso — todas as props de input funcionam
<InputField label="Email" type="email" placeholder="seu@email.com" required />
<InputField label="Senha" type="password" minLength={8} autoComplete="current-password" />
```

## Exemplo 3: Link wrapper

```tsx
interface NavLinkProps extends React.ComponentProps<'a'> {
  isActive?: boolean
}

function NavLink({ isActive = false, className, ...rest }: NavLinkProps) {
  return (
    <a
      className={`nav-link ${isActive ? 'active' : ''} ${className ?? ''}`}
      {...rest}
    />
  )
}

// Uso
<NavLink href="/home" isActive>Home</NavLink>
<NavLink href="/about" target="_blank" rel="noopener">About</NavLink>
```

## Exemplo 4: Combinando com variant pattern

```tsx
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className ?? ''}`}
      {...rest}
    />
  )
}

// Uso — props customizadas + nativas coexistem
<Button variant="danger" size="lg" onClick={handleDelete} disabled={isDeleting}>
  Deletar
</Button>
```

## Exemplo 5: Textarea wrapper

```tsx
interface TextAreaProps extends React.ComponentProps<'textarea'> {
  error?: string
}

function TextArea({ error, ...rest }: TextAreaProps) {
  return (
    <div>
      <textarea
        className={error ? 'input-error' : ''}
        {...rest}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

// Uso
<TextArea
  rows={5}
  maxLength={500}
  placeholder="Descreva o problema..."
  error={errors.description}
  onChange={handleChange}
/>
```

## Exemplo 6: Com forwardRef (para refs externas)

```tsx
import { forwardRef } from 'react'

interface InputProps extends React.ComponentProps<'input'> {
  label: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, ...rest }, ref) => {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} {...rest} />
    </div>
  )
})

// Uso com ref
const inputRef = useRef<HTMLInputElement>(null)
<Input ref={inputRef} label="Buscar" type="search" onFocus={() => console.log('focused')} />
```