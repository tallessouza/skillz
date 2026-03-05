# Code Examples: Listas HTML

## Exemplo da aula: Receita de Bolo de Cenoura

### Código completo

```html
<h2>Ingredientes</h2>
<ul>
  <li>Farinha - 300g</li>
  <li>Cacau em pó - 100g</li>
  <li>Cenoura ralada - 1 unidade</li>
</ul>

<h2>Modo de preparo</h2>
<ol>
  <li>Pegar a farinha e colocar no recipiente</li>
  <li>Misturar com o cacau</li>
  <li>Misturar a cenoura</li>
</ol>
```

### Resultado visual

**Ingredientes:**
- Farinha - 300g
- Cacau em pó - 100g
- Cenoura ralada - 1 unidade

**Modo de preparo:**
1. Pegar a farinha e colocar no recipiente
2. Misturar com o cacau
3. Misturar a cenoura

## Variações

### Lista de compras (não ordenada)

```html
<h2>Lista de compras</h2>
<ul>
  <li>Leite</li>
  <li>Pão</li>
  <li>Ovos</li>
  <li>Manteiga</li>
</ul>
```

### Tutorial de instalação (ordenada)

```html
<h2>Como instalar o Node.js</h2>
<ol>
  <li>Acesse nodejs.org</li>
  <li>Baixe a versão LTS</li>
  <li>Execute o instalador</li>
  <li>Verifique com <code>node --version</code></li>
</ol>
```

### Lista aninhada (categorias de ingredientes)

```html
<ul>
  <li>Ingredientes secos
    <ul>
      <li>Farinha - 300g</li>
      <li>Cacau em pó - 100g</li>
      <li>Açúcar - 200g</li>
    </ul>
  </li>
  <li>Ingredientes líquidos
    <ul>
      <li>Leite - 200ml</li>
      <li>Óleo - 100ml</li>
    </ul>
  </li>
</ul>
```

### Navegação com lista (uso comum em sites)

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/sobre">Sobre</a></li>
    <li><a href="/contato">Contato</a></li>
  </ul>
</nav>
```

### Lista de definição (bônus — não na aula, mas relacionada)

```html
<dl>
  <dt>UL</dt>
  <dd>Unordered List — lista não ordenada</dd>
  <dt>OL</dt>
  <dd>Ordered List — lista ordenada</dd>
  <dt>LI</dt>
  <dd>List Item — item da lista</dd>
</dl>
```