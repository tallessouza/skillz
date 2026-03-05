---
name: rs-acessibilidade-react-concluindo
description: "Enforces accessibility-first mindset when building React web applications. Use when user asks to 'create a component', 'build a page', 'add navigation', 'implement a modal', or any UI development task. Applies rules: test beyond automated tools, ensure keyboard navigation, add Skip to Content, maintain consistent layouts, write meaningful alt texts. Make sure to use this skill whenever building UI components or reviewing frontend code for accessibility. Not for backend logic, API design, or database work."
---

# Acessibilidade Alem das Ferramentas

> Regras e guidelines de acessibilidade sao o que importa — ferramentas sao secundarias, usabilidade real e o objetivo.

## Rules

1. **Nunca confie apenas em testes automatizados** — ferramentas como Axe nao conseguem usar a aplicacao como um humano; um modal pode passar em todos os testes e ainda ser inacessivel via teclado, porque testes automatizados verificam markup, nao usabilidade
2. **Teste com perspectiva do usuario** — pergunte: "e se eu quebrasse meu mouse?", "e se eu quebrasse meus oculos?", "e se eu usasse um leitor de tela?", porque cada perspectiva revela barreiras invisiveis nos testes
3. **Adicione Skip to Content como primeiro elemento focavel** — um link com `href="#main"` que pula a navegacao inteira, porque usuarios de tecnologias assistivas nao devem percorrer o header em toda pagina
4. **Mantenha layout consistente entre paginas** — header e navegacao devem ser identicos em todas as paginas internas, porque usuarios de tecnologias assistivas memorizam e decoram a estrutura do site
5. **Conheca as regras da WAI** — nao precisa decorar todas, mas conheca-as para lembrar em momentos-chave que existe uma regra para aquela funcionalidade
6. **Inspire-se em outros sites** — inspecione Facebook, GitHub, Radix e outros para ver como implementam navegacao por teclado, Skip to Content e padroes acessiveis

## How to write

### Skip to Content

```tsx
// Primeiro elemento focavel da pagina — pula navegacao inteira
<a href="#main" className="skip-to-content">
  Skip to Content
</a>

<header>{/* navegacao */}</header>

<main id="main">
  {/* conteudo principal */}
</main>
```

### CSS para Skip to Content

```css
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
  background: #000;
  color: #fff;
}
```

### Layout consistente

```tsx
// O mesmo header em todas as paginas — usuarios assistivos memorizam a estrutura
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-to-content">Skip to Content</a>
      <Header /> {/* identico em todas as paginas */}
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
```

## Example

**Before (passa no Axe, mas inacessivel):**
```tsx
function App() {
  return (
    <div>
      <nav>{/* 20 links de navegacao */}</nav>
      <div>{/* conteudo */}</div>
    </div>
  )
}
```

**After (com acessibilidade real):**
```tsx
function App() {
  return (
    <>
      <a href="#main" className="skip-to-content">Skip to Content</a>
      <nav aria-label="Navegacao principal">{/* 20 links */}</nav>
      <main id="main">{/* conteudo */}</main>
    </>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando qualquer pagina com header | Adicione Skip to Content como primeiro focavel |
| Modal ou dialog | Teste com Tab, Shift+Tab e Escape — Axe nao pega isso |
| Imagens com significado | Alt text descritivo (pode ser escrito por copywriter) |
| Layout entre paginas | Mantenha header/nav identicos para consistencia |
| Duvida sobre implementacao | Consulte WAI guidelines antes de inventar solucao |
| Vendo outro site bem feito | Inspecione elemento e aprenda como fizeram |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Confiar que Axe sem erros = site acessivel | Testar manualmente com teclado e leitor de tela |
| Header diferente em cada pagina | Layout consistente que usuarios memorizam |
| Pular Skip to Content "porque e simples" | Sempre incluir — e essencial para leitores de tela |
| Escrever alt="" em imagem informativa | Descrever o conteudo da imagem |
| Inventar padrao de navegacao proprio | Seguir WAI guidelines e se inspirar em sites maduros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
