# Code Examples: Font Size no CSS

## Exemplo 1: Nomes predefinidos

```css
/* Nomes absolutos — voce nao sabe o tamanho exato */
.texto-minusculo { font-size: x-small; }
.texto-pequeno   { font-size: small; }
.texto-grande    { font-size: large; }
.texto-enorme    { font-size: x-large; }
```

## Exemplo 2: Unidade `em` com heranca

```css
/* O em busca no pai e sobe a arvore */
.container { font-size: 20px; }
.container .filho { font-size: 1em; }    /* 20px — herdou do pai */
.container .filho2 { font-size: 1.5em; } /* 30px — 1.5 * 20 */
```

### Cuidado com composicao de em

```css
.nivel1 { font-size: 1.2em; }           /* 1.2 * 16 = 19.2px */
.nivel1 .nivel2 { font-size: 1.2em; }   /* 1.2 * 19.2 = 23.04px */
.nivel1 .nivel2 .nivel3 { font-size: 1.2em; } /* 1.2 * 23.04 = 27.65px */
/* O tamanho cresce a cada nivel! */
```

## Exemplo 3: Unidade `rem` (recomendado)

```css
/* rem vai direto ao root, ignora o pai */
html { font-size: 16px; } /* padrao, nem precisa declarar */

h1 { font-size: 2rem; }      /* 32px, sempre */
h2 { font-size: 1.5rem; }    /* 24px, sempre */
h3 { font-size: 1.25rem; }   /* 20px, sempre */
p  { font-size: 1rem; }      /* 16px, sempre */
.small { font-size: 0.875rem; } /* 14px, sempre */
.tiny  { font-size: 0.75rem; }  /* 12px, sempre */
```

### rem nao compoe (essa e a vantagem)

```css
.nivel1 { font-size: 1.2rem; }                /* 19.2px */
.nivel1 .nivel2 { font-size: 1.2rem; }        /* 19.2px — MESMO valor! */
.nivel1 .nivel2 .nivel3 { font-size: 1.2rem; } /* 19.2px — previsivel */
```

## Exemplo 4: Porcentagem

```css
/* Porcentagem busca no pai, como em */
.base { font-size: 20px; }
.base .proporcional { font-size: 100%; }  /* 20px */
.base .maior { font-size: 120%; }         /* 24px */
.base .menor { font-size: 80%; }          /* 16px */
.base .metade { font-size: 50%; }         /* 10px */
```

## Exemplo 5: Pixels (absoluto)

```css
/* px e fixo — nao muda com contexto nem preferencias do usuario */
.fixo { font-size: 14px; }
.titulo-fixo { font-size: 24px; }
```

## Exemplo 6: Escala tipografica completa com rem

```css
:root {
  font-size: 16px; /* base padrao */
}

/* Escala modular baseada em rem */
.text-xs   { font-size: 0.75rem; }   /* 12px */
.text-sm   { font-size: 0.875rem; }  /* 14px */
.text-base { font-size: 1rem; }      /* 16px */
.text-lg   { font-size: 1.125rem; }  /* 18px */
.text-xl   { font-size: 1.25rem; }   /* 20px */
.text-2xl  { font-size: 1.5rem; }    /* 24px */
.text-3xl  { font-size: 1.875rem; }  /* 30px */
.text-4xl  { font-size: 2.25rem; }   /* 36px */
```

## Exemplo 7: Comparacao lado a lado

```html
<div style="font-size: 20px;">
  <p style="font-size: 1em;">1em = 20px (herda do pai)</p>
  <p style="font-size: 1rem;">1rem = 16px (ignora o pai, vai ao root)</p>
  <p style="font-size: 100%;">100% = 20px (herda do pai, como em)</p>
  <p style="font-size: 16px;">16px = 16px (fixo, ignora tudo)</p>
</div>
```