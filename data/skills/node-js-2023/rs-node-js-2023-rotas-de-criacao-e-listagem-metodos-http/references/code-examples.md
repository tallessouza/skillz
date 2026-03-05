# Code Examples: Rotas HTTP e Metodos HTTP

## Exemplo 1: Extraindo method e url do request

```javascript
import http from 'node:http'

const server = http.createServer((req, res) => {
  const { method, url } = req

  console.log(method, url)

  return res.end('Hello World')
})

server.listen(3333)
```

Ao acessar `localhost:3333`, o console mostra: `GET /`
Ao acessar `localhost:3333/users`, mostra: `GET /users`

## Exemplo 2: Testando com diferentes metodos

```bash
# GET (metodo padrao do navegador)
http GET localhost:3333/users
# Output no console: GET /users

# POST
http POST localhost:3333/users
# Output no console: POST /users
```

O instrutor usa o modulo `http` do terminal (httpie), mas enfatiza que nao e obrigatorio ter instalado — o ponto e demonstrar que metodos diferentes chegam ao servidor.

## Exemplo 3: Roteamento com early return

```javascript
import http from 'node:http'

const server = http.createServer((req, res) => {
  const { method, url } = req

  // Rota 1: listar usuarios
  if (method === 'GET' && url === '/users') {
    return res.end('Listagem de usuarios')
  }

  // Rota 2: criar usuario
  if (method === 'POST' && url === '/users') {
    return res.end('Criacao de usuario')
  }

  // Fallback: rota nao encontrada
  return res.end('Hello World')
})

server.listen(3333)
```

### Testando:
```bash
# Cai no primeiro return
http GET localhost:3333/users
# → "Listagem de usuarios"

# Cai no segundo return
http POST localhost:3333/users
# → "Criacao de usuario"

# Cai no fallback
http GET localhost:3333/outra-rota
# → "Hello World"
```

## Exemplo 4: Expandindo para CRUD completo (extrapolacao do padrao)

Aplicando o mesmo padrao da aula para todos os 5 metodos:

```javascript
const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    return res.end('Listagem de usuarios')
  }

  if (method === 'POST' && url === '/users') {
    return res.end('Criacao de usuario')
  }

  if (method === 'PUT' && url === '/users') {
    return res.end('Atualizacao completa de usuario')
  }

  if (method === 'PATCH' && url === '/users') {
    return res.end('Atualizacao parcial de usuario')
  }

  if (method === 'DELETE' && url === '/users') {
    return res.end('Remocao de usuario')
  }

  return res.end('Rota nao encontrada')
})
```

## Nota sobre evolucao

O instrutor menciona que essa sintaxe com ifs e "de uma maneira mais simples por enquanto" e que "mais pra frente a gente vai melhorar bastante essa sintaxe". O padrao de roteamento manual serve para entender o conceito — em aulas futuras, sera substituido por abstrações mais robustas.