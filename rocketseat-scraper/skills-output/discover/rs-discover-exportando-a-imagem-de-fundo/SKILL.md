---
name: rs-discover-exportando-imagem-de-fundo
description: "Guides asset export and folder organization when setting up HTML/CSS projects from Figma designs. Use when user asks to 'export assets from Figma', 'organize project images', 'setup assets folder', or 'prepare images for HTML/CSS'. Applies correct folder structure and export workflow for Rocketseat Discover projects. Make sure to use this skill whenever starting a new HTML/CSS project that requires design assets. Not for image optimization, responsive images, or CSS background properties."
---

# Exportando Assets do Figma para Projetos HTML/CSS

> Organize assets do design em uma pasta dedicada no projeto antes de escrever qualquer codigo.

## Prerequisites

- Acesso ao projeto no Figma (ou arquivo de design equivalente)
- Pasta do projeto HTML/CSS ja criada localmente

## Steps

### Step 1: Abrir painel de exportacao no Figma

No Style Guide do projeto Figma:
- **Windows:** `Ctrl + Shift + E`
- **Mac:** `Shift + Cmd + E`

Isso abre o painel lateral com todos os assets exportaveis.

### Step 2: Exportar o asset desejado

Clicar no botao de export do elemento (ex: `Export BG Mobile`). O arquivo vai para a pasta de downloads do sistema.

### Step 3: Criar pasta assets no projeto

```
projeto/
├── index.html
├── style.css
└── assets/          ← criar esta pasta
    └── bg-mobile.png
```

### Step 4: Mover imagem para a pasta assets

Mover o arquivo exportado da pasta de downloads para `assets/` no projeto.

## Duas estrategias validas

| Estrategia | Quando usar | Vantagem |
|-----------|-------------|----------|
| Baixar pasta Assets completa do material complementar | No inicio do curso | Todas as imagens ja disponiveis, nao precisa exportar nas proximas aulas |
| Exportar uma a uma do Figma | Aula por aula | Aprende o fluxo de exportacao do Figma |

## Output format

```
projeto/
├── index.html
├── style.css
└── assets/
    ├── bg-mobile.png
    ├── (demais imagens exportadas nas proximas aulas)
    └── ...
```

## Error handling

- Se a pasta Assets baixada veio zipada: extrair antes de usar
- Se exportou do Figma e nao encontrou o arquivo: verificar pasta de downloads do sistema

## Verification

- Imagem aparece dentro de `assets/` no projeto
- Caminho relativo `./assets/bg-mobile.png` acessivel a partir do HTML

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de assets e fluxo Figma
- [code-examples.md](references/code-examples.md) — Exemplos de estrutura de pasta e referencia de imagens em HTML/CSS