# Deep Explanation: Botão para Visualizar Arquivo

## O conceito de página dual-mode

O instrutor demonstra um padrão muito comum em aplicações reais: a mesma página serve para **criar** e **visualizar** um recurso. A decisão de qual modo exibir depende da presença de um parâmetro na rota (o `id`).

Quando o `id` existe, significa que estamos visualizando um registro existente. Quando não existe, estamos criando um novo. Esse padrão evita duplicação de páginas e mantém a lógica centralizada.

## Por que um link e não um botão?

O instrutor substitui o botão de upload por um `<a>` (link) quando estamos em modo visualização. A razão é semântica e funcional:

- **Botão (`<button>`)**: executa uma ação na página atual (submit, toggle, etc.)
- **Link (`<a>`)**: navega para outro lugar (outra página, outro site, novo tab)

Para abrir um comprovante (que é um arquivo/URL externo), o link é semanticamente correto. O `target="_blank"` garante que o documento abre em nova aba, preservando o contexto do usuário na aplicação.

## A importância do `target="_blank"`

O instrutor usa `target="_blank"` para que o comprovante abra em uma nova página. Isso é crítico porque:

1. O usuário não perde o contexto da aplicação
2. O comprovante pode ser um PDF, imagem ou página externa
3. O fluxo de trabalho não é interrompido

## Estilização do link como elemento de ação

O link recebe classes Tailwind que o fazem parecer um elemento de ação:

- `text-sm` — tamanho de texto pequeno, discreto
- `text-green-500` — cor verde indicando ação positiva
- `font-semibold` — peso semi-bold para destaque
- `flex items-center justify-center` — centraliza ícone e texto
- `gap-2` — espaçamento entre ícone e texto
- `my-6` — margem vertical para respiração
- `hover:opacity-70` — feedback visual no hover
- `transition ease-linear` — transição suave

O instrutor testou `hover:opacity-50` primeiro mas achou muito forte, ajustando para `hover:opacity-70` para um efeito mais sutil. Esse tipo de refinamento iterativo é normal e desejável.

## Navegação entre rotas e impacto na UI

O instrutor demonstra como trocar de rota (de uma rota com `id` para outra sem) afeta completamente a UI:

- **Rota com `id` (ex: `/manager/123`)**: mostra "Abrir comprovante", campos somente leitura, botão "Voltar"
- **Rota sem `id` (ex: `/employees`)**: mostra formulário de upload, campos editáveis, botão "Enviar"

Ele mostra no console que ao clicar "Enviar", o formulário submete normalmente e navega para "solicitação enviada". Já na rota com `id`, o comportamento é totalmente diferente — visualização pura.

## Ícone SVG como componente

O instrutor importa um SVG (`file.svg`) como asset e usa dentro de uma tag `<img>`. Isso é um padrão simples e eficaz:

```typescript
import fileSvg from "../assets/file.svg"
```

O alt text "Ícone de arquivo" garante acessibilidade mínima. O ícone fica antes do texto "Abrir comprovante" graças ao `flex` e `gap-2`.

## O padrão mais amplo: páginas de detalhe vs criação

Este padrão se repete em praticamente toda aplicação CRUD:

1. `/resource/new` → formulário de criação
2. `/resource/:id` → visualização/edição

A decisão de usar a mesma página ou páginas separadas depende da complexidade. Para formulários simples onde a visualização é quase idêntica à criação (apenas campos `readOnly`), uma página condicional é mais DRY. Para fluxos muito diferentes, páginas separadas são mais claras.