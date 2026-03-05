# Code Examples: O que e o Next.js

## O problema: index.html de uma SPA

Este e o arquivo que o Vite gera para aplicacoes React. Note a div root vazia:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minha App</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- Ate o script abaixo carregar e executar, a pagina e BRANCA -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Fluxo SPA: Front-end chamando API diretamente

```typescript
// Em uma SPA tradicional (Vite + React)
// O browser faz a requisicao e renderiza no cliente
function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Browser → API diretamente
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  // Ate o useEffect completar, nada e renderizado
  // Crawler ve: <div id="root"></div> (vazio)
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## Fluxo Next.js: Servidor intermediario renderiza antes

```typescript
// Em Next.js (Pages Router com getServerSideProps)
// O servidor Node faz a requisicao e renderiza ANTES de enviar ao browser

export async function getServerSideProps() {
  // Isso roda no servidor Node (Next.js)
  // Next.js → API → JSON → renderiza React no servidor
  const res = await fetch('https://api.exemplo.com/users')
  const users = await res.json()

  return {
    props: { users } // Passado ao componente como props
  }
}

function UsersPage({ users }) {
  // Quando o browser recebe, o HTML ja esta pronto
  // Crawler ve: <ul><li>Joao</li><li>Maria</li>...</ul>
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

export default UsersPage
```

## Comparacao visual do que o crawler recebe

### SPA (React puro)
```html
<!-- O que o crawler do Google ve ao acessar -->
<html>
  <body>
    <div id="root"></div>
    <!-- Nada aqui. Pagina em branco. -->
  </body>
</html>
```

### Next.js (SSR)
```html
<!-- O que o crawler do Google ve ao acessar -->
<html>
  <body>
    <div id="__next">
      <ul>
        <li>Joao Silva</li>
        <li>Maria Santos</li>
        <li>Pedro Oliveira</li>
      </ul>
    </div>
    <!-- Conteudo completo, pronto para indexar -->
  </body>
</html>
```

## Diagrama do fluxo (como Juno desenhou)

```
=== SPA Tradicional ===

[Browser/React] --fetch('/api/users')--> [Back-end API]
                <------ JSON users ------
                renderiza no browser (demora)
                pagina em branco ate concluir


=== Com Next.js ===

[Browser] --> [Next.js Server (Node)] --fetch('/api/users')--> [Back-end API]
                                       <------ JSON users ------
              renderiza React no Node
         <-- HTML pronto --
         pagina ja completa ao chegar no browser
```