# Code Examples: Componente de Botao

## HTML base para testes

```html
<div class="flex gap-1">
  <a href="#" class="btn btn-primary btn-small">Label</a>
  <button class="btn btn-primary btn-md">Label</button>
  <span class="btn btn-primary btn-large">Label</span>
</div>
```

## CSS completo do componente (buttons.css)

```css
/* === Classe base: reset tag-agnostico === */
.btn {
  border: none;
  background: transparent;
  color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border-radius: 0.5rem;
  font-weight: var(--font-weight-md);
  font-size: var(--font-size-base);
  line-height: 1.5rem;
  font-family: var(--ff-sans);
  cursor: pointer;
}

/* === Variantes de tamanho === */
.btn-small {
  font-size: var(--font-size-small);
  padding: 0.5rem 1rem;
}

.btn-md {
  font-size: var(--font-size-base);
  padding: 0.75rem 1.5rem;
}

.btn-large {
  font-size: 1.125rem;
  padding: 1rem 2rem;
}

/* === Variante primary: cores com custom properties === */
.btn-primary {
  --btn-bgcolor: var(--text-color-primary);
  --btn-color: var(--bg-color);

  background: var(--btn-bgcolor);
  color: var(--btn-color);
}

/* === Hover: apenas redefine as custom properties === */
.btn-primary:hover {
  --btn-bgcolor: linear-gradient(
    90deg,
    var(--bg-color-secondary) 0%,
    var(--bg-color-primary) 100%
  );
  --btn-color: var(--surface-color);

  background: var(--btn-bgcolor);
  color: var(--btn-color);
}
```

## Classes utilitarias criadas na aula

```css
.flex {
  display: flex;
}

.grid {
  display: grid;
}

.gap-1 {
  gap: 1rem;
}
```

## Importacao no index.css

```css
@import './buttons.css';
```

## Variacao: adicionando btn-secondary

Seguindo o mesmo padrao ensinado, um botao secondary seria:

```css
.btn-secondary {
  --btn-bgcolor: transparent;
  --btn-color: var(--text-color-primary);

  background: var(--btn-bgcolor);
  color: var(--btn-color);
  border: 1px solid var(--text-color-primary);
}

.btn-secondary:hover {
  --btn-bgcolor: var(--text-color-primary);
  --btn-color: var(--bg-color);

  background: var(--btn-bgcolor);
  color: var(--btn-color);
}
```

## Variacao: usando com diferentes tags

```html
<!-- Todos renderizam identicamente -->
<a href="/page" class="btn btn-primary btn-md">Navegar</a>
<button type="submit" class="btn btn-primary btn-md">Enviar</button>
<span role="button" class="btn btn-primary btn-md">Acao</span>
<div class="btn btn-primary btn-md">Container</div>
```

## Padrao de calculo para font-size customizado

Quando o design system nao tem a variavel, calcule manualmente:

```
valor_em_px / 16 = valor_em_rem

18px / 16 = 1.125rem  → usado no btn-large
14px / 16 = 0.875rem  → equivalente ao font-size-small
```

Regra: se o valor e usado apenas em um componente, coloque direto. Se repetir, crie variavel global.

## Debug: verificando variaveis CSS no DevTools

Quando um estilo nao aplica:
1. Inspecione o elemento (F12 ou Ctrl+Shift+I)
2. Verifique se a propriedade aparece riscada (overridden) ou com icone de aviso
3. Confira o nome exato da variavel — um tracinho faltando invalida silenciosamente
4. No painel "Computed", verifique o valor final aplicado