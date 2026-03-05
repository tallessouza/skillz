# Code Examples: Componente Footer

## Exemplo completo da aula

### footer.tsx (versao final da aula)

```tsx
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 py-8">
          {/* Logo com link para home */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo do site"
              width={120}
              height={32}
            />
          </Link>

          {/* Navegacao do footer */}
          <nav className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <Link href="/termos-de-uso" className="hover:text-primary">
              Termos de uso
            </Link>
            <Link href="/politica-privacidade" className="hover:text-primary">
              Política de privacidade
            </Link>
            <Link href="/feedback" className="hover:text-primary">
              Enviar feedback
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
```

### index.ts (barrel export)

```tsx
export { Footer } from "./footer";
```

### layout.tsx (integracao)

```tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## Evolucao passo a passo

### Passo 1: Footer vazio

```tsx
export const Footer = () => {
  return <footer>Footer</footer>;
};
```

### Passo 2: Adicionando container e borda

```tsx
export const Footer = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        Footer
      </div>
    </footer>
  );
};
```

### Passo 3: Logo com Link

```tsx
<Link href="/">
  <Image src="/logo.svg" alt="Logo do site" width={120} height={32} />
</Link>
```

### Passo 4: Navegacao com links

```tsx
<nav className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
  <Link href="/termos-de-uso" className="hover:text-primary">
    Termos de uso
  </Link>
  <Link href="/politica-privacidade" className="hover:text-primary">
    Política de privacidade
  </Link>
  <Link href="/feedback" className="hover:text-primary">
    Enviar feedback
  </Link>
</nav>
```

### Passo 5: Layout flex responsivo (juntando tudo)

A div interna recebe `flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 py-8` para organizar logo e nav lado a lado no desktop, empilhados no mobile.

## Variacao: Footer com mais secoes

```tsx
export const Footer = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Coluna 1: Logo + descricao */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Descricao curta do projeto.
            </p>
          </div>

          {/* Coluna 2: Links */}
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Legal</span>
            <Link href="/termos-de-uso" className="hover:text-primary">
              Termos de uso
            </Link>
            <Link href="/politica-privacidade" className="hover:text-primary">
              Política de privacidade
            </Link>
          </nav>

          {/* Coluna 3: Contato */}
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Contato</span>
            <Link href="/feedback" className="hover:text-primary">
              Enviar feedback
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
```