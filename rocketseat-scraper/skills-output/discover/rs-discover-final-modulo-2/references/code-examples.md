# Code Examples: Prepare-se Pro Que Vem Por Ai

## Preview das tecnologias mencionadas

Esta aula nao contem codigo — e uma aula motivacional e de roadmap. Porem, o instrutor menciona as tecnologias que serao abordadas nas proximas aulas. Abaixo, um preview minimo de cada uma para contextualizar o que o aluno vai encontrar.

### HTML — Estrutura

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Meu Projeto</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>Meu primeiro projeto web.</p>
  </body>
</html>
```

HTML define O QUE aparece na pagina — titulos, paragrafos, imagens, links.

### CSS — Estilo

```css
body {
  font-family: Arial, sans-serif;
  background-color: #121214;
  color: #e1e1e6;
}

h1 {
  color: #00b37e;
}
```

CSS define COMO as coisas aparecem — cores, fontes, espacamentos, layout.

### JavaScript — Comportamento

```javascript
const button = document.querySelector('button')

button.addEventListener('click', function() {
  alert('Voce clicou!')
})
```

JavaScript define O QUE ACONTECE quando o usuario interage — cliques, animacoes, logica.

### README — Documentacao

```markdown
# Meu Projeto

Projeto desenvolvido durante o curso Discover da Rocketseat.

## Tecnologias

- HTML
- CSS
- JavaScript

## Como usar

Acesse o link: https://meu-usuario.github.io/meu-projeto
```

O README e o "cartao de visita" do projeto no GitHub — descreve o que e, como usar, e quais tecnologias foram usadas.

### GitHub — Publicacao

O fluxo basico de publicacao:

```bash
git init
git add .
git commit -m "primeiro commit"
git remote add origin https://github.com/usuario/projeto.git
git push -u origin main
```

### Deploy — Link funcional

Com GitHub Pages, o projeto ganha um link acessivel por qualquer pessoa:

```
https://seu-usuario.github.io/nome-do-projeto
```

Este e o resultado final que o instrutor mostrou na tela — um projeto real, publicado, funcionando.