# Code Examples: Display Flex

## Exemplo 1 — Visualizando block vs inline

O instrutor adiciona bordas para demonstrar o comportamento:

```css
/* li e block — ocupa 100% do container */
li {
  border: 1px solid red;
}

/* a e inline — ocupa so o tamanho do texto */
/* Resultado: borda so ao redor do texto, nao da linha toda */
```

## Exemplo 2 — Aplicando flex no elemento inline

```css
/* Antes: <a> ocupa so o tamanho do texto */
/* Depois: <a> ocupa 100% do espaco disponivel */
li a {
  display: flex;
}
```

Alternativa com block (mesmo resultado visual, menos funcionalidade):

```css
li a {
  display: block;
}
```

## Exemplo 3 — Flex container na lista

```css
ul {
  list-style: none;    /* remove os pontinhos */
  display: flex;
  flex-direction: column;  /* um abaixo do outro */
  gap: 8px;            /* 8px ENTRE cada li */
}
```

### Variacao: lista horizontal

```css
ul {
  list-style: none;
  display: flex;
  /* flex-direction: row e padrao, nao precisa declarar */
  gap: 16px;
}
```

## Exemplo 4 — O que o Figma sugeriu vs o que faz sentido

### CSS gerado pelo Figma:
```css
.element {
  box-sizing: border-box;      /* ja aplicado via * */
  display: flex;               /* FAZ SENTIDO */
  flex-direction: row;         /* REDUNDANTE — ja e padrao */
  align-items: center;         /* FAZ SENTIDO */
  padding: 12px 16px;          /* FAZ SENTIDO */
  gap: 8px;                    /* FAZ SENTIDO */
  width: 360px;                /* NAO FAZ SENTIDO — container ja define */
  height: 48px;                /* NAO FAZ SENTIDO — padding ja resolve */
}
```

### CSS limpo apos analise:
```css
.element {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
}
```

## Exemplo 5 — Gap em diferentes direcoes

```css
/* Column: gap cria espaco vertical entre itens */
.vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* Resultado: 8px de espaco ENTRE cada filho, verticalmente */
}

/* Row: gap cria espaco horizontal entre itens */
.horizontal {
  display: flex;
  gap: 16px;
  /* Resultado: 16px de espaco ENTRE cada filho, horizontalmente */
}
```