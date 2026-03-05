---
name: rs-full-stack-adicionando-imagens-e-estilos
description: "Applies correct image export and integration workflow when building HTML/CSS pages with assets from Figma. Use when user asks to 'add images', 'export from Figma', 'organize assets', 'set up project images', or 'add border-radius to images'. Enforces JPG-over-PNG for performance, proper asset folder structure, and CSS border-radius instead of baked-in rounding. Make sure to use this skill whenever integrating images from design tools into web projects. Not for SVG icon systems, image optimization pipelines, or responsive images with srcset."
---

# Adicionando Imagens e Estilos

> Exporte imagens como JPG e aplique arredondamento via CSS, nunca embutido na imagem.

## Rules

1. **Organize assets em pasta dedicada** — crie `assets/` na raiz do projeto para imagens, PDFs e midias, porque centraliza recursos e facilita referencia no codigo
2. **Prefira JPG sobre PNG** — JPG e significativamente mais leve; use PNG apenas quando transparencia e obrigatoria, porque performance importa desde o primeiro asset
3. **Nunca exporte bordas arredondadas na imagem** — zere o border-radius no Figma antes de exportar como JPG, aplique via CSS depois, porque cor de fundo pode mudar e a borda ficaria errada
4. **Descreva o alt da imagem com especificidade** — descreva o conteudo visivel, nao apenas o tipo do objeto, porque acessibilidade exige contexto real
5. **Crie .gitignore antes do primeiro commit** — ignore arquivos do sistema como `.DS_Store` desde o inicio, porque poluem o repositorio

## How to write

### Estrutura de assets

```
projeto/
├── index.html
├── style.css
├── assets/
│   ├── bg.jpg          # imagem de fundo (JPG, leve)
│   └── main-image.jpg  # imagem principal (JPG, sem bordas)
└── .gitignore
```

### Integrar imagem no HTML

```html
<div class="page-image">
  <img src="assets/main-image.jpg" alt="Cupcake com graos de cafe e chantilly">
</div>
```

### Aplicar border-radius via CSS

```css
.page-image img {
  border-radius: 16px;
}
```

### Linkar CSS no HTML

```html
<link rel="stylesheet" href="style.css">
```

## Example

**Before (borda exportada na imagem PNG):**
```
- Exporta PNG com border-radius 16 no Figma
- Imagem pesada (~3x maior que JPG)
- Fundo transparente que quebra se cor de fundo mudar
- Bordas com cor fixa embutida
```

**After (borda via CSS, imagem JPG):**
```
- Zera border-radius no Figma, exporta JPG
- Imagem leve
- border-radius: 16px no CSS
- Funciona com qualquer cor de fundo
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem precisa de fundo transparente | Use PNG (unico caso valido) |
| Imagem decorativa ou de fundo | Use JPG sempre |
| Imagem tem bordas arredondadas no design | Zere no Figma, aplique CSS |
| Primeiro arquivo no projeto | Crie .gitignore antes do primeiro commit |
| Nomear arquivo de imagem | Use nomes semanticos: `bg.jpg`, `main-image.jpg` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Exportar PNG com bordas arredondadas | Exportar JPG sem bordas + CSS border-radius |
| `alt="imagem"` | `alt="Cupcake com graos de cafe e chantilly"` |
| Imagens soltas na raiz do projeto | Imagens dentro de `assets/` |
| Commit sem .gitignore | Criar .gitignore com `.DS_Store` antes do primeiro commit |
| `<link rel="stylesheet" href="./styles/main.css">` sem necessidade | `<link rel="stylesheet" href="style.css">` simples na raiz |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre JPG vs PNG, workflow de exportacao Figma e decisoes de border-radius
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes