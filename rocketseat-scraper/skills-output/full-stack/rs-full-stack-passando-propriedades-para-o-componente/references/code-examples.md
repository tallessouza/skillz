# Code Examples: Passando Propriedades Para Componentes React

## Exemplo 1: Componente estatico (antes de props)

O ponto de partida — componente com informacao fixa:

```tsx
// Button.tsx — componente estatico
function Button() {
  return <button>Clique aqui</button>
}

export default Button
```

```tsx
// App.tsx — tres botoes identicos
import Button from './components/Button'

function App() {
  return (
    <>
      <Button />
      <Button />
      <Button />
    </>
  )
}
```

Resultado: tres botoes, todos com "Clique aqui". Sem flexibilidade.

## Exemplo 2: Passando prop sem tipagem (intermediario)

Primeiro passo — passar a prop, receber com `props`:

```tsx
// App.tsx
<Button name="Criar" />
<Button name="Editar" />
<Button name="Remover" />
```

```tsx
// Button.tsx — recebendo via props (sem tipo)
function Button(props) {
  return <button>{props.name}</button>
}
```

Funciona, mas o TypeScript reclama: tipo `any` no parametro.

## Exemplo 3: Tipando props com type

Adicionar tipagem para seguranca:

```tsx
// Button.tsx — com tipagem
type Props = {
  name: string
}

function Button(props: Props) {
  return <button>{props.name}</button>
}

export default Button
```

Agora o TypeScript valida que todo `<Button>` recebe `name` como string.

## Exemplo 4: Desestruturando props (forma preferida)

Eliminando o prefixo `props.`:

```tsx
// Button.tsx — desestruturado
type Props = {
  name: string
}

function Button({ name }: Props) {
  return <button>{name}</button>
}

export default Button
```

```tsx
// App.tsx
import Button from './components/Button'

function App() {
  return (
    <>
      <Button name="Criar" />
      <Button name="Editar" />
      <Button name="Remover" />
    </>
  )
}
```

Resultado: tres botoes com textos diferentes, mesmo componente.

## Exemplo 5: Erro comum — esquecer as chaves

```tsx
// ERRADO — renderiza o texto literal "name"
function Button({ name }: Props) {
  return <button>name</button>
}
```

```tsx
// CORRETO — renderiza o valor da variavel name
function Button({ name }: Props) {
  return <button>{name}</button>
}
```

## Exemplo 6: Erro comum — omitir prop obrigatoria

```tsx
// ERRO do TypeScript:
// Property 'name' is missing in type '{}' but required in type 'Props'
<Button />
```

```tsx
// CORRETO
<Button name="Salvar" />
```

## Variacao: Multiplas props

Expandindo o padrao para mais propriedades:

```tsx
type ButtonProps = {
  name: string
  variant: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

function Button({ name, variant, disabled = false }: ButtonProps) {
  return (
    <button className={variant} disabled={disabled}>
      {name}
    </button>
  )
}
```

```tsx
// Uso
<Button name="Criar" variant="primary" />
<Button name="Editar" variant="secondary" />
<Button name="Remover" variant="danger" disabled />
```

## Variacao: Prop com valor dinamico (expressao)

```tsx
const actionLabel = 'Confirmar'
const count = 3

// String simples — aspas
<Button name="Salvar" />

// Variavel — chaves
<Button name={actionLabel} />

// Expressao — chaves
<Button name={`Remover (${count})`} />
```

## Variacao: Props com children

Padrao alternativo usando `children` em vez de prop nomeada:

```tsx
type ButtonProps = {
  children: React.ReactNode
}

function Button({ children }: ButtonProps) {
  return <button>{children}</button>
}

// Uso
<Button>Criar</Button>
<Button>Editar</Button>
<Button>
  <span>Remover</span>
</Button>
```