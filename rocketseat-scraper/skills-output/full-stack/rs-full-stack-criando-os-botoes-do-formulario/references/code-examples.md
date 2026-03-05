# Code Examples: Botões de Formulário

## Exemplo completo: HTML dos botões

```html
<form>
  <!-- ... campos do formulário ... -->

  <div class="actions-wrapper">
    <button class="btn btn-secondary" type="button">Salvar respostas</button>
    <button class="btn btn-primary" type="submit">Fazer matrícula</button>
  </div>
</form>
```

## Exemplo completo: buttons.css

```css
/* Reset total de todos os botões */
button {
  all: unset;
  font-weight: 500;
  color: var(--text-highlight);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

/* Botão primário — ação principal do formulário */
.btn-primary {
  color: white;
  background-color: #5033c3;
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: #6842ff;
}

/* Botão secundário — ação alternativa */
.btn-secondary {
  margin-left: auto;
  border: 1px solid var(--text-highlight);
}

.btn-secondary:hover,
.btn-secondary:focus {
  outline: 0.25rem solid var(--surface-secondary);
  color: #5033c3;
  border-color: #5033c3;
}
```

## Exemplo completo: estilos do wrapper (dentro de forms.css)

```css
.actions-wrapper {
  margin-top: 3rem;
  display: flex;
  gap: 16px;
}
```

## Importação no index.html

```html
<link rel="stylesheet" href="styles/buttons.css" />
```

## Variação: três botões de ação

```html
<div class="actions-wrapper">
  <button class="btn btn-secondary" type="button">Cancelar</button>
  <button class="btn btn-secondary" type="button">Salvar rascunho</button>
  <button class="btn btn-primary" type="submit">Enviar</button>
</div>
```

```css
/* O último botão secundário empurra para a direita */
.actions-wrapper .btn-secondary:last-of-type {
  margin-left: auto;
}
```

## Variação: botão desabilitado

```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

## Variação: botão com ícone

```html
<button class="btn btn-primary" type="submit">
  <span>Fazer matrícula</span>
  <svg><!-- ícone --></svg>
</button>
```

```css
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
```

## Demonstração da validação nativa

```html
<form>
  <input type="text" name="nome" required />
  <input type="email" name="email" required />

  <div class="actions-wrapper">
    <button type="button">Salvar</button>
    <!-- Ao clicar, o browser bloqueia se campos required estão vazios -->
    <button type="submit">Enviar</button>
  </div>
</form>
```