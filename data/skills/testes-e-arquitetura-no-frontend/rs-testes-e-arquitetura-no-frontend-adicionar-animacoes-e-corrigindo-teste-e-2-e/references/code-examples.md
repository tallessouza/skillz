# Code Examples: Animacoes com Motion e Correcao de Testes E2E

## 1. Instalacao

```bash
pnpm install motion
```

Import padrao:
```tsx
import { motion } from "motion/react"
```

## 2. Copy Button — Transicao de texto

```tsx
// components/button-actions/copy-button.tsx
import { motion } from "motion/react"

function CopyButton({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy}>
      <motion.span
        key={isCopied ? "copiado" : "copiar"}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -2 }}
        transition={{ duration: 0.15 }}
      >
        {isCopied ? "Copiado" : "Copiar"}
      </motion.span>
    </button>
  )
}
```

**Detalhes:**
- `key` dinamica forca o React a desmontar/remontar o span, ativando as animacoes `initial` e `exit`
- `y: 2` / `y: -2` cria um leve movimento vertical durante a troca
- Duracao de 0.15s para sensacao instantanea

## 3. Prompt Card — Animacao de delecao + fix E2E

```tsx
// components/prompt-card.tsx
import { motion } from "motion/react"
import { useRouter } from "next/navigation"

function PromptCard({ prompt }: { prompt: Prompt }) {
  const router = useRouter()

  async function handleDelete() {
    await deletePrompt(prompt.id)
    router.refresh() // FIX: sincroniza estado em todos os browsers
    return
  }

  return (
    <motion.li
      initial={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
      aria-label={prompt.title}
    >
      {/* card content */}
      <button onClick={handleDelete}>Deletar</button>
    </motion.li>
  )
}
```

**Detalhes:**
- `height: "auto"` no initial permite que o Motion calcule a altura real
- `exit` anima height para 0 + marginBottom para 0 para colapso suave
- `aria-label` adicionado por acessibilidade
- `router.refresh()` resolve o bug do Firefox

## 4. Prompt List — Entrada lateral

```tsx
// components/prompt-list.tsx
import { motion } from "motion/react"

function PromptList({ prompts }: { prompts: Prompt[] }) {
  return (
    <motion.ol
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      layout
    >
      {prompts.map(prompt => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </motion.ol>
  )
}
```

**Detalhes:**
- `x: -20` no initial cria entrada deslizando da esquerda
- `layout` prop anima reposicionamento automatico quando items mudam

## 5. Sidebar Content — Fade escalonado com constantes extraidas

```tsx
// components/sidebar-content.tsx
import { motion } from "motion/react"

const INITIAL_MOTION = { opacity: 0 }
const FADE_TRANSITION = { duration: 0.2, delay: 0.1 }

function SidebarContent() {
  return (
    <motion.aside
      initial={false}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={INITIAL_MOTION}
        animate={{ opacity: 1 }}
        transition={FADE_TRANSITION}
      >
        <header>
          {/* logo, buttons */}
        </header>
      </motion.div>

      <motion.div
        initial={INITIAL_MOTION}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={FADE_TRANSITION}
      >
        {/* new prompt button */}
      </motion.div>

      <motion.nav
        initial={INITIAL_MOTION}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={FADE_TRANSITION}
      >
        {/* navigation items */}
      </motion.nav>
    </motion.aside>
  )
}
```

**Detalhes:**
- `initial={false}` no aside pula animacao no primeiro render
- Constantes `INITIAL_MOTION` e `FADE_TRANSITION` evitam repeticao
- `delay: 0.1` no transition cria efeito escalonado sutil

## 6. Controle granular de montagem (tecnica avancada)

```tsx
function SidebarContent() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <motion.div
      initial={isMounted ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
    >
      {/* conteudo */}
    </motion.div>
  )
}
```

**Quando usar:** Quando voce quer que a animacao rode apenas em atualizacoes subsequentes, nao no primeiro mount.

## 7. Centralizacao de mocks no Jest setup

```ts
// jest.setup.ts — mocks centralizados
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))
```

```ts
// __tests__/components/prompt-card.test.tsx
// Nao precisa mais importar o mock de next/navigation
// Herda do jest.setup.ts automaticamente

// MAS se precisar verificar chamadas especificas:
import { useRouter } from "next/navigation"

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
}

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter, // sobrescreve o setup
}))

it("should call refresh after delete", async () => {
  // ...
  expect(mockRouter.refresh).toHaveBeenCalled()
})
```

**Regra:** Setup define o padrao, teste sobrescreve quando precisa de controle.