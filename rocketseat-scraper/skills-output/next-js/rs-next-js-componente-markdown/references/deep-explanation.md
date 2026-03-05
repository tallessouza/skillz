# Deep Explanation: Componente Markdown

## Por que react-markdown e nao dangerouslySetInnerHTML?

O react-markdown converte Markdown em componentes React nativos, nao em HTML cru. Isso significa que cada elemento (h1, p, a, strong) pode ser interceptado e substituido por um componente React customizado com classes Tailwind. Isso elimina a necessidade de CSS global para estilizar markdown e da controle granular sobre cada elemento.

## O papel do remark-gfm

GFM = GitHub Flavored Markdown. O Markdown padrao e muito limitado — nao suporta tabelas, listas de tarefas (checkboxes), strikethrough, ou autolinks. O plugin remark-gfm adiciona tudo isso. O instrutor enfatiza que o react-markdown suporta uma array de plugins (`remarkPlugins={[remarkGfm, outroPlugin]}`), entao e extensivel.

## A prop `components` — o coracao da customizacao

O objeto passado em `components` mapeia tags HTML para funcoes React. Quando o react-markdown encontra um `# Titulo` no markdown (que seria um `<h1>`), em vez de renderizar um `<h1>` padrao, ele chama a funcao que voce definiu. Isso permite:

- Adicionar classes Tailwind especificas
- Mudar o comportamento (ex: links abrirem em nova aba)
- Adicionar wrappers ou icones
- Responsividade por elemento

## Estrategia de estilizacao progressiva

O instrutor comeca com apenas h1 e p, depois vai adicionando h2, strong, a conforme precisa. Essa abordagem e pratica porque:

1. Voce so estiliza o que seu conteudo realmente usa
2. E facil testar — adiciona um elemento no markdown e ve como fica
3. Evita over-engineering de componentes que nunca serao usados

## Responsividade nos elementos markdown

O instrutor usa breakpoints Tailwind dentro de cada componente:
- `text-heading-md md:text-heading-xl` para h1 (menor no mobile, maior no desktop)
- `text-heading-sm md:text-heading-lg` para h2

Isso e importante porque posts de blog sao consumidos em qualquer dispositivo.

## Diferenciacao visual sutil

Para `strong`, o instrutor usa `text-gray-100` enquanto o paragrafo usa `text-gray-200`. Essa diferenca de apenas um tom cria hierarquia visual sutil sem ser agressiva. O instrutor menciona que verificou no Figma e decidiu diferenciar levemente.

## Layout do post

O componente Markdown fica dentro de uma div com `prose max-w-[900px]` e margem top de 48px (mt-12). O `prose` e importante para quando a area de compartilhamento for adicionada depois. A largura maxima de 900px impede linhas muito longas que prejudicam a leitura.

## Barrel export

O instrutor cria um `index.ts` no diretorio de components para re-exportar o Markdown, seguindo o padrao de barrel exports para imports mais limpos.