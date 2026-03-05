# Code Examples: Estrutura de Projeto CSS Modular

## Exemplo 1: index.html minimo

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
  <h1>Alô</h1>
</body>
</html>
```

Pontos-chave:
- `lang="pt-br"` para projetos em portugues
- Apenas um `<link>` para CSS
- O instrutor usa `!` (Emmet) para gerar o boilerplate e ajusta manualmente

## Exemplo 2: index.css como hub

```css
/* styles/index.css — apenas imports, nenhum estilo */
@import url("global.css");
```

Evolucao conforme o projeto cresce:

```css
@import url("global.css");
@import url("header.css");
@import url("hero.css");
@import url("cards.css");
@import url("sidebar.css");
@import url("footer.css");
```

## Exemplo 3: global.css inicial

```css
/* styles/global.css — estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  --font-base: 'Inter', sans-serif;
}

body {
  font-family: var(--font-base);
  background-color: var(--color-primary);
  color: #fff;
}
```

## Exemplo 4: Estrutura completa do projeto (evolucao)

```
portal-de-noticias/
├── index.html
├── styles/
│   ├── index.css       ← @import url("global.css");
│   │                      @import url("header.css");
│   │                      @import url("cards.css");
│   ├── global.css      ← reset, variaveis, tipografia
│   ├── header.css      ← estilos do cabecalho
│   ├── cards.css       ← grid de cards de noticias
│   └── footer.css      ← rodape
└── assets/
    └── images/
```

## Configuracao do VS Code mencionada

O instrutor menciona ajustes importantes no `settings.json`:
- Tamanho de fonte
- Altura de linha
- Plugin Live Preview (Microsoft) instalado como Pre-Release

### Atalhos uteis demonstrados:
- `!` + Tab → gerar boilerplate HTML (Emmet)
- Botao direito → Show Preview (Live Preview)
- Toggle Zen Mode para foco