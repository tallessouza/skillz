# Code Examples: Compreendendo Componentes React

## Exemplo 1: Quando NAO componentizar (peca de quebra-cabeca)

Este trecho so e usado na pagina de "Sobre". Extrair como componente separado nao agrega valor.

```tsx
// pages/About.tsx — manter inline, nao extrair
export function About() {
  return (
    <main>
      <h1>Sobre nos</h1>
      <p>Fundada em 2020, nossa empresa...</p>
      <p>Nossa missao e...</p>
    </main>
  )
}
```

**Por que:** esse conteudo so existe aqui. Criar um `<AboutContent>` seria uma peca de quebra-cabeca — so encaixa neste lugar.

## Exemplo 2: Quando componentizar (peca de Lego)

Botoes aparecem em toda a aplicacao. Extrair como componente e obrigatorio.

### Antes (sem componentizacao)

```tsx
// pages/Home.tsx
export function Home() {
  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Comprar
      </button>
    </div>
  )
}

// pages/Profile.tsx
export function Profile() {
  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Salvar
      </button>
    </div>
  )
}

// pages/Contact.tsx
export function Contact() {
  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Enviar
      </button>
    </div>
  )
}
```

**Problema:** 3 botoes identicos em estilo, 3 lugares para manter. Muda o design? Altere em 3 arquivos.

### Depois (com componentizacao)

```tsx
// components/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// pages/Home.tsx
import { Button } from '../components/Button'

export function Home() {
  return (
    <div>
      <Button>Comprar</Button>
    </div>
  )
}

// pages/Profile.tsx
import { Button } from '../components/Button'

export function Profile() {
  return (
    <div>
      <Button>Salvar</Button>
    </div>
  )
}
```

**Beneficio:** 1 componente, N usos. Muda o design do botao? Altere em 1 arquivo.

## Exemplo 3: Composicao de componentes (analogia do carro)

Assim como um carro e composto por pecas, um formulario e composto por componentes:

```tsx
// components/Input.tsx — o "pneu" (tem sentido sozinho)
interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function Input({ label, value, onChange }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// components/Button.tsx — o "volante" (tem sentido sozinho)
export function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

// components/LoginForm.tsx — o "carro" (composto por outros componentes)
import { Input } from './Input'
import { Button } from './Button'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form>
      <Input label="Email" value={email} onChange={setEmail} />
      <Input label="Senha" value={password} onChange={setPassword} />
      <Button>Entrar</Button>
    </form>
  )
}
```

**Mapeamento da analogia:**
- `Input` e `Button` = pecas individuais (pneu, volante) — tem sentido sozinhas
- `LoginForm` = carro — composto por pecas, cada uma com sua responsabilidade
- `LoginForm` depende de `Input` e `Button` — assim como o carro depende das pecas

## Exemplo 4: Quebrando componente complexo em partes menores

### Antes (componente monolitico)

```tsx
export function Dashboard() {
  return (
    <div>
      <header>
        <img src="/logo.png" alt="Logo" />
        <nav>
          <a href="/">Home</a>
          <a href="/profile">Perfil</a>
        </nav>
        <button>Sair</button>
      </header>

      <aside>
        <ul>
          <li>Dashboard</li>
          <li>Relatorios</li>
          <li>Configuracoes</li>
        </ul>
      </aside>

      <main>
        <h1>Bem-vindo</h1>
        <div>
          <div className="card">Vendas: 150</div>
          <div className="card">Usuarios: 80</div>
          <div className="card">Receita: R$ 5000</div>
        </div>
      </main>
    </div>
  )
}
```

**Problema:** arquivo grande, complexo, dificil de manter. Tudo misturado.

### Depois (componentizado)

```tsx
// components/Header.tsx — reusavel em todas as paginas
export function Header() {
  return (
    <header>
      <img src="/logo.png" alt="Logo" />
      <nav>
        <a href="/">Home</a>
        <a href="/profile">Perfil</a>
      </nav>
      <button>Sair</button>
    </header>
  )
}

// components/Sidebar.tsx — reusavel em todas as paginas internas
export function Sidebar() {
  return (
    <aside>
      <ul>
        <li>Dashboard</li>
        <li>Relatorios</li>
        <li>Configuracoes</li>
      </ul>
    </aside>
  )
}

// components/StatCard.tsx — reusavel para qualquer metrica
interface StatCardProps {
  title: string
  value: string | number
}

export function StatCard({ title, value }: StatCardProps) {
  return <div className="card">{title}: {value}</div>
}

// pages/Dashboard.tsx — limpo e legivel
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { StatCard } from '../components/StatCard'

export function Dashboard() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <h1>Bem-vindo</h1>
        <div>
          <StatCard title="Vendas" value={150} />
          <StatCard title="Usuarios" value={80} />
          <StatCard title="Receita" value="R$ 5000" />
        </div>
      </main>
    </div>
  )
}
```

**Beneficios aplicados:**
- `Header` e `Sidebar` reutilizaveis em outras paginas (Lego)
- `StatCard` reutilizavel para qualquer metrica (Lego)
- Cada componente tem responsabilidade isolada
- `Dashboard` agora e legivel — voce le e entende a estrutura imediatamente
- Arquivos menores, mais faceis de manter