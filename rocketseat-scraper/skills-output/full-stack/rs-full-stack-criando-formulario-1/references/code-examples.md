# Code Examples: Criando Formulário com Tailwind CSS

## Exemplo completo da aula

### Página de reembolso (refund page)

```tsx
import { Input } from "../components/input"

export function Refund() {
  return (
    <form className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512px]">
      <header>
        <h1 className="text-xl font-bold text-gray-100">
          Solicitação de Reembolso
        </h1>
        <p className="text-sm text-gray-200 mt-2 mb-4">
          Dados da despesa para solicitar reembolso.
        </p>
      </header>

      <Input required legend="Nome da solicitação" />
    </form>
  )
}
```

## Variações

### Form com múltiplos campos

```tsx
<form className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512px]">
  <header>
    <h1 className="text-xl font-bold text-gray-100">
      Solicitação de Reembolso
    </h1>
    <p className="text-sm text-gray-200 mt-2 mb-4">
      Dados da despesa para solicitar reembolso.
    </p>
  </header>

  <Input required legend="Nome da solicitação" />
  <Input required legend="Valor" type="number" />
  <Input required legend="Data da despesa" type="date" />
  <Input legend="Observações" />
</form>
```

### Form com breakpoint diferente (md ao invés de lg)

```tsx
<form className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 md:min-w-[480px]">
  {/* Para telas médias, min-width menor */}
</form>
```

### Classe do form decomposta

```
bg-gray-500       → fundo escuro do card
w-full            → largura total do container pai
rounded-xl        → bordas arredondadas grandes
flex              → ativa flexbox
flex-col          → empilha filhos verticalmente
p-10              → padding 2.5rem em todas as direções
gap-6             → espaçamento 1.5rem entre filhos
lg:min-w-[512px]  → largura mínima 512px apenas em telas lg+
```

### Tipografia decomposta

```
// H1 do form
text-xl       → font-size: 1.25rem (20px)
font-bold     → font-weight: 700
text-gray-100 → cor clara para destaque

// Parágrafo descritivo
text-sm       → font-size: 0.875rem (14px)
text-gray-200 → cor intermediária, menos destaque
mt-2          → margin-top: 0.5rem (afasta do h1)
mb-4          → margin-bottom: 1rem (afasta dos campos)
```

### Contexto: form dentro do layout com Outlet

```tsx
// AppLayout.tsx
export function AppLayout() {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <main className="flex justify-center w-full">
        <Outlet /> {/* O form é renderizado aqui */}
      </main>
    </div>
  )
}
```

O form herda a centralização do `<main>` que tem `flex justify-center`, por isso não precisa de margin auto ou container próprio.