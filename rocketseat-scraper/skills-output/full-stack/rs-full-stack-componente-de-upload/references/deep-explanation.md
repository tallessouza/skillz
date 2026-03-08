# Deep Explanation: Componente de Upload

## Por que ocultar o input nativo?

O input `type="file"` do HTML tem um comportamento peculiar: ele renderiza um botao com texto que varia conforme o idioma do sistema operacional/navegador do usuario. Em portugues aparece "Escolher arquivo", em ingles "Choose file", etc. Esse texto **nao pode ser estilizado via CSS** — e um dos poucos elementos do HTML que resiste a customizacao.

A solucao classica e ocultar o input completamente e usar um `<label>` conectado via `htmlFor`/`id`. O mecanismo nativo do HTML garante que clicar no label dispara o mesmo comportamento de clicar no input — abrindo a janela do sistema para selecionar arquivos.

## A tecnica htmlFor + id

O HTML tem um mecanismo nativo: quando um `<label>` tem o atributo `for` (em React, `htmlFor`) apontando para o `id` de um input, clicar no label equivale a clicar no input. Isso funciona mesmo com o input oculto (`hidden` ou `display: none`).

```html
<input type="file" id="upload" class="hidden" />
<label for="upload">Clique aqui</label>
<!-- Clicar no label abre o seletor de arquivos -->
```

Essa abordagem e superior a usar `useRef` + `click()` programatico porque:
1. E nativa do HTML, sem JavaScript extra
2. Funciona com acessibilidade (screen readers entendem a associacao)
3. Nao depende de timing ou refs

## ComponentProps e extensibilidade

O instrutor escolhe `ComponentProps<'input'>` do React para herdar todas as props nativas de um input HTML. Isso permite que o consumidor do componente passe props como:
- `accept="image/*"` — filtrar tipos de arquivo
- `disabled` — desabilitar o upload
- `onChange` — reagir a selecao de arquivo
- `multiple` — permitir multiplos arquivos

O rest spread (`...rest`) repassa essas props para o input oculto, mantendo toda a funcionalidade nativa.

## Filename como prop (nao como state interno)

O componente recebe `fileName` como prop em vez de gerenciar estado internamente. Isso segue o padrao de componente controlado — quem usa o componente decide quando e como atualizar o nome do arquivo. O valor padrao e `null`, e o operador nullish coalescing (`??`) mostra o placeholder quando nenhum arquivo foi selecionado.

## Estilizacao do container

O container externo (`div`) replica o visual dos outros inputs do formulario:
- `w-full h-12` — largura total, altura fixa de 48px
- `flex items-center` — alinha conteudo verticalmente
- `rounded-lg border border-gray-300` — borda arredondada com cor consistente
- `outline-none` — remove outline padrao
- `bg-transparent` — fundo transparente

O span com o filename usa `flex-1` para ocupar todo o espaco disponivel, empurrando o botao de upload para a direita.

## Botao de upload (label estilizado)

O label e estilizado como um botao:
- `bg-green-100` com `hover:bg-green-200` — feedback visual no hover
- `transition ease-linear` — transicao suave de cor
- `cursor-pointer` — indica que e clicavel
- `disabled:opacity-50` — estado desabilitado visual

A imagem do icone usa `w-6 h-6` para dimensoes fixas de 24x24px, mantendo proporcao.

## Legend vs Label

O instrutor usa `<legend>` para o titulo "Comprovante" acima do campo, nao `<label>`. Isso e intencional — o `<label>` ja esta sendo usado para conectar ao input via `htmlFor`. A legend serve apenas como rotulo visual do grupo.