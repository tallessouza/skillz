# Code Examples: Input Range

## Exemplo 1: Range basico (padrao 0-100)

```html
<form>
  <input type="range" name="total">
  <button type="submit">Submit</button>
</form>
```

Comportamento: slider de 0 a 100, step=1, comeca no meio (50). Ao submeter, envia `?total=50` (ou o valor selecionado).

## Exemplo 2: Range com min e max customizados

```html
<form>
  <input type="range" name="total" min="20" max="200">
  <button type="submit">Submit</button>
</form>
```

Comportamento: slider de 20 a 200. Valor inicial = (20+200)/2 = 110.

## Exemplo 3: Range com step

```html
<form>
  <input type="range" name="total" min="0" max="200" step="20">
  <button type="submit">Submit</button>
</form>
```

Comportamento: valores possiveis sao 0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200. O slider "pula" entre esses valores.

## Exemplo 4: Range com value padrao

```html
<form>
  <input type="range" name="total" min="0" max="200" step="20" value="40">
  <button type="submit">Submit</button>
</form>
```

Comportamento: slider comeca posicionado em 40.

## Exemplo 5: Range completo com label e output (variacao pratica)

```html
<form>
  <label for="brightness">Brilho: <output id="brightnessValue">50</output>%</label>
  <input
    type="range"
    id="brightness"
    name="brightness"
    min="0"
    max="100"
    step="5"
    value="50"
    oninput="document.getElementById('brightnessValue').value = this.value"
  >
  <button type="submit">Aplicar</button>
</form>
```

Variacao que adiciona feedback visual do valor atual — algo que o range nativo nao mostra por padrao.

## Exemplo 6: Multiplos ranges em um form

```html
<form>
  <label>Volume: <input type="range" name="volume" min="0" max="100" value="75"></label>
  <label>Graves: <input type="range" name="bass" min="-10" max="10" step="1" value="0"></label>
  <label>Agudos: <input type="range" name="treble" min="-10" max="10" step="1" value="0"></label>
  <button type="submit">Salvar</button>
</form>
```

Demonstra que ranges podem ter faixas diferentes (0-100 vs -10 a 10) no mesmo formulario.