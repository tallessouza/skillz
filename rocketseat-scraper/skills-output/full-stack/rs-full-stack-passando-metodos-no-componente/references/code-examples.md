# Code Examples: Passando Métodos como Props em Componentes React

## Exemplo 1: Padrão básico da aula

### Definição do tipo com callback opcional

```tsx
interface ButtonProps {
  title: string
  onClick?: () => void
}
```

O `?` torna o `onClick` opcional. A notação `() => void` define uma função sem parâmetros e sem retorno.

### Componente que recebe e repassa

```tsx
function Button({ title, onClick }: ButtonProps) {
  return <button onClick={onClick}>{title}</button>
}
```

O componente desestrutura as props e repassa `onClick` diretamente para o `<button>` nativo.

### Uso no componente pai

```tsx
function App() {
  return (
    <Button
      title="Criar"
      onClick={() => alert('Criado!')}
    />
  )
}
```

A arrow function passada como prop é executada quando o usuário clica no botão.

---

## Exemplo 2: Callback com parâmetros

```tsx
interface SearchInputProps {
  placeholder: string
  onSearch?: (query: string) => void
}

function SearchInput({ placeholder, onSearch }: SearchInputProps) {
  return (
    <input
      placeholder={placeholder}
      onChange={(e) => onSearch?.(e.target.value)}
    />
  )
}

// Uso
function App() {
  return (
    <SearchInput
      placeholder="Buscar..."
      onSearch={(query) => console.log('Buscando:', query)}
    />
  )
}
```

Aqui o callback recebe um parâmetro `query: string`. O `?.` garante que só chama se `onSearch` foi passado.

---

## Exemplo 3: Múltiplos callbacks

```tsx
interface CardProps {
  title: string
  onEdit?: () => void
  onDelete?: () => void
}

function Card({ title, onEdit, onDelete }: CardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Excluir</button>
    </div>
  )
}

// Uso
function App() {
  return (
    <Card
      title="Meu Item"
      onEdit={() => console.log('Editando')}
      onDelete={() => confirm('Tem certeza?')}
    />
  )
}
```

---

## Exemplo 4: Callback obrigatória vs opcional

```tsx
// Callback OBRIGATÓRIA — sem ?
interface FormProps {
  onSubmit: (data: FormData) => void
}

// Callback OPCIONAL — com ?
interface TooltipProps {
  text: string
  onHover?: () => void
}
```

Use obrigatória quando o componente não faz sentido sem o callback (ex: form sem submit). Use opcional quando é um comportamento adicional (ex: tooltip com tracking).

---

## Exemplo 5: Diferentes tipos de props lado a lado

Demonstrando o ponto do instrutor sobre os diferentes tipos que props podem ter:

```tsx
interface CompleteComponentProps {
  // String
  title: string
  // Número
  count: number
  // Booleano
  isActive: boolean
  // Método (callback)
  onClick?: () => void
  onValueChange?: (value: number) => void
}

function CompleteComponent({
  title,
  count,
  isActive,
  onClick,
  onValueChange,
}: CompleteComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <span>{count}</span>
      {isActive && <span>Ativo</span>}
      <button onClick={onClick}>Ação</button>
      <input
        type="number"
        onChange={(e) => onValueChange?.(Number(e.target.value))}
      />
    </div>
  )
}
```

---

## Exemplo 6: Forwarding de evento nativo completo

```tsx
interface IconButtonProps {
  icon: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function IconButton({ icon, onClick }: IconButtonProps) {
  return (
    <button onClick={onClick}>
      <i className={icon} />
    </button>
  )
}

// Uso com acesso ao evento
function App() {
  return (
    <IconButton
      icon="fa-trash"
      onClick={(e) => {
        e.stopPropagation()
        console.log('Deletar clicado')
      }}
    />
  )
}
```