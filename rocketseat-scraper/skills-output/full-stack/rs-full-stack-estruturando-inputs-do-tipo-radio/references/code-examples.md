# Code Examples: Estruturando Inputs do Tipo Radio

## Exemplo 1: Estrutura da aula (turno de estudo)

```html
<fieldset>
  <legend>Opções de matrícula</legend>

  <div class="input-wrapper">
    <label>Selecione o turno de estudo</label>
  </div>

  <div class="radio-wrapper">
    <!-- Opcao: Manha -->
    <div class="radio-inner">
      <div class="radio-image"></div>
      <input type="radio" name="study_shift" value="morning" id="morning">
      <img src="./icons/sun-cloud-02.svg" alt="Ícone de sol com nuvem">
      <label for="morning">Manhã</label>
    </div>

    <!-- Opcao: Tarde -->
    <div class="radio-inner">
      <div class="radio-image"></div>
      <input type="radio" name="study_shift" value="evening" id="evening">
      <img src="./icons/sun.svg" alt="Ícone de sol">
      <label for="evening">Tarde</label>
    </div>
  </div>
</fieldset>
```

## Exemplo 2: Variacao com 3 opcoes (manha, tarde, noite)

```html
<fieldset>
  <legend>Turno de estudo</legend>

  <div class="input-wrapper">
    <label>Selecione o turno desejado</label>
  </div>

  <div class="radio-wrapper">
    <div class="radio-inner">
      <input type="radio" name="study_shift" value="morning" id="morning">
      <img src="./icons/sunrise.svg" alt="Ícone de nascer do sol">
      <label for="morning">Manhã</label>
    </div>

    <div class="radio-inner">
      <input type="radio" name="study_shift" value="afternoon" id="afternoon">
      <img src="./icons/sun.svg" alt="Ícone de sol">
      <label for="afternoon">Tarde</label>
    </div>

    <div class="radio-inner">
      <input type="radio" name="study_shift" value="evening" id="evening">
      <img src="./icons/moon.svg" alt="Ícone de lua">
      <label for="evening">Noite</label>
    </div>
  </div>
</fieldset>
```

## Exemplo 3: Radio group sem icones (simplificado)

```html
<fieldset>
  <legend>Forma de pagamento</legend>

  <div class="radio-wrapper">
    <div class="radio-inner">
      <input type="radio" name="payment_method" value="credit_card" id="credit_card">
      <label for="credit_card">Cartão de crédito</label>
    </div>

    <div class="radio-inner">
      <input type="radio" name="payment_method" value="pix" id="pix">
      <label for="pix">PIX</label>
    </div>

    <div class="radio-inner">
      <input type="radio" name="payment_method" value="boleto" id="boleto">
      <label for="boleto">Boleto bancário</label>
    </div>
  </div>
</fieldset>
```

## Exemplo 4: Radio com opcao pre-selecionada

```html
<fieldset>
  <legend>Tamanho da camiseta</legend>

  <div class="radio-wrapper">
    <div class="radio-inner">
      <input type="radio" name="shirt_size" value="s" id="size_s">
      <label for="size_s">P</label>
    </div>

    <div class="radio-inner">
      <input type="radio" name="shirt_size" value="m" id="size_m" checked>
      <label for="size_m">M</label>
    </div>

    <div class="radio-inner">
      <input type="radio" name="shirt_size" value="l" id="size_l">
      <label for="size_l">G</label>
    </div>
  </div>
</fieldset>
```

## Anatomia dos atributos

```
<input type="radio" name="study_shift" value="morning" id="morning">
       │              │                  │               │
       │              │                  │               └─ Conecta ao label[for]
       │              │                  └─ Dado enviado ao servidor
       │              └─ Agrupa radios (exclusao mutua)
       └─ Tipo do input
```

## Padrao de duplicacao com Ctrl+D

Ao criar o segundo radio a partir do primeiro:

```
1. Copie o bloco .radio-inner inteiro
2. Selecione "morning" com Ctrl+D (multiplas ocorrencias)
3. Substitua por "evening" (muda value, id, e for do label de uma vez)
4. Atualize o texto do label: "Manhã" → "Tarde"
5. Atualize o src e alt da imagem
```