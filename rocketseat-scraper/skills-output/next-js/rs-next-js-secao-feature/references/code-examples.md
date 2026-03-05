# Code Examples: Secao Feature

## Exemplo 1: Estrutura completa do componente

```tsx
// components/feature-section.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button"; // componente de botao ja existente
import { ArrowRight } from "lucide-react"; // icone

export const FeatureSection = () => {
  return (
    <section className="container bg-gray-700 grid gap-6 md:grid-cols-1 pb-8 pt-8 md:py-10">
      <h2 className="text-gray-100 text-heading-lg">
        Tudo que você precisa pra vender online
      </h2>

      {/* Card 1 — Simples */}
      <div className="flex flex-col gap-4 rounded-lg bg-gray-500 p-6 md:p-12">
        <span className="text-body-tag text-blue-200 bg-blue-400 px-2 py-1 inline-flex rounded-sm uppercase">
          Simples
        </span>
        <p>
          Texto descritivo do card simples com as informacoes relevantes
          sobre a feature.
        </p>
      </div>

      {/* Card 2 — Pratico (mesma estrutura do Card 1) */}
      <div className="flex flex-col gap-4 rounded-lg bg-gray-500 p-6 md:p-12">
        <span className="text-body-tag text-blue-200 bg-blue-400 px-2 py-1 inline-flex rounded-sm uppercase">
          Prático
        </span>
        <p>
          Texto descritivo do card pratico.
        </p>
      </div>

      {/* Card 3 — Personalizavel (com imagem e CTA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-4 rounded-lg bg-gray-500 p-6 md:p-12">
        {/* Lado esquerdo: conteudo */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-body-tag text-blue-200 bg-blue-400 px-2 py-1 inline-flex rounded-sm uppercase">
              Personalizável
            </span>
            <p>Texto descritivo do card personalizavel.</p>
          </div>

          {/* Botao desktop — hidden no mobile */}
          <Button className="hidden md:flex rounded-full mt-4">
            <Link href="/criar-loja">
              Criar loja grátis <ArrowRight />
            </Link>
          </Button>
        </div>

        {/* Lado direito: imagem */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md overflow-hidden">
            <Image
              src="/feature-section.svg"
              alt="Features da plataforma"
              width={440}
              height={330}
              className="object-cover w-full"
            />
          </div>
        </div>

        {/* Botao mobile — hidden no desktop */}
        <Button className="md:hidden w-full rounded-full mt-4 gap-2">
          <Link href="/criar-loja">
            Criar loja grátis <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
};
```

## Exemplo 2: Re-export via index.ts

```ts
// components/index.ts
export { FeatureSection } from "./feature-section";
```

## Exemplo 3: Estilo customizado no Tailwind config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'body-tag': ['12px', { lineHeight: 'normal', fontWeight: '500' }],
        // Outros estilos existentes:
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'heading-lg': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
      },
    },
  },
};
```

## Exemplo 4: Padrao de tag/badge reutilizavel

```tsx
{/* Tag padrao — reutilize em qualquer card */}
<span className="text-body-tag text-blue-200 bg-blue-400 px-2 py-1 inline-flex rounded-sm uppercase">
  {tagText}
</span>
```

## Exemplo 5: Container de imagem seguro

```tsx
{/* Wrapper que previne overflow da imagem */}
<div className="w-full max-w-md overflow-hidden">
  <Image
    src={imageSrc}
    alt={imageAlt}
    width={440}
    height={330}
    className="object-cover w-full"
  />
</div>
```

## Exemplo 6: Botao duplicado — padrao completo

```tsx
{/* Desktop: dentro do fluxo de texto, ao lado do conteudo */}
<Button className="hidden md:flex rounded-full mt-4">
  <Link href={ctaHref}>
    {ctaText} <ArrowRight />
  </Link>
</Button>

{/* ... imagem ou outro conteudo no meio ... */}

{/* Mobile: largura total, abaixo de tudo */}
<Button className="md:hidden w-full rounded-full mt-4 gap-2">
  <Link href={ctaHref}>
    {ctaText} <ArrowRight />
  </Link>
</Button>
```

## Exemplo 7: Section wrapper com grid responsivo

```tsx
{/* Container externo da section */}
<section className="container bg-gray-700 grid gap-6 pb-8 pt-8 md:py-10">
  {/* Todos os cards como filhos diretos do grid */}
</section>
```