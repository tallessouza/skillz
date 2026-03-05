# Code Examples: Autenticação vs Autorização

> Nota: Esta aula é de encerramento/revisão e não contém código novo. Os exemplos abaixo ilustram os conceitos revisados, baseados no que foi ensinado ao longo do módulo.

## Fluxo básico de autenticação com JWT

```typescript
// Middleware de autenticação — verifica QUEM é o usuário
function authenticateToken(request, response, next) {
  const authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return response.status(401).json({ message: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    request.user = decoded
    next()
  } catch {
    return response.status(401).json({ message: 'Token inválido' })
  }
}
```

## Fluxo básico de autorização com roles

```typescript
// Middleware de autorização — verifica O QUE o usuário pode fazer
function authorize(allowedRoles: string[]) {
  return (request, response, next) => {
    const userRole = request.user.role

    if (!allowedRoles.includes(userRole)) {
      return response.status(403).json({ message: 'Acesso negado' })
    }

    next()
  }
}

// Uso: somente admin pode deletar usuários
app.delete('/users/:id', authenticateToken, authorize(['admin']), deleteUser)

// Uso: admin e editor podem criar posts
app.post('/posts', authenticateToken, authorize(['admin', 'editor']), createPost)
```

## Geração de JWT no login

```typescript
// Rota de login — gera token após autenticação
app.post('/login', (request, response) => {
  const { email, password } = request.body

  // Verificação de credenciais (sem banco, dados em memória)
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return response.status(401).json({ message: 'Credenciais inválidas' })
  }

  // JWT carrega identidade E role — ponte entre auth e autorização
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  )

  return response.json({ token })
})
```

## Separação clara das camadas

```typescript
// CAMADA 1: Autenticação (quem é?)
app.use('/api', authenticateToken)

// CAMADA 2: Autorização (pode fazer?)
app.get('/api/admin/dashboard', authorize(['admin']), adminDashboard)
app.get('/api/profile', authorize(['admin', 'user']), userProfile)
app.get('/api/public', publicContent) // sem autorização adicional
```