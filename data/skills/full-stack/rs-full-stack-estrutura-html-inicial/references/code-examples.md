# Code Examples: Estrutura HTML a partir de Design

## Estrutura completa da pagina de receita

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagina de Receita</title>
</head>
<body>
  <div id="page">
    <img src="img/recipe.png" alt="Foto da receita">

    <main>
      <section id="about">
        <h1>Waffle de Chocolate com Morango</h1>
        <p>
          Tempo de preparo
          <br>
          40 minutos
          <br>
          12 porções
          <br>
          Dificuldade
          <br>
          Fácil
        </p>
      </section>

      <section id="ingredients">
        <h2>Ingredientes</h2>
        <ul>
          <li>2 xícaras de farinha de trigo</li>
          <li>1 xícara de açúcar</li>
          <li>1/2 xícara de chocolate em pó</li>
          <li>2 ovos</li>
          <li>1 xícara de leite</li>
          <li>1/4 xícara de óleo</li>
          <li>1 colher de chá de fermento</li>
          <li>Morangos para decorar</li>
        </ul>
      </section>

      <section id="preparation">
        <h2>Modo de Preparo</h2>
        <p>
          Para a massa: misture os ingredientes secos,
          adicione os liquidos e mexa ate ficar homogeneo.
          <br><br>
          Para o recheio: derreta o chocolate em banho-maria
          e reserve.
          <br><br>
          Para a montagem: despeje a massa na maquina de waffle,
          cubra com chocolate e decore com morangos.
        </p>
      </section>
    </main>
  </div>
</body>
</html>
```

## Atalhos Emmet usados na aula

```
div#page        → <div id="page"></div>
section#about   → <section id="about"></section>
section#ingredients → <section id="ingredients"></section>
section#preparation → <section id="preparation"></section>
h1              → <h1></h1>
h2              → <h2></h2>
p               → <p></p>
ul>li           → <ul><li></li></ul>
ul>li*8         → <ul> com 8 <li> vazios
img             → <img src="" alt="">
br              → <br>
```

## Tecnica de multicursor para listas

```
# Passo 1: Escrever itens em linhas separadas (sem tags)
2 xicaras de farinha
1 xicara de acucar
1/2 xicara de chocolate

# Passo 2: Alt + Click no inicio de cada linha (multicursor)
# Passo 3: Digitar <li>
<li>2 xicaras de farinha
<li>1 xicara de acucar
<li>1/2 xicara de chocolate

# Passo 4: Ctrl/Cmd + seta direita (ir para o fim de todas as linhas)
# Passo 5: Digitar </li>
<li>2 xicaras de farinha</li>
<li>1 xicara de acucar</li>
<li>1/2 xicara de chocolate</li>
```

## Variacoes: diferentes tipos de conteudo

### Receita com lista ordenada (modo de preparo como steps)

```html
<section id="preparation">
  <h2>Modo de Preparo</h2>
  <ol>
    <li>Misture os ingredientes secos</li>
    <li>Adicione os liquidos</li>
    <li>Mexa ate homogeneizar</li>
    <li>Despeje na forma</li>
    <li>Asse por 30 minutos</li>
  </ol>
</section>
```

### Informacoes da receita com semantica mais rica

```html
<section id="about">
  <h1>Waffle de Chocolate</h1>
  <ul>
    <li>Tempo de preparo: 40 minutos</li>
    <li>Porções: 12</li>
    <li>Dificuldade: Fácil</li>
  </ul>
</section>
```

### Multiplas sub-secoes no modo de preparo

```html
<section id="preparation">
  <h2>Modo de Preparo</h2>

  <h3>Massa</h3>
  <p>Misture os ingredientes secos...</p>

  <h3>Recheio</h3>
  <p>Derreta o chocolate...</p>

  <h3>Montagem</h3>
  <p>Despeje a massa na forma...</p>
</section>
```