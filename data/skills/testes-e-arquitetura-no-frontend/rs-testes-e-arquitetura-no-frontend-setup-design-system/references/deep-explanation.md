# Deep Explanation: Setup Design System (shadcn/ui)

## Por que mover o CSS global para styles/?

O instrutor explica que prefere criar uma pasta `styles/` e mover o `global.css` para la. A razao e organizacional: o CSS global nao pertence a pasta `app/` porque nao e uma rota nem um layout — e um asset de estilo que afeta toda a aplicacao. Manter em `styles/` cria separacao clara entre configuracao visual e estrutura de rotas.

## Filosofia de instalacao progressiva

O shadcn/ui nao e uma biblioteca tradicional onde voce importa tudo. Cada componente e instalado individualmente via CLI e vira um arquivo local no seu projeto (`components/ui/`). Isso significa:

1. **Voce eh dono do codigo** — pode customizar livremente
2. **Sem bloat** — so instala o que usa
3. **Sem breaking changes** — o codigo esta no seu repo, nao em node_modules

O instrutor demonstra isso instalando apenas o `button` inicialmente, e mencionando que card, input, e form serao adicionados conforme necessidade ao longo do modulo.

## Customizacao de estilos

Os estilos que vem por padrao no `global.css` do shadcn sao variaveis CSS (HSL) que definem o tema. O instrutor menciona que esses sao os "estilos default" e que serao customizados no decorrer do modulo para atender o design do projeto. A customizacao acontece alterando as variaveis CSS, nao os componentes em si.

## Formatacao automatica

Ao instalar o componente button, o instrutor nota que o codigo gerado vem com aspas duplas e sem ponto-e-virgula. Ao salvar, as configuracoes de formatacao do projeto (ESLint/Prettier) entram em vigor automaticamente. Isso reforca a importancia de ter linting configurado antes de comecar a adicionar componentes.

## Lucide React como icon set padrao

O instrutor confirma que usara `lucide-react` para icones, que e o icon set recomendado pelo shadcn/ui. Nao precisa configurar nada extra — basta instalar e importar os icones necessarios.