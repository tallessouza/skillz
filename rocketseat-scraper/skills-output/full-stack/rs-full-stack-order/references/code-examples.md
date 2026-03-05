# Code Examples: CSS Order Property

## Exemplo basico da aula

```css
/* Todos os items tem order: 0 por padrao */
.container {
  display: flex;
}

/* Mover item 2 para o inicio */
.item-2 {
  order: -1;
}
```
Resultado visual: **2, 1, 3, 4, 5** (mas o HTML continua 1, 2, 3, 4, 5)

```css
/* Mover item 2 para o final */
.item-2 {
  order: 2;
}
```
Resultado visual: **1, 3, 4, 5, 2**

## Layout responsivo com order

```css
.container {
  display: flex;
  flex-direction: column;
}

.sidebar { order: 0; }
.main-content { order: 0; }

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
  .sidebar {
    order: 1; /* Sidebar vai para a direita no desktop */
  }
  .main-content {
    order: 0; /* Conteudo principal fica a esquerda */
  }
}
```

## Destaque de elemento com order

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-featured {
  order: -1; /* Card em destaque sempre aparece primeiro */
}
```

## Valores negativos vs positivos

```css
.a { order: -2; } /* Posicao visual: 1o */
.b { order: -1; } /* Posicao visual: 2o */
.c { /* order: 0 implicito */ } /* Posicao visual: 3o */
.d { order: 1; }  /* Posicao visual: 4o */
.e { order: 2; }  /* Posicao visual: 5o */
```

## Order com Grid

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* Funciona da mesma forma que em flex */
.grid-item-special {
  order: -1;
}
```

## Caso problematico (acessibilidade)

```html
<!-- HTML: etapas de um formulario -->
<form class="steps">
  <fieldset class="step-1">Dados pessoais</fieldset>
  <fieldset class="step-2">Endereco</fieldset>
  <fieldset class="step-3">Pagamento</fieldset>
</form>
```

```css
/* NAO FACA ISSO — leitor de tela vai ler 1, 2, 3 mas visual mostra 3, 1, 2 */
.step-3 { order: -1; }
```

Neste caso, mude a ordem no HTML se precisar alterar a sequencia dos passos.