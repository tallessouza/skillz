# Code Examples: CSS Combinators

## HTML base da aula

```html
<article>
  <h2>Titulo</h2>
  <p>Primeiro paragrafo com <span>span</span></p>
  <p>Segundo paragrafo com <mark>mark</mark></p>
  <p>Terceiro paragrafo</p>
</article>

<p>Paragrafo fora do article</p>

<aside>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3
      <ul>
        <li>Sub-item 1</li>
        <li>Sub-item 2</li>
      </ul>
    </li>
  </ul>
</aside>
```

## Descendant combinator

```css
/* Todos os p da pagina */
p {
  color: red;
}

/* Apenas p dentro de article (qualquer profundidade) */
article p {
  color: red;
}
/* O <p> fora do article NAO e afetado */
```

## List combinator

```css
/* Aplica a mesma regra para span e mark */
span, mark {
  color: red;
}

/* Equivalente a escrever separadamente: */
span {
  color: red;
}
mark {
  color: red;
}
```

## Next-sibling combinator

```css
/* Seleciona o p imediatamente apos h2 */
h2 + p {
  color: red;
}
/* Resultado: apenas "Primeiro paragrafo" fica vermelho */

/* Seleciona todo p que tem outro p antes */
p + p {
  color: red;
}
/* Resultado: "Segundo paragrafo" e "Terceiro paragrafo" ficam vermelhos */
/* "Primeiro paragrafo" NAO, porque antes dele tem h2, nao p */
```

## Child combinator

```css
/* ERRADO para o objetivo: pega TODAS as ul */
aside ul {
  margin-top: 50px;
}
/* A ul aninhada dentro do li tambem recebe margin-top */

/* CORRETO: apenas ul filhas diretas de aside */
aside > ul {
  margin-top: 50px;
}
/* A ul aninhada NAO recebe margin-top */
```

## Armadilha: child combinator com propriedades herdaveis

```css
/* PARECE que limita, mas NAO limita a cor */
aside > ul {
  color: red;
}
/* A ul aninhada tambem fica vermelha por HERANCA CSS */
/* O > nao bloqueia heranca, apenas seletores */

/* Para margin/padding/border, funciona como esperado */
aside > ul {
  margin-top: 50px;
  border: 1px solid blue;
}
/* Apenas a ul de primeiro nivel tem margin e border */
```

## Variacoes e combinacoes

```css
/* Encadeando child com next-sibling */
aside > ul + ul {
  margin-top: 20px;
}
/* Se aside tiver duas ul filhas diretas, a segunda recebe margin */

/* Descendant dentro de child */
aside > ul li {
  color: blue;
}
/* Todos os li dentro da primeira ul (qualquer profundidade) */

/* Child estrito em multiplos niveis */
aside > ul > li {
  font-weight: bold;
}
/* Apenas li filhos diretos da ul filha direta de aside */
/* Sub-items dentro de ul aninhada NAO ficam bold */
```