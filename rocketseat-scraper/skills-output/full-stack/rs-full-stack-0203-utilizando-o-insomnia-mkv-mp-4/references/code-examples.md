# Code Examples: Utilizando o Insomnia

## Servidor usado na demonstracao

O instrutor usou um servidor Node.js basico rodando na porta 3333. O servidor retorna uma string simples.

```javascript
// server.js (exemplo baseado na demonstracao)
const http = require('node:http')

const server = http.createServer((request, response) => {
  response.end('Minha primeira API')
})

server.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
})
```

## Iniciando o servidor

```bash
npm run dev
```

O servidor precisa estar em execucao antes de enviar requisicoes pelo Insomnia.

## Configuracao da requisicao no Insomnia

```
Metodo: GET
URL: http://localhost:3333
Headers: (nenhum configurado nesta aula)
Body: (nenhum — GET nao envia body)
```

## Resposta recebida

```
Status: 200 OK
Body: Minha primeira API
```

## Exemplos de organizacao de colecoes

### API simples (como na aula)

```
Workspace: Rocket City
└── Collection: Minha Primeira API
    └── [GET] Obter Mensagem → http://localhost:3333
```

### API mais completa (projecao para aulas futuras)

```
Workspace: Rocket City
└── Collection: Minha Primeira API
    ├── [GET]    Obter Mensagem    → http://localhost:3333/
    ├── [GET]    Listar Usuarios   → http://localhost:3333/users
    ├── [POST]   Criar Usuario     → http://localhost:3333/users
    ├── [PUT]    Atualizar Usuario → http://localhost:3333/users/:id
    └── [DELETE] Deletar Usuario   → http://localhost:3333/users/:id
```

## Dicas praticas de uso

### Renomear workspace
1. Clicar no nome do workspace
2. Settings → Alterar nome → Update

### Renomear requisicao
1. Duplo-clique no nome da requisicao no painel esquerdo
2. Digitar novo nome
3. Clicar fora para salvar

### Ajustar paineis
- Arrastar as linhas verticais entre os paineis para redimensionar