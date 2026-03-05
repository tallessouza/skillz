# Code Examples: Adicionando Imagens de Fundo

## Exemplo 1: Section Features (do transcript)

```tsx
// Suporte section — section de Features
<section className="relative">
  {/* Div de background — hidden no mobile, visivel a partir de md */}
  <div
    className="absolute inset-0 hidden md:block bg-[url('/background-features.svg')] bg-cover bg-center bg-no-repeat opacity-90"
  />

  {/* Conteudo com relative para ficar acima do background */}
  <div className="relative">
    <h2>Sua loja de afiliados</h2>
    <p>Simples e do jeito que deveria ser</p>
  </div>
</section>
```

## Exemplo 2: Section Call to Action (do transcript)

```tsx
<section className="relative">
  <div
    className="absolute inset-0 bg-[url('/background-footer.svg')] bg-cover bg-center bg-no-repeat opacity-90"
  />

  <div className="relative">
    {/* Conteudo do CTA */}
  </div>
</section>
```

## Exemplo 3: Variacao com opacity diferente

```tsx
<section className="relative">
  <div
    className="absolute inset-0 hidden md:block bg-[url('/background-hero.svg')] bg-cover bg-center bg-no-repeat opacity-70"
  />
  <div className="relative z-10">
    <h1>Hero com imagem mais sutil</h1>
  </div>
</section>
```

## Exemplo 4: Com gradiente sobre a imagem

```tsx
<section className="relative">
  {/* Camada 1: imagem */}
  <div
    className="absolute inset-0 hidden md:block bg-[url('/bg.svg')] bg-cover bg-center bg-no-repeat opacity-90"
  />
  {/* Camada 2: gradiente opcional */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

  <div className="relative">
    <h2>Conteudo sobre gradiente</h2>
  </div>
</section>
```

## Estrutura de arquivos

```
public/
├── background-features.svg    # Exportado do Figma como SVG
├── background-footer.svg      # Exportado do Figma como SVG
└── ...

src/pages/          # Pages Router (sera migrado para app/)
└── index.tsx
    ├── SupportSection   # Usa background-features.svg
    └── CTASection       # Usa background-footer.svg
```

## Classes Tailwind utilizadas

| Classe | Funcao |
|--------|--------|
| `relative` | Cria stacking context na section e eleva conteudo |
| `absolute` | Posiciona div de bg relativa ao parent |
| `inset-0` | `top:0; right:0; bottom:0; left:0` — preenche o parent |
| `hidden` | `display: none` no mobile |
| `md:block` | `display: block` a partir de 768px |
| `bg-[url('...')]` | Background-image via arbitrary value do Tailwind |
| `bg-cover` | `background-size: cover` |
| `bg-center` | `background-position: center` |
| `bg-no-repeat` | `background-repeat: no-repeat` |
| `opacity-90` | `opacity: 0.9` |