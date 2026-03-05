# Code Examples: Especificidade CSS

## Exemplo 1: Os 3 niveis basicos (da aula)

### HTML
```html
<p class="green" id="text">Texto de exemplo</p>
```

### CSS
```css
/* Peso 001 — seletor de elemento */
p {
  color: red;
}

/* Peso 010 — seletor de classe */
.green {
  color: green;
}

/* Peso 100 — seletor de ID */
#text {
  color: blue;
}
```

**Resultado:** Texto fica **blue** porque ID (100) > classe (010) > elemento (001).

## Exemplo 2: Seletor combinado (da aula)

```css
/* Peso 111 — combina os 3 tipos */
p#text.green {
  color: black;
}
```

**Resultado:** Texto fica **black** porque 111 > 100 > 010 > 001.

## Exemplo 3: Cascata so funciona com pesos iguais

```css
/* Ambos peso 010 */
.green {
  color: green;
}

.highlight {
  color: yellow;
}
```

```html
<p class="green highlight">Texto</p>
```

**Resultado:** Texto fica **yellow** — mesmo peso, ultimo vence (cascata).

## Exemplo 4: Classe vence elemento mesmo vindo antes

```css
.title {
  color: blue;
}

h1 {
  color: red;
}
```

```html
<h1 class="title">Titulo</h1>
```

**Resultado:** Texto fica **blue** — classe (010) vence elemento (001) independente da ordem.

## Exemplo 5: Combinando para aumentar especificidade

```css
/* Peso 010 */
.card {
  background: white;
}

/* Peso 011 — mais especifico */
div.card {
  background: gray;
}

/* Peso 020 — ainda mais especifico */
.container .card {
  background: blue;
}
```

## Exemplo 6: Debug de especificidade no mundo real

```css
/* Voce escreveu isso: */
.btn {
  background: green;  /* peso 010 */
}

/* Mas em outro lugar do CSS existe: */
nav .menu .btn {
  background: red;  /* peso 030 — 3 classes */
}

/* Seu .btn nunca vai aplicar green nesse contexto */
/* Solucao: aumente a especificidade do seu seletor */
.page .btn {
  background: green;  /* peso 020 — ainda perde */
}

/* Ou seja mais especifico: */
nav .menu .btn.active {
  background: green;  /* peso 040 — agora vence */
}
```

## Exemplo 7: Tabela de calculo rapido

```
Seletor                    | Calculo          | Peso
---------------------------|------------------|------
p                          | 001              | 1
.card                      | 010              | 10
#header                    | 100              | 100
p.card                     | 001 + 010        | 11
div#header.main            | 001 + 100 + 010  | 111
#nav .menu li a.active     | 100 + 010 + 001 + 001 + 010 | 122
```