# Code Examples: Anatomia das Tags HTML

## Exemplo 1: Tag h1 completa (do instrutor)

```html
<!-- Abertura: <h1> -->
<!-- Conteudo: Titulo -->
<!-- Fechamento: </h1> -->
<h1>Titulo</h1>
```

### Variacoes com atributos

```html
<!-- Com atributo id (exemplo do instrutor) -->
<h1 id="main-title">Titulo</h1>

<!-- Com multiplos atributos -->
<h1 id="main-title" class="heading">Titulo</h1>
```

## Exemplo 2: Tag img vazia (do instrutor)

```html
<!-- Void element — sem conteudo, sem fechamento -->
<img src="photo.jpg" alt="Descricao da foto">
```

### Variacoes

```html
<!-- Com mais atributos -->
<img src="photo.jpg" alt="Descricao" width="300" height="200">

<!-- Com barra opcional (valido mas nao recomendado em HTML5) -->
<img src="photo.jpg" alt="Descricao" />
```

## Exemplo 3: Tag br (do instrutor)

```html
<!-- Void element sem atributos -->
<p>Primeira linha<br>Segunda linha</p>
```

### Uso pratico

```html
<!-- Endereco com quebras de linha -->
<address>
  Rua das Flores, 123<br>
  Sao Paulo - SP<br>
  Brasil
</address>
```

## Exemplo 4: Anatomia completa anotada

```html
<!--
  ANATOMIA:
  
  <tagname attribute="value">Conteudo</tagname>
  |______| |______________|  |______| |_________|
  abertura    atributo       conteudo  fechamento
  
  |_______________________________________________|
                    elemento
-->

<h1 id="titulo">Meu Titulo</h1>
```

## Exemplo 5: Comparacao — elementos com conteudo vs vazios

```html
<!-- ELEMENTOS COM CONTEUDO (precisam de fechamento) -->
<h1>Titulo</h1>
<p>Paragrafo de texto</p>
<a href="https://example.com">Clique aqui</a>
<div>Container</div>
<span>Texto inline</span>

<!-- ELEMENTOS VAZIOS (sem conteudo, sem fechamento) -->
<img src="foto.jpg" alt="Foto">
<br>
<hr>
<input type="text">
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">
```

## Exemplo 6: Atributos configurando void elements

```html
<!-- img: atributos dao toda a funcionalidade -->
<img src="avatar.png" alt="Foto do usuario" width="48" height="48">

<!-- input: atributos definem tipo e comportamento -->
<input type="email" name="user-email" placeholder="seu@email.com" required>

<!-- meta: atributos carregam metadados -->
<meta name="description" content="Pagina sobre anatomia HTML">
```