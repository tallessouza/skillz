# Code Examples: Pagina de Formulario em Next.js App Router

## Layout completo com header

```tsx
// app/(app)/layout.tsx
import { Header } from './header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        {children}
      </main>
    </div>
  )
}
```

## Header com border e spacing

```tsx
// Estilizacao do header para separacao visual
<div className="border-b pb-2 mb-2">
  {/* conteudo do header */}
</div>
```

## Pagina de criacao completa

```tsx
// app/(app)/create-organization/page.tsx
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateOrganization() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create organization</h1>

      <form className="space-y-4">
        {/* Nome da organizacao */}
        <div className="space-y-1">
          <Label htmlFor="name">Organization name</Label>
          <Input id="name" name="name" />
        </div>

        {/* Dominio com inputMode */}
        <div className="space-y-1">
          <Label htmlFor="domain">E-mail domain</Label>
          <Input
            id="domain"
            name="domain"
            type="text"
            inputMode="url"
            placeholder="example.com"
          />
        </div>

        {/* Checkbox com label descritiva */}
        <div className="flex items-baseline space-x-2">
          <Checkbox
            id="shouldAttachUsersByDomain"
            name="shouldAttachUsersByDomain"
          />
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Auto-join new members
            </span>
            <p className="text-sm text-muted-foreground">
              This will automatically invite all members with same email domain
              to this organization.
            </p>
          </label>
        </div>

        <Button type="submit" className="w-full">
          Save organization
        </Button>
      </form>
    </div>
  )
}
```

## Instalacao do componente Checkbox (ShadCN)

```bash
npx shadcn-ui@latest add checkbox
```

## Comparacao: items-center vs items-baseline

```tsx
{/* items-center: checkbox centraliza com TODO o bloco de texto */}
<div className="flex items-center space-x-2">
  <Checkbox />
  <label>
    <span>Titulo</span>
    <p>Descricao longa que pode quebrar em varias linhas...</p>
  </label>
</div>

{/* items-baseline: checkbox alinha com a PRIMEIRA LINHA do texto */}
<div className="flex items-baseline space-x-2">
  <Checkbox />
  <label>
    <span>Titulo</span>
    <p>Descricao longa que pode quebrar em varias linhas...</p>
  </label>
</div>
```

## Variacao: form reutilizavel para criar e editar

```tsx
interface OrganizationFormProps {
  initialData?: {
    name: string
    domain: string
    shouldAttachUsersByDomain: boolean
  }
}

export function OrganizationForm({ initialData }: OrganizationFormProps) {
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          id="domain"
          name="domain"
          type="text"
          inputMode="url"
          placeholder="example.com"
          defaultValue={initialData?.domain}
        />
      </div>

      <div className="flex items-baseline space-x-2">
        <Checkbox
          id="shouldAttachUsersByDomain"
          name="shouldAttachUsersByDomain"
          defaultChecked={initialData?.shouldAttachUsersByDomain}
        />
        <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
          <span className="text-sm font-medium leading-none">
            Auto-join new members
          </span>
          <p className="text-sm text-muted-foreground">
            This will automatically invite all members with same email domain
            to this organization.
          </p>
        </label>
      </div>

      {/* "Save" funciona tanto para criar quanto editar */}
      <Button type="submit" className="w-full">
        Save organization
      </Button>
    </form>
  )
}
```