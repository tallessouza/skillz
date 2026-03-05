# Code Examples: Página do Documento

## Exemplo completo do layout

### Estrutura do main (antes — estado inicial)

```tsx
// Estado anterior — centralizado sem estrutura
<main className="flex items-center justify-center text-neutral-400">
  {/* Conteúdo solto */}
</main>
```

### Estrutura do main (depois — com layout de documento)

```tsx
<main className="flex py-12 px-10 gap-8">
  {/* Sidebar */}
  <aside className="hidden lg:block sticky top-0">
    <span className="text-xs font-semibold uppercase text-neutral-300">
      Table of contents
    </span>
    <Toc.Root>
      <Toc.Link>Backend</Toc.Link>
      <Toc.Section>
        <Toc.Link>Banco de dados</Toc.Link>
        <Toc.Link>Autenticação</Toc.Link>
      </Toc.Section>
    </Toc.Root>
  </aside>

  {/* Área de conteúdo */}
  <section className="flex-1 flex flex-col items-center">
    <div className="w-[700px] max-w-full">
      {/* Editor de texto será inserido aqui */}
    </div>
  </section>
</main>
```

## Import do componente TOC com composition pattern

```tsx
// Note: importação direta, sem asterisco
import { Toc } from '../components/toc'
```

O instrutor inicialmente tenta `import * as Toc`, mas percebe que não precisa — o componente já exporta um objeto com os subcomponentes.

## Uso do Toc.Section para sub-links

```tsx
<Toc.Root>
  {/* Link de nível 1 (como H2) */}
  <Toc.Link>Backend</Toc.Link>

  {/* Section cria indentação — sub-links (como H3) */}
  <Toc.Section>
    <Toc.Link>Banco de dados</Toc.Link>
    <Toc.Link>Autenticação</Toc.Link>
  </Toc.Section>

  {/* Outro link de nível 1 */}
  <Toc.Link>Frontend</Toc.Link>
  <Toc.Section>
    <Toc.Link>Componentes</Toc.Link>
  </Toc.Section>
</Toc.Root>
```

## Referência de classes Tailwind usadas

| Classe | Valor | Propósito |
|--------|-------|-----------|
| `py-12` | 48px | Padding vertical do main |
| `px-10` | 40px | Padding horizontal do main |
| `gap-8` | 32px | Espaço entre sidebar e conteúdo |
| `hidden` | display: none | Esconde sidebar por padrão |
| `lg:block` | display: block @1024px | Mostra sidebar em telas grandes |
| `sticky` | position: sticky | Sidebar gruda durante scroll |
| `top-0` | top: 0 | Ponto de referência do sticky |
| `text-xs` | 12px | Tamanho do título da sidebar |
| `font-semibold` | font-weight: 600 | Peso do título (menos que bold/700) |
| `flex-1` | flex: 1 1 0% | Conteúdo ocupa espaço restante |
| `items-center` | align-items: center | Centraliza div de largura fixa |
| `text-neutral-300` | cor cinza clara | Cor do título "Table of contents" |