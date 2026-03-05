# Code Examples: Especificidade CSS — inline style e !important

## Exemplo 1: Inline style sobrescrevendo ID

Cenario da aula — demonstrando que inline style vence o seletor ID:

```html
<h1 id="title" style="font-size: 32px">Titulo</h1>
```

```css
#title {
  font-size: 12px; /* Nao aplica — inline style tem mais peso */
}
```

**Resultado:** O titulo aparece com 32px, nao 12px.

**Correcao:** Remover o inline style e usar apenas CSS:

```html
<h1 id="title">Titulo</h1>
```

```css
#title {
  font-size: 32px;
}
```

## Exemplo 2: !important sobrescrevendo tudo

```html
<h1 id="title" style="font-size: 32px">Titulo</h1>
```

```css
#title {
  font-size: 12px !important; /* Agora SIM aplica — !important vence ate inline */
}
```

**Resultado:** O titulo aparece com 12px.

**Por que evitar:** Se esquecer que usou `!important` aqui, qualquer tentativa futura de mudar o font-size desse elemento vai falhar silenciosamente.

## Exemplo 3: Escalada de especificidade correta

Em vez de recorrer a inline ou !important, aumente a especificidade do seletor:

```css
/* Nivel 1: tag — peso baixo */
h1 {
  font-size: 24px;
}

/* Nivel 2: class — peso medio */
.page-title {
  font-size: 28px; /* Vence h1 */
}

/* Nivel 3: id — peso alto */
#main-title {
  font-size: 32px; /* Vence .page-title */
}

/* Nivel 4: combinacao — peso ainda maior */
section#hero #main-title {
  font-size: 36px; /* Vence #main-title sozinho */
}
```

## Exemplo 4: Sobrescrevendo CSS de terceiros sem !important

```css
/* Bootstrap define: */
.btn {
  padding: 6px 12px;
}

/* Em vez de: */
.btn {
  padding: 10px 20px !important; /* EVITAR */
}

/* Faca: */
.my-app .btn {
  padding: 10px 20px; /* Mais especifico que .btn sozinho */
}

/* Ou ainda mais especifico se necessario: */
body .my-app .content .btn {
  padding: 10px 20px;
}
```

## Exemplo 5: Quando !important e aceitavel (documentado)

```css
/* JUSTIFICATIVA: Widget de terceiros injeta inline styles via JS
   que nao podemos controlar. !important e o unico recurso. */
.third-party-widget .price {
  color: #333 !important;
}
```

Sempre documente o motivo com um comentario para que o proximo desenvolvedor entenda por que o `!important` esta ali.