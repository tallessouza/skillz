# Code Examples: Secao Pricing Parte 2

## 1. Estilizacao da lista com icone check

```css
/* Cada item da lista recebe icone como background */
li {
  color: var(--text-color-secondary);
  background: url(assets/icons/check.svg) no-repeat;
  padding-left: 2rem;
}

/* Small apos li — unico no design, precisa de display block */
li + small {
  display: block;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}
```

## 2. HTML do card premium

```html
<div class="premium">
  <div class="card">
    <span>Um mês grátis</span>
    <p>Premium</p>
    <p class="pricing">
      R$24,90 <small>/mês</small>
    </p>
    <a href="#" class="btn primary">Experimente de graça</a>
    <div class="separator"></div>
    <ul>
      <li>Sem interrupção de anúncio</li>
      <li>Cante quantas músicas quiser</li>
      <li>Cante todas as músicas da biblioteca</li>
    </ul>
  </div>
</div>
```

## 3. Badge "Um mês grátis" — posicionamento absoluto

```css
.premium {
  position: relative; /* contexto para o span absoluto */
}

.premium .card span:first-child {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.75rem 2rem;
  background: linear-gradient(
    90deg,
    var(--brand-color-secondary) 0%,
    var(--brand-color-primary) 100%
  );
  border-top-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  font-weight: 600;
  font-size: var(--font-size-small);
  font-family: sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--pg-color);
}
```

## 4. Card com espaco para o badge

```css
.premium .card {
  padding-top: 4.25rem; /* espaco para o badge absoluto */
}
```

## 5. Borda degradê completa

```css
/* Container externo — revela o pseudo-element */
.premium {
  position: relative;
  padding: 2px;
}

/* Pseudo-element como "livro de baixo" */
.premium::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    90deg,
    var(--brand-color-secondary) 0%,
    var(--brand-color-primary) 100%
  );
  border-radius: 1.5rem;
  z-index: -1;
}
```

## 6. Ajustes de alinhamento entre cards

```css
/* Card premium precisa de mais padding embaixo para alinhar botoes */
.premium .card {
  padding-bottom: 6rem;
}

/* Terceiro card: separator com margem menor para alinhamento */
.card:nth-child(3) .separator {
  margin-block: 1.5rem; /* em vez de 2rem dos outros */
}
```

## 7. Override de botao no contexto pricing (cascata)

```css
/* Definicao global: botao cresce no desktop */
@media (min-width: 768px) {
  .btn {
    font-size: var(--font-size-lg);
    padding: 1rem 2rem;
  }
}

/* Override no pricing: manter tamanho MD mesmo no desktop */
@media (min-width: 768px) {
  .pricing .btn {
    font-size: var(--font-size-md);
    padding: 0.75rem 1.5rem;
  }
}
```

**Por que funciona:** O seletor `.pricing .btn` tem maior especificidade que `.btn`, e mesmo com especificidade igual, aparece depois no codigo — a cascata CSS garante que o ultimo vence.

## Variacoes da tecnica de borda degradê

### Variacao: borda apenas no topo

```css
.card-top-border::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-a), var(--color-b));
  border-radius: 1.5rem 1.5rem 0 0;
}
```

### Variacao: borda com animacao

```css
.animated-border::before {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```