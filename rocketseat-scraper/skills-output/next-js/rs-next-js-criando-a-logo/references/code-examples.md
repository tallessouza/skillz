# Code Examples: Criando a Logo

## Exemplo 1: Componente basico extraido da aula

```tsx
// components/Logo/logo.tsx
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";

export function Logo() {
  return (
    <Link href="/" title="Pagina inicial">
      <Image src={logo} alt="Logo da aplicacao" />
    </Link>
  );
}
```

```ts
// components/Logo/index.ts
export { Logo } from "./logo";
```

## Exemplo 2: Uso no Header

```tsx
// components/Header/header.tsx
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header>
      <Logo />
      <nav>{/* navegacao */}</nav>
    </header>
  );
}
```

## Exemplo 3: Uso no Footer

```tsx
// components/Footer/footer.tsx
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer>
      <Logo />
      <p>Todos os direitos reservados</p>
    </footer>
  );
}
```

## Exemplo 4: Com props de variacao (extensao sugerida pelo instrutor)

```tsx
import Link from "next/link";
import Image from "next/image";
import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

const logoMap = {
  light: logoLight,
  dark: logoDark,
} as const;

export function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link href="/" title="Pagina inicial">
      <Image
        src={logoMap[variant]}
        alt="Logo da aplicacao"
        className={className}
      />
    </Link>
  );
}
```

## Exemplo 5: Antes vs Depois completo

### Antes — header.tsx com logo inline

```tsx
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";

export function Header() {
  return (
    <header>
      <Link href="/">
        <Image src={logo} alt="Logo" />
      </Link>
      <nav>
        <Link href="/about">Sobre</Link>
        <Link href="/contact">Contato</Link>
      </nav>
    </header>
  );
}
```

### Antes — footer.tsx com logo copiada

```tsx
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";

export function Footer() {
  return (
    <footer>
      <Link href="/">
        <Image src={logo} alt="Logo" />
      </Link>
      <p>&copy; 2024</p>
    </footer>
  );
}
```

### Depois — ambos usando componente

```tsx
// header.tsx
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header>
      <Logo />
      <nav>
        <Link href="/about">Sobre</Link>
        <Link href="/contact">Contato</Link>
      </nav>
    </header>
  );
}

// footer.tsx
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer>
      <Logo />
      <p>&copy; 2024</p>
    </footer>
  );
}
```

Note como os imports de `Image`, `Link` e `logo` foram removidos do header e footer — agora sao responsabilidade interna do componente Logo.