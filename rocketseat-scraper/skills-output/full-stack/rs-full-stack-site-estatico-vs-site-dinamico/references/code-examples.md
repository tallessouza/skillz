# Code Examples: Site Estático vs Site Dinâmico

## Exemplo 1: Site estático puro

Um servidor que serve arquivos HTML prontos:

```javascript
// Servidor estático — apenas serve arquivos que já existem
const express = require('express')
const app = express()

// Todos os arquivos em /public são servidos diretamente
// Não importa quem acessa — todos recebem o mesmo HTML
app.use(express.static('public'))

app.listen(3000)
```

Estrutura de arquivos:
```
public/
├── index.html      ← Mesmo para todos
├── about.html      ← Mesmo para todos
├── style.css
└── script.js
```

## Exemplo 2: Site dinâmico — página personalizada

```javascript
// Servidor dinâmico — consulta banco e monta página por usuário
const express = require('express')
const app = express()

app.get('/perfil/:username', async (req, res) => {
  const { username } = req.params  // ex: "mikebrito"

  // Consulta banco de dados — cada usuário tem dados diferentes
  const user = await database.findUser(username)
  const watchedLessons = await database.getWatchedLessons(user.id)
  const pendingLessons = await database.getPendingLessons(user.id)

  // Constrói HTML personalizado para ESTE usuário
  const html = buildProfilePage({
    name: user.name,
    watchedLessons,
    pendingLessons,
  })

  res.send(html)  // Cada pessoa recebe HTML diferente
})

app.listen(3000)
```

Neste caso:
- `GET /perfil/mikebrito` → página com as aulas do Mayk
- `GET /perfil/maria` → página com as aulas da Maria
- Mesma URL base, respostas diferentes

## Exemplo 3: O fluxo do request/response ilustrado

### Estático
```
Browser                          Servidor
   |                                |
   |--- GET /index.html ---------->|
   |                                |-- Lê arquivo do disco
   |<-- 200 OK (HTML fixo) --------|
   |                                |
```

### Dinâmico
```
Browser                          Servidor                    Banco de Dados
   |                                |                              |
   |--- GET /perfil/mikebrito ---->|                              |
   |                                |-- SELECT * FROM users      ->|
   |                                |<- {name: "Mayk", ...}     --|
   |                                |-- SELECT * FROM lessons    ->|
   |                                |<- [{lesson1}, {lesson2}]  --|
   |                                |-- Monta HTML personalizado   |
   |<-- 200 OK (HTML único) --------|                              |
   |                                |                              |
```

## Exemplo 4: SPA — estático no servidor, dinâmico no browser

```javascript
// Servidor: estático (serve o mesmo HTML para todos)
app.use(express.static('build'))

// O index.html é SEMPRE o mesmo:
// <div id="root"></div>
// <script src="app.js"></script>
```

```javascript
// Browser: JavaScript busca dados dinamicamente
useEffect(() => {
  // Isso acontece no browser, não no servidor
  fetch(`/api/perfil/${username}`)
    .then(res => res.json())
    .then(data => setProfile(data))
}, [username])
```

O servidor web é estático. A API é dinâmica. O resultado visual é dinâmico. Mas a página HTML servida é sempre a mesma.

## Exemplo 5: Next.js — escolhendo por página

```typescript
// pages/about.tsx — ESTÁTICO (SSG)
// Gerado uma vez no build, servido como arquivo estático
export default function About() {
  return <h1>Sobre a Rocketseat</h1>
}

// pages/perfil/[username].tsx — DINÂMICO (SSR)
// Gerado a cada request, consultando banco
export async function getServerSideProps({ params }) {
  const user = await database.findUser(params.username)
  const lessons = await database.getWatchedLessons(user.id)

  return { props: { user, lessons } }
}

export default function Profile({ user, lessons }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Aulas assistidas: {lessons.length}</p>
    </div>
  )
}
```

Mesmo app pode ter páginas estáticas e dinâmicas — a decisão é por rota.