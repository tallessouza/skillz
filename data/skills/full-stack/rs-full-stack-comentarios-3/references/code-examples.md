# Code Examples: Comentarios no HTML

## Exemplo 1: Comentario basico (da aula)

O instrutor demonstra que texto puro aparece na pagina, mas dentro de comentario, desaparece:

```html
<!-- comentário -->
```

Resultado: nada aparece na pagina. O texto "comentario" so e visivel no codigo-fonte.

## Exemplo 2: Texto livre dentro de comentarios

```html
<!-- 
  Este bloco de texto pode ter multiplas linhas.
  Pode conter <tags> HTML que serao ignoradas.
  Pode ter acentuação, números 123, e símbolos @#$.
  Nada disso aparece na pagina.
-->
```

## Exemplo 3: Comentando codigo para debug

```html
<header>
  <nav>
    <a href="/">Home</a>
    <!-- <a href="/sobre">Sobre</a> -->
    <a href="/contato">Contato</a>
  </nav>
</header>
```

O link "Sobre" esta temporariamente desabilitado. Util durante desenvolvimento, mas deve ser removido ou restaurado antes do deploy.

## Exemplo 4: Separadores de secao

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Pagina</title>
</head>
<body>

  <!-- ======== CABECALHO ======== -->
  <header>
    <h1>Meu Site</h1>
    <nav>
      <a href="/">Inicio</a>
      <a href="/blog">Blog</a>
    </nav>
  </header>

  <!-- ======== CONTEUDO PRINCIPAL ======== -->
  <main>
    <article>
      <h2>Artigo</h2>
      <p>Texto do artigo...</p>
    </article>
  </main>

  <!-- ======== BARRA LATERAL ======== -->
  <aside>
    <h3>Links uteis</h3>
    <ul>
      <li><a href="#">Link 1</a></li>
    </ul>
  </aside>

  <!-- ======== RODAPE ======== -->
  <footer>
    <p>&copy; 2024 Meu Site</p>
  </footer>

</body>
</html>
```

## Exemplo 5: Comentario explicativo (documentacao)

```html
<!-- 
  Wrapper extra necessario para corrigir bug de overflow 
  no Safari iOS 15. Ref: https://bugs.webkit.org/show_bug.cgi?id=XXXXX
  TODO: remover quando droparmos suporte a iOS 15
-->
<div class="safari-fix-wrapper">
  <div class="content-grid">
    ...
  </div>
</div>
```

## Exemplo 6: Marcando areas de template

```html
<!-- SLOT: sidebar-widgets (preenchido pelo CMS) -->
<div id="sidebar-widgets">
  <!-- widgets serao injetados aqui via JavaScript -->
</div>
```

## Exemplo 7: Sintaxe incorreta vs correta

```html
<!-- ERRADO: um traco so -->
<!- isso nao e um comentario valido ->

<!-- ERRADO: tres tracos -->
<!--- isso tambem pode causar problemas --->

<!-- CORRETO: exatamente dois tracos -->
<!-- este e o formato padrao -->
```