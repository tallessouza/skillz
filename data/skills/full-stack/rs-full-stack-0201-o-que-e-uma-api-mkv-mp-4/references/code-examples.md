# Code Examples: O que é uma API

## Exemplo basico de API com Node.js (Express)

### Servidor com rotas

```typescript
import express from 'express'

const app = express()
app.use(express.json())

// Rota: cadastrar paciente
app.post('/patients', (request, response) => {
  const { name, email } = request.body

  // Simula verificacao no banco
  const patientAlreadyExists = false

  if (patientAlreadyExists) {
    // API SEMPRE retorna resposta — mesmo negativa
    return response.status(409).json({
      message: 'Paciente ja cadastrado',
    })
  }

  // Processa no servidor (salva no banco)
  const patient = { id: '1', name, email }

  // Retorna resposta de sucesso
  return response.status(201).json({
    message: 'Paciente cadastrado com sucesso',
    patient,
  })
})

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
})
```

### Anatomia das partes

```
POST https://meu-servidor.com.br/patients
|__| |________________________| |_______|
metodo     endereco servidor      rota

Request Body (dados enviados pelo cliente):
{
  "name": "João Silva",
  "email": "joao@email.com"
}

Response (resposta da API):
{
  "message": "Paciente cadastrado com sucesso",
  "patient": { "id": "1", "name": "João Silva", "email": "joao@email.com" }
}
```

## Variacao: multiplas rotas

```typescript
// Listar pacientes
app.get('/patients', (request, response) => {
  const patients = [] // buscar do banco
  return response.status(200).json({ patients })
})

// Buscar paciente por ID
app.get('/patients/:id', (request, response) => {
  const { id } = request.params
  const patient = null // buscar do banco

  if (!patient) {
    return response.status(404).json({
      message: 'Paciente nao encontrado',
    })
  }

  return response.status(200).json({ patient })
})

// Deletar paciente
app.delete('/patients/:id', (request, response) => {
  const { id } = request.params
  // deletar do banco
  return response.status(200).json({
    message: 'Paciente removido com sucesso',
  })
})
```

## Exemplo de consumo pelo front-end (cliente)

```typescript
// O front-end NAO sabe como a API implementou internamente
// Ele so conhece a rota e o formato de comunicacao

async function cadastrarPaciente(name: string, email: string) {
  const response = await fetch('https://meu-servidor.com.br/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })

  const data = await response.json()

  if (response.status === 409) {
    alert(data.message) // "Paciente ja cadastrado"
    return
  }

  alert(data.message) // "Paciente cadastrado com sucesso"
}
```

## Regra critica: sempre retornar resposta

```typescript
// ERRADO — cliente fica aguardando ate timeout
app.post('/patients', (request, response) => {
  const { name } = request.body
  saveToDatabase(name)
  // esqueceu de retornar resposta!
})

// CORRETO — sempre retorna algo
app.post('/patients', (request, response) => {
  const { name } = request.body
  saveToDatabase(name)
  return response.status(201).json({ message: 'Cadastrado' })
})
```