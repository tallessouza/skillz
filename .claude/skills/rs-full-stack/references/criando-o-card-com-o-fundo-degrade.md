---
name: rs-full-stack-card-fundo-degrade
description: "Applies CSS gradient overlay techniques using pseudo-elements and linear-gradient when building card components. Use when user asks to 'create a card', 'add gradient overlay', 'darken image background', 'fade effect on image', or 'linear-gradient on card'. Covers ::before pseudo-element creation, position absolute/relative pairing, overflow hidden, and linear-gradient function. Make sure to use this skill whenever creating cards with background images that need gradient overlays. Not for CSS animations, grid/flexbox layout, or JavaScript interactions."
---

# Card com Fundo Degradê via CSS

> Crie sobreposicoes de degradê em cards usando pseudo-elementos CSS e a funcao linear-gradient, sem elementos HTML extras.

## Rules

1. **Use pseudo-elemento ::before para a camada de degradê** — `::before` cria um elemento HTML via CSS sem poluir o markup, porque a camada visual nao pertence ao conteudo semantico
2. **Pseudo-elemento exige content** — sempre declare `content: ""` mesmo vazio, porque sem content o pseudo-elemento nao renderiza
3. **Position relative no pai, absolute no filho** — o card recebe `position: relative` e o `::before` recebe `position: absolute` com `inset: 0`, porque absolute sem contexto relativo se posiciona na pagina inteira
4. **Use overflow: hidden no card** — porque elementos internos (imagens, pseudo-elementos) transbordam e ignoram border-radius do pai
5. **border-radius vai no card, nao na imagem** — combinado com `overflow: hidden`, o arredondamento se aplica a todo o conteudo interno
6. **Use linear-gradient com angulacao explicita** — `linear-gradient(180deg, transparent 0%, #cor 100%)` para controle preciso da direcao do degradê

## How to write

### Card com degradê sobre imagem

```css
.card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  & img {
    width: 100%;
    display: block;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, #1a1a1a 100%);
  }
}
```

### Sintaxe do linear-gradient

```css
/* linear-gradient(angulacao, cor-inicio posicao, cor-fim posicao) */
background: linear-gradient(180deg, transparent 0%, #1a1a1a 100%);
/*          180deg = de cima para baixo
            transparent 0% = comeca invisivel no topo
            #1a1a1a 100% = cor solida no fundo */
```

## Example

**Before (sem degradê, imagem crua):**
```css
.card {
  border-radius: 8px;
}
.card img {
  border-radius: 8px;
  width: 100%;
}
```

**After (com degradê via pseudo-elemento):**
```css
.card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  & img {
    width: 100%;
    display: block;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, #1a1a1a 100%);
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Texto sobre imagem precisa de contraste | Adicione degradê escuro com ::before |
| Degradê comeca no meio do card | Ajuste posicao inicial: `transparent 50%` |
| Degradê so na metade inferior | Use `top: 50%` ao inves de `inset: 0` |
| Cor do degradê vem do Figma | Inspecione o elemento, copie o CSS e extraia apenas o linear-gradient |
| Border-radius nao funciona na imagem interna | Coloque border-radius no pai + overflow: hidden |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `<div class="overlay"></div>` no HTML | `&::before { content: ""; ... }` no CSS |
| `border-radius` na imagem dentro do card | `border-radius` + `overflow: hidden` no card pai |
| `position: absolute` sem `position: relative` no pai | Sempre pareie relative no pai com absolute no filho |
| `::before` sem `content` | Sempre inclua `content: ""` |
| `background-color: white` quando quer degradê | `background: linear-gradient(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre pseudo-elementos, overflow e linear-gradient
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-o-card-com-o-fundo-degrade/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-o-card-com-o-fundo-degrade/references/code-examples.md)
