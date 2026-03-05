# Deep Explanation: Adicionando Style Guide

## Por que remover estilos de libs UI primeiro?

O instrutor destaca um cenário real: o projeto já usava shadcn/ui com variáveis CSS próprias (--primary, --secondary, etc.) no `globals.css`. Quando o design entrega um Style Guide customizado, essas variáveis conflitam com os novos tokens. A abordagem correta é remover completamente as variáveis da lib e substituir pelos tokens do design system do projeto.

O instrutor enfatiza: "como a gente tem o nosso próprio Style Guide, faz sentido a gente utilizar o nosso Style Guide e não esse Style Guide que vem lá da lib". Isso reflete uma decisão arquitetural — quando há um design system próprio, a lib UI serve apenas como componente base, não como source of truth de design.

## Cenário do dia a dia

O instrutor contextualiza com um cenário realista: "imagina o seguinte cenário — a sua design chegou para você e disse que alterou o style guide da aplicação, que é algo bem comum de acontecer no dia a dia". Isso significa que a habilidade de migrar tokens rapidamente é essencial.

## Estrutura do Style Guide no Figma

O Figma contém:
- **Tons de cor**: Blue (100-400), Cyan (100-300), Gray (100-800)
- **Tipografia**: Separada por função (heading, body, action) com font-family, weight e line-height específicos
- **Ícones**: Lucide Icons (já estava sendo usado)

## Container como cidadão de primeira classe

O container é definido fora do `extend` porque é uma substituição completa do default do Tailwind. Com `center: true`, `padding: '2rem'` e max-width de `1200px`, ele se torna o wrapper padrão reutilizado em toda a aplicação. O instrutor menciona: "ele vai ser o que a gente vai utilizar em bastante locais, então faz sentido extrair e colocar aqui".

## Fontes com Next.js

O instrutor mostra como aplicar a fonte Inter globalmente via `next/font/google` no componente de layout. A fonte é importada, configurada com `subsets: ['latin']`, e aplicada via `inter.className` em template literal na div wrapper. Isso garante que todo conteúdo dentro do layout use Inter por default, podendo ser sobrescrito pontualmente (ex: headings com PT Sans Caption).

## Refatoração incremental de componentes

A abordagem foi componente por componente:
1. **Footer**: Removeu border-top, adicionou `bg-gray-500`
2. **Links do footer**: Trocou `text-primary` por `text-body-sm text-blue-100`, hover por `hover:text-blue-200`
3. **ActiveLink**: Alterou para `text-action-sm`, com ativo em `text-blue-200` e inativo em `text-white`
4. **Button**: Variante primary ficou `bg-blue-200 text-white hover:bg-blue-300`, outline ganhou `border-gray-500 transition-colors duration-200 hover:text-blue-200 hover:border-blue-200`, secondary ficou `bg-white text-gray-800 hover:bg-blue-100 rounded-full`

## Sobre o botão secondary

O instrutor investigou ao vivo por que o botão não aparecia — o problema era a variante secondary no button que ainda usava classes da lib antiga. Ele ajustou para `bg-white text-gray-800` com hover `bg-blue-100` e adicionou `rounded-full` conforme o design mostrava bordas completamente arredondadas.