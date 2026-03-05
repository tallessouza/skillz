# Deep Explanation: CSS Animations & Transitions — Projeto LP de Patins

## Contexto do Projeto

O projeto e uma landing page de patins (roller skates) construida a partir de um design no Figma. O instrutor usa esse projeto para ensinar tres pilares de movimento em CSS.

## Os tres pilares de movimento CSS

### 1. Animacoes de Entrada (Entrance Animations)

Sao animacoes que rodam automaticamente quando a pagina carrega. No projeto, varios elementos do hero aparecem com animacoes — eles "entram" na tela.

**Por que usar `@keyframes` e nao `transition`?**
Transitions precisam de uma mudanca de estado (hover, focus, classe adicionada). Na entrada da pagina, nao ha mudanca de estado — o elemento simplesmente precisa animar do estado inicial ao final. `@keyframes` permite definir essa animacao sem depender de trigger externo.

**Dica do instrutor:** Pressionar "R" no Figma faz reload da animacao, permitindo ver o efeito de entrada repetidamente. Isso e analogo a dar refresh na pagina durante desenvolvimento.

### 2. Transicoes de Hover

No projeto, links de navegacao tem um efeito ao passar o mouse — um risquinho (underline) aparece embaixo do texto. O instrutor nota que no Figma o efeito pode parecer "estragadinho" (cortando o texto), mas a intencao e apenas uma linha sutil embaixo da fonte.

**Tecnica:** Pseudo-elemento `::after` com `width: 0` que transiciona para `width: 100%` no hover. Isso cria o efeito de underline animado sem afetar o layout do texto.

**Por que nao usar `text-decoration`?** Porque `text-decoration` nao e animavel com transition na maioria dos browsers. O pseudo-elemento da controle total sobre posicao, espessura e cor da linha.

### 3. Animacoes de Scroll

Quando o usuario rola a pagina, imagens aparecem gradualmente. CSS puro nao tem como detectar scroll, entao a tecnica e:
1. Definir estado "escondido" em CSS (opacity: 0, translateY)
2. Usar IntersectionObserver em JS para detectar quando o elemento entra no viewport
3. Adicionar classe que ativa o estado "visivel"
4. CSS transition faz a animacao suave entre os estados

### Mobile como desafio

O instrutor deliberadamente deixa a versao mobile como exercicio. A razao pedagogica: focar nas animacoes sem se preocupar com responsividade permite entender melhor cada tecnica individualmente.

**Consideracao tecnica para mobile:**
- Hover nao existe em touch devices — transicoes de hover precisam de alternativa
- Animacoes de entrada podem ser mais sutis em telas menores
- Performance de animacao e mais critica em dispositivos moveis
- `prefers-reduced-motion` media query deve ser considerada

## Fluxo de trabalho recomendado

1. Implementar estrutura HTML estatica (sem animacao)
2. Adicionar animacoes de entrada com `@keyframes`
3. Implementar transicoes de hover nos elementos interativos
4. Configurar IntersectionObserver para animacoes de scroll
5. Testar todas as animacoes juntas
6. (Desafio) Adaptar para mobile