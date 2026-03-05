# Deep Explanation: Métodos HTTP

## A relação cliente-servidor e o protocolo HTTP

A API vive dentro de um servidor. O cliente (desktop, web, mobile) se comunica com ela via protocolo HTTP. Essa comunicação tem duas direções:

1. **Requisição (request):** cliente faz um pedido à API
2. **Resposta (response):** API devolve o resultado

### Por que a API SEMPRE deve responder

O instrutor enfatiza: **sempre** a API tem que devolver uma resposta, seja de sucesso ou de erro. Se a API não responde, o cliente fica esperando indefinidamente até estourar o timeout (tempo de tolerância do navegador ou cliente HTTP).

Exemplos de respostas:
- Cliente pede lista de produtos filtrados por cor vermelha → API retorna a listagem (sucesso)
- Cliente tenta criar produto que já existe → API retorna erro "produto já cadastrado"
- Cliente acessa rota que não existe → API retorna "not found"

A resposta pode ou não ter conteúdo (body). Mesmo sem conteúdo, o status code comunica o resultado.

## Por que métodos HTTP existem

O insight central do instrutor: **o mesmo endereço (path) pode executar ações completamente diferentes**. Exemplo:

- `GET https://meuservidor.com.br/products` → ler/consultar produtos
- `POST https://meuservidor.com.br/products` → criar novo produto

A API diferencia a ação pelo método HTTP, não pela URL. Isso é o que torna os métodos HTTP fundamentais: eles são **semânticos** — dão significado à ação.

## Os 5 métodos principais

| Método | Ação | Analogia |
|--------|------|----------|
| GET | Ler/consultar/buscar | "Me mostra o que tem" |
| POST | Criar/cadastrar | "Registra isso pra mim" |
| PUT | Atualizar completamente | "Substitui tudo por isso" |
| DELETE | Excluir/remover | "Remove isso" |
| PATCH | Atualizar parcialmente | "Muda só esse campo" |

### PUT vs PATCH

O instrutor diferencia claramente:
- **PUT:** atualizar todos os dados de um produto
- **PATCH:** atualizar apenas um campo específico — foto do produto, status de disponibilidade, etc.

PATCH é para quando "eu quero atualizar uma coisa mais específica".

## Status Codes — as 5 faixas

| Faixa | Significado | Exemplos |
|-------|-------------|----------|
| 1xx | Informativo | 102 Processing |
| 2xx | Sucesso | 200 OK, 201 Created |
| 3xx | Redirecionamento | 301 Moved Permanently, 302 Found |
| 4xx | Erro do cliente | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Erro do servidor | 500 Internal Server Error |

### Diferença entre 4xx e 5xx

- **4xx:** erro causado pela requisição do cliente (rota errada, sem autorização, dados inválidos)
- **5xx:** erro interno do servidor, não causado diretamente pelo cliente

### Conselho do instrutor

"Você não precisa se preocupar em decorar todos esses status codes. Com o passar do tempo você vai vendo os mais utilizados e vai ficando super natural."

## Resposta com e sem conteúdo

- **Com conteúdo:** retorna ID do produto cadastrado, listagem de produtos filtrados
- **Sem conteúdo:** após deletar um produto, não precisa retornar detalhes — apenas se deu certo ou não

O status code é a camada mínima de informação que toda resposta deve ter, mesmo sem body.

## Modelo mental completo

```
REQUISIÇÃO = Método HTTP + Path + (Body opcional)
                ↓
              API processa
                ↓
RESPOSTA = Status Code + (Body opcional)
```

O método HTTP está na requisição (indica a ação).
O status code está na resposta (indica o resultado).