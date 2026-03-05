# Code Examples: Cascading

## Exemplo 1: Mesma propriedade no mesmo bloco

```css
p {
  color: violet;
  color: blue;   /* violet e ignorado, blue prevalece */
}
```

**Resultado:** texto azul. O editor avisa sobre a duplicata, mas o CSS e valido.

## Exemplo 2: Mesmo seletor em blocos distantes

```html
<p>Texto de exemplo</p>
```

```css
/* Bloco 1 — inicio do arquivo */
p {
  color: violet;
}

/* ... centenas de linhas depois ... */

/* Bloco 2 — fim do arquivo */
p {
  color: blue;
}
```

**Resultado:** texto azul. O segundo bloco `p` sobrescreve o primeiro.

## Exemplo 3: Classe vs Tag (especificidade)

```html
<p class="green">Texto de exemplo</p>
```

```css
p {
  color: violet;   /* especificidade: 0,0,1 */
}

.green {
  color: green;    /* especificidade: 0,1,0 — vence */
}
```

**Resultado:** texto verde. A classe tem especificidade maior que a tag, independente da ordem.

## Exemplo 4: Classe vs Tag — ordem invertida

```html
<p class="green">Texto de exemplo</p>
```

```css
.green {
  color: green;    /* especificidade: 0,1,0 */
}

p {
  color: violet;   /* especificidade: 0,0,1 */
}
```

**Resultado:** texto verde. Mesmo com `.green` vindo antes, a especificidade da classe vence.

## Exemplo 5: Dois seletores de classe (mesma especificidade)

```html
<p class="green highlight">Texto</p>
```

```css
.green {
  color: green;
}

.highlight {
  color: yellow;
}
```

**Resultado:** texto amarelo. Mesma especificidade (ambas sao classe), entao a ordem decide — `.highlight` vem depois.

## Exemplo 6: Combinando propriedades sem conflito

```css
p {
  color: violet;
  font-size: 16px;
}

p {
  margin: 10px;
  padding: 5px;
}
```

**Resultado:** o `<p>` recebe TODAS as propriedades: `color: violet`, `font-size: 16px`, `margin: 10px`, `padding: 5px`. So ha sobrescrita quando a mesma propriedade aparece nos dois blocos.

## Exemplo 7: Conflito parcial

```css
p {
  color: violet;
  font-size: 16px;
}

p {
  color: blue;
  padding: 5px;
}
```

**Resultado:** `color: blue` (sobrescrito), `font-size: 16px` (mantido do primeiro), `padding: 5px` (adicionado do segundo).