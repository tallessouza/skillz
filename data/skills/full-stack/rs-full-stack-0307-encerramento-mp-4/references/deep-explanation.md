# Deep Explanation: Fundamentos do Node.js

## Por que esses fundamentos importam

O instrutor estruturou o módulo como uma progressão deliberada onde cada conceito depende do anterior:

1. **Criar aplicação** → base para tudo
2. **Conceito de API** → entender O QUE estamos construindo
3. **Servidor HTTP** → o "motor" que recebe conexões
4. **Request/Response** → o ciclo fundamental de toda comunicação web
5. **Body da requisição** → como o cliente envia dados complexos
6. **Route params** → como identificar recursos específicos (`/users/123`)
7. **Query params** → como filtrar e buscar (`/users?role=admin`)
8. **Dados em memória** → primeiro passo para manipular estado
9. **Persistência em arquivo** → sobreviver a restarts sem banco de dados

## A progressão de persistência

O módulo ensina uma progressão clara de como lidar com dados:

### Nível 1: Memória (array/objeto)
- Mais simples possível
- Perfeito para protótipos e testes
- Dados perdidos ao reiniciar o servidor
- Sem dependências externas

### Nível 2: Arquivo (fs + JSON)
- Dados sobrevivem a restarts
- Ainda sem dependência de banco de dados
- Limitado em performance e concorrência
- Bom para aprendizado e projetos pequenos

### Nível 3: Banco de dados (próximo módulo)
- Solução real para produção
- Queries complexas, índices, transações
- Requer setup e conhecimento adicional

## Conexão entre os conceitos

O instrutor enfatiza que na próxima etapa "vamos juntar todas essas peças" — indicando que esses fundamentos são blocos de construção independentes que, combinados, formam uma aplicação completa. Cada conceito isolado é simples; o valor está em saber combiná-los.

## Parâmetros: quando usar cada tipo

### Route params (nomeados)
Identificam um recurso específico. Fazem parte da estrutura da URL.
- `GET /users/:id` → buscar usuário específico
- `DELETE /posts/:postId/comments/:commentId` → recurso aninhado

### Query params (não nomeados)
Modificam o comportamento da requisição. São opcionais.
- `GET /users?search=john&page=2` → filtrar e paginar
- `GET /products?category=electronics&sort=price` → filtrar e ordenar

### Body
Envia dados complexos que não cabem na URL.
- `POST /users` com body `{ name, email, password }` → criar recurso
- `PUT /users/:id` com body `{ name, email }` → atualizar recurso