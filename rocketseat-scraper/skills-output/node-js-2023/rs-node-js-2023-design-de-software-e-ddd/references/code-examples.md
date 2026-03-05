# Code Examples: Design de Software e DDD

## Exemplo 1: A armadilha do "User" generico

Este exemplo ilustra o problema mais comum que DDD resolve: usar nomenclatura generica de programador em vez da linguagem do dominio.

### Cenario: Sistema para barbearia

**Sem DDD (como o programador tipicamente comeca):**

```typescript
// O programador cria uma entidade generica "User" por reflexo
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'barber' | 'customer' | 'bartender'
}

// Tudo e "user" — a role diferencia
function createUser(data: CreateUserDTO): User { ... }
function getUsers(role?: string): User[] { ... }
function updateUser(id: string, data: UpdateUserDTO): User { ... }
```

**Problemas:**
- `User` nao existe no vocabulario do barbeiro
- O barbeiro fala "meu cliente", "meu fornecedor", "meu atendente"
- Um unico `User` com `role` esconde comportamentos completamente diferentes
- O codigo nao reflete o dominio real

**Com DDD (apos conversar com o barbeiro — o domain expert):**

```typescript
// Cada entidade reflete como o barbeiro fala no dia a dia

interface Cliente {
  id: string
  name: string
  phone: string
  preferredBarbeiro?: string
}

interface Barbeiro {
  id: string
  name: string
  specialties: string[] // corte, barba, pigmentacao
  availableWeekdays: number[]
}

interface Atendente {
  id: string
  name: string
  shift: 'morning' | 'afternoon'
}

interface Fornecedor {
  id: string
  companyName: string
  products: string[]
}

// Casos de uso tambem usam linguagem do dominio
function agendarCorte(cliente: Cliente, barbeiro: Barbeiro, horario: Date) { ... }
function listarClientesDoDia(barbeiro: Barbeiro, date: Date): Cliente[] { ... }
function registrarChegada(cliente: Cliente): void { ... }
function consultarAgenda(barbeiro: Barbeiro, week: number): Agendamento[] { ... }
```

### O que mudou e por que

| Antes (programador) | Depois (linguagem ubiqua) | Por que |
|---------------------|---------------------------|---------|
| `User` | `Cliente`, `Barbeiro`, `Atendente`, `Fornecedor` | O barbeiro nunca diz "usuario" |
| `createUser` | `agendarCorte`, `registrarChegada` | Verbos do dominio, nao CRUD generico |
| `role: string` | Interfaces separadas | Cada entidade tem atributos e comportamentos unicos |
| `getUsers` | `listarClientesDoDia` | O caso de uso real e especifico, nao generico |

## Exemplo 2: Agencia de viagens

O instrutor menciona este cenario como outro exemplo de dominio.

**Sem DDD:**
```typescript
interface User {
  id: string
  name: string
  type: 'agent' | 'customer' | 'supplier'
}

function createBooking(userId: string, packageId: string) { ... }
```

**Com DDD (apos conversar com o agente de viagens):**
```typescript
interface Viajante {
  id: string
  name: string
  passport: string
  preferences: TravelPreferences
}

interface AgenteDeViagens {
  id: string
  name: string
  region: string // especialidade por regiao
}

interface PacoteDeViagem {
  id: string
  destination: string
  departureDate: Date
  returnDate: Date
  priceInCents: number
}

// Verbos do dominio
function reservarPacote(viajante: Viajante, pacote: PacoteDeViagem): Reserva { ... }
function consultarDisponibilidade(destination: string, period: DateRange): PacoteDeViagem[] { ... }
function cancelarReserva(reserva: Reserva, motivo: string): void { ... }
```

## Exemplo 3: Design vs Arquitetura — sao independentes

**DDD + MVC (sem Clean Architecture):**
```typescript
// models/cliente.ts — linguagem ubiqua aplicada
class Cliente {
  constructor(
    public name: string,
    public phone: string,
  ) {}
}

// controllers/agendamento.controller.ts
class AgendamentoController {
  async agendar(req: Request, res: Response) {
    const cliente = await ClienteModel.findById(req.body.clienteId)
    const barbeiro = await BarbeiroModel.findById(req.body.barbeiroId)
    const agendamento = await AgendamentoModel.create({ cliente, barbeiro, horario: req.body.horario })
    return res.json(agendamento)
  }
}
```

**DDD + Clean Architecture:**
```typescript
// domain/entities/cliente.ts
class Cliente {
  constructor(
    public name: string,
    public phone: string,
  ) {}
}

// domain/use-cases/agendar-corte.ts
class AgendarCorte {
  constructor(
    private clienteRepository: ClienteRepository,
    private barbeiroRepository: BarbeiroRepository,
    private agendamentoRepository: AgendamentoRepository,
  ) {}

  async execute({ clienteId, barbeiroId, horario }: AgendarCorteInput) {
    const cliente = await this.clienteRepository.findById(clienteId)
    const barbeiro = await this.barbeiroRepository.findById(barbeiroId)
    const agendamento = Agendamento.create({ cliente, barbeiro, horario })
    await this.agendamentoRepository.save(agendamento)
    return agendamento
  }
}
```

**Ponto-chave**: Em ambos os casos, a linguagem ubiqua e a mesma (`Cliente`, `Barbeiro`, `AgendarCorte`). O que muda e a arquitetura (MVC vs Clean), nao o design (DDD).