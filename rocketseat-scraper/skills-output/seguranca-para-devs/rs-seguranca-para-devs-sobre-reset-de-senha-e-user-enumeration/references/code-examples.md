# Code Examples: Reset de Senha e User Enumeration

## Exemplo completo do instrutor (Node.js + Express + SQLite)

### Estrutura do banco de dados

```sql
-- Tabela de usuarios com coluna para reset token
CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  email TEXT,
  password TEXT,
  reset_token TEXT
);
```

### Funcoes auxiliares

```javascript
// Sleep - simula delay ou forca tempo consistente
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Busca usuario por email
function getUser(email) {
  // SELECT * FROM user WHERE email = ?
  return db.get('SELECT * FROM user WHERE email = ?', [email])
}

// Gera token e salva no banco
function setUserToken(email) {
  const token = Math.random().toString() // NOTA: em producao, usar crypto.randomBytes
  db.run('UPDATE user SET reset_token = ? WHERE email = ?', [token, email])
  return token
}

// Simula envio de email com delay realista
async function sendMail(email, token) {
  console.log(`Para cadastrar uma nova senha, clique no link: ${host}/new-password?token=${token}`)
  // Simula tempo de conexao SMTP (0.5s a 1s)
  const delay = Math.random() * 500 + 500
  await sleep(delay)
}
```

### Versao VULNERAVEL (antes)

```javascript
app.get('/reset-password/:email', async (req, res) => {
  const { email } = req.params
  const user = await getUser(email)

  if (user) {
    const token = await setUserToken(email)
    await sendMail(email, token)
    return res.status(200).json({ message: 'Password reset email sent' })
  }

  // VULNERABILIDADE 1: Mensagem diferente
  // VULNERABILIDADE 2: Status code diferente (404)
  // VULNERABILIDADE 3: Tempo de resposta diferente (sem envio de email)
  return res.status(404).json({ message: 'Email not found' })
})
```

**Teste demonstrado pelo instrutor:**
```bash
# Email valido - 754ms
time curl http://localhost:3000/reset-password/antonio@email.com

# Email invalido - 12ms (VAZA INFORMACAO!)
time curl http://localhost:3000/reset-password/invalido@email.com.br
```

### Versao SEGURA (depois)

```javascript
app.get('/reset-password/:email', async (req, res) => {
  const start = Date.now() // Medir desde o INICIO, antes de qualquer operacao

  const { email } = req.params
  const user = await getUser(email)

  if (user) {
    const token = await setUserToken(email)
    await sendMail(email, token)
  }

  // Garantir tempo consistente
  const elapsed = Date.now() - start
  if (elapsed < 1500) {
    await sleep(1500 - elapsed)
  }

  // Mesma resposta SEMPRE - mesmo status, mesma mensagem
  res.status(200).json({ message: 'Password reset email sent' })
})
```

**Teste demonstrado pelo instrutor:**
```bash
# Email valido - 1.52s
time curl http://localhost:3000/reset-password/antonio@email.com

# Email invalido - 1.52s (CONSISTENTE!)
time curl http://localhost:3000/reset-password/invalido@email.com.br
```

### Bug encontrado durante a aula

O instrutor esqueceu o `await` no `sleep()`, o que fez a funcao retornar sem esperar o delay. Tambem adicionou a checagem `if (elapsed < 1500)` para evitar problemas caso o envio de email demore mais que o target.

## Variacao em producao (TypeScript)

```typescript
import crypto from 'crypto'

app.post('/reset-password', async (req, res) => {
  const start = Date.now()
  const TARGET_RESPONSE_MS = 1500

  const { email } = req.body
  const user = await userRepository.findByEmail(email)

  if (user) {
    // Token seguro em producao (NAO Math.random)
    const token = crypto.randomBytes(32).toString('hex')
    await userRepository.setResetToken(user.id, token)
    await emailService.sendResetEmail(user.email, token)
  }

  const elapsed = Date.now() - start
  if (elapsed < TARGET_RESPONSE_MS) {
    await sleep(TARGET_RESPONSE_MS - elapsed)
  }

  // Mensagem ambigua proposital
  res.status(200).json({
    message: 'Se este email estiver cadastrado em nosso sistema, voce recebera um link para redefinir sua senha.'
  })
})
```

## Aplicando o mesmo principio em outros endpoints

### Convite por email (mesma vulnerabilidade)

```typescript
// VULNERAVEL - revela quais emails estao cadastrados
app.post('/invite', async (req, res) => {
  const user = await findUser(req.body.email)
  if (!user) return res.status(404).json({ error: 'User not found' }) // VAZA INFO
  await sendInvite(user)
  res.json({ message: 'Invite sent' })
})

// SEGURO - tempo e resposta consistentes
app.post('/invite', async (req, res) => {
  const start = Date.now()
  const user = await findUser(req.body.email)
  if (user) await sendInvite(user)

  const elapsed = Date.now() - start
  if (elapsed < 1500) await sleep(1500 - elapsed)

  res.status(200).json({ message: 'Se este usuario existir, ele recebera o convite.' })
})
```