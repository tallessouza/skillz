# Deep Explanation: Estruturando Paginas com HTML Semantico

## A abordagem pedagogica: errar primeiro

O instrutor usa uma estrategia deliberada: construir a pagina da forma **mais errada possivel** primeiro. Isso permite que o aluno:

1. Veja os erros que ferramentas como o ESLint do Next.js ja apontam automaticamente (ex: `alt prop missing`)
2. Entenda que "funcionar visualmente" nao significa "ser acessivel"
3. Tenha uma base concreta para comparar antes/depois

### O que o instrutor fez de proposito errado:

- **Usou `<div>` para header e nav** — elementos semanticos existem exatamente para esses casos
- **Nao passou `alt` na Image** — Next.js ja reclama via ESLint, mostrando que o framework incentiva acessibilidade
- **Comecou com `<h2>` em vez de `<h1>`** — quebrando a hierarquia de headings
- **Pulou de `<h2>` para `<h4>`** — headings devem seguir ordem sequencial
- **Colocou SVG do GitHub dentro de `<a>` sem label** — o link nao tem texto acessivel

## Por que a hierarquia de headings importa

O instrutor destaca: "ate a ordem de titulos importa". Leitores de tela geram uma arvore de headings que funciona como indice de navegacao. Quando voce pula de h2 para h4, cria "buracos" nesse indice, confundindo usuarios que dependem dessa estrutura.

A motivacao visual (querer um titulo menor) deve ser resolvida com CSS, nunca alterando o nivel semantico do heading.

## Next.js Image (next/future/image)

No momento da aula (setembro 2022), o componente experimental era `next/future/image`. Posteriormente virou o `next/image` padrao. O instrutor recomenda verificar a documentacao atual.

Propriedades usadas:
- `src` — importar o SVG como modulo e passar a referencia
- `width` — para redimensionar (instrutor dividiu 286/2 = 143)
- A altura e calculada proporcionalmente automaticamente

## CSS Modules no Next.js

O instrutor usa CSS Modules (`home.module.css`) para escopar estilos. Padroes demonstrados:

- **Max-width + margin auto** — centralizar conteudo com largura maxima
- **Padding compensado no max-width** — se padding horizontal e 20px de cada lado (40px total), somar ao max-width (1024 + 40 = 1064) para manter a largura visual consistente
- **Largura diferente para conteudo** — header com 1024px, conteudo com 736px, criando hierarquia visual

## Ferramentas de teste ja presentes

O instrutor menciona que o DevTools do navegador tem uma aba de Acessibilidade, mas observa que com imagens e multiplos elementos, nem sempre funciona bem para testes de acessibilidade em desenvolvimento. Isso sera abordado em aulas posteriores com ferramentas especificas.