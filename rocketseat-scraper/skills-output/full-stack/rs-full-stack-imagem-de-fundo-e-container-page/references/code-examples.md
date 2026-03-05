# Code Examples: Imagem de Fundo e Container Page

## Exemplo completo da aula

### HTML (estrutura referenciada)

```html
<body>
  <div id="page">
    <img src="..." alt="...">
    <main>
      <!-- conteudo da receita -->
    </main>
  </div>
</body>
```

### CSS completo

```css
body {
  background-image: url(./assets/bg.jpg);
  background-size: cover;
}

#page {
  width: 800px;
  padding: 24px;
  background-color: #36393B;
  border-radius: 24px;
  margin: 48px auto;
  box-sizing: border-box;
}
```

## Variacao: background-image com URL externa

```css
body {
  background-image: url(https://example.com/assets/bg.jpg);
  background-size: cover;
}
```

O instrutor menciona que `url()` aceita tanto caminhos locais quanto URLs externas (https).

## Demonstracao do problema sem box-sizing

```css
/* SEM box-sizing */
#page {
  width: 800px;
  padding: 24px;
}
/* Largura real no DevTools: 848px (800 + 24 + 24) */

/* COM box-sizing */
#page {
  width: 800px;
  padding: 24px;
  box-sizing: border-box;
}
/* Largura real no DevTools: 800px (padding incluso) */
```

## Como verificar no DevTools

1. F12 para abrir DevTools
2. Clicar no icone de selecao (seta) e clicar no elemento
3. Aba **Computed** → digitar "width" → mostra largura do content-box
4. **Hover sobre o elemento** no painel Elements → tooltip mostra largura total real
5. Com `border-box`, ambos os valores serao iguais

## Variacao: background com propriedades adicionais

```css
body {
  background-image: url(./assets/bg.jpg);
  background-size: cover;
  background-position: center;  /* centraliza a imagem */
  background-repeat: no-repeat; /* explicito, embora cover ja resolva */
  background-attachment: fixed; /* imagem fixa durante scroll */
}
```

## Variacao: container responsivo com max-width

```css
/* Para telas menores que 800px */
#page {
  max-width: 800px;
  width: 100%;
  padding: 24px;
  margin: 48px auto;
  box-sizing: border-box;
}
```

## Shorthand de margin explicado

```css
/* Shorthand com 2 valores */
margin: 48px auto;
/* Equivale a: */
margin-top: 48px;
margin-bottom: 48px;
margin-left: auto;
margin-right: auto;

/* Shorthand com 4 valores */
margin: 48px auto 48px auto;
/* top right bottom left */
```

## Fluxo de commit do instrutor

O instrutor finaliza com um commit descritivo:
```
"imagem de fundo, estilo, page"
```

Descreve as duas mudancas principais: background-image no body e estilizacao do #page.