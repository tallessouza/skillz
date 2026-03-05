# Code Examples: Estilos Globais Acessiveis

## Exemplo completo do global.css da aula

```css
/* Reset global — remove estilos padrao dos navegadores */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Fontes — incluindo elementos de formulario que nao herdam do body */
body, input, button, textarea, select {
  font-family: 'Roboto', sans-serif;
}

/* Background padrao Skillz */
body {
  background-color: #121214;
}
```

## Versao corrigida com contraste acessivel

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, input, button, textarea, select {
  font-family: 'Roboto', sans-serif;
}

body {
  background-color: #121214;
  color: #e1e1e6;
  -webkit-font-smoothing: antialiased;
}
```

## Variacao: com CSS custom properties para temas

```css
:root {
  --background: #121214;
  --text-primary: #e1e1e6;
  --text-secondary: #a8a8b3;
  --font-family: 'Roboto', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, input, button, textarea, select {
  font-family: var(--font-family);
}

body {
  background-color: var(--background);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}
```

## Verificacao de contraste no DevTools

Para verificar o contraste manualmente:
1. Abrir DevTools (F12 ou Cmd+Shift+I)
2. Inspecionar o elemento de texto
3. Na aba Styles, clicar no quadrado de cor ao lado de `color`
4. O DevTools mostra o ratio de contraste e os niveis WCAG atingidos

O navegador mostra automaticamente avisos quando o contraste e insuficiente ao passar o mouse sobre elementos no modo de inspecao, como demonstrado pelo instrutor na aula.

## Ordem recomendada do global.css

```css
/* 1. Reset */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* 2. Fontes (incluindo form elements) */
body, input, button, textarea, select {
  font-family: 'Roboto', sans-serif;
}

/* 3. Body base (background + color acessivel) */
body {
  background-color: #121214;
  color: #e1e1e6;
}

/* 4. Utilitarios de acessibilidade (adicionados conforme necessario) */
```