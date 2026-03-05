# Code Examples: Cascata e Especificidade CSS

## Exemplo 1: Cascata pura (mesmo seletor)

```css
body {
  background: red;
}

body {
  background: blue;
}
/* Resultado: background azul — ultimo vence */
```

Multiplas propriedades dentro do mesmo seletor tambem seguem a cascata:

```css
body {
  background: red;
  background: blue;  /* Este vence */
  background: green; /* Este vence */
}
/* Resultado: background verde */
```

## Exemplo 2: Especificidade com elemento vs ID

```html
<p id="unico-1">Primeiro paragrafo</p>
<p>Segundo paragrafo</p>
<p>Terceiro paragrafo</p>
```

```css
p {
  color: red; /* Especificidade: 0,0,1 */
}

p {
  color: blue; /* Especificidade: 0,0,1 — mesmo peso, cascata: este vence */
}

#unico-1 {
  color: blue; /* Especificidade: 1,0,0 — vence qualquer seletor de elemento */
}
```

Resultado:
- Primeiro `<p>`: azul (ID vence)
- Segundo e terceiro `<p>`: azul (cascata, ultimo `p` vence)

## Exemplo 3: Classe vs Elemento

```html
<p class="qualquer">Paragrafo com classe</p>
<p>Paragrafo sem classe</p>
```

```css
p {
  color: red; /* 0,0,1 */
}

.qualquer {
  color: green; /* 0,1,0 — vence elemento mesmo aparecendo depois ou antes */
}
```

O instrutor mostra que nao precisa colocar o seletor de elemento antes da classe: `.qualquer` funciona igual a `p.qualquer` para selecionar, porem com pesos diferentes:
- `.qualquer` = `0,1,0`
- `p.qualquer` = `0,1,1`

## Exemplo 4: Erros de nomenclatura

```css
/* INVALIDO — comeca com numero */
#1unico {
  color: red; /* NAO APLICA — erro silencioso */
}

/* INVALIDO — caractere especial no inicio */
.@classe {
  color: red; /* NAO APLICA */
}

/* VALIDO — underscore no inicio */
._classe {
  color: green; /* Funciona normalmente */
}

/* VALIDO — hifen no inicio */
.-classe {
  color: blue; /* Funciona normalmente */
}
```

## Exemplo 5: Tabela completa de pesos

```css
p { }                    /* 0,0,1 = 1   */
p.classe { }             /* 0,1,1 = 11  */
.classe { }              /* 0,1,0 = 10  */
#id { }                  /* 1,0,0 = 100 */
#id .classe { }          /* 1,1,0 = 110 */
#id .classe p { }        /* 1,1,1 = 111 */
```

## Exemplo 6: Cascata como desempate

```css
.alerta { color: red; }    /* 0,1,0 */
.destaque { color: blue; } /* 0,1,0 — mesmo peso */
```

```html
<p class="alerta destaque">Que cor?</p>
<!-- Resultado: azul — mesmo peso, ultimo na cascata vence -->
```