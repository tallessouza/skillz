# Code Examples: Implementando Barra de Pesquisa com TDD

## Teste completo com AAA

```typescript
describe('Sidebar', () => {
  it('should update search field when typing', async () => {
    // Arrange
    const { user } = makeSut()
    const searchInput = screen.getByPlaceholderText('Buscar prompts...')
    const text = 'AI'

    // Act
    await user.type(searchInput, text)

    // Assertion
    expect(searchInput).toHaveValue(text)
  })
})
```

### Notas:
- `makeSut()` retorna o setup padrao (renderiza o componente + user events)
- `async/await` necessario porque `user.type` e assincrono
- A variavel `text` e criada no Arrange para reutilizar no Act e Assertion

## Estrutura do componente na sidebar

```tsx
// Dentro do componente Sidebar, quando nao esta colapsado
{!isCollapsed && (
  <section style={{ marginBottom: '20px' }}>
    <form>
      <Input
        name="query"
        type="text"
        placeholder="Buscar prompts..."
        autoFocus
      />
    </form>
  </section>
)}
```

### Notas:
- `section` com `marginBottom` de 20px para separacao visual
- `form` envolve o input (semantica HTML)
- `autoFocus` para focar automaticamente quando a sidebar abre
- `value` e `onChange` serao adicionados depois (componente controlado)

## Comparacao: teste com Act vs sem Act

### Com Act (acao do usuario):
```typescript
it('should update search field when typing', async () => {
  // Arrange
  const { user } = makeSut()
  const searchInput = screen.getByPlaceholderText('Buscar prompts...')
  const text = 'AI'

  // Act
  await user.type(searchInput, text)

  // Assertion
  expect(searchInput).toHaveValue(text)
})
```

### Sem Act (verificacao de renderizacao):
```typescript
it('should show navigation links when expanded', () => {
  // Arrange
  makeSut()

  // Assertion (sem Act — apenas verifica presenca)
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Settings')).toBeInTheDocument()
})
```

## Organizacao visual com comentarios AAA

```typescript
it('should collapse sidebar when clicking toggle', async () => {
  // Arrange
  const { user } = makeSut()
  const toggleButton = screen.getByRole('button', { name: /toggle/i })

  // Act
  await user.click(toggleButton)

  // Assertion
  expect(screen.queryByText('Home')).not.toBeInTheDocument()
})
```

O instrutor recomenda deixar os blocos AAA visualmente separados com comentarios para que qualquer pessoa consiga ler e entender a estrutura do teste rapidamente.