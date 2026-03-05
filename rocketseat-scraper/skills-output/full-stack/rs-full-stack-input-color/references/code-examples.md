# Code Examples: Input Color e DataList

## Exemplo 1: Input color basico

```html
<!-- Color picker simples, sem valor padrao (usa preto #000000) -->
<input type="color">
```

## Exemplo 2: Com valor padrao

```html
<!-- Inicia com uma cor especifica -->
<input type="color" value="#0FACAA">
```

O valor `#0FACAA` aparece ja selecionado ao carregar a pagina.

## Exemplo 3: Com DataList (do transcript)

```html
<input type="color" list="color-picker" value="#0FACAA">

<datalist id="color-picker">
  <option value="#FCAC00" />
  <option value="#FF00DD" />
</datalist>
```

Ao clicar no input, o usuario ve as duas opcoes predefinidas. Se quiser outra cor, abre o color picker completo.

## Exemplo 4: Formulario completo com submit

```html
<form method="POST" action="/salvar-preferencias">
  <label for="cor-tema">Cor do tema:</label>
  <input type="color" id="cor-tema" name="tema" value="#3366FF" list="cores-sugeridas">
  <button type="submit">Salvar</button>
</form>

<datalist id="cores-sugeridas">
  <option value="#3366FF" />
  <option value="#FF6633" />
  <option value="#33FF66" />
  <option value="#FF3366" />
</datalist>
```

No submit, o valor enviado sera algo como `tema=%233366FF`.

## Exemplo 5: Multiplos color inputs com DataList compartilhado

```html
<label>Cor primaria:</label>
<input type="color" name="primary" list="paleta" value="#0066FF">

<label>Cor secundaria:</label>
<input type="color" name="secondary" list="paleta" value="#FF6600">

<datalist id="paleta">
  <option value="#0066FF" />
  <option value="#FF6600" />
  <option value="#00CC66" />
  <option value="#CC0066" />
</datalist>
```

Um unico DataList pode ser reutilizado por multiplos inputs.

## Exemplo 6: DataList em input text (para referencia)

```html
<!-- DataList nao e exclusivo de color -->
<input type="text" list="frutas" placeholder="Escolha uma fruta">

<datalist id="frutas">
  <option value="Banana">
  <option value="Maca">
  <option value="Laranja">
</datalist>
```

Mesmo mecanismo de `list` + `id`, mas com sugestoes de texto.

## Valores invalidos (comportamento)

```html
<!-- INVALIDO: nome de cor — navegador ignora, usa #000000 -->
<input type="color" value="red">

<!-- INVALIDO: hex curto — navegador ignora -->
<input type="color" value="#FFF">

<!-- VALIDO: hex completo -->
<input type="color" value="#FF0000">
```