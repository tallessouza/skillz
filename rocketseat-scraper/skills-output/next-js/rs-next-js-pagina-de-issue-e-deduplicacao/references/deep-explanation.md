# Deep Explanation: Pagina de Issue e Deduplicacao

## Por que params e uma Promise no Next.js 15+

No Next.js 15, tanto `params` quanto `searchParams` foram transformados em Promises. Isso significa que voce DEVE usar `await` para acessar os valores. O instrutor enfatiza: "faltou o await aqui na frente e o async aqui" — e esquecido com frequencia por desenvolvedores acostumados com versoes anteriores.

## A mecanica da deduplicacao automatica

O Next.js intercepta todas as chamadas `fetch` feitas em server components. Quando detecta que duas chamadas tem:
- Mesma URL
- Mesmos parametros/headers

Ele executa a requisicao UMA unica vez e compartilha o resultado. Isso acontece transparentemente — o desenvolvedor nao precisa fazer nada.

O instrutor explica: "ele percebe que eu estou fazendo a mesma requisicao tanto na pagina quanto no generateMetadata e ele deduplica isso para a gente, ou seja, ele faz uma unica requisicao e compartilha o resultado entre os dois locais."

## Por que unstable_cache ainda e "unstable"

O instrutor observa que a funcao `unstable_cache` provavelmente permanecera instavel por um bom tempo porque "a maioria dos casos sao cobertos pela automacao em cima da funcao Fetch." Como o padrao recomendado e usar fetch (front chamando back) em vez de acesso direto ao banco, a necessidade de `unstable_cache` e minoritaria.

## Filosofia: fetch > acesso direto ao banco

O instrutor e enfatico: "na maioria das vezes, o certo e eu nao fazer a chamada para o banco de dados direto no meu app Next.js, apesar de eu poder fazer isso. Eu geralmente, quase sempre, 98% das vezes eu vou usar um fetch."

Razoes:
1. Deduplicacao automatica gratuita
2. Cache integrado do Next.js
3. Separacao clara entre front-end e back-end
4. Revalidacao automatica

## generateMetadata recebe as mesmas props

O ponto chave: "no Next, as mesmas props que a minha pagina recebe, esse generateMetadata tambem recebe." Isso permite configurar titulo, Open Graph, e qualquer metadado usando os mesmos dados da pagina sem logica extra.

## Tipando props de componentes com Link

O instrutor mostra duas formas de estender props de componentes do Next.js:
1. Importar diretamente: `LinkProps` exportado pela lib
2. Usar `ComponentProps<typeof Link>` (mais generico, funciona sempre)

A segunda abordagem e mais confiavel quando a lib nao exporta as props diretamente.