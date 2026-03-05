# Code Examples: Radio Inputs com Grid Responsivo

## Exemplo completo do formulario de esportes

```html
<div class="input-wrapper">
  <label>Em qual esporte voce gostaria de inscrever seu filho?</label>
  <div class="radial-wrapper">

    <div class="radial-inner">
      <div class="radial-image">
        <img src="./assets/icons/futebol.svg" alt="Icone de futebol">
      </div>
      <input type="radio" name="esporte" id="futebol">
      <label for="futebol">Futebol</label>
    </div>

    <div class="radial-inner">
      <div class="radial-image">
        <img src="./assets/icons/basqueteball02.svg" alt="Icone de basquete">
      </div>
      <input type="radio" name="esporte" id="basquete">
      <label for="basquete">Basquete</label>
    </div>

    <div class="radial-inner">
      <div class="radial-image">
        <img src="./assets/icons/swimming.svg" alt="Icone de natacao">
      </div>
      <input type="radio" name="esporte" id="natacao">
      <label for="natacao">Natacao</label>
    </div>

    <div class="radial-inner">
      <div class="radial-image">
        <img src="./assets/icons/yoga.svg" alt="Icone de yoga">
      </div>
      <input type="radio" name="esporte" id="yoga">
      <label for="yoga">Yoga</label>
    </div>

    <div class="radial-inner">
      <div class="radial-image">
        <img src="./assets/icons/voleibol.svg" alt="Icone de volei">
      </div>
      <input type="radio" name="esporte" id="volei">
      <label for="volei">Volei</label>
    </div>

    <div class="radial-inner">
      <div class="radial-image">
        <img src="./assets/icons/boxing-globe01.svg" alt="Icone de boxe">
      </div>
      <input type="radio" name="esporte" id="boxe">
      <label for="boxe">Boxe</label>
    </div>

  </div>
</div>
```

## CSS do grid responsivo

```css
.radial-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
  gap: 1rem;
}

.radial-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  cursor: pointer;
}

.radial-inner:has(input:checked) {
  border-color: #007bff;
  background-color: #f0f7ff;
}

.radial-image img {
  width: 2.5rem;
  height: 2.5rem;
}

.radial-inner input[type="radio"] {
  /* Pode esconder visualmente se o card inteiro for clicavel */
  /* display: none; */
}
```

## Variacao: radio cards sem imagem

```html
<div class="radial-wrapper">
  <div class="radial-inner">
    <input type="radio" name="plano" id="mensal">
    <label for="mensal">Mensal - R$ 99</label>
  </div>
  <div class="radial-inner">
    <input type="radio" name="plano" id="trimestral">
    <label for="trimestral">Trimestral - R$ 249</label>
  </div>
  <div class="radial-inner">
    <input type="radio" name="plano" id="anual">
    <label for="anual">Anual - R$ 899</label>
  </div>
</div>
```

## Variacao: adicionando novo esporte (template para copiar)

```html
<!-- Template: copie este bloco e substitua SPORT_ID, ICON_FILE, SPORT_NAME -->
<div class="radial-inner">
  <div class="radial-image">
    <img src="./assets/icons/ICON_FILE.svg" alt="Icone de SPORT_NAME">
  </div>
  <input type="radio" name="esporte" id="SPORT_ID">
  <label for="SPORT_ID">SPORT_NAME</label>
</div>
```

## Demonstracao do auto-fit em diferentes larguras

```
Largura ~320px (2 colunas):
┌──────────┐ ┌──────────┐
│ Futebol  │ │ Basquete │
└──────────┘ └──────────┘
┌──────────┐ ┌──────────┐
│ Natacao  │ │  Yoga    │
└──────────┘ └──────────┘
┌──────────┐ ┌──────────┐
│  Volei   │ │  Boxe    │
└──────────┘ └──────────┘

Largura ~500px (3 colunas):
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Futebol  │ │ Basquete │ │ Natacao  │
└──────────┘ └──────────┘ └──────────┘
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Yoga    │ │  Volei   │ │  Boxe    │
└──────────┘ └──────────┘ └──────────┘

Largura ~800px+ (6 colunas):
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│Futeb│ │Basqu│ │Natac│ │Yoga │ │Volei│ │Boxe │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
```