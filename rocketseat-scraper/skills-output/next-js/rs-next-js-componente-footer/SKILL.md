---
name: rs-next-js-componente-footer
description: "Applies Footer component patterns when building Next.js pages with Tailwind CSS. Use when user asks to 'create a footer', 'add footer component', 'build page layout', or 'add navigation links to footer'. Enforces responsive flex layout, proper Next.js Image/Link usage, and componentization of repeated elements like logos. Make sure to use this skill whenever generating footer or layout components in Next.js projects. Not for header-specific logic, API routes, or server-side data fetching."
---

# Componente Footer em Next.js

> Ao criar um footer, estruture com flex responsivo, use componentes Next.js (Link, Image), e extraia elementos repetidos em componentes reutilizaveis.

## Rules

1. **Crie o footer como componente isolado** — `footer.tsx` com barrel export via `index.ts`, porque facilita imports e organizacao do projeto
2. **Use tags semanticas** — `<footer>`, `<nav>` para links, porque melhora acessibilidade e SEO
3. **Layout responsivo com flex** — `flex-col` no mobile, `flex-row` no desktop via breakpoints Tailwind, porque o footer precisa funcionar em todas as telas
4. **Use Link do Next.js para navegacao interna** — envolva logos e links internos com `<Link href="/">`, porque preserva client-side navigation
5. **Imagens estaticas via pasta public** — `src="/logo.svg"` acessa `public/logo.svg` automaticamente, sem prefixo `public/`
6. **Identifique elementos duplicados para componentizar** — se logo aparece no header E footer, crie um componente `Logo` separado, porque duplicacao quebra o principio DRY do React

## How to write

### Estrutura basica do Footer

```tsx
// components/footer/footer.tsx
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 py-8">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo do site" width={120} height={32} />
          </Link>

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

### Barrel export

```tsx
// components/footer/index.ts
export { Footer } from "./footer";
```

### Importacao no Layout

```tsx
// layout.tsx
import { Footer } from "@/components/footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

## Example

**Before (sem componentizacao, logo duplicada):**
```tsx
// layout.tsx — logo copiada no header e footer
<header>
  <Link href="/"><Image src="/logo.svg" alt="Logo" width={120} height={32} /></Link>
</header>
<footer>
  <Link href="/"><Image src="/logo.svg" alt="Logo" width={120} height={32} /></Link>
</footer>
```

**After (com componente Logo extraido):**
```tsx
// components/logo.tsx
export const Logo = () => (
  <Link href="/">
    <Image src="/logo.svg" alt="Logo do site" width={120} height={32} />
  </Link>
);

// header.tsx
<header><Logo /></header>

// footer.tsx
<footer><Logo /></footer>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento visual aparece em 2+ lugares | Extrair em componente proprio |
| Footer tem links internos | Usar `<Link>` do Next.js, nunca `<a>` |
| Imagem estatica (logo, icone) | Colocar em `public/`, referenciar com `/` |
| Layout mobile vs desktop | `flex-col` default + `md:flex-row` no breakpoint |
| Espacamento do container | `max-w-7xl mx-auto` + padding responsivo por breakpoint |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<a href="/">` para rotas internas | `<Link href="/">` |
| `src="public/logo.svg"` | `src="/logo.svg"` |
| Logo duplicada em header e footer | Componente `<Logo />` compartilhado |
| `<div>` para lista de links de navegacao | `<nav>` com links semanticos |
| Estilos fixos sem responsividade | Breakpoints `sm:`, `md:`, `lg:` do Tailwind |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
