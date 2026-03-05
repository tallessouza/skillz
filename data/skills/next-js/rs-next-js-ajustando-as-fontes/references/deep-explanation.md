# Deep Explanation: Centralizacao de Fontes no Next.js Pages Router

## Por que centralizar no layout e nao no _document?

O instrutor explica um ponto crucial da arquitetura Next.js Pages Router: o `_document` so executa no servidor. Ja o `_app` e, por consequencia, o layout que envolve o `_app`, executam tanto no servidor quanto no client. Isso torna o layout o lugar ideal para configuracao de fontes, porque:

1. As fontes precisam estar disponiveis no client para renderizacao
2. O layout envolve toda a aplicacao (header, main, footer)
3. Centraliza a configuracao num unico ponto

## Hierarquia de aplicacao de fontes

O instrutor demonstra uma hierarquia clara:

1. **Container raiz do layout** recebe a fonte padrao (Inter) — tudo herda essa fonte
2. **Titulos das secoes** recebem override explicito (PT Sans Caption via `font-sans`)
3. **Demais textos** herdam automaticamente a fonte do container pai

Isso elimina a necessidade de especificar a fonte em cada componente. So se especifica quando e diferente do padrao.

## CSS Variables como ponte para Tailwind

O padrao `variable: '--font-sans'` cria uma CSS custom property que o Tailwind consome via `fontFamily` no config. Isso permite usar classes utilitarias (`font-sans`, `font-inter`) em vez de manipular `className` diretamente com o objeto da fonte.

O mapeamento e:
- `PT_Sans_Caption` → `variable: '--font-sans'` → `fontFamily.sans: 'var(--font-sans)'` → classe `font-sans`
- `Inter` → `variable: '--font-inter'` → `fontFamily.inter: 'var(--font-inter)'` → classe `font-inter`

## Weight como array vs string

- **Inter:** pesos 400 (regular) e 500 (medium) → `weight: ['400', '500']` (array)
- **PT Sans Caption:** apenas peso 700 (bold) → `weight: '700'` (string)

O instrutor mostra como verificar os pesos disponiveis no Google Fonts antes de configurar.

## Refatoracao gradual

O processo demonstrado foi:
1. Mover instanciacao das fontes para o layout
2. Definir fonte padrao no container raiz
3. Ir secao por secao removendo imports locais da fonte
4. Substituir `className={ptSans.className}` por `font-sans`
5. Limpar template literals desnecessarios

## Detalhe do margin-top

O instrutor menciona que a tag `<main>` recebe `mt-10` (40px de margin-top), um ajuste feito durante a gravacao que ele esqueceu de mostrar explicitamente.