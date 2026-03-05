# Code Examples: Text Align e Line Height

## Text Align — Todos os valores

### Alinhamento a esquerda (padrao)
```css
p {
  text-align: left;
}
```
O texto ja vem alinhado a esquerda por padrao, mas pode ser explicito quando sobrescrevendo outro estilo.

### Alinhamento central
```css
h1 {
  text-align: center;
}
```
Usado para titulos, banners, call-to-actions centralizados.

### Alinhamento a direita
```css
.price {
  text-align: right;
}
```
Usado para valores monetarios, datas, elementos que alinham a direita em tabelas ou cards.

### Texto justificado
```css
.article p {
  text-align: justify;
}
```
O texto preenche toda a largura do container, adicionando espaco entre palavras. Funciona bem em paragrafos longos, mas pode criar espacamentos estranhos em textos curtos.

## Line Height — Comparacao de abordagens

### Com pixels (fragil)
```css
.text {
  font-size: 16px;
  line-height: 24px;
}

/* Problema: ao mudar font-size, precisa recalcular */
.text-large {
  font-size: 24px;
  line-height: 24px; /* desproporcional! deveria ser 36px */
}
```

### Com rem (um pouco melhor, mas ainda fixo)
```css
.text {
  font-size: 16px;
  line-height: 1.5rem; /* = 24px, fixo ao root */
}
```
Ainda nao se adapta ao font-size do elemento — so ao root.

### Com multiplicador (recomendado)
```css
.text {
  font-size: 16px;
  line-height: 1.5; /* = 24px */
}

.text-large {
  font-size: 24px;
  line-height: 1.5; /* = 36px, automatico! */
}

.text-small {
  font-size: 12px;
  line-height: 1.5; /* = 18px, automatico! */
}
```

## Convertendo pixels do designer para multiplicador

```
Designer pede: font-size 16px, line-height 24px
Calculo: 24 / 16 = 1.5
CSS: line-height: 1.5

Designer pede: font-size 20px, line-height 28px
Calculo: 28 / 20 = 1.4
CSS: line-height: 1.4

Designer pede: font-size 14px, line-height 22px
Calculo: 22 / 14 ≈ 1.57
CSS: line-height: 1.57
```

## Exemplo completo — Tipografia de pagina

```css
body {
  font-size: 16px;
  line-height: 1.6;
  text-align: left;
}

h1 {
  font-size: 32px;
  line-height: 1.2;
  text-align: center;
}

h2 {
  font-size: 24px;
  line-height: 1.3;
}

.article-body {
  text-align: justify;
  line-height: 1.8; /* mais espaco para leitura confortavel */
}

.caption {
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
}
```

## Multiplicadores comuns da aula

| Multiplicador | Efeito visual |
|---------------|---------------|
| `1` | Linhas coladas, sem espaco extra |
| `1.2` | Compacto, bom para titulos |
| `1.5` | Padrao confortavel para texto corrido |
| `2` | Espaco duplo, como "double spacing" em editores |