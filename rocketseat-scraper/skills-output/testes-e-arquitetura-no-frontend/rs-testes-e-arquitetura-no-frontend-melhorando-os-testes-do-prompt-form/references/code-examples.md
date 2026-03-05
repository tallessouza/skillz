# Code Examples: Melhorando Testes do PromptForm

## Setup completo do teste de update

```typescript
// Mocks separados para cada action
const createActionMock = vi.fn()
const updateActionMock = vi.fn()

// Mock do update com TODOS os campos que o componente consome
updateActionMock.mockResolvedValueOnce({
  success: true,
  message: 'Prompt atualizado com sucesso',
})

// Prompt existente para o modo de edicao
const prompt = {
  id: '1',
  title: 'old title',
  contents: 'old content',
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## makeSUT com props opcionais

```typescript
// Antes: sem suporte a props
function makeSUT() {
  render(<PromptForm />)
}

// Depois: aceita prompt opcional para modo edit
function makeSUT(props: Partial<PromptFormProps> = {}) {
  render(<PromptForm {...props} />)
}

// Uso nos testes de criacao (sem mudanca)
makeSUT()

// Uso nos testes de edicao
makeSUT({ prompt })
```

## Teste completo de update

```typescript
it('should update an existing prompt successfully', async () => {
  updateActionMock.mockResolvedValueOnce({
    success: true,
    message: 'Prompt atualizado com sucesso',
  })

  const prompt = {
    id: '1',
    title: 'old title',
    contents: 'old content',
    createdAt: now,
    updatedAt: now,
  }

  makeSUT({ prompt })

  // Captura dos elementos
  const titleInput = screen.getByPlaceholderText('Título do prompt')
  const contentInput = screen.getByPlaceholderText('Digite o conteúdo do prompt')

  // CRITICO: limpar antes de digitar
  await user.clear(titleInput)
  await user.type(titleInput, 'new title')

  await user.clear(contentInput)
  await user.type(contentInput, 'new content')

  // Submit
  const submitButton = screen.getByRole('button', { name: 'Salvar' })
  await user.click(submitButton)

  // Verificacoes
  expect(updateActionMock).toHaveBeenCalledWith({
    id: prompt.id,
    title: 'new title',
    content: 'new content',
  })

  expect(toastSuccess).toHaveBeenCalledWith('Prompt atualizado com sucesso')
  expect(refreshMock).toHaveBeenCalledTimes(1)
})
```

## Padroes de verificacao pos-submit

```typescript
// Verificar que a action correta foi chamada com os dados corretos
expect(updateActionMock).toHaveBeenCalledWith({
  id: prompt.id,
  title: 'new title',
  content: 'new content',
})

// Verificar feedback ao usuario
expect(toastSuccess).toHaveBeenCalledWith('Prompt atualizado com sucesso')

// Verificar refresh chamado exatamente 1 vez
expect(refreshMock).toHaveBeenCalledTimes(1)
```

## Exemplo de como NAO duplicar cenarios

```typescript
// NO TESTE UNITARIO da action (ja feito):
it('should return error when update fails', async () => {
  // ... testado aqui
})

// NO TESTE DE INTEGRACAO do form:
// NAO repita o cenario de erro!
// Apenas teste o fluxo de sucesso do update
it('should update an existing prompt successfully', async () => {
  // ... apenas sucesso
})
```