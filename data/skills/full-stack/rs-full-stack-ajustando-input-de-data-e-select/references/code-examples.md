# Code Examples: Estilizando Inputs de Data e Select

## Exemplo 1: Evolução do Calendar Picker (passo a passo do instrutor)

### Tentativa 1 — Estilizar diretamente o webkit (funciona só em Chrome/Edge)

```css
input[type="date"]::-webkit-calendar-picker-indicator {
  position: relative;
}

/* Tentativa de colocar icone customizado diretamente no indicador */
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  background: url("../assets/icons/calendar-03.svg") no-repeat center;
  background-size: contain;
  width: 1rem;
}
```

**Problema**: Não funciona no Safari.

### Tentativa 2 — Display None (remove funcionalidade)

```css
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
}
```

**Problema**: O usuario não consegue mais clicar para abrir o calendário.

### Solução Final — Opacity 0 + Pseudo-elemento

```css
/* O input precisa ser o container de referência */
input[type="date"] {
  position: relative;
}

/* Esconde o indicador nativo mas mantém clicavel */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
}

/* Icone customizado via pseudo-elemento */
input[type="date"]::before {
  content: "";
  background: url("../assets/icons/calendar-03.svg") no-repeat center;
  background-size: contain;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
```

## Exemplo 2: Select com seta customizada

### Evolução do background-position

```css
/* Versão 1: Colado na borda */
select {
  appearance: none;
  background: url("../assets/icons/arrow-down.svg") no-repeat right center;
}

/* Versão 2: Porcentagem aproximada (impreciso) */
select {
  appearance: none;
  background: url("../assets/icons/arrow-down.svg") no-repeat 95% center;
}

/* Versão 3 (final): calc() para posicionamento exato */
select {
  appearance: none;
  background: url("../assets/icons/arrow-down.svg") no-repeat calc(100% - 1rem) center;
}
```

## Exemplo 3: Técnica de centralização vertical com translate

```css
/* Genérico — funciona para qualquer elemento absoluto */
.elemento-centralizado {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

/* Centralização horizontal também */
.elemento-centralizado-ambos {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

## Exemplo 4: Variações para outros inputs com ícones

```css
/* Input de busca com lupa */
input[type="search"] {
  position: relative;
  appearance: none;
}

input[type="search"]::before {
  content: "";
  background: url("../assets/icons/search.svg") no-repeat center;
  background-size: contain;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

/* Input de email com icone */
input[type="email"] {
  position: relative;
  padding-left: 3rem;
}

input[type="email"]::before {
  content: "";
  background: url("../assets/icons/mail.svg") no-repeat center;
  background-size: contain;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
```

## Exemplo 5: Background shorthand completo

```css
/* Forma expandida */
select {
  background-image: url("../assets/icons/arrow-down.svg");
  background-repeat: no-repeat;
  background-position: calc(100% - 1rem) center;
  background-size: 1rem;
}

/* Forma shorthand (preferida) */
select {
  background: url("../assets/icons/arrow-down.svg") no-repeat calc(100% - 1rem) center / 1rem;
}
```