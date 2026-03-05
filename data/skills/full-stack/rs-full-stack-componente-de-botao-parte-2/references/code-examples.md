# Code Examples: Componente de Botao Secundario

## Estrutura HTML completa

```html
<!-- Botao primario (com texto normal) -->
<button class="btn">
  <span class="label">Começar agora</span>
</button>

<!-- Botao secundario (sem texto, com aria-label) -->
<button class="btn" aria-label="Saiba mais"></button>
```

**Importante:** O botao secundario nao deve ter conteudo textual dentro da tag. Todo o texto vem do `aria-label`.

## CSS completo do botao secundario

```css
.btn {
  /* Estilos base compartilhados entre primary e secondary */
  border: inherit; /* borda definida no nivel superior */
  position: relative;
}

/* Seletor: todo .btn que tem aria-label = botao secondary */
.btn[aria-label] {

  /* Pseudo-elemento ::after — renderiza o texto com gradiente */
  &::after {
    content: attr(aria-label);  /* Puxa o texto do atributo HTML */
    background: var(--btn-bg-color);  /* Gradiente para o texto */
    -webkit-background-clip: text;  /* Vendor prefix obrigatorio */
    background-clip: text;  /* Versao padrao */
    color: transparent;  /* Esconde a cor do texto, revela o gradiente */
    position: relative;
    z-index: 1;  /* Fica acima do ::before */
  }

  /* Pseudo-elemento ::before — simula borda gradiente */
  &::before {
    content: "";  /* Conteudo vazio */
    position: absolute;  /* Absoluto em relacao ao .btn (que e relative) */
    inset: 0.093rem;  /* ~1.5px de gap = espessura da "borda" gradiente */
    background-color: var(--bg-color);  /* Cor solida = cor de fundo do site */
    border: inherit;  /* Herda border-radius e estilo do pai */
  }
}
```

## Passo a passo da construcao

### Passo 1: Texto via attr()

```css
.btn[aria-label]::after {
  content: attr(aria-label);
}
/* Resultado: texto aparece dentro do botao, puxado do HTML */
```

### Passo 2: Gradiente no texto

```css
.btn[aria-label]::after {
  content: attr(aria-label);
  background: var(--btn-bg-color);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* Resultado: texto com efeito gradiente, mas sem borda ainda */
```

### Passo 3: Borda gradiente via ::before

```css
.btn[aria-label]::before {
  content: "";
  position: absolute;
  inset: 0.093rem;
  background-color: var(--bg-color);
  border: inherit;
}
/* Resultado: camada opaca cobrindo o botao, com gap revelando gradiente nas bordas */
```

### Passo 4: Z-index para empilhamento correto

```css
.btn[aria-label]::after {
  /* ... texto gradiente ... */
  position: relative;
  z-index: 1;  /* Texto fica ACIMA da camada opaca */
}
/* Resultado: texto visivel sobre o fundo opaco, borda gradiente ao redor */
```

## Variacoes

### Borda mais grossa

```css
.btn[aria-label]::before {
  inset: 0.125rem;  /* ~2px */
}
```

### Borda de 1px

```css
.btn[aria-label]::before {
  inset: 1px;  /* Direto em pixels, sem conversao */
}
```

### Adaptando para fundo branco

```css
:root {
  --bg-color: #ffffff;  /* Mude a variavel para combinar com o fundo */
}
```

## O que acontece se colocar texto dentro do botao

```html
<!-- ERRADO -->
<button class="btn" aria-label="Saiba mais">Saiba mais</button>
```

Resultado: o texto "Saiba mais" aparece duplicado — uma vez como conteudo normal do botao e outra via `::after`. O layout fica "esquisito" (nas palavras do instrutor). Sempre deixe o conteudo do `<button>` vazio quando usando essa estrategia.