---
name: rs-full-stack-modificando-o-codigo
description: "Enforces feature branch workflow with CSS animation feedback patterns when implementing visual feedback, shake animations, conditional CSS classes, or Git branch naming conventions. Use when user asks to 'add animation', 'create visual feedback', 'shake on error', 'create feature branch', or 'implement error feedback'. Make sure to use this skill whenever adding conditional animations triggered by state changes in React. Not for complex animation libraries, Framer Motion, or CI/CD pipeline configuration."
---

# Feature Branch + Feedback Visual com Animação

> Implemente funcionalidades novas em branches separadas com nomes semânticos, e use estado React para controlar animações CSS condicionais.

## Rules

1. **Crie branch com prefixo semântico** — `feature/nome`, `fix/nome`, `refactor/nome`, porque facilita identificação do propósito no histórico Git
2. **Nomeie keyframes pelo comportamento** — `shake`, `fadeIn`, `slideUp`, porque o nome descreve o movimento visual
3. **Controle animação via estado booleano** — ative com `setState(true)`, desative com `setTimeout(() => setState(false), duration)`, porque a animação deve executar apenas uma vez por trigger
4. **Aplique classes condicionalmente com template literal** — `` className={`${styles.base} ${condition ? styles.animation : ''}`} ``, porque permite compor múltiplas classes CSS Modules
5. **Duração do setTimeout deve coincidir com a animação CSS** — se a animação dura 0.3s, o timeout é 300ms, porque evita estado dessincronizado

## How to write

### Branch semântica

```bash
# Criar branch para nova funcionalidade
git checkout -b feature/shake-feedback

# Outros exemplos de prefixos
git checkout -b fix/login-validation
git checkout -b refactor/user-service
```

### Keyframe de shake

```css
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.3s ease-in-out;
}
```

### Estado + animação condicional

```tsx
const [shake, setShake] = useState(false)

function handleConfirm() {
  const correct = checkAnswer()

  if (!correct) {
    setShake(true)
    setTimeout(() => setShake(false), 300)
  }
}

return (
  <div className={`${styles.word} ${shake ? styles.shake : ''}`}>
    {letters}
  </div>
)
```

## Example

**Before (animação sempre ativa ao carregar):**
```tsx
<div className={`${styles.word} ${styles.shake}`}>
  {letters}
</div>
```

**After (animação apenas no erro):**
```tsx
const [shake, setShake] = useState(false)

function handleConfirm() {
  if (!correct) {
    setShake(true)
    setTimeout(() => setShake(false), 300)
  }
}

<div className={`${styles.word} ${shake ? styles.shake : ''}`}>
  {letters}
</div>
```

## Heuristics

| Situação | Ação |
|----------|------|
| Nova funcionalidade | Criar branch `feature/nome-descritivo` |
| Animação de feedback de erro | Usar keyframe + estado booleano + setTimeout |
| Múltiplas classes CSS Modules | Template literal com interpolação |
| Animação deve rodar só uma vez | setState(true) → setTimeout → setState(false) |
| Duração da animação | Manter CSS animation duration === setTimeout delay |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `className={styles.shake}` (sempre ativo) | `className={shake ? styles.shake : ''}` |
| `git checkout -b nova-feature` (sem prefixo) | `git checkout -b feature/shake-feedback` |
| Animação sem reset de estado | `setTimeout(() => setShake(false), 300)` |
| Duração CSS 0.5s com timeout 300ms | Duração CSS e timeout iguais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre branches semânticas, keyframes CSS e controle de animação via estado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações