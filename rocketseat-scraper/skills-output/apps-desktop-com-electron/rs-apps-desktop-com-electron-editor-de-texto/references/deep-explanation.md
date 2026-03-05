# Deep Explanation: Editor de Texto com TipTap

## Por que TipTap e nao outros editores?

O instrutor menciona varios editores disponiveis (Prose, Milkdown, Slate, Draft.js), mas escolhe o TipTap por ser um **conjunto de funcionalidades para criar seu proprio editor**, nao um editor pronto. Ele funciona como uma plataforma de plugins onde voce monta o editor que precisa.

O TipTap tem um ecossistema de extensoes (Extensions) que funcionam como plugins. Algumas sao gratuitas, outras sao Pro (pagas via assinatura). As extensoes Pro sao a minoria. Exemplos de extensoes gratuitas: Bubble Menu, Code Block, Floating Menu, Placeholder, Mentions, Tables, Task Items.

## Por que o EditorContent renderiza multiplas divs

O `EditorContent` nao renderiza uma unica div — ele cria uma hierarquia de divs. A div externa recebe o `className` passado diretamente no componente. Porem, a div **interna** (onde o conteudo editavel realmente esta) nao e acessivel via `className`. Para estilizar essa div interna, usa-se `editorProps.attributes.class`.

Isso e importante porque classes como `prose` e `focus:outline-none` precisam estar na div do conteudo, nao na div wrapper.

## Como o Placeholder funciona sem input nativo

O editor TipTap e uma `div` com `contentEditable` — nao e um `<input>` nem `<textarea>`. Portanto, o atributo HTML `placeholder` nao funciona. O TipTap resolve isso adicionando um atributo `data-placeholder` na div quando ela esta vazia.

Para exibir visualmente, usa-se o pseudo-elemento CSS `::before` com `content: attr(data-placeholder)`. As tres propriedades criticas:

- **`height: 0` (`before:h-0`)** — o placeholder nao ocupa espaco no layout
- **`float: left` (`before:float-left`)** — posiciona o texto corretamente sem deslocar outros elementos
- **`pointer-events: none` (`before:pointer-events-none`)** — impede que o usuario clique, selecione ou copie o texto do placeholder

## Estrutura do documento com Document.extend

Ao passar `content: 'heading block*'` na extensao Document, voce define a **schema** do documento. Isso significa:

- O primeiro elemento **obrigatoriamente** e um `heading` (H1-H6)
- Depois do heading, qualquer numero de blocos (`block*`) — paragrafos, listas, blockquotes, etc.
- Se o usuario apagar tudo, o editor automaticamente volta a mostrar um heading vazio com o placeholder

Essa tecnica e inspirada no Notion, onde documentos sempre comecam com um titulo.

Para usar essa customizacao, e necessario desabilitar a extensao `document` do StarterKit (`StarterKit.configure({ document: false })`) e importar/configurar `Document` separadamente.

## Tailwind Typography: a "magica" do prose

O plugin `@tailwindcss/typography` e descrito pelo instrutor como "uma das coisas mais incriveis do Tailwind". Ao adicionar a classe `prose`, **todas as tags HTML semanticas** dentro daquele container ganham estilizacao automatica: H1-H6, paragrafos, blockquotes, listas, negrito, italico, etc.

- `prose` — estilizacao padrao (light mode)
- `prose-invert` — inverte para dark mode
- `prose-headings:mt-0` — customiza margin-top dos headings para zero
- Todas as tags podem ser customizadas com `prose-{tag}:{utilidade}`

O `w-[65ch]` (65 caracteres de largura) e a medida recomendada para leitura confortavel, mencionada inclusive na documentacao do plugin.

## Pacotes necessarios

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-document @tiptap/extension-placeholder @tiptap/extension-typography @tiptap/extension-highlight @tailwindcss/typography
```