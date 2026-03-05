# Deep Explanation: Acessibilidade para Modais

## Por que o Axe/linters nao pegam tudo

O instrutor demonstra que ferramentas como Axe DevTools nao identificam todos os problemas de acessibilidade em modais. Um `<div>` renderizado como modal nao gera erros automaticos — o Axe simplesmente nao sabe que aquilo e um modal. So apos adicionar `role="dialog"` o linter comeca a cobrar requisitos como nome acessivel. Isso reforca que **testes com leitores de tela reais sao indispensaveis**.

## O elemento `<dialog>` nativo vs modal customizado

O HTML possui o elemento `<dialog>` que ja funciona de forma acessivel na maioria dos navegadores modernos. O instrutor menciona que escolheu criar o modal manualmente para ensinar os conceitos de WAI-ARIA. Na pratica, se voce usar `<dialog>`, muita da semantica ja vem de graca. Mas quando voce cria comportamento customizado, precisa replicar toda a semantica com roles e aria attributes.

## Por que `aria-label="modal"` e redundante

Quando voce adiciona `role="dialog"`, leitores de tela ja anunciam "dialog" ou "modal" ao entrar. Colocar `aria-label="modal"` faz o leitor falar "modal, dialog" — informacao duplicada e inutil. O nome acessivel deve descrever o CONTEUDO do modal (ex: "Termos de uso"), nao o TIPO do componente.

## A sacada do `aria-labelledby` vs `aria-label`

O instrutor destaca que usar `aria-labelledby` apontando para o H2 interno e superior a `aria-label` com texto hardcoded porque:
1. O titulo ja existe visualmente — voce reutiliza em vez de duplicar
2. Se o titulo mudar, a label acessivel muda automaticamente
3. Mantém consistencia entre o que usuarios visuais e leitores de tela percebem

## Foco programatico: a ponte entre React declarativo e acessibilidade imperativa

O instrutor faz uma observacao importante sobre programacao declarativa vs imperativa no React. React e declarativo por natureza — voce declara estado e o framework renderiza. Mas gerenciar foco e uma operacao imperativa: voce precisa dizer "foque AGORA neste elemento". Por isso usamos `useRef` + `useEffect`:

- `useRef` cria uma referencia ao elemento DOM real
- `useEffect` observa mudancas no estado `isModalOpen`
- Quando muda para `true`, chamamos `.focus()` imperativamente

Sem esse foco programatico, o leitor de tela simplesmente nao anuncia que um modal apareceu. O instrutor demonstrou isso ao vivo com ChromeVox — sem foco, clicar no botao so anunciava o botao. Com foco, o leitor anunciou "entering dialog" seguido do conteudo.

## `tabIndex={-1}`: focavel mas nao tabbable

O valor `-1` significa:
- NAO aparece na ordem de navegacao por Tab
- PODE receber foco via JavaScript (`.focus()`)

Isso e essencial para modais porque:
1. Voce quer focar o modal ao abrir (programaticamente)
2. Voce NAO quer que o usuario navegando por Tab foque o container do modal em si
3. O foco deve ficar nos elementos interativos DENTRO do modal (inputs, botoes)

## `aria-controls`: conexao explicita botao → modal

O atributo `aria-controls` no botao informa tecnologias assistivas que aquele botao controla/interage com um elemento especifico. Nao e estritamente necessario para funcionar, mas melhora a experiencia para usuarios avancados de leitores de tela que podem navegar para o elemento controlado.

## Dica pratica do instrutor: aprenda com sites acessiveis

O instrutor recomenda fortemente olhar como outros sites acessiveis implementam modais, em vez de tentar decorar toda a documentacao WAI-ARIA. Na pratica, voce vai aprender mais rapido inspecionando implementacoes reais do que lendo specs.