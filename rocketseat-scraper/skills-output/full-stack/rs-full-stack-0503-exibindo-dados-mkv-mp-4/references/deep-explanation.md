# Deep Explanation: Exibindo Dados da API na Interface

## Por que mapear antes de setar estado?

O instrutor demonstra um padrão fundamental: a resposta da API tem um shape diferente do que o componente espera. O componente `RefundItem` espera campos como `title`, `description`, `amount` e `categoryImg`, mas a API retorna `user.name`, `name`, `amount`, `category.icon`.

Fazer essa transformação no `.map()` antes do `setState` tem vantagens claras:
- O componente não precisa conhecer a estrutura da API
- Se a API mudar, você corrige em um lugar só (o map)
- Os dados já chegam prontos para renderização

## O erro de inversão de campos

O instrutor comete um erro ao vivo: inverte `amount` com `value` na hora de mapear. Isso ilustra por que é importante verificar visualmente a saída após cada transformação. O campo `amount` estava recebendo o valor errado porque os nomes foram trocados no mapeamento.

**Lição:** sempre confira o resultado visual após popular o estado. Campos invertidos não geram erro — geram dados errados silenciosamente.

## Renomeando campos para o contexto da UI

O instrutor decide trocar `category` por `description` no componente `RefundItem`. Isso mostra que o nome do campo deve refletir o que a UI exibe, não o que a API retorna:
- API retorna `refund.name` → UI mostra como "descrição" da solicitação
- API retorna `refund.user.name` → UI mostra como "título" (nome do usuário)

Essa renomeação acontece tanto no mapeamento quanto no componente. O instrutor edita o componente `RefundItem` trocando a prop `category` por `description` para que o nome faça sentido no contexto visual.

## Paginação: estado local vs estado da resposta

O instrutor faz uma distinção importante:
- `page` (página atual) — é estado **local**, controlado pelo usuário ao clicar nos botões
- `totalOfPages` — vem da **resposta da API** (`response.data.pagination.totalPage`)

Não faz sentido sobrescrever `page` com o valor da resposta porque o usuário já controla esse estado. Mas `totalOfPages` precisa vir da API porque só o backend sabe quantas páginas existem.

## Desabilitação automática dos botões de paginação

Quando só existe uma página de resultados, o componente de paginação desabilita automaticamente os botões de avançar e voltar. Essa validação já foi implementada anteriormente — o ponto aqui é que ao atualizar `totalOfPages` corretamente, a UI reage automaticamente sem lógica adicional.

Isso é um exemplo de estado derivado: o comportamento dos botões (habilitado/desabilitado) é derivado da combinação de `page` e `totalOfPages`, sem precisar de um estado separado `isNextDisabled`.

## Fluxo completo de dados

```
API Response (shape da API)
    ↓ .map() — extrai e renomeia campos
Dados formatados (shape do componente)
    ↓ setState
Estado React
    ↓ renderização
Componente visual (RefundItem)
```

Cada camada tem sua responsabilidade. Misturar as camadas (ex: acessar `refund.user.name` direto no JSX) cria acoplamento desnecessário.