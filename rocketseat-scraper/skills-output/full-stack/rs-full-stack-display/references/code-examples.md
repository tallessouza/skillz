# Code Examples: Display CSS — Block vs Inline

## Exemplo 1: Flow padrao do HTML

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Sem nenhum CSS de layout — apenas bordas para visualizar */
    h1 { border: 2px solid blue; }
    p { border: 2px solid green; }
    a { border: 2px solid red; }
    strong { border: 2px solid orange; }
  </style>
</head>
<body>
  <!-- Block: cada um ocupa uma linha -->
  <h1>Titulo (block)</h1>
  <p>Paragrafo (block)</p>

  <!-- Inline: ficam lado a lado dentro do texto -->
  <p>
    Texto com <a href="#">link (inline)</a> e
    <strong>negrito (inline)</strong> na mesma linha
  </p>
</body>
</html>
```

**Resultado**: `h1` e `p` empilham verticalmente. `a` e `strong` fluem dentro do paragrafo.

## Exemplo 2: Mudando display de block para inline

```css
/* Navegacao horizontal com lista */
nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  display: inline; /* li e block por padrao, agora fica lado a lado */
}
```

```html
<nav>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Sobre</a></li>
    <li><a href="#">Contato</a></li>
  </ul>
</nav>
```

## Exemplo 3: Mudando display de inline para block

```css
/* Links empilhados em menu vertical */
.menu a {
  display: block; /* a e inline por padrao, agora ocupa linha toda */
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
```

```html
<div class="menu">
  <a href="#">Dashboard</a>
  <a href="#">Perfil</a>
  <a href="#">Configuracoes</a>
  <a href="#">Sair</a>
</div>
```

## Exemplo 4: inline-block — o meio-termo

```css
.badge {
  display: inline-block; /* lado a lado, mas aceita width/height */
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: #007bff;
  color: white;
  border-radius: 4px;
  margin: 4px;
}
```

```html
<span class="badge">HTML</span>
<span class="badge">CSS</span>
<span class="badge">JS</span>
```

## Exemplo 5: Demonstrando que inline ignora width/height

```css
/* ISSO NAO FUNCIONA como esperado */
a {
  width: 200px;   /* ignorado — a e inline */
  height: 50px;   /* ignorado — a e inline */
  background: yellow;
}

/* ISSO FUNCIONA */
a {
  display: inline-block; /* agora aceita width/height */
  width: 200px;
  height: 50px;
  background: yellow;
}
```

## Exemplo 6: Visualizando a diferenca no flow

```html
<style>
  .block-example div {
    background: lightblue;
    border: 1px solid blue;
    margin: 4px 0;
    padding: 8px;
  }
  .inline-example span {
    background: lightyellow;
    border: 1px solid orange;
    padding: 4px;
  }
</style>

<!-- Block: cada div em sua propria linha -->
<div class="block-example">
  <div>Caixa 1 (block)</div>
  <div>Caixa 2 (block)</div>
  <div>Caixa 3 (block)</div>
</div>

<!-- Inline: spans lado a lado -->
<div class="inline-example">
  <span>Caixa 1 (inline)</span>
  <span>Caixa 2 (inline)</span>
  <span>Caixa 3 (inline)</span>
</div>
```

## Tabela de referencia rapida

| Propriedade | Block | Inline | Inline-block |
|-------------|-------|--------|-------------|
| Ocupa linha toda | Sim | Nao | Nao |
| Aceita width/height | Sim | Nao | Sim |
| Aceita margin vertical | Sim | Nao | Sim |
| Aceita padding vertical | Sim | Visual apenas* | Sim |
| Elementos ficam lado a lado | Nao | Sim | Sim |

*Padding vertical em inline aumenta visualmente mas nao empurra elementos acima/abaixo.