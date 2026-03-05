# Deep Explanation: Testando Acessibilidade da Pagina

## Por que o Lighthouse nao e suficiente

O Lighthouse e a ferramenta mais conhecida para auditorias de acessibilidade. Esta disponivel no Chrome DevTools (aba Lighthouse). Voce desmarca todas as categorias exceto "Accessibility" e gera o relatorio.

Porem, o Lighthouse usa o axe-core por debaixo dos panos, mas **nao executa todos os testes** que o axe-core oferece. Isso significa que mesmo um score de 100% no Lighthouse **nao garante** que seu site esta totalmente acessivel. Existem testes adicionais que so o axe-core completo realiza.

## A hierarquia das ferramentas axe-core

A empresa Deque (criadora do axe-core) oferece varias ferramentas:

1. **axe DevTools (extensao do navegador)** — Extensao para Chrome/Edge/navegadores Chromium. Voce abre DevTools, vai em "axe DevTools", escaneia a pagina e recebe feedbacks detalhados. Retorna mais problemas que o Lighthouse.

2. **@axe-core/react** — Biblioteca que se integra ao codigo React. Injeta o axe-core na pagina e da feedbacks em tempo real no console do navegador durante o desenvolvimento.

3. **eslint-plugin-jsx-a11y** — Plugin ESLint que analisa estaticamente o JSX e avisa sobre problemas de acessibilidade direto no editor (VS Code).

4. **axe Accessibility Linter (VS Code)** — Extensao do VS Code que funciona como linter visual. Tem limitacoes (nao reconhece todos os componentes customizados como `<Image>` do Next.js vs `<img>` nativo).

## O problema do SSR no Next.js

O axe-core depende da DOM para funcionar. No Next.js, componentes sao renderizados primeiro no servidor (SSR — Server-Side Rendering), onde nao existe DOM, `window`, nem `document`.

Duas solucoes:
- `typeof window !== 'undefined'` — verifica se o window existe antes de executar
- `useEffect` — hook do React que so executa no cliente, mais confiavel

O instrutor recomenda `useEffect` como a forma mais segura.

## Por que integrar no codigo ao inves de usar extensao

O problema de extensoes de navegador e que dependem de cada desenvolvedor instalar e usar. Em um time, voce nao consegue garantir que todos vao:
- Instalar a extensao
- Lembrar de escanear a pagina
- Agir sobre os resultados

Com @axe-core/react integrado no codigo, **todo mundo** que roda o projeto em desenvolvimento automaticamente ve os erros de acessibilidade no console.

## Erros comuns que as ferramentas detectam

1. **Imagens sem alt text** — leitores de tela nao conseguem descrever a imagem
2. **Documento sem titulo** — a aba do navegador mostra apenas "localhost:3000"
3. **Links sem nome discernivel** — um link com apenas icone (ex: icone do GitHub) sem texto descritivo
4. **Contraste insuficiente** — cores de texto que nao contrastam o suficiente com o fundo
5. **Atributo lang ausente** — o elemento `<html>` precisa de `lang="pt-BR"` para leitores de tela
6. **Headings fora de ordem** — pular de H2 para H4 (sem H3) quebra a navegacao por leitores de tela
7. **Multiplos main landmarks** — a pagina deve ter apenas um elemento `<main>`
8. **Ausencia de H1** — toda pagina deve ter pelo menos um titulo principal

## Insight do instrutor sobre headings

Desenvolvedores frequentemente usam tags de heading erradas para obter tamanho visual. Exemplo: usam `<h6>` porque e visualmente pequeno, ou `<h4>` ao inves de `<h3>` porque parece melhor. **HTML nao e responsavel por estilizacao** — use CSS. Tags de heading definem hierarquia semantica do conteudo.

## Niveis de severidade do axe-core

O @axe-core/react classifica problemas por severidade no console:
- **Serious** — problemas graves que afetam significativamente a acessibilidade
- **Moderate** — problemas menos graves, mas que ainda devem ser corrigidos

Cada erro mostra: o que esta errado, onde esta o elemento, e qual regra foi violada.