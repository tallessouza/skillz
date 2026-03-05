# Code Examples: Faixa Rotativa CSS

## Exemplo completo passo a passo

### 1. HTML base

```html
<section class="banner bg-gradient-animate">
  <div class="scroller">
    <div class="rolling">
      <img src="assets/banner.svg" alt="Patins e acessórios" />
      <img src="assets/banner.svg" alt="Patins e acessórios" />
      <img src="assets/banner.svg" alt="Patins e acessórios" />
      <img src="assets/banner.svg" alt="Patins e acessórios" />
      <img src="assets/banner.svg" alt="Patins e acessórios" />
      <img src="assets/banner.svg" alt="Patins e acessórios" />
      <img src="assets/banner.svg" alt="Patins e acessórios" />
      <img src="assets/banner.svg" alt="Patins e acessórios" />
    </div>
  </div>
</section>
```

O instrutor começou com 2 imagens para demonstrar o conceito, depois foi duplicando (4, 8, 16) até o banner parecer infinito sem gaps.

### 2. CSS do banner (container externo)

```css
.banner {
  width: 100%;
  padding-block: 2.5rem;
  overflow: hidden;
}
```

- `width: 100%` garante que ocupa toda a largura
- `padding-block: 2.5rem` cria espaço em cima e embaixo (40px)
- `overflow: hidden` é crítico — esconde todo conteúdo que sai dos limites

### 3. CSS do scroller (contenção)

```css
.scroller {
  width: 100%;
  overflow: hidden;
  padding-block: 1rem;
}
```

Camada extra de contenção. O padding-block menor (1rem) dá respiro interno ao conteúdo rolante.

### 4. CSS do rolling (elemento animado)

```css
.rolling {
  display: flex;
  gap: 1.5rem;
  animation: rolling 2s linear infinite;
}

@keyframes rolling {
  to {
    transform: translateX(-132px);
  }
}
```

**Construção progressiva que o instrutor fez:**

Primeiro, sem infinite:
```css
animation: rolling 2s linear;
/* Roda uma vez e para — útil para testar o valor do translateX */
```

Depois, com infinite:
```css
animation: rolling 2s linear infinite;
/* Loop eterno — a ilusão do scroll infinito */
```

### 5. CSS do gradiente animado

```css
.bg-gradient-animate {
  background: linear-gradient(
    45deg,
    var(--snap-light-sky-light),
    var(--snap-tap-joy-light)
  );
  background-size: 400%;
  background-position: 50% 50%;
  animation: bg-gradient 20s ease infinite;
}

@keyframes bg-gradient {
  50% {
    background-position: 100% 50%;
  }
}
```

**O que o instrutor demonstrou passo a passo:**

1. Primeiro, só o gradient sem animação — estático
2. Depois, adicionou `background-size: 400%` — "agora só vejo azul" (porque o gradiente ficou enorme e só uma parte é visível)
3. Depois, `background-position: 50% 50%` — centralizou a parte visível
4. Finalmente, o keyframe que move a position — efeito de cor fluindo

### Variação: Velocidades diferentes

```css
/* Scroll rápido (urgência, energia) */
.rolling--fast {
  animation: rolling 1s linear infinite;
}

/* Scroll lento (elegância, calma) */
.rolling--slow {
  animation: rolling 4s linear infinite;
}

/* Gradiente mais rápido (mais dinâmico) */
.bg-gradient-animate--fast {
  animation: bg-gradient 8s ease infinite;
}
```

### Variação: Direção oposta

```css
@keyframes rolling-reverse {
  to {
    transform: translateX(132px); /* Positivo = direita para esquerda invertido */
  }
}
```

### Variação: Gradiente com mais cores

```css
.bg-gradient-animate--multi {
  background: linear-gradient(
    45deg,
    var(--color-1),
    var(--color-2),
    var(--color-3),
    var(--color-1) /* Repetir a primeira cor para loop suave */
  );
  background-size: 600%; /* Maior para mais cores */
  background-position: 0% 50%;
  animation: bg-gradient-multi 30s ease infinite;
}

@keyframes bg-gradient-multi {
  50% {
    background-position: 100% 50%;
  }
}
```

### Debug: Como encontrar o valor correto do translateX

O instrutor explicou que ajustou manualmente de 133 para 132. Processo:

1. Coloque só 2 cópias da imagem
2. Adicione `animation: rolling 2s linear` (sem infinite)
3. Observe o deslocamento — a segunda imagem deve parar exatamente onde a primeira começou
4. Se der "pulo", ajuste ±1px
5. Quando o loop parecer contínuo, adicione `infinite`
6. Duplique as imagens até preencher a tela

```css
/* Dica: use borda temporária para visualizar limites */
.banner { border: 1px solid pink; }
.scroller { border: 1px solid black; }
/* Remova após ajuste */
```