# Deep Explanation: Estrutura de Pastas e Arquivos — React + Vite

## Por que o Vite não instala node_modules automaticamente?

Quando você executa `npm create vite@latest`, o Vite apenas cria os arquivos do template — o `package.json`, configs, e o código de exemplo. Ele **não roda `npm install`** automaticamente. Isso é por design: o projeto é criado em milissegundos porque não precisa baixar dependências.

O efeito colateral é que, ao abrir o projeto no VS Code, o editor mostra sublinhados vermelhos em todos os imports (`react`, `react-dom`, etc.) porque essas bibliotecas ainda não existem fisicamente no disco. Basta executar `npm i` para gerar a pasta `node_modules/` e resolver todos os alertas.

## Diferença entre `public/` e `src/assets/`

### `public/`
- Arquivos copiados **diretamente** para o build final sem processamento
- Acessíveis pela URL raiz: `public/vite.svg` → `http://localhost:5173/vite.svg`
- Uso típico: favicon, robots.txt, imagens de SEO (og:image), arquivos que precisam de URL fixa
- O Vite **não** transforma, otimiza ou adiciona hash nesses arquivos

### `src/assets/`
- Arquivos que passam pelo **pipeline do bundler**
- Importados via `import logo from './assets/logo.svg'`
- O Vite adiciona hash no nome do arquivo para cache busting
- Podem ser otimizados (compressão de imagem, inline de SVGs pequenos)
- Se o arquivo não for importado em nenhum componente, ele **não entra no build final** (tree-shaking)

### Analogia do instrutor
Pense em `public/` como a vitrine da loja — qualquer pessoa pode ver diretamente. `src/assets/` é o estoque — só aparece quando você decide mostrar (importar em um componente).

## O papel de cada arquivo de configuração

### `vite.config.ts`
Configuração do bundler Vite. Aqui você adiciona plugins (como o `@vitejs/plugin-react`), configura aliases de importação, proxy para APIs, etc.

### `tsconfig.json`
Config TypeScript "guarda-chuva" que herda das configs específicas:
- `tsconfig.app.json` — regras para o código da aplicação em `src/`
- `tsconfig.node.json` — regras para configs e scripts que rodam no Node (como `vite.config.ts`)

Essa separação existe porque o código da aplicação roda no **browser** e as configs rodam no **Node** — ambientes diferentes com APIs diferentes.

### `.gitignore`
Já vem configurado para ignorar `node_modules/`, `dist/` (build), e outros arquivos temporários. O instrutor enfatiza que esse é um arquivo que você já conhece de projetos Node.

## Por que limpar o boilerplate?

O template do Vite vem com:
- Um componente `App.tsx` com contador, imports de SVGs, e JSX de exemplo
- Arquivos CSS (`App.css`, `index.css`) com estilos pré-definidos
- Uma pasta `src/assets/` com o logo do React
- Configuração ESLint com múltiplas dependências

O instrutor remove **tudo isso** porque:
1. **Código de exemplo atrapalha** — quando você começa a escrever seus componentes, os imports do exemplo quebram e confundem
2. **ESLint adiciona complexidade** — para fins de aprendizado, remover o linter simplifica o setup (em produção, recomenda-se mantê-lo)
3. **Começar do zero é mais didático** — você entende cada arquivo que cria, em vez de herdar código que não escreveu

## O `main.tsx` como ponto de entrada

O `main.tsx` é o **bootstrap** da aplicação React. Ele faz exatamente uma coisa:

1. Encontra o elemento `#root` no `index.html`
2. Cria uma React root nesse elemento
3. Renderiza o componente `<App />` dentro de `<StrictMode>`

Nunca coloque lógica de negócio, providers complexos, ou fetch de dados no `main.tsx`. Ele deve ser o mais simples possível — apenas o ponto de montagem.

## O `App.tsx` como root component

O `App.tsx` é o primeiro componente da árvore React. Na prática, é onde começa a **sua** aplicação. Providers globais (tema, autenticação, rotas) tipicamente ficam aqui ou são importados aqui.

O instrutor esvazia completamente o `App.tsx` para criar do zero na próxima aula, demonstrando que o template é apenas um ponto de partida descartável.

## Dependências do ESLint removidas

O instrutor remove especificamente estas dependências do `package.json`:

- `@eslint/js` — regras JavaScript base do ESLint
- `eslint` — o linter em si
- `eslint-plugin-react-hooks` — regras para hooks do React
- `eslint-plugin-react-refresh` — regras para React Fast Refresh

Essas dependências são úteis em projetos profissionais, mas para o contexto de aprendizado, o instrutor prefere simplicidade. Em um projeto real, considere manter o ESLint com regras adequadas.