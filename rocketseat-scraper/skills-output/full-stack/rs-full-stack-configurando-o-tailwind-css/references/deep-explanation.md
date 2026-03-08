# Deep Explanation: Configurando o Tailwind CSS

## Por que customizar o tema?

O Tailwind CSS vem com um conjunto padrão de cores, tamanhos, fontes e espaçamentos. Porém, cada projeto tem seu próprio design system com cores específicas, fontes escolhidas e tamanhos que podem não existir no padrão. Em vez de usar valores arbitrários (`text-[#1f8459]`), o correto é registrar esses valores no tema para que fiquem disponíveis como classes utilitárias nativas.

## Como o @theme funciona

No Tailwind CSS v4, a customização do tema é feita diretamente no CSS usando a diretiva `@theme`. Isso substitui o antigo `tailwind.config.js` com uma abordagem CSS-native.

O bloco `@theme` define variáveis CSS que o Tailwind usa para gerar suas classes utilitárias. Quando você define `--color-green-200: #2cb178`, o Tailwind automaticamente gera classes como `text-green-200`, `bg-green-200`, `border-green-200`, etc., todas usando esse valor.

## Sobrescrita de valores padrão

Um ponto importante demonstrado na aula: se você define uma variável com o mesmo nome de uma existente no Tailwind (ex: `--color-red-800`), o valor do `@theme` **prevalece**. O instrutor demonstrou isso mudando `--color-red-800` para azul — a classe `text-red-800` passou a renderizar azul.

Isso significa que o `@theme` é o ponto de verdade para todas as cores, fontes e tamanhos do projeto.

## Sistema de variáveis do Tailwind

A documentação do Tailwind lista todas as variáveis disponíveis para customização. Os padrões principais:

- **Cores:** `--color-{nome}-{peso}` — qualquer nome, qualquer peso numérico
- **Fonte padrão:** `--default-font-family` — define a fonte base de toda a aplicação
- **Tamanhos de fonte:** `--text-{nome}` — registra novos tamanhos além dos padrão (xs, sm, base, lg, xl, 2xl...)
- **Espaçamentos, bordas, sombras** — todos seguem o mesmo padrão de variáveis CSS

Para ver a lista completa, na documentação do Tailwind: buscar "theme variables" ou acessar a seção de variáveis.

## Cálculo de rem

O Tailwind usa `rem` como unidade para tamanhos de fonte. O `rem` é relativo ao `font-size` do elemento root (`html`), que por padrão é `16px`.

Para converter pixels para rem: `px / 16 = rem`

Exemplos:
- 10px → 10/16 = 0.625rem
- 12px → 12/16 = 0.75rem (já existe como `xs`)
- 14px → 14/16 = 0.875rem (já existe como `sm`)
- 8px → 8/16 = 0.5rem

Usar `rem` em vez de `px` garante que o tamanho respeite a preferência de tamanho do navegador do usuário.

## Onde colocar o @theme

O bloco `@theme` deve vir **após** o `@import "tailwindcss"` no arquivo `index.css`. Colocar antes pode causar erro porque o Tailwind precisa ser carregado primeiro para que as variáveis sejam reconhecidas.

## Font-family com fallback

Ao definir `--default-font-family: "Open Sans", serif`, o `serif` é o fallback. Se por algum motivo a Open Sans não carregar (erro de rede, bloqueio de CDN), o navegador usará a fonte serif padrão do sistema, que visualmente é mais próxima da Open Sans do que uma sans-serif genérica.

O nome da fonte deve ser exatamente o que o Google Fonts especifica no campo `font-family` da opção "Get Embedded Code".