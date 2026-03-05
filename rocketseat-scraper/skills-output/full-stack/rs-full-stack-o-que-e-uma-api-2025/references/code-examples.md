# Code Examples: O que é uma API

## Estrutura JSON básica

O instrutor mostrou este formato de JSON:

```json
{
  "user": {
    "id": 1,
    "name": "Rodrigo Gonzalez"
  }
}
```

### Tipos de valores em JSON

```json
{
  "numero": 42,
  "texto": "uma string",
  "objeto": {
    "chave": "valor"
  },
  "lista": ["item1", "item2"],
  "booleano": true,
  "nulo": null
}
```

## Exemplo de rota completa

O instrutor mostrou a seguinte URL como exemplo:

```
https://meuservidor.com.br/produtos
```

Decomposta:
```
Protocolo:  https://
Servidor:   meuservidor.com.br
Recurso:    /produtos
```

## Exemplos práticos de requisições por método HTTP

### GET — Leitura

```javascript
// Listar todos os produtos
fetch('https://meuservidor.com.br/produtos', {
  method: 'GET'
})

// Listar produtos com preço menor que 100
fetch('https://meuservidor.com.br/produtos?preco_max=100', {
  method: 'GET'
})

// Buscar endereço pelo CEP
fetch('https://viacep.com.br/ws/01001000/json/')
```

### POST — Criação

```javascript
// Criar um novo produto
fetch('https://meuservidor.com.br/produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Camiseta',
    preco: 59.90
  })
})
```

### PUT — Atualização completa

```javascript
// Atualizar dados cadastrais completos
fetch('https://meuservidor.com.br/usuarios/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Rodrigo Gonzalez',
    email: 'rodrigo@email.com',
    telefone: '11999999999'
  })
})
```

### PATCH — Atualização parcial

```javascript
// Atualizar só a foto do perfil
fetch('https://meuservidor.com.br/usuarios/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    foto: 'https://cdn.exemplo.com/nova-foto.jpg'
  })
})
```

### DELETE — Remoção

```javascript
// Remover um produto
fetch('https://meuservidor.com.br/produtos/42', {
  method: 'DELETE'
})
```

## Exemplo prático: API de CEP (fluxo completo)

```javascript
// Usuário informa o CEP, campos preenchidos automaticamente
async function buscarEndereco(cep) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
  const endereco = await response.json()

  // endereco retorna algo como:
  // {
  //   "cep": "01001-000",
  //   "logradouro": "Praça da Sé",
  //   "bairro": "Sé",
  //   "localidade": "São Paulo",
  //   "uf": "SP"
  // }

  document.getElementById('rua').value = endereco.logradouro
  document.getElementById('bairro').value = endereco.bairro
  document.getElementById('cidade').value = endereco.localidade
  document.getElementById('estado').value = endereco.uf
}
```

## Resumo visual dos métodos HTTP

```
GET     →  📖 Ler dados      →  Não envia body
POST    →  ➕ Criar recurso   →  Envia dados no body (JSON)
PUT     →  🔄 Atualizar tudo →  Envia dados completos no body
PATCH   →  ✏️ Atualizar parte →  Envia dados parciais no body
DELETE  →  🗑️ Remover        →  Geralmente sem body
```