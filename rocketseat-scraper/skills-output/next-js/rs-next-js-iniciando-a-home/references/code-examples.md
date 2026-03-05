# Code Examples: Iniciando a Home

## 1. Substituicao de fonte no layout.tsx

### Antes (template padrao)
```typescript
// layout.tsx — gerado pelo create-next-app
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

### Depois (configurado para o projeto)
```typescript
// layout.tsx — com Inter + fonte display
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

// Fonte display secundaria (para titulos decorativos)
const tights = Inter({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-tights',
})

export const metadata = {
  title: 'Mundo Pet',
  description: 'Boas vindas ao projeto. Aqui voce pode ver todos os seus agendamentos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${tights.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

## 2. Pagina inicial completa (page.tsx)

```typescript
// app/page.tsx
export default function Home() {
  return (
    <div className="bg-background-primary p-6">
      {/* Container flex para titulo + date picker (futuro) */}
      <div className="flex items-center justify-between md:mb-8">
        {/* Bloco de texto */}
        <div>
          <h1 className="text-title text-content mb-2">
            Sua agenda
          </h1>
          <p className="text-paragraph-small text-content-secondary">
            Aqui você pode ver todos os clientes e serviços agendados para hoje
          </p>
        </div>

        {/* Date picker sera adicionado aqui nas proximas aulas */}
      </div>

      {/* Area de conteudo — agendamentos via Prisma serao adicionados depois */}
    </div>
  )
}
```

## 3. Padrao de classes do design system

```typescript
// Mapeamento tipico no tailwind.config.ts para este projeto:
// (nao mostrado na aula, mas inferido das classes usadas)

// Cores
'bg-background-primary'    // fundo principal da pagina
'text-content'             // cor de texto principal
'text-content-secondary'   // cor de texto secundario/muted

// Tipografia
'text-title'              // tamanho/estilo de titulo (h1)
'text-paragraph-small'    // paragrafo pequeno (12px Inter, conforme Figma)
```

## 4. Variacao: pagina com date picker placeholder

```typescript
// Quando o date picker for implementado, a estrutura ja esta pronta:
export default function Home() {
  return (
    <div className="bg-background-primary p-6">
      <div className="flex items-center justify-between md:mb-8">
        <div>
          <h1 className="text-title text-content mb-2">Sua agenda</h1>
          <p className="text-paragraph-small text-content-secondary">
            Aqui voce pode ver todos os clientes e servicos agendados para hoje
          </p>
        </div>

        {/* O flex justify-between ja posiciona isso corretamente */}
        <DatePicker />
      </div>

      {/* Lista de agendamentos */}
      <div>
        {appointments.map(appointment => (
          <AppointmentCard key={appointment.id} {...appointment} />
        ))}
      </div>
    </div>
  )
}
```