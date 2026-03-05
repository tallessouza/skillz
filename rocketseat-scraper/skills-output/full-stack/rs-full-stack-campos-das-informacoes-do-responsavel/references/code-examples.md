# Code Examples: Campos das Informacoes do Responsavel

## Estrutura HTML completa do fieldset

```html
<fieldset class="guardian">
  <legend>Informações do responsável</legend>

  <!-- Campo nome com texto auxiliar -->
  <div class="input-wrapper">
    <label for="guardian">Nome do responsável</label>
    <input type="text" id="guardian" name="guardian" />
    <small>Obrigatório para menores de 18 anos conforme o ECA</small>
  </div>

  <!-- Campo telefone com placeholder de formato -->
  <div class="input-wrapper">
    <label for="phone">Telefone</label>
    <input
      type="tel"
      id="phone"
      name="phone"
      placeholder="(11) 99999-9999"
    />
  </div>

  <!-- Campo email com validacao e mensagem de erro -->
  <div class="input-wrapper">
    <label for="mail">E-mail</label>
    <input type="email" id="mail" name="mail" required />
    <div class="error">
      <img
        src="./assets/icons/alert-circle.svg"
        alt="Ícone de alerta vermelho"
      />
      <span>Insira um e-mail válido</span>
    </div>
  </div>
</fieldset>
```

## CSS completo dos campos

```css
/* ============================
   Validacao: borda no invalido
   ============================ */
input:invalid {
  border: 0.125rem solid var(--semantic-error);
}

/* ============================
   Mensagem de erro com icone
   ============================ */
input:required ~ .error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--text-small);
  color: var(--semantic-error);
  margin-top: 0.25rem;
}

/* ============================
   Esconde erro: valido + fora de foco
   ============================ */
input:not(:focus):valid ~ .error {
  display: none;
}

/* ============================
   Texto auxiliar (small como irmao)
   ============================ */
input ~ small {
  font-size: var(--text-small);
  color: #7C7C8A;
  display: inline-block;
  margin-top: 0.25rem;
}
```

## Variacao: erro que some DURANTE digitacao (sem :not(:focus))

```css
/* Comportamento: erro pisca a cada caractere */
input:valid ~ .error {
  display: none;
}
```

Resultado: ao digitar `user@e`, o navegador ja considera valido e esconde o erro. Ao continuar com `user@e.`, volta a ser invalido. Efeito visual ruim.

## Variacao: usando + (adjacent sibling) em vez de ~

```html
<!-- Funciona com + porque .error e imediatamente apos input -->
<input type="email" required />
<div class="error">...</div>
```

```css
input:not(:focus):valid + .error {
  display: none;
}
```

```html
<!-- NAO funciona com + porque small esta entre input e .error -->
<input type="email" required />
<small>Texto auxiliar</small>
<div class="error">...</div>
```

```css
/* + nao alcanca .error, precisa de ~ */
input:not(:focus):valid ~ .error {
  display: none;
}
```

## Variacao: campo telefone com pattern

```html
<input
  type="tel"
  id="phone"
  name="phone"
  pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}"
  placeholder="(11) 99999-9999"
  title="Formato: (11) 99999-9999"
/>
```

Com `pattern` + `required`, as pseudo-classes `:invalid`/`:valid` tambem funcionam para telefone.

## Variacao: multiplos campos required no mesmo fieldset

```css
/* Cada campo required com seu proprio .error */
.guardian input:required:invalid {
  border: 0.125rem solid var(--semantic-error);
}

.guardian input:required:not(:focus):valid ~ .error {
  display: none;
}
```