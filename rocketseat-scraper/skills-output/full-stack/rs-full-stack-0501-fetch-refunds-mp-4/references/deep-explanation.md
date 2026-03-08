# Deep Explanation: fetchRefunds — Busca Paginada com Axios

## Contexto da aplicação

A aplicação possui dois perfis: solicitante (que envia pedidos de reembolso com upload de arquivo) e manager (que visualiza, filtra e gerencia as solicitações). Esta aula foca nas rotas do manager — especificamente a busca paginada de solicitações.

## Estrutura da página do manager

A página do manager contém:
- **Título** da seção
- **Formulário de pesquisa** com input de texto (nome) e botão submit
- **Lista de solicitações** renderizada por um componente dedicado
- **Footer de paginação** para navegar entre páginas

Inicialmente tudo é estático com dados de exemplo no estado. O objetivo é substituir por dados reais da API.

## Por que importar AxiosError separadamente

O Axios exporta tanto a instância padrão quanto tipos/classes de erro. Importar `AxiosError` separadamente permite:

```typescript
import { AxiosError } from "axios"
```

Isso habilita o uso de `instanceof` para verificação de tipo em runtime:

```typescript
if (error instanceof AxiosError) {
  // TypeScript sabe que error.response existe
  alert(error.response?.data?.message)
}
```

Sem essa verificação, acessar `error.response` em um erro de rede (sem resposta HTTP) causaria `TypeError`.

## O erro clássico: `$` vs `&` em query strings

O instrutor demonstra um erro real que cometeu ao vivo: usar `$` (cifrão) como separador de query parameters ao invés de `&` (e-comercial).

**Errado:**
```
/refunds?name=João$page=1$per_page=5
```

A URL inteira após `?name=` é interpretada como o valor do parâmetro `name`. A API recebe:
- `name` = `"João$page=1$per_page=5"`
- `page` = undefined
- `per_page` = undefined

Resultado: erro de validação — "expected a number" para `page`.

**Correto:**
```
/refunds?name=João&page=1&per_page=5
```

Cada `&` separa um novo par chave=valor. A API recebe corretamente os três parâmetros.

## Fluxo de paginação da API

A API aceita três query parameters:
- **name** — filtro de pesquisa pelo nome da pessoa (usado com `LIKE` ou similar no banco)
- **page** — número da página atual (1-indexed)
- **per_page** — quantidade de itens por página

A API retorna:
```json
{
  "refunds": [{ "id": "...", "description": "Participação do evento", ... }],
  "pagination": {
    "page": 1,
    "perPage": 5,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

Internamente, a API calcula o `skip` (offset) baseado em `(page - 1) * perPage` para a query no banco de dados.

## Padrão de busca: onSubmit + useEffect

A função `fetchRefunds` serve dois propósitos:
1. **Carga inicial** — via `useEffect([], [])` quando a tela monta
2. **Pesquisa** — via `onSubmit` do formulário quando o usuário filtra por nome

Por isso ela é extraída como função nomeada reutilizável, não inline no useEffect.

## Tratamento de erros em camadas

O padrão recomendado é um try/catch com duas camadas:

1. **Erro da API (AxiosError)** — a API respondeu com status de erro e possivelmente uma mensagem descritiva em `error.response.data.message`
2. **Erro genérico** — falha de rede, timeout, ou erro inesperado — exibe mensagem genérica ao usuário

Esse padrão evita mostrar ao usuário erros técnicos incompreensíveis enquanto preserva mensagens úteis que a API fornece (como "usuário não encontrado" ou "erro de validação").

## Constante PER_PAGE

Definir `PER_PAGE` como constante no topo do componente (ou módulo) em vez de número mágico inline:
- Facilita alterar o valor em um único lugar
- Documenta a intenção (é a quantidade de itens por página)
- Pode ser reutilizada no cálculo do total de páginas na UI