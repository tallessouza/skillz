# Code Examples: Pseudo-selector :hover e Transições

## Exemplo 1: Botão dark mode com hover (da aula)

### Estado base do botão
```css
.button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1.5px solid transparent;
  /* outras propriedades do botão já definidas */
  transition: background-color 0.2s;
}
```

### Estado hover
```css
.button:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1.5px solid white;
}
```

## Exemplo 2: Com `all` (demonstrado como problema)

```css
.button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1.5px solid transparent;
  transition: all 0.5s; /* PROBLEMA: transiciona tudo no carregamento */
}
```

Ao carregar a página, todas as propriedades (cor, borda, padding, tamanho) animam desde o valor inicial do browser até o valor definido no CSS.

## Exemplo 3: Transição de múltiplas propriedades

```css
.button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1.5px solid transparent;
  transition: background-color 0.2s, border-color 0.2s;
}

.button:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: white;
}
```

## Variação: Link com hover

```css
.nav-link {
  color: #ccc;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #fff;
}
```

## Variação: Card com hover

```css
.card {
  background-color: #1a1a1a;
  border: 1px solid transparent;
  transition: background-color 0.2s, border-color 0.2s;
}

.card:hover {
  background-color: #222;
  border-color: rgba(255, 255, 255, 0.1);
}
```

## Comparação de durações

```css
/* Muito rápido — quase imperceptível */
.fast { transition: background-color 0.1s; }

/* Ideal para botões — suave e responsivo */
.ideal { transition: background-color 0.2s; }

/* Aceitável — um pouco mais dramático */
.moderate { transition: background-color 0.3s; }

/* Lento — parece preguiçoso para botão */
.slow { transition: background-color 0.5s; }
```