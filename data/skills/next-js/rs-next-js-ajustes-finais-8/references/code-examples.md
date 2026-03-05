# Code Examples: Ajustes Finais — Layout e Header Next.js

## 1. Componente Header completo

```tsx
// components/header/header.tsx

export const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Logo />
    </header>
  )
}
```

### Barrel export do header
```tsx
// components/header/index.ts
export * from "./header"
```

## 2. Componente Logo completo

```tsx
// components/logo/logo.tsx
import Link from "next/link"
import { Dog } from "lucide-react"

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-4 bg-background/95 w-fit p-3 rounded-b-lg"
    >
      <div className="w-8 h-8 bg-background-brand rounded flex items-center justify-center">
        <Dog />
      </div>
      <span className="text-label-lg font-bold text-content-brand">
        MundoPet
      </span>
    </Link>
  )
}
```

### Barrel export da logo
```tsx
// components/logo/index.ts
export * from "./logo"
```

## 3. Layout atualizado

```tsx
// app/layout.tsx
import { Header } from "@/components/header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="flex flex-1 flex-col mt-12 max-w-3xl mx-auto">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  )
}
```

## 4. Evolucao do header — de solido para glassmorphism

### Tentativa 1 (descartada): Background solido
```tsx
<header className="fixed top-0 z-50 w-full bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/60">
```
Problema: cor solida nao permite o efeito de vidro.

### Versao final: Background transparente com blur
```tsx
<header className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
```
A chave foi remover "primary" e usar apenas "background" — a cor neutra com opacidade permite que o blur funcione corretamente.

## 5. Fix do copy-paste nos periodos

### Antes (bug):
```tsx
// Todos os periodos mostravam "Manhã" por erro de copy-paste
const periods = [
  { label: "Manhã", ... },
  { label: "Manhã", ... },  // Deveria ser "Tarde"
  { label: "Manhã", ... },  // Deveria ser "Noite"
]
```

### Depois (corrigido):
```tsx
const periods = [
  { label: "Manhã", ... },
  { label: "Tarde", ... },
  { label: "Noite", ... },
]
```

## 6. Classes Tailwind importantes usadas

| Classe | Funcao |
|--------|--------|
| `fixed top-0 z-50` | Header fixo no topo, acima de tudo |
| `w-full` | Largura total |
| `bg-background/60` | Background com 60% opacidade |
| `backdrop-blur` | Blur no conteudo atras |
| `supports-[backdrop-filter]:` | Condicional para browsers com suporte |
| `max-w-3xl` | Max-width 768px |
| `mx-auto` | Centraliza horizontalmente |
| `mt-12` | Margin-top 48px (compensa header fixo) |
| `flex flex-1 flex-col` | Flex container vertical que cresce |
| `w-fit` | Largura do conteudo |
| `rounded-b-lg` | Border-radius apenas embaixo |
| `gap-4` | Gap de 16px entre flex items |