# Code Examples: Aplicando PARE no Aprendizado de Programacao

## Exemplo 1: Aprendendo uma nova API (aplicando P — Perguntar)

Ao estudar a Fetch API pela primeira vez:

```typescript
// Voce ve este codigo em um tutorial:
const response = await fetch('/api/users')
const data = await response.json()
```

**Perguntas que voce deveria fazer:**
- O que acontece se a URL estiver errada?
- `response.json()` pode falhar? Quando?
- Qual a diferenca entre `fetch` e `axios`?
- O que e esse `await`? Por que precisa?

```typescript
// Apos pesquisar, voce entende melhor:
const response = await fetch('/api/users')

// Pergunta: e se der erro?
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}

// Pergunta: o que json() retorna exatamente?
const users = await response.json() // retorna o body parseado como objeto JS
```

## Exemplo 2: Criando anotacoes (aplicando A — Anotar)

### Mapa mental para React Hooks:

```
React Hooks
├── useState
│   ├── Retorna [valor, setter]
│   ├── Re-renderiza ao mudar
│   └── Inicializacao lazy: useState(() => calc())
├── useEffect
│   ├── Roda apos render
│   ├── Cleanup function: return () => {}
│   └── Deps array controla quando roda
├── useContext
│   ├── Consome contexto sem prop drilling
│   └── Re-renderiza quando contexto muda
└── useRef
    ├── Persiste entre renders
    └── .current nao causa re-render
```

### Anotacao em formato de perguntas-respostas:

```markdown
## Minhas anotacoes: useEffect

**P: Quando useEffect roda?**
R: Apos o render do componente, nao durante.

**P: O que acontece se eu nao passar o array de deps?**
R: Roda em todo render — geralmente nao e o que voce quer.

**P: Como limpar um intervalo/listener?**
R: Retornando uma funcao de cleanup:
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])
```

## Exemplo 3: Revisao espacada (aplicando R — Revisar)

### Dia seguinte — Revisao rapida
Sem olhar o codigo, tente responder:
- Como criar um estado em React?
- Como fazer fetch de dados quando componente monta?
- Como limpar side effects?

### Semana seguinte — Revisao pratica
Recrie de memoria um componente que:
1. Busca dados de uma API ao montar
2. Mostra loading enquanto busca
3. Trata erros
4. Limpa a requisicao se o componente desmontar

```typescript
// Tente escrever sem consultar antes
function UserList() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers() {
      try {
        const response = await fetch('/api/users', {
          signal: controller.signal
        })
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
    return () => controller.abort()
  }, [])

  // ... render
}
```

### Mes seguinte — Revisao de aplicacao
Construa algo real usando os conceitos. Nao um exercicio — um projeto.

## Exemplo 4: Explicando para solidificar (aplicando E — Explicar)

### Como voce explicaria closures para alguem:

```typescript
// "Closure e quando uma funcao lembra das variaveis
// do escopo onde foi criada, mesmo depois que esse escopo acabou"

function createCounter() {
  let count = 0 // esta variavel "vive" dentro da closure

  return {
    increment: () => ++count,
    getCount: () => count
  }
}

const counter = createCounter()
// createCounter ja executou e "acabou"
// mas count ainda existe dentro da closure

counter.increment() // 1
counter.increment() // 2
counter.getCount()  // 2
```

**Teste: voce consegue explicar sem olhar o codigo?**
- O que e uma closure?
- Por que `count` nao desaparece depois que `createCounter` executa?
- Onde closures sao usadas na pratica? (event handlers, React hooks, callbacks)

## Exemplo 5: Mapa mental como ferramenta de organizacao

O instrutor usa o Whimsical na aula. Para programacao, voce pode criar mapas mentais de:

```
Projeto: API REST
├── Rotas
│   ├── GET /users — listar todos
│   ├── POST /users — criar novo
│   ├── PUT /users/:id — atualizar
│   └── DELETE /users/:id — remover
├── Middleware
│   ├── auth — verificar token
│   ├── validation — validar body
│   └── error-handler — centralizar erros
├── Database
│   ├── users table
│   ├── migrations
│   └── seeds
└── Testes
    ├── unitarios — services
    ├── integracao — rotas
    └── e2e — fluxos completos
```

Este mapa mental serve como anotacao visual que pode ser revisada e expandida conforme voce aprende mais sobre cada ramo.