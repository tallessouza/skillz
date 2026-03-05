# Code Examples: Matchers do Jest

## 1. Diferenca pratica entre matchers

```typescript
// Elemento com opacity: 0 (animacao Framer Motion)
// <button style="opacity: 0">Novo Prompt</button>

// PASSA — elemento existe no DOM
expect(screen.getByText('Novo Prompt')).toBeInTheDocument()

// FALHA — elemento nao esta visivel (opacity: 0)
expect(screen.getByText('Novo Prompt')).toBeVisible()
```

## 2. Ajuste do componente para manter toBeVisible

```tsx
// ANTES: animacao com initial opacity 0
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <button hidden={isCollapsed}>Novo Prompt</button>
</motion.div>

// DEPOIS: initial={false} e sem hidden
<motion.div initial={false} animate={{ opacity: 1 }}>
  <button>Novo Prompt</button>
</motion.div>
```

## 3. Mock centralizado em jest.setup.ts

```typescript
// jest.setup.ts
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}))
```

## 4. Sobrescrevendo mock centralizado em teste especifico

```typescript
// prompt-card.spec.tsx
import { useRouter } from 'next/navigation'

const refreshMock = jest.fn()

// Sobrescreve apenas o que precisa
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: refreshMock,
  }),
}))
```

## 5. beforeEach com mockReset completo

```typescript
const deleteMock = jest.fn()
const refreshMock = jest.fn()

beforeEach(() => {
  deleteMock.mockReset()
  refreshMock.mockReset()
  ;(toast.success as jest.Mock).mockReset()
  ;(toast.error as jest.Mock).mockReset()
})
```

## 6. Verificacao de side effects: sucesso vs falha

```typescript
it('deveria remover com sucesso e chamar refresh', async () => {
  deleteMock.mockResolvedValue({ success: true })
  
  render(<PromptCard prompt={makeSut()} />)
  await userEvent.click(screen.getByRole('button', { name: /deletar/i }))
  
  expect(toast.success).toHaveBeenCalled()
  expect(refreshMock).toHaveBeenCalledTimes(1)
})

it('deveria exibir erro quando action falhar', async () => {
  deleteMock.mockResolvedValue({ success: false, error: 'Erro' })
  
  render(<PromptCard prompt={makeSut()} />)
  await userEvent.click(screen.getByRole('button', { name: /deletar/i }))
  
  expect(toast.error).toHaveBeenCalled()
  expect(refreshMock).not.toHaveBeenCalled()
})

it('deveria exibir erro quando action lancar excecao', async () => {
  deleteMock.mockRejectedValue(new Error('Network error'))
  
  render(<PromptCard prompt={makeSut()} />)
  await userEvent.click(screen.getByRole('button', { name: /deletar/i }))
  
  expect(toast.error).toHaveBeenCalled()
  expect(refreshMock).not.toHaveBeenCalled()
})
```

## 7. Validacao anti-falso-positivo

```typescript
// Tecnica do instrutor: inverter assertion para confirmar que quebra
expect(refreshMock).toHaveBeenCalledTimes(1) // passa ✓
expect(refreshMock).toHaveBeenCalledTimes(2) // quebra ✓ (nao e falso positivo)

expect(refreshMock).not.toHaveBeenCalled() // passa ✓
// Remove o "not" para validar:
expect(refreshMock).toHaveBeenCalled() // quebra ✓ (nao e falso positivo)
```

## 8. Usando makeSut para factory de props

```typescript
// Helper para criar props padrao
function makeSut(overrides?: Partial<Prompt>): Prompt {
  return {
    id: '1',
    title: 'Test Prompt',
    content: 'Test content',
    ...overrides,
  }
}

// Uso no teste
render(<PromptCard prompt={makeSut()} />)
render(<PromptCard prompt={makeSut({ title: 'Custom' })} />)
```