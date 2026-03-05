# Code Examples: Campo SELECT em Formularios HTML

## Exemplo 1 — SELECT basico com placeholder

Estrutura minima funcional demonstrada na aula:

```html
<form>
  <select name="car">
    <option value="">Selecione</option>
    <option value="fiat">Fiat</option>
  </select>
  <button>Enviar</button>
</form>
```

**Payload ao enviar sem selecionar:** `car=`
**Payload ao selecionar Fiat:** `car=fiat`

## Exemplo 2 — OPTION com atributo label

Sintaxe alternativa mostrada pelo instrutor:

```html
<select name="car">
  <option value="">Selecione</option>
  <option label="Fiat" value="fiat">
</select>
```

Funciona identicamente ao formato com conteudo entre tags.

## Exemplo 3 — SELECT com MULTIPLE

```html
<select name="car" multiple>
  <option value="">Selecione</option>
  <option value="fiat">Fiat</option>
  <option value="bmw">BMW</option>
</select>
```

Interacao: CTRL+clique para selecionar multiplos, SHIFT+clique para range.

## Exemplo 4 — MULTIPLE com SIZE

```html
<select name="car" multiple size="6">
  <option value="">Selecione</option>
  <option value="fiat">Fiat</option>
  <option value="bmw">BMW</option>
</select>
```

SIZE controla quantas opcoes aparecem visiveis. Rolagem aparece se opcoes > size.

## Exemplo 5 — OPTGROUP para categorias

Exemplo completo da aula com agrupamento:

```html
<select name="car" size="6">
  <option value="">Selecione</option>
  <optgroup label="Esportivo">
    <option value="fiat">Fiat</option>
    <option value="bmw">BMW</option>
  </optgroup>
  <optgroup label="Familia">
    <option value="uno">Uno</option>
    <option value="chevette">Chevette</option>
  </optgroup>
</select>
```

OPTGROUP labels nao sao selecionaveis — sao apenas categorias visuais.

## Exemplo 6 — Variacao: SELECT completo com todos os atributos

```html
<form action="/submit" method="post">
  <label for="cars">Escolha seus carros:</label>
  <select id="cars" name="cars" multiple size="8">
    <optgroup label="Esportivo">
      <option value="ferrari">Ferrari</option>
      <option value="lamborghini">Lamborghini</option>
      <option value="porsche">Porsche</option>
    </optgroup>
    <optgroup label="Familia">
      <option value="uno">Uno</option>
      <option value="gol">Gol</option>
      <option value="civic">Civic</option>
    </optgroup>
    <optgroup label="SUV">
      <option value="tracker">Tracker</option>
      <option value="compass">Compass</option>
    </optgroup>
  </select>
  <button type="submit">Enviar</button>
</form>
```

Combina: label acessivel, multiple, size, e optgroups multiplos.