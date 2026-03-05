# Deep Explanation: CSS Animations & Transitions — Boas Práticas

## A analogia da fórmula química

O instrutor (Mayk Brito) usa uma analogia poderosa: **CSS é como uma fórmula química**. Você mistura uma propriedade com outra e o resultado muda completamente. `transform` + `opacity` dá um efeito. `transform` + `filter` + `opacity` dá outro. Essa combinação criativa é o que torna CSS animations tão expressivas.

A implicação prática: não decore receitas prontas. Entenda cada propriedade individualmente e depois experimente combinações. O espaço de possibilidades é enorme — "não tem como abordar o universo inteiro de animações", como o instrutor destaca.

## Modelo mental: linha do tempo

Toda animação CSS opera sobre uma **linha do tempo**. Isso é fundamental:

- **Início e fim** são obrigatórios (`from`/`to` ou `0%`/`100%`)
- **Pontos intermediários** são opcionais e adicionam complexidade
- A timeline é o conceito unificador — tanto para animações atuais quanto para o futuro Animation Timeline (scroll-driven)

Pensar em timeline ajuda a planejar a animação antes de codar: "o que acontece no início? no meio? no fim?"

## Animation Timeline — o futuro

O instrutor apresenta `scroll()` e `view()` como funcionalidades futuras do CSS que permitem animações driven by scroll position. Pontos importantes:

- **Ainda não tem suporte universal** — não usar em produção sem fallback
- **Já vale conhecer** — quando estabilizar, substitui muito JavaScript de scroll animations
- O conceito continua sendo timeline, apenas a fonte muda (tempo → scroll position)

## Prefers Reduced Motion — acessibilidade como obrigação

O instrutor enfatiza: "você deve usar, pensando na acessibilidade". Não é sugestão, é obrigação profissional.

Pessoas com distúrbios vestibulares, epilepsia fotossensível, ou simplesmente preferência por menos movimento são diretamente impactadas por animações descontroladas. A media query `prefers-reduced-motion` é a ferramenta CSS nativa para respeitar essa preferência.

A abordagem pode ser:
1. **Remover animações** (`animation: none`) — mais seguro
2. **Reduzir drasticamente** (`animation-duration: 0.01ms`) — mantém lógica sem movimento visível
3. **Substituir por alternativa estática** — fade em vez de slide, por exemplo

## Moderação como princípio de design

Frase-chave do instrutor: "qualquer coisinha pequena que você colocar já vai ter um impacto bem bacana."

Isso reflete um princípio de UX maduro: **menos é mais em animação**. Um fade-in de 300ms num card já transforma a percepção de qualidade de uma interface. Não precisa de particle effects e animações complexas para causar impacto.

A tentação de quem aprende animações é usar tudo. O profissional sabe selecionar.

## CSS vs JavaScript para animações

O instrutor menciona que "bibliotecas em JavaScript vão fazer você ter animações muito mais interessantes", mas o contexto é claro: CSS é a base. JS é o próximo nível.

Quando usar cada um:
- **CSS transitions**: mudanças de estado (hover, focus, active, class toggle)
- **CSS animations**: movimentos predefinidos, loops, sequências simples
- **JS (GSAP, Framer Motion, etc.)**: animações interativas, physics-based, orquestração complexa, scroll-driven (enquanto Animation Timeline não estabiliza)

## O workflow keyframe-first

O instrutor enfatiza a separação: "crio primeiro o keyframe e depois vou lá e uso a propriedade onde eu quiser."

Isso promove:
1. **Reutilização** — mesmo keyframe em múltiplos elementos
2. **Organização** — keyframes agrupados, fáceis de encontrar
3. **Manutenibilidade** — alterar a animação em um lugar afeta todos os usos