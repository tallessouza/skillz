---
name: rs-angular-trabalhando-com-imagens-1
description: "Enforces correct image handling patterns in Angular applications. Use when user asks to 'add an image', 'reference assets', 'optimize images', 'use background image in Angular', or 'configure assets in Angular'. Applies rules: use public/ folder for static assets, relative paths without public/ prefix, always use leading slash, never inline Base64 in templates. Make sure to use this skill whenever working with images or static assets in Angular projects. Not for dynamic image upload, image processing libraries, or server-side image manipulation."
---

# Trabalhando com Imagens no Angular

> Imagens sao assets estaticos: vivem em `public/`, sao apenas copiadas para o bundle final, e devem ser referenciadas com caminhos relativos ao servidor.

## Rules

1. **Coloque imagens em `public/images/`** — nunca dentro de `src/`, porque assets em `public/` sao apenas copiados para `dist/` sem transformacao, exatamente como o Angular espera
2. **Referencie com barra inicial, sem `public/`** — use `/images/logo.png` e nao `public/images/logo.png`, porque o Angular resolve automaticamente o caminho a partir de `public/`
3. **Nunca embuta Base64 no template** — Base64 e ~33% maior que o arquivo original, impede cache do navegador e bloqueia o carregamento paralelo, porque a imagem viaja dentro do JavaScript principal
4. **Comprima imagens antes de adicionar ao projeto** — o Angular nao otimiza imagens no build, entao imagens pesadas vao direto para producao sem compressao
5. **Prefira imagens separadas a inline** — o navegador faz requisicoes paralelas para imagens separadas, sem impactar o download dos arquivos JS/CSS principais

## How to write

### Imagem no HTML (forma padrao)

```html
<img src="/images/skillz.png" alt="Logo Skillz" />
```

### Imagem via CSS (background)

```css
.container {
  width: 200px;
  height: 200px;
  background-image: url("/images/skillz.png");
  background-size: contain;
  background-repeat: no-repeat;
}
```

### Estrutura de pastas

```
projeto-angular/
├── public/
│   └── images/
│       ├── logo.png
│       └── hero-banner.webp
├── src/
│   └── app/
│       └── app.component.html   ← referencia /images/logo.png
└── angular.json                 ← configura public/ como assets
```

## Example

**Before (Base64 inline — problematico):**

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..." />
```

**After (asset separado — correto):**

```html
<img src="/images/skillz.png" alt="Logo Skillz" />
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Imagem estatica (logo, icone, banner) | Colocar em `public/images/`, referenciar com `/images/nome.ext` |
| Imagem vinda de API/servidor | Usar URL da API diretamente no `src`, nao salvar em `public/` |
| Base64 de API temporario | Usar e descartar — nunca chumbar no template |
| Imagem pesada (>200KB) | Comprimir antes com ferramenta online, Angular nao otimiza |
| Fontes e SVGs estaticos | Tambem vao em `public/`, mesma regra de assets |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `src="public/images/logo.png"` | `src="/images/logo.png"` |
| `src="data:image/png;base64,..."` chumbado | `src="/images/logo.png"` como asset separado |
| Imagem de 2MB sem compressao em `public/` | Comprimir antes de adicionar ao projeto |
| Imagem dentro de `src/assets/` (padrao antigo) | Usar `public/` (padrao Angular 19+) |
| Referenciar sem barra inicial: `images/logo.png` | Sempre com barra: `/images/logo.png` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
