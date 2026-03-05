# Code Examples: TDD para Renderizacao de Listas

## 1. Definicao do tipo Prompt

```typescript
// types/prompt.ts
export type Prompt = {
  id: string
  title: string
  content: string
}

export type SidebarContentProps = {
  prompts: Prompt[]
}
```

## 2. makeSUT com default props

```typescript
const initialPrompts: Prompt[] = [
  { id: '1', title: 'Title 01', content: 'Content 01' },
]

function makeSUT(props?: Partial<SidebarContentProps>) {
  return render(
    <SidebarContent prompts={initialPrompts} {...props} />
  )
}
```

O spread `{...props}` sobrescreve o default quando voce passa valores customizados. Se nao passar nada, usa `initialPrompts`.

## 3. Teste basico — item aparece em tela

```typescript
describe('Base', () => {
  it('should render the create new prompt button', () => {
    makeSUT()
    expect(screen.getByText('Criar novo prompt')).toBeInTheDocument()
  })

  it('should render the prompts list', () => {
    makeSUT()
    expect(screen.getByText(initialPrompts[0].title)).toBeInTheDocument()
  })
})
```

## 4. Teste com input customizado e validacao de quantidade

```typescript
it('should render the prompts list', () => {
  const input = {
    prompts: [
      { id: '1', title: 'Example 01', content: 'Content 01' },
      { id: '2', title: 'Example 02', content: 'Content 02' },
    ],
  }
  makeSUT(input)

  expect(screen.getAllByRole('paragraph')).toHaveLength(input.prompts.length)
  expect(screen.getByText(input.prompts[0].title)).toBeInTheDocument()
})
```

### Por que `input.prompts.length` e nao `2`?

Se voce hardcoda o numero, o teste nao acompanha mudancas no input. Usando `.length`, o teste e dinamico e auto-documentado.

### Verificacao do instrutor

O instrutor testa com `.toHaveLength(3)` quando so tem 2 itens para provar que nao e falso positivo:
> "Esperava 3 e recebi 2. Entao nao e um falso positivo."

## 5. Implementacao minima (Green phase)

```typescript
// components/sidebar-content.tsx
import { SidebarContentProps } from '@/types/prompt'

export function SidebarContent({ prompts }: SidebarContentProps) {
  return (
    <div>
      <button>Criar novo prompt</button>
      {prompts.map((prompt) => (
        <p key={prompt.id}>{prompt.title}</p>
      ))}
    </div>
  )
}
```

Isso e intencionalmente simples — `<p>` em vez de componente visual elaborado. O visual vem na fase de Refactor. O teste garante que, ao substituir `<p>` por `<PromptCard>`, o comportamento nao quebra.

## 6. Script de watch mode

```json
{
  "scripts": {
    "test:watch": "vitest --watch"
  }
}
```

Rodar com `npm run test:watch` para feedback continuo durante TDD.

## 7. Uso de .only e .skip durante desenvolvimento

```typescript
// Isolar teste atual
it.only('should render the prompts list', () => {
  // ...
})

// Pular temporariamente
it.skip('should render the create new prompt button', () => {
  // ...
})
```

O instrutor mostra que testes skipados aparecem de forma diferente no output e que `.only` foca apenas no teste em desenvolvimento, reduzindo ruido.