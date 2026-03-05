# Deep Explanation: Obtendo Dados do Formulário

## Por que preventDefault é essencial

O comportamento padrão de um formulário HTML ao ser submetido é enviar uma requisição HTTP (GET ou POST) para a URL definida no atributo `action` — ou para a própria página se `action` não estiver definido. Isso causa um recarregamento completo da página.

Em aplicações JavaScript modernas onde manipulamos os dados no client-side, esse recarregamento:
- Perde qualquer estado JavaScript em memória
- Reseta o DOM para o estado inicial
- Impede que o código após o submit seja executado
- Causa uma experiência ruim para o usuário (flash de tela branca)

`event.preventDefault()` intercepta esse comportamento nativo e permite que o JavaScript assuma o controle completo do que acontece com os dados.

## Estratégia de seleção de elementos

O instrutor usa uma estratégia clara e consistente:

1. **`getElementById`** para elementos com `id` — é o método mais performático do DOM para seleção individual. O browser mantém uma hash table interna de ids, então a busca é O(1).

2. **`querySelector`** para o formulário — quando o elemento é selecionado pela tag (não tem id específico), `querySelector("form")` é a escolha natural. Retorna o primeiro match.

### Por que não usar querySelector para tudo?

Embora `querySelector("#expense")` funcione, `getElementById("expense")` é:
- Mais explícito na intenção (estou buscando por id)
- Marginalmente mais rápido (acesso direto à hash table)
- Convenção mais comum em código vanilla JS

## Organização do código: seleções no topo

O instrutor demonstra um padrão importante: todas as seleções de elementos ficam agrupadas no topo do script, antes de qualquer lógica. Isso serve como uma "declaração de dependências" — ao olhar o topo do arquivo, você sabe exatamente quais elementos do DOM o script precisa.

O instrutor inclusive mostra como recolher blocos de código no editor (code folding) para manter o foco no que está sendo trabalhado — evidenciando que organização visual do código importa durante o desenvolvimento.

## Arrow function no onsubmit

A escolha de arrow function (`(event) => {}`) ao invés de function expression (`function(event) {}`) é deliberada:
- Sintaxe mais concisa
- `this` léxico (não rebinda o contexto)
- Padrão moderno de JavaScript
- Consistente com o restante do código do projeto

## O parâmetro event

O `event` (objeto do evento) é passado automaticamente pelo browser quando o handler é invocado. Ele contém:
- `preventDefault()` — cancela o comportamento padrão
- `target` — referência ao elemento que disparou o evento (o form)
- `submitter` — o botão que causou o submit
- Outros metadados do evento

Mesmo que você só use `preventDefault()`, é boa prática receber o `event` para ter acesso a ele quando necessário.