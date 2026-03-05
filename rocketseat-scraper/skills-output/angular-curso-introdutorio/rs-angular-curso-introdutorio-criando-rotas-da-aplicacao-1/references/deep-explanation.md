# Deep Explanation: Criando Rotas em Angular

## O que sao rotas e por que existem

O instrutor começa explicando o problema: ate este ponto do curso, para acessar uma pagina diferente, era necessario alterar manualmente o template do `app.component.html`, trocando o componente renderizado. Rotas eliminam essa necessidade — cada URL mapeia para um componente automaticamente.

A analogia usada e direta: "rota, como o proprio nome ja diz, e um caminho para acessar uma determinada pagina." Por exemplo:
- `/certificados` → lista de certificados
- `/certificados/1` → certificado especifico com ID 1
- `/` (raiz) → pagina inicial

## Estrutura do arquivo `app.routes.ts`

O arquivo ja vem pre-criado pelo Angular CLI dentro da pasta `app/`. Ele exporta um `const routes` que e um array de objetos. Cada objeto aceita varios atributos (vistos via Ctrl+Space no editor), mas os dois essenciais sao:

1. **`path`** — o caminho da URL (sem barra inicial)
2. **`component`** — qual componente Angular carregar

O instrutor enfatiza: "nao precisa colocar a barra aqui no inicio, simplesmente ja comeca a escrever o caminho."

## O papel do `router-outlet`

Apos definir as rotas, o instrutor mostra que nada acontece ao acessar `/certificados`. O motivo: falta o `<router-outlet>` no template. Este elemento e o placeholder onde o Angular injeta dinamicamente o componente correspondente a rota atual.

Componentes como `<app-navbar>` e `<app-base-layout>` permanecem fixos — sao a "casca" da aplicacao. Apenas o conteudo dentro do `router-outlet` muda.

## Parametros dinamicos com `:id`

Para paginas de item especifico, o instrutor usa a sintaxe `:id` no path: `certificados/:id`. Qualquer valor passado apos a barra (1, 2, UUID) sera capturado como parametro. O instrutor menciona que "fica o seu criterio" qual tipo de identificador usar.

Nesta aula ele nao implementa a captura do parametro (isso vem depois), apenas configura a rota.

## Estados visuais vs rotas

Insight importante do instrutor ao analisar o Figma: uma tela com dois estados visuais diferentes (ex: lista vazia vs lista com itens) NAO precisa de duas rotas. "E uma unica pagina, so com dois estados diferentes. Nao precisa de uma rota especifica para cada estado."

## Limpeza de imports

O instrutor mostra um problema colateral: ao longo do desenvolvimento, imports foram adicionados automaticamente e nunca removidos, gerando warnings no console. A solucao e o comando:

```bash
ng generate @angular/core:cleanup-unused-imports
```

No exemplo, ele removeu 6 imports nao utilizados do `app.component.ts` de uma vez.

## Convencao de nomes de rota

O instrutor usa o padrao RESTful intuitivamente:
- `certificados` → listagem (collection)
- `certificados/novo` → criacao (new)
- `certificados/:id` → item especifico (show)