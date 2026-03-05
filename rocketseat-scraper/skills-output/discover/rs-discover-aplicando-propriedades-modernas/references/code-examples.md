# Code Examples: Propriedades Modernas do CSS

## Exemplo 1: Lista vertical com Flexbox e gap

```css
/* Container: UL recebe flex para organizar os LIs */
ul {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

**O que acontece:**
- Cada `<li>` dentro da `<ul>` se empilha verticalmente
- 16px de espaco entre cada `<li>`
- Sem espaco extra antes do primeiro ou depois do ultimo

### Variacao: Lista horizontal

```css
ul {
  display: flex;
  flex-direction: row; /* ou simplesmente omitir, row e o padrao */
  gap: 16px;
}
```

### Variacao: Gaps diferentes horizontal e vertical

```css
.grid {
  display: flex;
  flex-wrap: wrap;
  row-gap: 16px;
  column-gap: 24px;
}
```

## Exemplo 2: Botao com RGBA

```css
a {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

**Decomposicao:**
- `background: rgba(255, 255, 255, 0.1)` → fundo branco quase transparente (10% opaco)
- `border: 1px solid rgba(255, 255, 255, 0.5)` → borda branca semi-transparente (50% opaca)
- `border-radius: 8px` → cantos arredondados
- `backdrop-filter: blur(4px)` → embaça o que esta atras do botao
- `-webkit-backdrop-filter: blur(4px)` → mesma coisa para Safari

### Variacao: Diferentes niveis de transparencia

```css
/* Quase invisivel */
.ghost-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Semi-transparente */
.glass-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* Quase solido */
.solid-button {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.9);
}
```

### Variacao: RGBA com cores diferentes

```css
/* Preto transparente (overlay escuro) */
.dark-overlay {
  background: rgba(0, 0, 0, 0.5);
}

/* Azul transparente */
.blue-tint {
  background: rgba(0, 100, 255, 0.2);
}

/* Vermelho transparente (alerta sutil) */
.error-bg {
  background: rgba(255, 0, 0, 0.1);
}
```

## Exemplo 3: Glassmorphism completo

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 24px;
}
```

**Contexto:** Este e o padrao de design "glassmorphism" que combina todas as propriedades da aula — transparencia com RGBA, arredondamento com border-radius, e blur com backdrop-filter.

## Exemplo 4: Valores RGBA explicados

```css
/* RGB: cada canal de 0 a 255 */
rgba(0, 0, 0, 1)       /* preto solido */
rgba(255, 255, 255, 1)  /* branco solido */
rgba(255, 0, 0, 1)      /* vermelho puro */
rgba(0, 255, 0, 1)      /* verde puro */
rgba(0, 0, 255, 1)      /* azul puro */

/* Alpha: de 0 (invisivel) a 1 (solido) */
rgba(255, 255, 255, 0)    /* totalmente invisivel */
rgba(255, 255, 255, 0.1)  /* quase invisivel */
rgba(255, 255, 255, 0.5)  /* metade visivel */
rgba(255, 255, 255, 1)    /* totalmente visivel */
```

## Exemplo 5: Vendor prefix pattern

```css
/* Padrao: sempre declare a versao com prefix ANTES da versao padrao */
.element {
  -webkit-backdrop-filter: blur(4px); /* Safari */
  backdrop-filter: blur(4px);         /* Standard */
}
```

**Por que a ordem importa:** O browser lê de cima para baixo. Se ele entende a versão padrão, ela sobrescreve a prefixada. Se não entende (Safari antigo), usa a prefixada.