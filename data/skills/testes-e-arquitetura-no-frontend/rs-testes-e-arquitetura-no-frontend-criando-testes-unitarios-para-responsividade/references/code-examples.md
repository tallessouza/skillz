# Code Examples: Testes Unitarios para Responsividade

## Exemplo completo da aula

### Componente sendo testado (SidebarContent)

O componente tem um estado `mobile` que controla a visibilidade do sidebar:

```typescript
// Estado default: mobile = false
const [mobile, setMobile] = useState(false)

// Classes condicionais baseadas no estado
<aside className={`... ${mobile ? 'translate-x-0' : '-translate-x-full'} ...`}>
  {/* conteudo do sidebar */}
</aside>

// Botao para abrir (visivel apenas em mobile via CSS)
<button onClick={() => setMobile(true)} aria-label="Abrir menu">
  {/* icone hamburger */}
</button>

// Botao para fechar (dentro do sidebar)
<button onClick={() => setMobile(false)} aria-label="Fechar menu">
  {/* icone X */}
</button>
```

### Teste completo

```typescript
describe('SidebarContent Mobile', () => {
  it('deve abrir e fechar o menu mobile', async () => {
    // makeSut() renderiza o componente e retorna userEvent setup
    const { user } = makeSut()

    // Busca o aside pela role semantica
    const aside = screen.getByRole('complementary')

    // 1. Verifica estado default (menu fechado)
    expect(aside.className).toContain('-translate-x-full')

    // 2. Clica no botao de abrir
    const openButton = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(openButton)

    // 3. Verifica que o menu abriu
    expect(aside.className).toContain('translate-x-0')

    // 4. Clica no botao de fechar
    const closeButton = screen.getByRole('button', { name: /fechar menu/i })
    await user.click(closeButton)

    // 5. Verifica que o menu voltou ao estado fechado
    expect(aside.className).toContain('-translate-x-full')
  })
})
```

### Coverage antes do teste

```
Statements: 99.1%
Branches:   98%
Functions:  95%    ← gap era o codigo mobile na linha 88
```

### Coverage depois do teste

```
Statements: 100%
Branches:   100%
Functions:  100%
```

## Variacoes do padrao

### Testando drawer/modal mobile

```typescript
it('deve abrir e fechar o drawer mobile', async () => {
  const { user } = makeSut()
  const drawer = screen.getByRole('dialog')

  expect(drawer.className).toContain('opacity-0')
  expect(drawer.className).toContain('pointer-events-none')

  await user.click(screen.getByRole('button', { name: /menu/i }))
  expect(drawer.className).toContain('opacity-100')
  expect(drawer.className).toContain('pointer-events-auto')

  await user.click(screen.getByRole('button', { name: /fechar/i }))
  expect(drawer.className).toContain('opacity-0')
})
```

### Testando navigation mobile com overlay

```typescript
it('deve mostrar overlay ao abrir menu mobile', async () => {
  const { user } = makeSut()

  const overlay = screen.getByTestId('mobile-overlay')
  expect(overlay.className).toContain('hidden')

  await user.click(screen.getByRole('button', { name: /abrir menu/i }))
  expect(overlay.className).not.toContain('hidden')
  expect(overlay.className).toContain('fixed')
})
```

### Comando para rodar coverage

```bash
pnpm run coverage
```