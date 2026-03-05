# Deep Explanation: Listagem do Catalogo no Frontend

## Por que SWR ao inves de useEffect + useState?

O instrutor escolhe SWR especificamente porque ele gerencia cache automaticamente. Quando o usuario digita "arroz" na pesquisa, o SWR cacheia esse resultado. Se o usuario apagar e digitar "arroz" novamente, o resultado vem do cache instantaneamente sem nova requisicao. Isso melhora a performance percebida significativamente.

Alem disso, SWR gerencia revalidacao — se os dados ficarem stale, ele rebusca automaticamente em background sem mostrar loading para o usuario.

## Por que estado na URL ao inves do React state?

O instrutor explica uma decisao arquitetural importante: o estado de pesquisa NAO fica no `useState` do React. Fica no query parameter da URL (`?search=arroz`).

A razao e que `window.history.pushState` altera o endereco do navegador, o que:
1. Permite compartilhar a URL com a pesquisa ja aplicada
2. Permite usar o botao "voltar" do navegador
3. Sobrevive a refresh da pagina
4. Dispara re-renderizacao que faz o SWR buscar com o novo parametro

O fluxo completo:
```
Usuario digita → onChange → handleSearch → pushState altera URL →
re-render do componente → useSearchParams le novo valor →
SWR recebe nova key ["catalog", "arroz"] → getCatalog("arroz") → API → resultado
```

## A armadilha do CORS

O instrutor demonstra um erro real: esqueceu de habilitar CORS no backend NestJS. O frontend fazia a requisicao mas o navegador bloqueava a resposta. A solucao no NestJS e simples — `app.enableCors()` no `main.ts` — mas e facil esquecer quando se testa apenas com ferramentas como curl ou testes automatizados (que nao passam pelo navegador).

## Precos como inteiros

Os precos estao armazenados como inteiros (centavos) no banco de dados. O instrutor divide por 100 no frontend para exibir. Ele menciona que seria melhor fazer isso no backend, mas por enquanto deixa no frontend. Essa e uma pratica comum para evitar problemas de ponto flutuante com valores monetarios.

## Separacao de concerns: api.ts

O arquivo `api.ts` centraliza:
- A instancia do Axios com `baseURL` configurada via variavel de ambiente
- Funcoes tipadas como `getCatalog` que encapsulam os endpoints

Isso evita espalhar URLs e configuracoes de requisicao pelos componentes.

## Variavel de ambiente no Next.js

No Next.js App Router, variaveis de ambiente acessiveis no client-side precisam do prefixo `NEXT_PUBLIC_`. O instrutor inicialmente confundiu com Vite (`VITE_`), mas corrigiu para `process.env.NEXT_PUBLIC_API_URL`. Sem esse prefixo, a variavel so estaria disponivel no server-side.

## "use client" e o App Router

Como SWR usa hooks do React (estado, efeitos), a pagina precisa da diretiva `"use client"`. No Next.js App Router, componentes sao server components por padrao. Qualquer componente que use hooks de estado precisa dessa diretiva explicitamente.