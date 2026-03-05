# Code Examples: Acessibilidade Alem das Ferramentas

## Skip to Content — Demonstrado pelo instrutor no site da WAI

O instrutor inspecionou o site da WAI ao vivo e mostrou o mecanismo:

```html
<!-- Primeiro elemento focavel da pagina -->
<a href="#main">Skip to Content</a>

<!-- ... toda a navegacao do header ... -->

<!-- Conteudo principal com id correspondente -->
<main id="main">
  <!-- conteudo -->
</main>
```

### Como funciona:
1. Usuario aperta Tab — primeiro foco vai para "Skip to Content"
2. Usuario clica/aperta Enter — pagina scrolla para `#main` (como ancora)
3. Leitores de tela movem o foco para o `<main>`, pulando toda navegacao

### Implementacao completa em React:

```tsx
// components/SkipToContent.tsx
export function SkipToContent() {
  return (
    <a
      href="#main"
      className="skip-to-content"
    >
      Skip to Content
    </a>
  )
}
```

```css
/* Visualmente escondido ate receber foco */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-to-content:focus {
  position: fixed;
  top: 10px;
  left: 10px;
  width: auto;
  height: auto;
  z-index: 9999;
  padding: 8px 16px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}
```

## Layout consistente entre paginas

```tsx
// layouts/AppLayout.tsx
import { SkipToContent } from '../components/SkipToContent'
import { Header } from '../components/Header'

interface AppLayoutProps {
  children: React.ReactNode
}

// Header identico em todas as paginas — usuarios assistivos memorizam
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main">
        {children}
      </main>
      <footer>{/* ... */}</footer>
    </>
  )
}
```

## O que o WAI tambem oferece: Change Text Size or Colors

O instrutor mostrou que o site da WAI tem um botao "Change Text Size or Colors" que permite ao usuario dar zoom e ajustar texto. Implementacao similar:

```tsx
function TextSizeControls() {
  const [fontSize, setFontSize] = useState(16)

  return (
    <div role="group" aria-label="Ajustar tamanho do texto">
      <button
        onClick={() => setFontSize(prev => prev + 2)}
        aria-label="Aumentar tamanho do texto"
      >
        A+
      </button>
      <button
        onClick={() => setFontSize(16)}
        aria-label="Tamanho de texto padrao"
      >
        Normal
      </button>
      <button
        onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
        aria-label="Diminuir tamanho do texto"
      >
        A-
      </button>
    </div>
  )
}
```

## Checklist de teste manual (baseado nas perspectivas do instrutor)

```typescript
/**
 * Checklist de acessibilidade manual — ferramentas automatizadas NAO cobrem isso
 * 
 * Perspectiva "quebrei o mouse":
 * - [ ] Todos os elementos interativos sao acessiveis via Tab?
 * - [ ] Modals podem ser fechados com Escape?
 * - [ ] Dropdowns navegam com setas?
 * - [ ] Focus trap funciona em modals?
 * 
 * Perspectiva "quebrei os oculos":
 * - [ ] Contraste suficiente (minimo 4.5:1)?
 * - [ ] Texto legivel em zoom 200%?
 * - [ ] Informacao nao depende apenas de cor?
 * 
 * Perspectiva "usando leitor de tela":
 * - [ ] Skip to Content presente?
 * - [ ] Landmarks semanticos (main, nav, header)?
 * - [ ] Imagens informativas tem alt descritivo?
 * - [ ] Formularios tem labels associados?
 * - [ ] Anuncios dinamicos usam aria-live?
 */
```