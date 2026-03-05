---
name: rs-full-stack-iniciando-o-projeto-6
description: "Applies CSS project scaffolding structure when setting up a new HTML/CSS project. Use when user asks to 'create a project', 'start a new site', 'setup HTML CSS', 'scaffold a frontend project', or 'organize CSS files'. Enforces modular CSS with index.css as entry point importing global.css and feature-specific files. Make sure to use this skill whenever creating a new static HTML/CSS project from scratch. Not for React, Next.js, or framework-based projects with built-in CSS tooling."
---

# Estrutura de Projeto CSS Modular

> Organize CSS em arquivos pequenos e modulares, usando um index.css como ponto de entrada que importa todos os outros.

## Rules

1. **Crie uma pasta `styles/`** — todo CSS fica dentro dela, porque misturar CSS na raiz polui o projeto
2. **`index.css` e o unico arquivo linkado no HTML** — ele importa todos os outros via `@import url()`, porque centraliza a ordem de carregamento
3. **`global.css` contem apenas estilos globais** — reset, variaveis, tipografia base, porque esses estilos se aplicam em todas as paginas
4. **Um arquivo CSS por secao/componente** — conforme o projeto cresce, crie arquivos como `header.css`, `cards.css`, porque facilita manutencao e evita conflitos
5. **Use Live Preview no VS Code** — instale o plugin da Microsoft para ver mudancas em tempo real, porque elimina o alt-tab constante para o browser

## Steps

### Step 1: Criar estrutura de pastas

```
projeto/
├── index.html
└── styles/
    ├── index.css
    └── global.css
```

### Step 2: Configurar index.html

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/index.css">
  <title>Portal de Notícias</title>
</head>
<body>
  <!-- conteudo -->
</body>
</html>
```

Apenas `styles/index.css` e linkado. Nunca linke multiplos CSS no HTML.

### Step 3: Configurar index.css como hub de imports

```css
@import url("global.css");
```

Conforme o projeto cresce, adicione imports:

```css
@import url("global.css");
@import url("header.css");
@import url("cards.css");
@import url("footer.css");
```

### Step 4: Iniciar global.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* variaveis, fontes, estilos globais */
```

### Step 5: Instalar Live Preview

1. Abrir Extensions no VS Code (Ctrl+Shift+X)
2. Buscar "Live Preview" (publisher: Microsoft)
3. Instalar como Pre-Release
4. Clicar com botao direito no `index.html` → Show Preview
5. O preview abre dentro do VS Code com hot reload

## Output format

```
projeto/
├── index.html          ← unico HTML, linka apenas index.css
└── styles/
    ├── index.css       ← hub de @imports, nenhum estilo direto
    ├── global.css      ← reset, variaveis, tipografia
    ├── header.css      ← (criado conforme necessario)
    └── cards.css       ← (criado conforme necessario)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo estilo que se aplica em toda a pagina | Adicione em `global.css` |
| Estilo especifico de uma secao | Crie arquivo separado e importe em `index.css` |
| Arquivo CSS ficou grande (>150 linhas) | Divida em arquivos menores por responsabilidade |
| Precisa de variaveis CSS | Defina em `global.css` no `:root` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Linkar multiplos CSS no HTML | Linkar apenas `index.css` e usar `@import` |
| Colocar todo CSS em um unico arquivo | Separar por secao/componente |
| Misturar arquivos CSS na raiz do projeto | Manter tudo dentro de `styles/` |
| Escrever estilos diretamente no `index.css` | Usar `index.css` apenas para imports |

## Verification

- `index.html` linka apenas `styles/index.css`
- `index.css` contem apenas `@import url()` statements
- `global.css` contem apenas estilos verdadeiramente globais
- Live Preview mostra o projeto corretamente dentro do VS Code

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao CSS modular e workflow de desenvolvimento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes