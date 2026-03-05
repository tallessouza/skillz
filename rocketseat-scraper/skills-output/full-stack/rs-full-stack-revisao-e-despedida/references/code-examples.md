# Code Examples: CSS Animations & Transitions

## Keyframe básico — fade in com movimento

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fade-in 0.3s ease-out;
}
```

## Keyframe com pontos intermediários

```css
@keyframes pulse-subtle {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.notification-badge {
  animation: pulse-subtle 2s ease-in-out 3; /* 3 repetições, não infinite */
}
```

## Transition para mudança de estado

```css
.button {
  background-color: var(--primary);
  transform: scale(1);
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.button:hover {
  background-color: var(--primary-hover);
  transform: scale(1.02);
}

.button:active {
  transform: scale(0.98);
}
```

## Combinação de propriedades (fórmula química)

```css
@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.modal {
  animation: appear 0.35s ease-out;
}
```

## Prefers reduced motion — abordagem global

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Prefers reduced motion — abordagem por elemento

```css
.hero-banner {
  animation: slide-in 0.5s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .hero-banner {
    animation: none;
    opacity: 1; /* garante que o elemento aparece */
  }
}
```

## Staggered animation com delay

```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-item {
  animation: fade-up 0.3s ease-out both;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }
```

## Animation Timeline (futuro — verificar suporte)

```css
/* Scroll-driven: elemento anima conforme scroll da página */
@keyframes reveal {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

## Propriedades de animation — referência rápida

```css
.element {
  /* Shorthand */
  animation: nome duração timing-function delay iteration-count direction fill-mode play-state;

  /* Longhand */
  animation-name: fade-in;
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
}
```

## Performance — propriedades seguras para animar

```css
/* GPU-accelerated (compositor thread) — PREFERIR */
.fast {
  transform: translateX(100px);
  opacity: 0.5;
  filter: blur(2px);
}

/* Layout trigger (main thread) — EVITAR animar */
.slow {
  width: 200px;    /* triggers layout */
  height: 100px;   /* triggers layout */
  top: 50px;       /* triggers layout */
  margin: 10px;    /* triggers layout */
}
```