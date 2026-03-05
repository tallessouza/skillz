# Deep Explanation: Controller Pattern

## Por que separar rotas de controllers?

O instrutor enfatiza o conceito de **separacao de responsabilidades**. Existem dois papeis distintos:

1. **Roteamento** — definir QUAL caminho HTTP mapeia para QUAL acao
2. **Execucao** — O QUE acontece quando aquele caminho e acessado

Quando voce mistura os dois no mesmo arquivo, o arquivo de rotas cresce descontroladamente. Cada rota carrega sua logica, e encontrar onde algo acontece se torna dificil.

## A regra dos 5 metodos

O padrao de no maximo 5 metodos por controller (index, show, create, update, remove) e uma convencao que vem do Rails e foi adotada por diversas comunidades. A logica e:

- Esses 5 metodos cobrem todas as operacoes CRUD de um recurso REST
- Se voce precisa de um sexto metodo, e sinal de que voce esta misturando dois recursos em um
- Exemplo: se `ProductsController` precisa de um metodo `search`, talvez voce precise de um `ProductSearchController`

Essa restricao forca voce a pensar em termos de **recursos**, nao de acoes arbitrarias.

## Padronizacao como ferramenta de manutencao

O instrutor destaca que padronizar nomes de metodos facilita a navegacao:

- Qualquer desenvolvedor que entre no projeto sabe que `index` lista, `show` exibe um, `create` cria, `update` atualiza, `remove` deleta
- Nao ha ambiguidade: nao existe `getAll`, `fetchProducts`, `listAll` — e sempre `index`
- Isso reduz carga cognitiva e acelera onboarding

## Tipagem de Request e Response

No TypeScript, sem importar `Request` e `Response` do Express, os parametros ficam como `any`. O instrutor demonstra que ao tipar:

- Voce ganha autocomplete para `request.query`, `request.body`, `request.params`
- Erros de acesso a propriedades inexistentes sao pegos em tempo de compilacao
- A IDE mostra os metodos disponiveis em `response` (`.json()`, `.status()`, etc.)

## Instanciacao da classe

O controller e uma classe que precisa ser instanciada com `new`. O instrutor mostra:

```typescript
const productsController = new ProductsController()
```

Feito uma vez no topo do arquivo de rotas. Depois, cada rota referencia o metodo:

```typescript
productsRoutes.get("/", productsController.index)
```

O Express automaticamente passa `request` e `response` como argumentos para o metodo chamado. Por isso nao e necessario escrever `(req, res) => productsController.index(req, res)` — basta passar a referencia do metodo.

## Estrutura de pastas

```
src/
├── controllers/
│   └── ProductsController.ts
├── routes/
│   └── products.routes.ts
└── server.ts
```

Essa organizacao escala: para cada recurso (users, orders, payments), voce tera um arquivo de rotas e um controller correspondente.