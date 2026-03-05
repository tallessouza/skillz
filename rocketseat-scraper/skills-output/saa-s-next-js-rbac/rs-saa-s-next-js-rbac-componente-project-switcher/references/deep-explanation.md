# Deep Explanation: Client Component Data Fetching no Next.js

## Por que nao usar cookies para tudo

O instrutor explica que, diferente do Organization Switcher que usa cookies (via middleware que salva a org ativa a partir da URL), para projetos ele optou por usar somente a URL. A razao: "comeca a ficar um pouco de coisa demais armazenando dentro dos cookies". Cookies sao bons para dados globais (como org ativa), mas para dados mais granulares (projeto ativo), a URL e suficiente e mais limpa.

## Limitacao do Next.js com URL em Server Components

O Next.js nao permite acessar dados da URL (pathname, params) em Server Components — exceto em paginas diretas (page.tsx). Isso e uma "limitacao justificavel pelo jeito que o Next funciona". Se o componente esta aninhado (componente dentro de componente dentro de componente), passar params desde a pagina seria "muito trabalho e nao vai ficar tao bonito o codigo". A solucao pragmatica: tornar o componente um Client Component.

## O hook `use` do React 19

O React 19 introduziu o hook `use`, que permite obter dados de uma Promise diretamente em Client Components:

```typescript
const projects = use(getProjects(orgSlug!))
```

Tambem pode ser usado para acessar contextos (substituindo useContext). Porem, o instrutor opta por NAO usar ele porque:
- Nao tem cache automatico
- Nao tem loading/error states nativos
- Nao tem deduplication de requests
- React-query resolve tudo isso

O instrutor considera react-query "uma das poucas bibliotecas insubstituiveis no React".

## SuperJSON — mencionado como curiosidade

Quando dados passam por HTTP como JSON, classes do JavaScript (como Date) sao convertidas em strings. O instrutor menciona o SuperJSON (criado pelo pessoal do Blitz.js) como solucao — ele envia metadados no JSON indicando que um campo era um Date, e reconverte no frontend. Nao e usado no projeto, mas e "um projeto super legal".

## Server Components dentro de Client Components

Regra fundamental do Next.js 15: a unica forma de usar um Server Component dentro de um Client Component e passando-o como `children`. Quando voce envolve conteudo com um provider (Client Component), os filhos passados via children NAO se tornam Client Components automaticamente. Mas se voce importar e renderizar um componente diretamente dentro de um Client Component, ele sera convertido em Client Component, e todo o JavaScript necessario sera incluido no bundle.

## Pattern do arquivo providers.tsx

Quase todo projeto Next.js hoje tem um arquivo `providers.tsx`. Ele agrupa todos os context providers (QueryClientProvider, ThemeProvider, etc.) em um unico Client Component que recebe children. Isso permite que o layout.tsx continue sendo Server Component.