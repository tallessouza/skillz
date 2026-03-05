# Code Examples: Anatomia de uma Declaracao CSS

## Exemplo base da aula

### HTML sem estilo
```html
<h1>Meu Titulo</h1>
```
Resultado: titulo com estilo padrao do navegador (preto, tamanho padrao de h1).

### HTML com declaracao CSS completa
```css
h1 {
  color: blue;
  font-size: 60px;
  letter-spacing: 2;
  text-transform: uppercase;
}
```
```html
<h1>Meu Titulo</h1>
```
Resultado: titulo azul, 60px, letras espacadas, tudo em caixa alta ("MEU TITULO").

## Anatomia detalhada

```css
/* ┌─ SELETOR (conecta ao HTML)
   │
   │    ┌─ CONTEXTO (abre com {)
   │    │                                        */
   h1   {
/*   ┌─ PROPRIEDADE    ┌─ VALOR (named)          */
     color:             blue;
/*   ┌─ PROPRIEDADE    ┌─ VALOR (numerico+unidade)*/
     font-size:         60px;
/*   ┌─ PROPRIEDADE    ┌─ VALOR (numerico puro)   */
     letter-spacing:    2;
/*   ┌─ PROPRIEDADE    ┌─ VALOR (named)           */
     text-transform:    uppercase;
   }
/* └─ CONTEXTO (fecha com })                      */
```

## Variacoes por tipo de valor

### Named values
```css
p {
  color: red;                /* cor por nome */
  text-align: center;        /* alinhamento por nome */
  font-weight: bold;         /* peso por nome */
  display: flex;             /* display por nome */
}
```

### Valores numericos com unidade
```css
p {
  font-size: 16px;           /* pixels */
  margin: 2rem;              /* root em */
  padding: 1.5em;            /* em relativo ao pai */
  width: 100%;               /* porcentagem */
  border: 1px solid black;   /* pixel em shorthand */
}
```

### Valores numericos puros
```css
p {
  line-height: 1.5;          /* multiplicador sem unidade */
  opacity: 0.8;              /* 0 a 1 sem unidade */
  flex-grow: 1;              /* sem unidade */
  order: 2;                  /* sem unidade */
}
```

## Efeito broadcast do seletor de tag

```css
/* Esta UNICA declaracao afeta TODOS os paragrafos da pagina */
p {
  color: darkgray;
  line-height: 1.6;
}
```

```html
<p>Primeiro paragrafo — afetado</p>
<p>Segundo paragrafo — tambem afetado</p>
<div>
  <p>Paragrafo aninhado — tambem afetado</p>
</div>
```

## Construcao incremental (approach do instrutor)

```css
/* Passo 1: so cor */
h1 { color: blue; }

/* Passo 2: adiciona tamanho */
h1 { color: blue; font-size: 60px; }

/* Passo 3: adiciona espacamento */
h1 { color: blue; font-size: 60px; letter-spacing: 2; }

/* Passo 4: adiciona transformacao */
h1 { color: blue; font-size: 60px; letter-spacing: 2; text-transform: uppercase; }
```

Cada passo mostra o efeito visual da nova propriedade, facilitando o entendimento do que cada uma faz.