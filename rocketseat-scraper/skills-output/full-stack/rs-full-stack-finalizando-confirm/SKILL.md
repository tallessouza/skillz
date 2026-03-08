---
name: rs-full-stack-finalizando-confirm
description: "Enforces Tailwind CSS confirmation/success page patterns when building feedback screens, success states, or post-submission UI. Use when user asks to 'create a success page', 'build a confirmation screen', 'show submission feedback', 'design a thank you page', or any post-action feedback UI. Applies centered card layout with icon, message, description, and CTA link using Tailwind utilities. Make sure to use this skill whenever building post-form-submission screens or success/confirmation states. Not for form building, error pages, or loading states."
---

# Finalizando Confirm — Página de Confirmação com Tailwind CSS

> Construa telas de confirmação como cards centralizados com ícone, título, descrição e CTA de retorno.

## Rules

1. **Substitua elementos simples por estrutura semântica** — use `div > h1 + img + p + Link` em vez de um `h1` solto, porque a tela de confirmação precisa de hierarquia visual clara
2. **Importe assets como módulos** — `import okSvg from '../assets/ok.svg'` em vez de string hardcoded, porque o bundler otimiza e valida a existência do arquivo
3. **Use flex column com gap para espaçamento** — `flex flex-col gap-6` em vez de margins individuais, porque mantém espaçamento consistente e previsível
4. **Estilize o CTA como bloco completo** — `w-full text-center rounded-lg` no link, porque em telas de confirmação o botão de retorno deve ser o elemento mais acessível
5. **Adicione hover com transition** — `hover:bg-green-200 transition ease-linear` em todo elemento interativo, porque feedback visual confirma que o elemento é clicável
6. **Use breakpoints para largura máxima** — `lg:w-[512px]` em vez de largura fixa, porque a tela deve funcionar em mobile e desktop

## How to write

### Estrutura da página de confirmação

```tsx
import okSvg from '../assets/ok.svg'
import { Link } from 'react-router-dom'

function Confirm() {
  return (
    <div className="bg-gray-500 lg:w-[512px] lg:rounded-xl flex flex-col items-center p-10 gap-6">
      <h1 className="text-2xl font-bold text-center text-green-100">
        Solicitação enviada!
      </h1>

      <img src={okSvg} alt="Ícone de ok" className="w-28" />

      <p className="text-sm text-gray-200 text-center">
        Agora é apenas aguardar. Sua solicitação será analisada
        e em breve o setor irá entrar em contato com você.
      </p>

      <Link
        to="/"
        className="w-full text-center p-3 bg-green-100 rounded-lg text-white hover:bg-green-200 transition ease-linear"
      >
        Nova solicitação
      </Link>
    </div>
  )
}
```

## Example

**Before (H1 solto sem estrutura):**
```tsx
function Confirm() {
  return <h1>Confirmado</h1>
}
```

**After (card completo com feedback visual):**
```tsx
function Confirm() {
  return (
    <div className="bg-gray-500 lg:w-[512px] lg:rounded-xl flex flex-col items-center p-10 gap-6">
      <h1 className="text-2xl font-bold text-center text-green-100">
        Solicitação enviada!
      </h1>
      <img src={okSvg} alt="Ícone de ok" className="w-28" />
      <p className="text-sm text-gray-200 text-center">
        Agora é apenas aguardar. Sua solicitação será analisada
        e em breve o setor irá entrar em contato com você.
      </p>
      <Link
        to="/"
        className="w-full text-center p-3 bg-green-100 rounded-lg text-white hover:bg-green-200 transition ease-linear"
      >
        Nova solicitação
      </Link>
    </div>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Tela pós-submit de formulário | Card centralizado com ícone + mensagem + CTA |
| Ícone de confirmação | Importe SVG como módulo, use `w-28` para destaque |
| Botão de retorno | `Link` com `w-full` e hover com transition |
| Responsividade do card | `lg:w-[512px]` + `lg:rounded-xl` para desktop, full-width em mobile |
| Texto explicativo | `text-sm text-gray-200 text-center` para hierarquia secundária |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<h1>Confirmado</h1>` sem estrutura | Card completo com ícone, título, descrição e CTA |
| `<img src="/ok.svg">` com path hardcoded | `import okSvg from '../assets/ok.svg'` |
| `<a href="/">Voltar</a>` em SPA | `<Link to="/">Nova solicitação</Link>` |
| `style={{ marginBottom: 20 }}` em cada elemento | `flex flex-col gap-6` no container |
| Botão sem hover state | `hover:bg-green-200 transition ease-linear` |
| Largura fixa sem breakpoint | `lg:w-[512px]` com mobile full-width |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre composição de telas de feedback e padrões de UX pós-submit
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de layout e tema