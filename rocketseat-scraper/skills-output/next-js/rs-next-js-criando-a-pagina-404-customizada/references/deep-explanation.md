# Deep Explanation: Pagina 404 Customizada no Next.js App Router

## Convencao not-found.tsx

No App Router do Next.js, a pagina 404 e criada com o arquivo `not-found.tsx` na pasta `app/`. Basta exportar um componente default e ele automaticamente substitui a pagina 404 generica do Next.js.

Importante: essa convencao e **exclusiva do App Router**. No Pages Router, a convencao e `pages/404.tsx` com uma estrutura diferente. Ambas funcionam, mas nao misture as abordagens.

## A sacada do ?search para auto-focus

O instrutor destaca uma tecnica de usabilidade muito elegante: quando o usuario esta perdido (pagina 404), ele provavelmente quer encontrar algo. Entao o botao "Pesquisar Posts" leva para `/blog?search`.

No componente de busca, o `useSearchParams().has("search")` detecta a presenca desse parametro. Combinado com `useRef` e `useEffect`, o input recebe foco automatico assim que a pagina monta. O usuario pode comecar a digitar imediatamente sem precisar clicar no campo.

Essa e uma camada de usabilidade que poucas pessoas implementam, mas faz diferenca significativa na experiencia.

## useRef — hook subutilizado

O instrutor observa que `useRef` e "extremamente util" mas poucas pessoas usam no dia a dia. No contexto de 404, ele permite:

1. Criar uma referencia ao elemento input (`useRef<HTMLInputElement | null>(null)`)
2. Passar como `ref={inputRef}` no JSX
3. Acessar `.current.focus()` programaticamente no `useEffect`

A combinacao `useRef` + `useEffect` e o padrao idiomatico do React para manipulacao imperativa de DOM quando necessario.

## Estilizacao com proposito

O 404 nao e apenas uma mensagem de erro — e um ponto de recuperacao. O instrutor estrutura:

1. **Icone visual** (FileQuestion do Lucide) — comunica visualmente o problema
2. **"404" grande e estilizado** — com spans individuais e transform CSS (rotate, translate) para dar personalidade
3. **Texto descritivo** — "Pagina nao encontrada"
4. **Botoes de acao** — Home (primario) + Pesquisar Posts (secundario)

A hierarquia visual guia o usuario: entender o problema → escolher acao → resolver.

## Spans individuais para cada digito

Em vez de um unico `<h2>404</h2>`, o instrutor usa 3 `<span>` separados (4, 0, 4). Isso permite aplicar transformacoes CSS individuais — como rotacionar o primeiro "4" com `rotate-12` e deslocar com `translate-y-2` — criando um efeito visual mais interessante e unico.