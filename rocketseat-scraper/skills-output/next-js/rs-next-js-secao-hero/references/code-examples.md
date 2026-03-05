# Code Examples: Secao Hero

## Exemplo completo do componente

Estrutura final do `HeroSection.tsx` conforme construido na aula:

```tsx
import Image from "next/image"
import Link from "next/link"
import { Clock, Store, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const HeroSection = () => {
  return (
    <section className="container relative flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[20rem] md:h-[36rem] items-center">
        <div className="flex flex-col items-center justify-center gap-4 md:items-start lg:items-start">
          <h1 className="text-heading-hg">
            Venda seus produtos online
          </h1>

          <div>
            <div className="flex items-center gap-2">
              <Clock className="text-cyan-100" height={16} width={16} />
              <span className="text-gray-200">Crie sua loja em minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="text-cyan-100" height={16} width={16} />
              <span className="text-gray-200">Milhares de produtos</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center md:items-start lg:items-start mt-5">
            <Button className="w-fit" asChild>
              <Link href="/criar-loja">
                Criar loja gratis
                <ArrowRight className="text-white" />
              </Link>
            </Button>
            <p className="text-gray-300 text-body-xs">
              Sem necessidade de cartao de credito
            </p>
          </div>
        </div>

        <div className="relative h-[20rem] hidden md:flex lg:flex items-center justify-center overflow-hidden">
          <Image
            src="/hero-section.svg"
            alt="Ilustracao com icones de store, tag e sacola"
            width={200}
            height={400}
            className="h-auto w-auto"
          />
        </div>
      </div>
    </section>
  )
}
```

## Pagina index usando o componente

```tsx
// pages/index.tsx
import { HeroSection } from "@/components/HeroSection"

export default function Home() {
  return (
    <article className="flex flex-col">
      <HeroSection />
      {/* Proximas secoes serao adicionadas aqui */}
    </article>
  )
}
```

## Padrao: Exportar imagem do Figma para /public

1. No Figma, selecione o asset
2. Exporte como SVG (vetorial, leve)
3. Coloque em `/public/` na raiz do projeto
4. Acesse com `src="/nome-do-arquivo.svg"` no componente Image

## Padrao: Feature list com icones

```tsx
// Reutilizavel para qualquer lista de features
const features = [
  { icon: Clock, text: "Crie sua loja em minutos" },
  { icon: Store, text: "Milhares de produtos" },
]

{features.map(({ icon: Icon, text }) => (
  <div key={text} className="flex items-center gap-2">
    <Icon className="text-cyan-100" height={16} width={16} />
    <span className="text-gray-200">{text}</span>
  </div>
))}
```

## Padrao: CTA com Button + Link

```tsx
// Antes: botao sem navegacao
<button className="bg-primary px-4 py-2 rounded text-white">
  Criar loja gratis
</button>

// Depois: botao que navega via Link do Next.js
<Button className="w-fit" asChild>
  <Link href="/criar-loja">
    Criar loja gratis
    <ArrowRight className="text-white" />
  </Link>
</Button>
```

## Breakpoints responsivos aplicados

| Elemento | Mobile (default) | md (768px+) | lg (1024px+) |
|----------|-----------------|-------------|--------------|
| Grid | 1 coluna | 2 colunas | 2 colunas |
| Imagem | hidden | flex | flex |
| Alinhamento texto | center | start | start |
| CTA alinhamento | center | start | start |
| Altura container | min-h-[20rem] | h-[36rem] | h-[36rem] |