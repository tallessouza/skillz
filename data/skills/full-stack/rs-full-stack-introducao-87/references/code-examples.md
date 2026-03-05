# Code Examples: CSS Animations & Transitions

## 1. Transition — Hover basico

```css
/* Muda cor de fundo suavemente ao hover */
.card {
  background-color: white;
  transition: background-color 0.3s ease;
}

.card:hover {
  background-color: #f0f0f0;
}
```

## 2. Transition — Multiplas propriedades

```css
.button {
  background-color: #3498db;
  color: white;
  transform: scale(1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}
```

## 3. Transition — Com delay

```css
/* O transform comeca 0.1s depois do background */
.element {
  transition: background-color 0.3s ease, transform 0.3s ease 0.1s;
}
```

## 4. Animation — Slide in da esquerda

```css
@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.panel {
  animation: slide-in-left 0.5s ease-out forwards;
}
```

## 5. Animation — Fade in

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.element {
  animation: fade-in 0.4s ease-in;
}
```

## 6. Animation — Bounce (multiplos keyframes)

```css
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-20px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-10px);
  }
}

.icon {
  animation: bounce 1s ease infinite;
}
```

## 7. Animation — Pulse (atencao)

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.notification-badge {
  animation: pulse 2s ease-in-out infinite;
}
```

## 8. Animation — Spin (loading)

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

## 9. Combinando transition e animation

```css
/* Animation no load, transition no hover */
.card {
  animation: fade-in 0.5s ease-out;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## 10. Propriedades performaticas vs nao-performaticas

```css
/* BOM — anima propriedades composited (GPU) */
.element {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* RUIM — causa layout recalculation */
.element-slow {
  transition: width 0.3s ease, height 0.3s ease, top 0.3s ease;
}
```

## Variacoes de timing functions

```css
/* Cada timing function cria uma sensacao diferente */
.ease        { transition: transform 0.3s ease; }        /* padrao, natural */
.ease-in     { transition: transform 0.3s ease-in; }     /* comeca devagar */
.ease-out    { transition: transform 0.3s ease-out; }    /* termina devagar */
.ease-in-out { transition: transform 0.3s ease-in-out; } /* suave dos dois lados */
.linear      { transition: transform 0.3s linear; }      /* velocidade constante */

/* Custom cubic-bezier para controle total */
.custom { transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
```