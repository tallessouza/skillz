# Code Examples: Tailwind CSS — Construção de Aplicação Completa

## Página de Signup completa

```html
<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Criar conta</h1>

    <form onsubmit="handleSubmit(event)" class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          name="name"
          required
          class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          name="email"
          required
          class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          name="password"
          required
          class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Cadastrar
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      Já tem uma conta?
      <a href="/signin" class="font-medium text-blue-600 hover:text-blue-500">Entrar</a>
    </p>
  </div>
</div>
```

## Componente Input reutilizável

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
               focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

// Uso
<Input label="E-mail" type="email" name="email" required />
<Input label="Senha" type="password" name="password" required />
```

## Layout com header por grupo de rotas

```tsx
// layouts/EmployeeLayout.tsx
function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b bg-white shadow-sm">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 class="text-lg font-semibold text-gray-900">Portal do Funcionário</h1>
          <nav class="flex gap-4">
            <a href="/employee/new" class="text-sm text-gray-600 hover:text-gray-900">
              Nova solicitação
            </a>
            <a href="/employee/requests" class="text-sm text-gray-600 hover:text-gray-900">
              Minhas solicitações
            </a>
          </nav>
        </div>
      </header>
      <main class="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}

// layouts/ManagerLayout.tsx
function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b bg-white shadow-sm">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 class="text-lg font-semibold text-gray-900">Gerenciamento</h1>
          <nav class="flex gap-4">
            <a href="/manager" class="text-sm text-gray-600 hover:text-gray-900">
              Solicitações
            </a>
          </nav>
        </div>
      </header>
      <main class="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}
```

## Roteamento por permissão do usuário

```tsx
// routes/index.tsx
function AppRoutes() {
  const user = useAuth()

  // Sem autenticação → páginas de auth
  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    )
  }

  // Sem role → página de criar conta/perfil
  if (!user.role) {
    return (
      <Routes>
        <Route path="/" element={<CreateAccount />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  // Employee
  if (user.role === "employee") {
    return (
      <EmployeeLayout>
        <Routes>
          <Route path="/" element={<NewRequest />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </EmployeeLayout>
    )
  }

  // Manager
  if (user.role === "manager") {
    return (
      <ManagerLayout>
        <Routes>
          <Route path="/" element={<RefundList />} />
          <Route path="/refund/:id" element={<RefundDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ManagerLayout>
    )
  }
}
```

## Upload de arquivo estilizado

```tsx
function FileUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [fileName, setFileName] = useState<string | null>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileSelect(file)
    }
  }

  return (
    <div>
      <label
        class="flex cursor-pointer items-center justify-center gap-2 rounded-md
               border-2 border-dashed border-gray-300 px-6 py-4 text-sm text-gray-600
               transition-colors hover:border-gray-400 hover:text-gray-700"
      >
        <input type="file" class="hidden" onChange={handleChange} />
        {fileName ? fileName : "Selecionar comprovante"}
      </label>
    </div>
  )
}
```

## Lista com pesquisa e paginação (Manager)

```tsx
function RefundList() {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div class="space-y-6">
      {/* Barra de pesquisa */}
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="Pesquisar solicitação..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          class="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm
                 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
                 hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* Lista de itens */}
      <div class="divide-y rounded-md border bg-white">
        {refunds.map((refund) => (
          <a
            key={refund.id}
            href={`/manager/refund/${refund.id}`}
            class="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span class="text-sm text-gray-900">{refund.description}</span>
            <span class="text-xs text-gray-500">{refund.date}</span>
          </a>
        ))}
      </div>

      {/* Paginação */}
      <div class="flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          class="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
        >
          Anterior
        </button>
        <span class="text-sm text-gray-600">Página {currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          class="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
```

## Detalhe read-only com botão de comprovante

```tsx
function RefundDetail() {
  const { id } = useParams()
  const refund = useRefund(id)

  return (
    <div class="mx-auto max-w-2xl space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Solicitação #{id}</h2>

      <div class="space-y-4 rounded-md border bg-white p-6">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
          <input
            type="text"
            value={refund.description}
            readOnly
            class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm
                   text-gray-700"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Valor</label>
          <input
            type="text"
            value={refund.amount}
            readOnly
            class="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm
                   text-gray-700"
          />
        </div>

        <button
          onClick={() => window.open(refund.receiptUrl)}
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700
                 hover:bg-gray-200"
        >
          Exibir comprovante
        </button>
      </div>
    </div>
  )
}
```

## Evento de submit do formulário

```tsx
function SignUpForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    console.log(userData)
    // Enviar para API...
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <Input label="Nome" type="text" name="name" required />
      <Input label="E-mail" type="email" name="email" required />
      <Input label="Senha" type="password" name="password" required />
      <button
        type="submit"
        class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
               hover:bg-blue-700"
      >
        Cadastrar
      </button>
    </form>
  )
}
```