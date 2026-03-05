# Code Examples: Checkbox, Radio e Hidden

## Exemplo 1: Checkbox basico (da aula)

```html
<!-- Sem value — envia "on" -->
<form action="/submit">
  <input type="checkbox" name="carro">
  <button type="submit">Submit</button>
</form>
<!-- Resultado se marcado: ?carro=on -->
<!-- Resultado se nao marcado: (nada) -->
```

## Exemplo 2: Checkbox com value (da aula)

```html
<form action="/submit">
  <input type="checkbox" name="carro" value="fiat" checked>
  <button type="submit">Submit</button>
</form>
<!-- Resultado: ?carro=fiat (ja vem marcado por padrao) -->
```

## Exemplo 3: Multiplos checkboxes agrupados (da aula)

```html
<form action="/submit">
  <input type="checkbox" name="carro" value="fiat" checked> Fiat
  <input type="checkbox" name="carro" value="audi"> Audi
  <button type="submit">Submit</button>
</form>
<!-- Se ambos marcados: ?carro=fiat&carro=audi -->
<!-- Se so Fiat: ?carro=fiat -->
```

## Exemplo 4: Radio basico (da aula)

```html
<form action="/submit">
  <input type="radio" name="carro" value="fiat"> Fiat
  <input type="radio" name="carro" value="audi"> Audi
  <button type="submit">Submit</button>
</form>
<!-- Selecionar Fiat depois Audi: Audi desmarca Fiat -->
<!-- Resultado: ?carro=audi -->
```

## Exemplo 5: Radio com checked (da aula)

```html
<form action="/submit">
  <input type="radio" name="carro" value="fiat" checked> Fiat
  <input type="radio" name="carro" value="audi"> Audi
  <button type="submit">Submit</button>
</form>
<!-- Fiat ja vem selecionado por padrao -->
```

## Exemplo 6: Radio com names diferentes — ERRO (da aula)

```html
<!-- ERRADO: nomes diferentes permitem selecionar ambos -->
<form action="/submit">
  <input type="radio" name="carro1" value="fiat"> Fiat
  <input type="radio" name="carro2" value="audi"> Audi
  <button type="submit">Submit</button>
</form>
<!-- Ambos podem ficar marcados! Resultado: ?carro1=fiat&carro2=audi -->
```

## Exemplo 7: Input hidden (da aula)

```html
<form action="/submit">
  <input type="hidden" name="id" value="abc-123">
  <input type="text" name="nome" placeholder="Seu nome">
  <button type="submit">Submit</button>
</form>
<!-- O campo id nao aparece no formulario -->
<!-- Resultado: ?id=abc-123&nome=valor_digitado -->
<!-- Visivel apenas no DevTools (Elements > input[type=hidden]) -->
```

## Variacao: Formulario completo com todos os tipos

```html
<form action="/api/pedido" method="POST">
  <!-- Hidden: ID do pedido (transportado sem mostrar) -->
  <input type="hidden" name="pedido_id" value="ped-789">

  <!-- Radio: forma de pagamento (apenas uma) -->
  <fieldset>
    <legend>Forma de pagamento:</legend>
    <input type="radio" name="pagamento" value="pix" checked> Pix
    <input type="radio" name="pagamento" value="cartao"> Cartao
    <input type="radio" name="pagamento" value="boleto"> Boleto
  </fieldset>

  <!-- Checkbox: adicionais (zero ou mais) -->
  <fieldset>
    <legend>Adicionais:</legend>
    <input type="checkbox" name="adicional" value="embalagem"> Embalagem presente
    <input type="checkbox" name="adicional" value="seguro"> Seguro
    <input type="checkbox" name="adicional" value="expresso" checked> Entrega expressa
  </fieldset>

  <button type="submit">Finalizar pedido</button>
</form>
```

## Variacao: Labels com for/id (boa pratica complementar)

```html
<!-- Clicar no texto tambem marca o input -->
<input type="checkbox" name="termos" value="aceito" id="termos">
<label for="termos">Aceito os termos de uso</label>

<input type="radio" name="plano" value="mensal" id="plano-mensal">
<label for="plano-mensal">Plano Mensal</label>

<input type="radio" name="plano" value="anual" id="plano-anual">
<label for="plano-anual">Plano Anual</label>
```