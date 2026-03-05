# Code Examples: Seguranca do Armazenamento Local

## Exemplo da aula: aplicacao vulneravel

O instrutor criou um `index.html` com a seguinte estrutura:

```html
<!-- index.html demonstrado na aula -->
<input type="password" id="passwordInput" />
<button onclick="storePassword()">Store Password</button>

<script>
function storePassword() {
  const password = document.getElementById('passwordInput').value
  localStorage.password = password  // VULNERAVEL: senha em texto puro no disco
  document.getElementById('passwordInput').value = ''
  alert('Senha salva com sucesso')
}
</script>
```

### O que acontece por baixo dos panos

Quando `localStorage.password = "pafuncio serve fritas"` e executado:

1. O Chrome grava no arquivo levelDB em `~/.config/google-chrome/Default/Local Storage/leveldb/`
2. O dado fica como texto puro no disco
3. Qualquer processo com permissao de leitura no diretorio do usuario pode acessar

## Demonstracao do ataque (feita pelo instrutor)

```bash
# Como root, copiar os arquivos do LocalStorage do usuario Jimmy
cp -r /home/jimmy/.config/google-chrome/Default/Local\ Storage/leveldb/* /tmp/stolen/

# Entrar na pasta e ler com ferramenta de levelDB
cd /tmp/stolen/
leveldb-reader .

# Saida mostra todos os dados em texto puro:
# http://127.0.0.1:8080 | \x01 | password | \x01 | pafuncio serve fritas
```

## Padroes seguros para diferentes cenarios

### Cenario 1: Autenticacao com JWT

```typescript
// ERRADO
function login(credentials: Credentials) {
  const { token } = await api.post('/auth/login', credentials)
  localStorage.setItem('auth-token', token) // Token acessivel via XSS e no disco
}

// CORRETO: cookie httpOnly (configurado no servidor)
// O frontend NAO toca no token — o servidor seta o cookie
// Express example:
app.post('/auth/login', (req, res) => {
  const token = generateJWT(user)
  res.cookie('auth-token', token, {
    httpOnly: true,   // JavaScript nao consegue acessar
    secure: true,     // Apenas HTTPS
    sameSite: 'strict', // Protege contra CSRF
    maxAge: 3600000   // 1 hora
  })
  res.json({ user: { name: user.name } })
})
```

### Cenario 2: Dados do usuario para exibicao

```typescript
// ERRADO: armazenar todos os dados do usuario
function cacheUserData(user: User) {
  localStorage.setItem('user', JSON.stringify(user))
  // user contem: cpf, endereco, nome da mae, telefone...
}

// CORRETO: armazenar apenas dados de exibicao
function cacheUserDisplay(user: User) {
  localStorage.setItem('user-display', JSON.stringify({
    name: user.displayName,
    avatarUrl: user.avatarUrl,
    preferredTheme: user.theme,
  }))
  // Dados sensiveis ficam apenas no servidor
}
```

### Cenario 3: Formulario multi-step

```typescript
// ERRADO: salvar dados sensiveis entre steps
function saveFormProgress(formData: FormData) {
  sessionStorage.setItem('registration', JSON.stringify({
    name: formData.name,
    cpf: formData.cpf,         // PII no sessionStorage
    creditCard: formData.card,  // Dados financeiros no sessionStorage
    step: formData.currentStep,
  }))
}

// CORRETO: manter dados sensiveis em memoria, salvar apenas estado
const formState = new Map<string, unknown>() // Memoria apenas

function saveFormProgress(formData: FormData) {
  // Dados sensiveis ficam em memoria (JS)
  formState.set('registration', formData)

  // Apenas o step atual vai pro sessionStorage
  sessionStorage.setItem('registration-step', String(formData.currentStep))
}
```

### Cenario 4: Cache de API responses

```typescript
// ERRADO: cachear resposta inteira que pode conter dados sensiveis
const response = await fetch('/api/users/me')
const userData = await response.json()
localStorage.setItem('user-cache', JSON.stringify(userData))

// CORRETO: cachear apenas dados publicos, com TTL
interface PublicCache {
  displayName: string
  role: string
  cachedAt: number
}

function cachePublicData(userData: UserResponse) {
  const publicOnly: PublicCache = {
    displayName: userData.name,
    role: userData.role,
    cachedAt: Date.now(),
  }
  localStorage.setItem('user-cache', JSON.stringify(publicOnly))
}

function getCachedData(): PublicCache | null {
  const raw = localStorage.getItem('user-cache')
  if (!raw) return null
  const cached: PublicCache = JSON.parse(raw)
  const ONE_HOUR = 3600000
  if (Date.now() - cached.cachedAt > ONE_HOUR) {
    localStorage.removeItem('user-cache')
    return null
  }
  return cached
}
```