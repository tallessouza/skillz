# Code Examples: Secao Support

## Exemplo completo do componente SupportSection

```tsx
// components/support-section/support-section.tsx
import { Handshake, PaintbrushVertical, Store } from "lucide-react";
import { PT_Sans_Caption } from "next/font/google";

const ptSansCaption = PT_Sans_Caption({
  subsets: ["latin"],
  weight: "700",
});

export const SupportSection = () => {
  return (
    <section className="container pb-8 md:py-10">
      <div className="flex flex-col items-center gap-12">
        <h2
          className={`${ptSansCaption.className} text-balance text-center text-heading-xl text-gray-100`}
        >
          Sua loja de afiliados simples do jeito que deveria ser
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Primeiro card */}
          <div className="flex flex-col gap-2 rounded-lg p-6 md:p-12 bg-blue-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-300 mb-4">
              <PaintbrushVertical className="h-6 w-6 text-white" />
            </div>
            <strong className="text-heading-sm text-gray-100">
              Personaliza o seu site
            </strong>
            <p className="text-body-sm text-gray-200">
              Descricao do primeiro card
            </p>
          </div>

          {/* Segundo card */}
          <div className="flex flex-col gap-2 rounded-lg p-6 md:p-12 bg-cyan-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-200 mb-4">
              <Store className="h-6 w-6 text-white" />
            </div>
            <strong className="text-heading-sm text-gray-100">
              Monte a sua loja
            </strong>
            <p className="text-body-sm text-gray-200">
              Descricao do segundo card
            </p>
          </div>

          {/* Terceiro card */}
          <div className="flex flex-col gap-2 rounded-lg p-6 md:p-12 bg-blue-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-300 mb-4">
              <Handshake className="h-6 w-6 text-white" />
            </div>
            <strong className="text-heading-sm text-gray-100">
              Receba suporte amigavel
            </strong>
            <p className="text-body-sm text-gray-200">
              Descricao do terceiro card
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
```

## Barrel export

```tsx
// components/support-section/index.ts
export * from "./support-section";
```

## Uso na page

```tsx
// pages/index.tsx
import { SupportSection } from "@/components/support-section";

export default function Home() {
  return (
    <>
      {/* outras secoes */}
      <SupportSection />
    </>
  );
}
```

## Variacao: com gradiente na section

```tsx
<section className="container pb-8 md:py-10 bg-gradient-to-r from-gray-500 to-gray-700">
  {/* conteudo */}
</section>
```

## Variacao: card como componente reutilizavel (previsto para refatoracao)

```tsx
interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconBgColor: string;
}

const SupportCard = ({ icon, title, description, bgColor, iconBgColor }: SupportCardProps) => (
  <div className={`flex flex-col gap-2 rounded-lg p-6 md:p-12 ${bgColor}`}>
    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor} mb-4`}>
      {icon}
    </div>
    <strong className="text-heading-sm text-gray-100">{title}</strong>
    <p className="text-body-sm text-gray-200">{description}</p>
  </div>
);
```

## Pattern de icone com container

```tsx
{/* Icone SEM container (errado) */}
<PaintbrushVertical className="h-6 w-6 text-white" />

{/* Icone COM container (correto) */}
<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-300 mb-4">
  <PaintbrushVertical className="h-6 w-6 text-white" />
</div>
```

## Next Font setup

```tsx
import { PT_Sans_Caption } from "next/font/google";

// Instanciar fora do componente (nivel de modulo)
const ptSansCaption = PT_Sans_Caption({
  subsets: ["latin"],
  weight: "700", // string, nao numero
});

// Usar via template literal no className
<h2 className={`${ptSansCaption.className} text-heading-xl`}>
  Titulo
</h2>
```