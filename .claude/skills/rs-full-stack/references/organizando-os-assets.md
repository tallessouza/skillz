---
name: rs-full-stack-organizando-os-assets
description: "Applies asset organization conventions when setting up project images, icons, and logos from design tools like Figma. Use when user asks to 'organize assets', 'export from Figma', 'structure images folder', 'setup project assets', or 'create assets directory'. Enforces folder hierarchy (assets/images, assets/icons), correct naming with state suffixes (-hover), and format selection (SVG for logos/icons, PNG for photos). Make sure to use this skill whenever creating or reorganizing frontend asset directories. Not for CSS styling, image optimization, or build tool configuration."
---

# Organizando os Assets

> Exporte assets do design e organize-os em pastas semanticas com nomes descritivos antes de comecar a codar.

## Rules

1. **Crie uma pasta `assets/` na raiz do projeto** — todo asset fica dentro dela, porque evita arquivos soltos e facilita referencia nos imports
2. **Separe por tipo em subpastas** — `assets/images/`, `assets/icons/`, porque misturar icones com fotos torna impossivel encontrar o que precisa
3. **Logos e icones em SVG** — porque SVG escala sem perda e pesa menos para graficos vetoriais
4. **Fotos e ads em PNG** — porque PNG preserva qualidade para imagens rasterizadas
5. **Nomeie pelo conteudo + estado** — `arrow-right.svg`, `arrow-right-hover.svg`, porque o nome deve indicar o que e e quando usar
6. **Exporte tudo antes de codar** — use o atalho do Figma (Ctrl+Shift+E / Cmd+Shift+E) para exportar batch, porque descobrir assets faltando no meio do codigo quebra o fluxo

## Steps

### Step 1: Exportar do Figma

Use o atalho global de export (Ctrl+Shift+E no Windows, Cmd+Shift+E no Mac) para exportar todos os assets marcados de uma vez. Para assets individuais nao marcados, clique no elemento e use Export manualmente, selecionando o formato correto.

### Step 2: Criar estrutura de pastas

```
assets/
├── icons/          # Icones de interface (SVG)
├── images/         # Fotos e ilustracoes (PNG/JPG)
├── ads/            # Banners e anuncios (PNG)
└── logo.svg        # Logo na raiz de assets
```

### Step 3: Nomear arquivos com estado

```
icons/
├── arrow-right.svg        # Estado default (branco/normal)
├── arrow-right-hover.svg  # Estado hover (azul/ativo)
├── magnifying-glass.svg
└── list.svg
```

### Step 4: Verificar completude

Compare os assets exportados com o Style Guide do Figma. Verifique se cada elemento visual do design tem seu arquivo correspondente.

## Output format

```
projeto/
└── assets/
    ├── icons/
    │   ├── arrow-right.svg
    │   ├── arrow-right-hover.svg
    │   ├── magnifying-glass.svg
    │   └── list.svg
    ├── images/
    │   ├── image-01.png
    │   ├── image-02.png
    │   └── ...
    ├── ads.png
    └── logo.svg
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Icone com variacao de cor por estado | Exporte cada estado separado, sufixo `-hover`, `-active`, `-disabled` |
| Logo do projeto | SVG na raiz de `assets/`, nao dentro de `icons/` |
| Imagem fotografica | PNG ou JPG em `assets/images/` |
| Asset unico sem categoria | Coloque na raiz de `assets/` |
| Muitos assets para exportar | Use o atalho batch do Figma primeiro |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Soltar assets na raiz do projeto | Colocar dentro de `assets/` com subpastas |
| Nomear `icon1.svg`, `icon2.svg` | Nomear pelo conteudo: `magnifying-glass.svg` |
| Exportar logo como PNG | Exportar como SVG (vetorial, escalavel) |
| Misturar icones e fotos na mesma pasta | Separar em `icons/` e `images/` |
| Exportar hover e default no mesmo arquivo | Arquivos separados com sufixo de estado |
| Comecar a codar sem todos os assets | Exportar e organizar tudo antes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de assets e workflow de exportacao
- [code-examples.md](references/code-examples.md) — Exemplos de estruturas de pasta e convencoes de nomeacao

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-organizando-os-assets/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-organizando-os-assets/references/code-examples.md)
