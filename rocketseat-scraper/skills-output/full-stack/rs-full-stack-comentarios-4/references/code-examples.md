# Code Examples: Comentários em CSS

## Exemplo 1: Comentário inline (anotação)

```css
/* Cor definida pelo design system — token: primary-500 */
button {
  background-color: #6366f1;
}
```

## Exemplo 2: Desativar uma propriedade

```css
h1 {
  color: blue;
  /* font-size: 32px; */
  font-weight: bold;
}
```

Útil para testar o efeito de remover uma propriedade sem deletá-la.

## Exemplo 3: Desativar um bloco inteiro (conforme o instrutor)

O instrutor demonstra que você pode envolver um bloco completo:

```css
/*
header {
  background-color: red;
  color: white;
  padding: 20px;
}
*/
```

Todo o seletor e suas propriedades são ignorados pelo navegador.

## Exemplo 4: Desativar múltiplos blocos

```css
/*
.sidebar {
  width: 250px;
  background: #333;
}

.sidebar a {
  color: white;
  text-decoration: none;
}
*/
```

## Exemplo 5: Comentários como separadores de seção

```css
/* ========== TIPOGRAFIA ========== */
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
p { font-size: 1rem; }

/* ========== CORES ========== */
:root {
  --primary: #6366f1;
  --secondary: #a855f7;
}

/* ========== LAYOUT ========== */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

## Exemplo 6: Comentário explicando decisão (não o óbvio)

```css
/* Margem negativa compensa o padding do container pai */
.full-bleed {
  margin-left: -2rem;
  margin-right: -2rem;
}
```

Contraste com comentário inútil:

```css
/* NÃO FAÇA: comentário óbvio */
/* Define margem esquerda como -2rem */
.full-bleed {
  margin-left: -2rem;
}
```

## Exemplo 7: Debugging com comentários

Processo de isolamento de bug visual:

```css
.card {
  /* background: white; */
  /* border: 1px solid #ddd; */
  /* border-radius: 8px; */
  padding: 16px;
  /* box-shadow: 0 2px 4px rgba(0,0,0,0.1); */
}
```

Comente propriedades uma a uma, recarregue o navegador, e identifique qual propriedade causa o problema visual.