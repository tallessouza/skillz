---
name: rs-next-js-secao-call-to-action
description: "Generates Call to Action sections for Next.js landing pages using Tailwind CSS. Use when user asks to 'create a CTA section', 'build a call to action', 'add a landing page section', 'create a conversion section', or 'finalize a landing page'. Applies patterns: gradient backgrounds, centered layout with flex column, reusable button components, icon with rounded badge, PT Sans Caption for headings. Make sure to use this skill whenever building CTA or final sections of landing pages. Not for blog pages, navigation, or header/hero sections."
---

# Secao Call to Action

> Ao criar secoes de call to action, centralize o conteudo visualmente com gradiente de fundo, icone destacado, titulo forte e botao repetido como componente reutilizavel.

## Rules

1. **Extraia botoes repetidos em componentes** — se um botao aparece em 3+ pontos da landing page, crie um componente customizado, porque alterar em multiplos lugares gera inconsistencia e dificulta manutencao
2. **Use gradientes sutis no fundo** — `bg-gradient-to-b` de uma cor vibrante (ciano) para um tom neutro (cinza), porque cria profundidade visual sem distrair do CTA
3. **Centralize com flex column** — use `flex flex-col items-center text-center` com gap consistente, porque CTAs precisam de foco visual unico
4. **Destaque o icone com badge arredondado** — envolva o icone em uma div com `bg-ciano-300 rounded-full w-fit p-4`, porque cria hierarquia visual e atrai o olhar
5. **Use text-balance no titulo** — aplique `text-balance` no heading para distribuicao uniforme do texto, porque evita linhas orfas em titulos curtos
6. **Mantenha a section simples** — CTA e a secao mais simples da landing page, o impacto vem do design visual, nao da quantidade de conteudo

## How to write

### Componente CTA completo

```tsx
import { Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-cyan-950 to-gray-700">
      <div className="container">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="p-4 bg-cyan-300 w-fit rounded-full">
            <Store className="text-cyan-100" />
          </div>
          <h2 className={`${ptSansCaption.className} text-heading-xl text-gray-100 text-balance`}>
            Crie uma loja online e inicie suas vendas ainda hoje
          </h2>
          <Button variant="primary" asChild className="mt-4">
            <Link href="/criar-loja">
              Criar loja gratis <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
```

### Variant primary no Button

```tsx
primary: "bg-blue-200 text-white hover:bg-blue-300 rounded",
```

## Example

**Before (CTA sem design):**
```tsx
<section>
  <h2>Crie sua loja</h2>
  <a href="/criar">Criar loja</a>
</section>
```

**After (com esta skill aplicada):**
```tsx
<section className="py-24 bg-gradient-to-b from-cyan-950 to-gray-700">
  <div className="container">
    <div className="flex flex-col items-center text-center gap-6">
      <div className="p-4 bg-cyan-300 w-fit rounded-full">
        <Store className="text-cyan-100" />
      </div>
      <h2 className="text-heading-xl text-gray-100 text-balance">
        Crie uma loja online e inicie suas vendas ainda hoje
      </h2>
      <Button variant="primary" asChild className="mt-4">
        <Link href="/criar-loja">Criar loja gratis <ArrowRight /></Link>
      </Button>
    </div>
  </div>
</section>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao aparece em 3+ lugares | Extraia para componente reutilizavel |
| Secao final da landing page | Use gradiente que escurece para baixo |
| Icone decorativo no CTA | Envolva com badge arredondado colorido |
| Titulo do CTA | Use font display (PT Sans Caption) bold + text-balance |
| Botao com link interno | Use Button com asChild + Link do Next.js |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Botao duplicado em 3 arquivos | Componente unico importado em 3 lugares |
| `<a href=...>` para rotas internas | `<Link href=...>` do Next.js |
| Background solido em CTA | `bg-gradient-to-b` com transicao suave |
| Icone solto sem container | Icone dentro de div com padding e rounded-full |
| Titulo sem text-balance | Titulo com `text-balance` para distribuicao uniforme |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
