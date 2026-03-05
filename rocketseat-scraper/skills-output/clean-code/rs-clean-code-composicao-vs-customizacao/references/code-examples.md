# Code Examples: Composicao vs Customizacao

## Exemplo 1: Input com configuracao (o que evitar)

Componente original mostrado na aula — acumula props de configuracao:

```typescript
import { ReactNode } from 'react'

interface InputProps {
  label?: string
  icon?: ReactNode
  leftIcon?: ReactNode
  errorMessage?: string
}

export function Input({ label, icon = null, leftIcon = null, errorMessage }: InputProps) {
  return (
    <div>
      {label ? <label>{label}</label> : null}
      {leftIcon}
      <input />
      {icon}
      {errorMessage ? <span>{errorMessage}</span> : null}
    </div>
  )
}
```

Problemas vistos na aula:
- Para mover o icone de posicao, precisa de `leftIcon` + `icon` (duas props)
- Para passar `htmlFor` na label, precisaria de `labelProps` (horrivel)
- Cada nova variacao visual = nova prop + novo condicional

## Exemplo 2: Input com composicao (o correto)

```typescript
import { ComponentProps, ReactNode } from 'react'

interface RootProps {
  children: ReactNode
}

export function Root({ children }: RootProps) {
  return <div className="input-wrapper">{children}</div>
}

export function Label(props: ComponentProps<'label'>) {
  return <label {...props} />
}

export function Icon({ children }: { children: ReactNode }) {
  return <span>{children}</span>
}

export function ErrorMessage({ message }: { message: string }) {
  return <span>{message}</span>
}

export function FormField(props: ComponentProps<'input'>) {
  return <input {...props} />
}
```

## Exemplo 3: Uso no App — configuracao vs composicao

### Configuracao:
```typescript
import { Input } from './components/input.old'

<Input
  label="Nome"
  icon={<SearchIcon />}
  errorMessage="Digite seu nome corretamente"
/>
```

### Composicao:
```typescript
import * as Input from './components/input'

<Input.Root>
  <Input.Label htmlFor="name">Nome</Input.Label>
  <Input.FormField id="name" />
  <Input.Icon><SearchIcon /></Input.Icon>
  <Input.ErrorMessage message="Digite seu nome corretamente" />
</Input.Root>
```

## Exemplo 4: Reposicionamento de icone

Com composicao, mover o icone e trivial:

```typescript
// Icone depois do input
<Input.Root>
  <Input.FormField />
  <Input.Icon><SearchIcon /></Input.Icon>
</Input.Root>

// Icone antes do input — basta reordenar
<Input.Root>
  <Input.Icon><SearchIcon /></Input.Icon>
  <Input.FormField />
</Input.Root>
```

## Exemplo 5: Props nativas direto no sub-componente

```typescript
// Passar qualquer prop HTML nativa diretamente
<Input.Label htmlFor="name" id="name-label" className="custom-label">
  Nome
</Input.Label>
```

Sem composicao, seria necessario:
```typescript
// Horrivel — nao faca isso
<Input label="Nome" labelProps={{ htmlFor: 'name', id: 'name-label', className: 'custom-label' }} />
```

## Exemplo 6: Pattern real — TableOfContents (mencionado pelo instrutor)

```typescript
// Projeto Electron do instrutor
import * as TableOfContents from './components/table-of-contents'

<TableOfContents.Root>
  <TableOfContents.Section>
    <TableOfContents.Link href="#intro">Introducao</TableOfContents.Link>
    <TableOfContents.Link href="#setup">Setup</TableOfContents.Link>
  </TableOfContents.Section>
</TableOfContents.Root>
```

## Exemplo 7: Sidebar com composicao (mencionado pelo instrutor)

```typescript
import * as Sidebar from './components/sidebar'

<Sidebar.Root>
  <Sidebar.Section>
    <Sidebar.SectionTitle>Navegacao</Sidebar.SectionTitle>
    <Sidebar.SectionContent>
      <Sidebar.Link href="/home">Home</Sidebar.Link>
      <Sidebar.Link href="/settings">Settings</Sidebar.Link>
    </Sidebar.SectionContent>
  </Sidebar.Section>
</Sidebar.Root>
```