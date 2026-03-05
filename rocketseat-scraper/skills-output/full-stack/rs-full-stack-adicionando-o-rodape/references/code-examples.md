# Code Examples: Footer com Alinhamento de Icones SVG

## Exemplo completo da aula

### HTML (index.html — final do body)

```html
<footer>
  Feito com <img src="assets/heart.svg" alt="coracao"> pela Rocketseat
</footer>
```

### CSS (style.css — secao do footer)

```css
footer {
  color: #7B7B7B;
  text-align: center;
  padding-bottom: 48px;
  font-size: 16px;
  line-height: 150%;
}

footer img {
  vertical-align: middle;
}
```

## Variacao: Footer com flexbox (abordagem profissional mencionada)

```html
<footer>
  <span>Feito com</span>
  <img src="assets/heart.svg" alt="coracao">
  <span>pela Rocketseat</span>
</footer>
```

```css
footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #7B7B7B;
  padding-bottom: 48px;
  font-size: 16px;
  line-height: 150%;
}
```

## Todos os valores de vertical-align demonstrados

```css
/* Cada um desses foi testado no DevTools durante a aula */
footer img { vertical-align: baseline; }   /* Padrao — geralmente desalinhado */
footer img { vertical-align: bottom; }     /* Fundo da linha */
footer img { vertical-align: middle; }     /* Centro — o escolhido */
footer img { vertical-align: sub; }        /* Posicao de subscrito */
footer img { vertical-align: super; }      /* Posicao de sobrescrito */
footer img { vertical-align: text-bottom; } /* Fundo do texto */
footer img { vertical-align: text-top; }   /* Topo do texto */
```

## Variacao: Footer com icone e link

```html
<footer>
  Feito com <img src="assets/heart.svg" alt="coracao"> pela
  <a href="https://rocketseat.com.br">Rocketseat</a>
</footer>
```

```css
footer {
  color: #7B7B7B;
  text-align: center;
  padding-bottom: 48px;
  font-size: 16px;
  line-height: 150%;
}

footer img {
  vertical-align: middle;
}

footer a {
  color: inherit;
  text-decoration: underline;
}
```

## Variacao: Footer com copyright

```html
<footer>
  <p>&copy; 2024 — Feito com <img src="assets/heart.svg" alt="coracao"> pela Rocketseat</p>
</footer>
```

```css
footer {
  text-align: center;
  padding: 28px 0 48px;
  color: #7B7B7B;
  font-size: 16px;
}

footer img {
  vertical-align: middle;
}
```

## Como exportar SVG do Phosphor Icons

1. Acesse o site de icones (ex: phosphoricons.com)
2. Busque o icone desejado (ex: "heart")
3. Clique no icone
4. Exporte como SVG (botao de download/export)
5. Salve na pasta `assets/` do projeto como `heart.svg`
6. Referencie: `<img src="assets/heart.svg" alt="coracao">`