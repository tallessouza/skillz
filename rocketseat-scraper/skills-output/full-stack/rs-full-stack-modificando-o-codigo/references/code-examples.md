# Code Examples: Feature Branch + Feedback Visual com Animação

## 1. Criando a branch

```bash
# Verificar branch atual
git branch
# * main

# Criar e mudar para nova branch
git checkout -b feature/shake-feedback
# Switched to a new branch 'feature/shake-feedback'

# Verificar que mudou
git branch
#   main
# * feature/shake-feedback
```

## 2. Keyframe completo no CSS Module

```css
/* app.module.css */

/* Keyframe de shake horizontal */
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}

/* Classe que aplica a animação */
.shake {
  animation: shake 0.3s ease-in-out;
}
```

## 3. Componente React com animação condicional

```tsx
// app.tsx
import { useState } from 'react'
import styles from './app.module.css'

function App() {
  const [shake, setShake] = useState(false)

  function handleConfirm() {
    // ... lógica de verificação ...
    const correct = checkGuess()

    if (!correct) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }
  }

  return (
    <div className={`${styles.word} ${shake ? styles.shake : ''}`}>
      {/* Componentes de letras */}
    </div>
  )
}
```

## 4. Variações do padrão shake

### Shake vertical

```css
@keyframes shakeY {
  0% { transform: translateY(0); }
  25% { transform: translateY(-5px); }
  50% { transform: translateY(5px); }
  75% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}

.shakeY {
  animation: shakeY 0.3s ease-in-out;
}
```

### Shake com mudança de cor (feedback mais forte)

```css
@keyframes shakeError {
  0% { transform: translateX(0); border-color: inherit; }
  25% { transform: translateX(-10px); border-color: #ef4444; }
  50% { transform: translateX(10px); border-color: #ef4444; }
  75% { transform: translateX(-10px); border-color: #ef4444; }
  100% { transform: translateX(0); border-color: inherit; }
}

.shakeError {
  animation: shakeError 0.4s ease-in-out;
}
```

### Shake mais sutil (amplitude menor)

```css
@keyframes shakeSubtle {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}

.shakeSubtle {
  animation: shakeSubtle 0.2s ease-in-out;
}
```

## 5. Alternativa com onAnimationEnd

```tsx
function App() {
  const [shake, setShake] = useState(false)

  function handleConfirm() {
    const correct = checkGuess()
    if (!correct) {
      setShake(true)
    }
  }

  return (
    <div
      className={`${styles.word} ${shake ? styles.shake : ''}`}
      onAnimationEnd={() => setShake(false)}
    >
      {letters}
    </div>
  )
}
```

## 6. Padrão reutilizável como custom hook

```tsx
function useShake(durationMs = 300) {
  const [isShaking, setIsShaking] = useState(false)

  function triggerShake() {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), durationMs)
  }

  return { isShaking, triggerShake }
}

// Uso:
function App() {
  const { isShaking, triggerShake } = useShake(300)

  function handleConfirm() {
    if (!correct) {
      triggerShake()
    }
  }

  return (
    <div className={`${styles.word} ${isShaking ? styles.shake : ''}`}>
      {letters}
    </div>
  )
}
```

## 7. Exemplo de branch naming por tipo

```bash
# Nova funcionalidade
git checkout -b feature/shake-feedback
git checkout -b feature/dark-mode
git checkout -b feature/user-profile

# Correção de bug
git checkout -b fix/login-redirect
git checkout -b fix/broken-animation

# Refatoração
git checkout -b refactor/extract-hooks
git checkout -b refactor/api-layer

# Estilo/visual
git checkout -b style/responsive-header

# Documentação
git checkout -b docs/api-endpoints
```