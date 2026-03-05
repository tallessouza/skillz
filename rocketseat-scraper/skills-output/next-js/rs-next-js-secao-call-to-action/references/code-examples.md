# Code Examples: Secao Call to Action

## Exemplo 1: Estrutura do componente CallToAction

```tsx
// components/call-to-action.tsx
export const CallToAction = () => {
  return (
    <>
      {/* Conteudo aqui */}
    </>
  );
};
```

```tsx
// components/index.ts
export * from "./call-to-action";
```

## Exemplo 2: Barrel export e importacao na page

```tsx
// pages/index.tsx
import { CallToAction } from "@/components";

export default function Home() {
  return (
    <>
      {/* outras secoes */}
      <CallToAction />
    </>
  );
}
```

## Exemplo 3: Section com gradiente

```tsx
<section className="py-24 bg-gradient-to-b from-cyan-950 to-gray-700">
  <div className="container">
    {/* conteudo centralizado */}
  </div>
</section>
```

O `py-24` da padding vertical generoso. O gradiente vai de ciano escuro (950) ate cinza medio (700).

## Exemplo 4: Layout centralizado com flex

```tsx
<div className="flex flex-col items-center text-center gap-6">
  {/* icone */}
  {/* titulo */}
  {/* botao */}
</div>
```

Flex column com items-center centraliza horizontalmente. Text-center alinha o texto. Gap-6 da espacamento uniforme entre os elementos.

## Exemplo 5: Badge do icone

```tsx
import { Store } from "lucide-react";

<div className="p-4 bg-cyan-300 w-fit rounded-full">
  <Store className="text-cyan-100" />
</div>
```

O `w-fit` faz a div se ajustar ao conteudo. `rounded-full` cria o circulo. `bg-cyan-300` contrasta com o fundo escuro da section.

## Exemplo 6: Titulo com fonte customizada

```tsx
import { PT_Sans_Caption } from "next/font/google";

const ptSansCaption = PT_Sans_Caption({
  subsets: ["latin"],
  weight: "700",
});

<h2 className={`${ptSansCaption.className} text-heading-xl text-gray-100 text-balance`}>
  Crie uma loja online e inicie suas vendas ainda hoje
</h2>
```

## Exemplo 7: Botao com variant primary

```tsx
// Adicionando variant primary ao componente Button
const buttonVariants = cva("...", {
  variants: {
    variant: {
      default: "...",
      destructive: "...",
      outline: "...",
      primary: "bg-blue-200 text-white hover:bg-blue-300 rounded",
    },
  },
});
```

## Exemplo 8: Botao como Link

```tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

<Button variant="primary" asChild>
  <Link href="/criar-loja">
    Criar loja gratis <ArrowRight />
  </Link>
</Button>
```

O `asChild` permite que o Button renderize como Link do Next.js, mantendo a estilizacao do botao mas com navegacao client-side.

## Exemplo 9: Espacamento do botao com margin-top

```tsx
<Button variant="primary" asChild className="mt-4">
  <Link href="/criar-loja">
    Criar loja gratis <ArrowRight />
  </Link>
</Button>
```

O `mt-4` adiciona espaco extra acima do botao alem do `gap-6` do flex container, criando mais separacao visual entre o titulo e o CTA.