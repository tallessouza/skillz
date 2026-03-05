# Code Examples: Exportando Assets e Estrutura de Projeto

## Estrutura basica do projeto apos setup de assets

```
projeto/
├── index.html
├── style.css
└── assets/
    └── bg-mobile.png
```

## Referenciando a imagem de fundo no CSS

```css
body {
  background-image: url('./assets/bg-mobile.png');
  background-size: cover;
  background-position: center;
}
```

## Referenciando imagem no HTML

```html
<img src="./assets/bg-mobile.png" alt="Background mobile" />
```

## Estrutura completa apos baixar todos os assets

```
projeto/
├── index.html
├── style.css
└── assets/
    ├── bg-mobile.png
    ├── logo.svg
    ├── icon-search.svg
    ├── avatar.png
    └── (demais imagens do projeto)
```

## Atalhos do Figma para exportacao

| Sistema | Atalho | Acao |
|---------|--------|------|
| Windows | `Ctrl + Shift + E` | Abrir painel de exportacao |
| Mac | `Shift + Cmd + E` | Abrir painel de exportacao |

## Fluxo completo passo a passo

```bash
# 1. Criar pasta assets no projeto
mkdir assets

# 2. Mover imagem exportada do Figma
mv ~/Downloads/bg-mobile.png ./assets/

# OU se baixou a pasta completa dos materiais complementares:
unzip assets.zip -d ./assets/
```