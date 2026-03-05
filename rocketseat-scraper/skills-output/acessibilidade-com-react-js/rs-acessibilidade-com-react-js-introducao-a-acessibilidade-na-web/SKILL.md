---
name: rs-a11y-react-intro-acessibilidade-web
description: "Applies web accessibility principles when building React components and pages. Use when user asks to 'create a component', 'build a page', 'add a form', 'implement navigation', or any UI task. Ensures semantic HTML, keyboard navigation, screen reader support, and inclusive design patterns. Make sure to use this skill whenever generating UI code, even if the user doesn't mention accessibility. Not for backend logic, API design, or database schemas."
---

# Acessibilidade na Web — Principios Fundamentais

> Todo elemento visual deve ter um equivalente acessivel: se pode ser visto, deve poder ser ouvido, navegado por teclado e compreendido por tecnologias assistivas.

## Conceito central

Acessibilidade nao e apenas para pessoas com deficiencias permanentes. Impedimentos temporarios (mouse quebrado, oculos quebrado, braço engessado) afetam qualquer usuario. Codigo acessivel beneficia 100% dos usuarios, nao apenas uma minoria.

## Rules

1. **Todo conteudo visual deve ter alternativa textual** — imagens com `alt`, icones com `aria-label`, videos com legendas, porque usuarios cegos dependem de leitores de tela para consumir conteudo
2. **Todo elemento interativo deve ser navegavel por teclado** — botoes, links, formularios devem funcionar com Tab/Enter/Escape, porque um mouse quebrado ou deficiencia motora impede uso do ponteiro
3. **Nunca dependa apenas de cor para transmitir informacao** — use icones, texto ou padroes visuais adicionais, porque usuarios daltonicos ou com baixa visao nao distinguem cores
4. **Tamanhos de fonte devem ser ajustaveis** — use `rem`/`em` em vez de `px` para texto, porque usuarios com baixa visao precisam aumentar o tamanho da fonte
5. **Formularios devem ter labels explicitos** — todo `input` precisa de um `label` associado via `htmlFor`, porque leitores de tela nao conseguem identificar campos sem label
6. **Hierarquia de headings deve ser semantica** — use `h1` > `h2` > `h3` em ordem, sem pular niveis, porque leitores de tela navegam por headings para entender a estrutura da pagina

## Decision framework

| Situacao | Acao |
|----------|------|
| Criando componente com conteudo visual | Adicionar alternativa textual (alt, aria-label) |
| Criando elemento clicavel | Garantir que funciona com teclado (Enter/Space) |
| Exibindo status com cor (verde/vermelho) | Adicionar icone ou texto complementar |
| Criando formulario | Associar label a cada input, agrupar com fieldset |
| Criando modal/dialog | Implementar focus trap e fechar com Escape |
| Criando navegacao | Usar landmarks semanticos (nav, main, aside) |

## Tipos de impedimento

| Tipo | Permanente | Temporario | Situacional |
|------|-----------|------------|-------------|
| Visual | Cegueira | Oculos quebrado | Sol na tela |
| Motor | Paralisia | Braco engessado | Mouse quebrado |
| Auditivo | Surdez | Infeccao no ouvido | Ambiente barulhento |
| Cognitivo | Dislexia | Medicacao | Distracao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `<div onClick={...}>` sem role | `<button onClick={...}>` |
| `<img src="...">` sem alt | `<img src="..." alt="descricao">` |
| Cor como unica indicacao de erro | Cor + icone + texto de erro |
| `font-size: 14px` fixo | `font-size: 0.875rem` |
| `<input>` sem label | `<label htmlFor="x">Nome</label><input id="x">` |
| Navegacao impossivel por teclado | `tabIndex`, focus management, atalhos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
